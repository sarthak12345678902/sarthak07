
import { UserResponse, IntelType, ScoringResult, UserSession } from '../types';
import { NARRATIVES } from '../constants';

export function calculateResult(responses: UserResponse[]): ScoringResult {
  const counts: Record<IntelType, number> = {
    [IntelType.PR]: 0,
    [IntelType.EX]: 0,
    [IntelType.ST]: 0,
    [IntelType.SI]: 0
  };

  let totalResponseTime = 0;
  let changedCount = 0;
  
  // Basic counting
  responses.forEach(r => {
    counts[r.selectedType]++;
    totalResponseTime += r.responseTimeMs;
    if (r.optionChanged) changedCount++;
  });

  // Dominant/Secondary
  const sortedTypes = (Object.keys(counts) as IntelType[]).sort((a, b) => counts[b] - counts[a]);
  const dominant = sortedTypes[0];
  const secondary = sortedTypes[1];

  // Percentage mix
  const mix: Record<IntelType, number> = {
    [IntelType.PR]: Math.round((counts[IntelType.PR] / responses.length) * 100),
    [IntelType.EX]: Math.round((counts[IntelType.EX] / responses.length) * 100),
    [IntelType.ST]: Math.round((counts[IntelType.ST] / responses.length) * 100),
    [IntelType.SI]: Math.round((counts[IntelType.SI] / responses.length) * 100)
  };

  // Confidence Level
  const avgTime = totalResponseTime / responses.length;
  let confidence: 'High' | 'Moderate' | 'Low' = 'Moderate';
  if (avgTime > 1500 && avgTime < 6000 && changedCount < 3) {
    confidence = 'High';
  } else if (avgTime < 1500 || changedCount > 6) {
    confidence = 'Low';
  }

  // Reliability check
  let reliability: 'Valid' | 'Low Reliability' | 'Invalid' = 'Valid';
  const maxOptionBias = Math.max(...Object.values(mix));
  if (avgTime < 1000 || maxOptionBias > 75) {
    reliability = 'Invalid';
  } else if (avgTime < 1800 || maxOptionBias > 60) {
    reliability = 'Low Reliability';
  }

  // Conflict detection (Explorer vs Stabilizer balance)
  const conflictDetected = mix[IntelType.EX] > 30 && mix[IntelType.ST] > 30;

  return {
    dominant,
    secondary,
    mix,
    confidenceLevel: confidence,
    reliability,
    conflictDetected,
    narrative: NARRATIVES[dominant]
  };
}
