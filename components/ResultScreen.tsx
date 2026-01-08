
import React from 'react';
import { UserSession, IntelType } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ResultScreenProps {
  session: UserSession;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ session, onReset }) => {
  const result = session.result!;
  
  const chartData = [
    { subject: 'Pattern', value: result.mix[IntelType.PR], full: 100 },
    { subject: 'Explorer', value: result.mix[IntelType.EX], full: 100 },
    { subject: 'Stabilizer', value: result.mix[IntelType.ST], full: 100 },
    { subject: 'Social', value: result.mix[IntelType.SI], full: 100 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in zoom-in duration-500">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Your Intelligence Map</h1>
        <p className="text-slate-500 font-medium">Psychometric Decision Profile for {session.name}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Visual Map */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
          <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-8">Intelligence Distribution</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                <Radar
                  name="Intelligence"
                  dataKey="value"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Narrative Card */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl flex flex-col justify-center border-t-4 border-blue-500">
          <span className="text-blue-400 font-bold uppercase tracking-tighter text-sm mb-4">Assessment Complete</span>
          <h2 className="text-3xl font-bold mb-4">{result.narrative.headline}</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            {result.narrative.summary}
          </p>
          <div className="flex flex-wrap gap-2">
            {result.narrative.roles.map((role: string) => (
              <span key={role} className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-200">
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-slate-400 font-bold text-xs uppercase mb-3">Secondary Strength</h4>
          <p className="font-semibold text-slate-800">{result.narrative.secondaryInsight}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-slate-400 font-bold text-xs uppercase mb-3">Decision Style</h4>
          <p className="font-semibold text-slate-800">{result.narrative.decisionStyle}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-slate-400 font-bold text-xs uppercase mb-3">Growth Blind Spot</h4>
          <p className="font-semibold text-slate-800">{result.narrative.blindSpot}</p>
        </div>
      </div>

      {/* Metadeta Flags */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13zm-6 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h.01a1 1 0 100-2H10zm3 0a1 1 0 100 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg>
          Confidence: {result.confidenceLevel}
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
          result.reliability === 'Valid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 13a1 1 0 011.46-1.074 1 1 0 00.913 0 1 1 0 011.46 1.074 3.001 3.001 0 004.814 1.83 1 1 0 011.374 0 3.001 3.001 0 004.814-1.83 1 1 0 011.46-1.074 1 1 0 00.913 0 1 1 0 011.46 1.074l.006.003A9 9 0 112.166 13zM10 5a1 1 0 011 1v2a1 1 0 11-2 0V6a1 1 0 011-1zm-1 9a1 1 0 102 0 1 1 0 00-2 0z" clipRule="evenodd" /></svg>
          Reliability: {result.reliability}
        </div>
      </div>

      <div className="max-w-xs mx-auto">
        <button
          onClick={onReset}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-xl hover:bg-black transition-all shadow-xl active:scale-95"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
