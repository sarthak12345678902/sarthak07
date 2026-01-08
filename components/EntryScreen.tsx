
import React, { useState } from 'react';

interface EntryScreenProps {
  onStart: (name: string) => void;
}

const EntryScreen: React.FC<EntryScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 animate-in fade-in duration-1000">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full -ml-16 -mb-16 blur-3xl opacity-50" />

        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-slate-200 transform hover:scale-105 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Intelligence Analyzer</h1>
          <p className="text-slate-500 mt-3 font-medium text-lg italic">"Logic meets situational instinct"</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Identity Tag</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-lg font-bold placeholder:font-normal placeholder:text-slate-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            Launch Profile
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center relative z-10">
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Proprietary psychometric logic enabled.<br/>By starting, you consent to decision-pattern tracking.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-2 opacity-10 hover:opacity-100 transition-opacity">
         <div className="text-[8px] font-black text-slate-200 uppercase tracking-widest">End-to-End Encrypted Dashboard Access Required</div>
      </div>
    </div>
  );
};

export default EntryScreen;
