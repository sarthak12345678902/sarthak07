
export enum IntelType {
  PR = 'PR', // Pattern Recognition
  EX = 'EX', // Explorer
  ST = 'ST', // Stabilizer
  SI = 'SI'  // Social Intelligence
}

export interface Option {
  id: string;
  text: string;
  type: IntelType;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  reverse?: boolean;
}

export interface UserResponse {
  questionId: number;
  selectedOptionId: string;
  selectedType: IntelType;
  responseTimeMs: number;
  optionChanged: boolean;
}

export interface UserSession {
  sessionId: string;
  name: string;
  startedAt: number;
  completedAt?: number;
  responses: UserResponse[];
  result?: ScoringResult;
}

export interface ScoringResult {
  dominant: IntelType;
  secondary: IntelType;
  mix: Record<IntelType, number>;
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  reliability: 'Valid' | 'Low Reliability' | 'Invalid';
  conflictDetected: boolean;
  narrative: {
    headline: string;
    summary: string;
    secondaryInsight: string;
    decisionStyle: string;
    blindSpot: string;
    roles: string[];
  };
}
