
import React, { useState, useEffect, useMemo } from 'react';
import { storage } from '../services/storage';
import { UserSession, IntelType } from '../types';
import { QUESTIONS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface AdminDashboardProps {
  onBack: () => void;
  isAuthenticated: boolean;
  onAuthenticate: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, isAuthenticated, onAuthenticate }) => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [view, setView] = useState<'overview' | 'details'>('overview');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // SECURE: Change this password to whatever you want
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    if (isAuthenticated) {
      const data = storage.getAllSessions().reverse();
      setSessions(data);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onAuthenticate();
      setError('');
    } else {
      setError('Invalid Access Key');
      setPassword('');
    }
  };

  // Aggregated Stats for Overview
  const stats = useMemo(() => {
    const total = sessions.length;
    const typeCounts: Record<string, number> = {
      [IntelType.PR]: 0,
      [IntelType.EX]: 0,
      [IntelType.ST]: 0,
      [IntelType.SI]: 0,
    };

    sessions.forEach(s => {
      if (s.result?.dominant) {
        typeCounts[s.result.dominant]++;
      }
    });

    const chartData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
    return { total, chartData };
  }, [sessions]);

  const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6'];

  const clearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      storage.clearAll();
      setSessions([]);
      setSelectedSession(null);
      setView('overview');
    }
  };

  const downloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `intelligence_data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const selectUser = (s: UserSession) => {
    setSelectedSession(s);
    setView('details');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="text-2xl font-black text-white">System Lock</h2>
            <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-bold">Owner Authentication Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Master Access Key"
              className="w-full px-6 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-center text-lg font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-400 text-center text-xs font-bold animate-pulse">{error}</p>}
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 transition-all active:scale-95">Verify & Open</button>
            <button type="button" onClick={onBack} className="w-full py-4 text-slate-400 font-bold hover:text-white transition-colors">Return to Home</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row animate-in fade-in duration-500">
      {/* Sidebar: User List */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <h1 className="text-xl font-black">Owner Console</h1>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active Data: {sessions.length} Profiles</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <button 
            onClick={() => setView('overview')}
            className={`w-full p-4 text-left border-b border-slate-50 transition-colors flex items-center gap-3 ${view === 'overview' ? 'bg-blue-50 border-r-4 border-r-blue-600' : 'hover:bg-slate-50'}`}
          >
            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </span>
            <span className="font-bold text-slate-700">Global Overview</span>
          </button>

          <div className="px-4 py-3 bg-slate-100/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Assessments</div>
          
          {sessions.map((s) => (
            <button 
              key={s.sessionId}
              onClick={() => selectUser(s)}
              className={`w-full p-4 text-left border-b border-slate-50 transition-colors flex flex-col gap-1 ${selectedSession?.sessionId === s.sessionId && view === 'details' ? 'bg-blue-50 border-r-4 border-r-blue-600' : 'hover:bg-slate-50'}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 truncate pr-2">{s.name}</span>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{new Date(s.startedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                   s.result?.dominant === IntelType.PR ? 'bg-blue-100 text-blue-600' :
                   s.result?.dominant === IntelType.EX ? 'bg-orange-100 text-orange-600' :
                   s.result?.dominant === IntelType.ST ? 'bg-green-100 text-green-600' :
                   'bg-purple-100 text-purple-600'
                 }`}>
                   {s.result?.dominant || 'Incomplete'}
                 </span>
                 <span className="text-[9px] text-slate-400 font-medium">{s.result?.confidenceLevel} Confidence</span>
              </div>
            </button>
          ))}
          
          {sessions.length === 0 && (
            <div className="p-10 text-center text-slate-300 italic text-sm">No data yet.</div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <button onClick={downloadData} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">Export (JSON)</button>
          <button onClick={clearData} className="w-full py-2 text-red-500 hover:bg-red-50 text-xs font-bold rounded-lg transition-colors">Reset Local Data</button>
          <button onClick={onBack} className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg transition-all hover:bg-black">Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {view === 'overview' ? (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Data Intelligence Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-400 font-bold text-xs uppercase mb-1 tracking-widest">Total User Base</p>
                <p className="text-4xl font-black text-slate-900">{stats.total}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-2">
                 <p className="text-slate-400 font-bold text-xs uppercase mb-4 tracking-widest">Global Type Mapping</p>
                 <div className="h-48 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stats.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-6">Audience Patterns</h3>
              <p className="text-slate-500 leading-relaxed text-lg">
                The predominant trait among your users is <strong>{stats.chartData.sort((a,b) => b.value - a.value)[0]?.name || 'N/A'}</strong>. 
                Average completion rate is high, indicating engagement. Use the export feature to perform cross-session analysis.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900">{selectedSession?.name}</h2>
                <p className="text-slate-500 font-medium">Tracking ID: {selectedSession?.sessionId}</p>
              </div>
              <div className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg">
                {selectedSession?.result?.dominant}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="font-black text-[10px] uppercase text-slate-400 mb-6 tracking-widest">Full Score Radar</h3>
                <div className="space-y-4">
                  {Object.entries(selectedSession?.result?.mix || {}).map(([type, percent]) => (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-black text-slate-700">
                        <span>{type}</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            type === IntelType.PR ? 'bg-blue-500' :
                            type === IntelType.EX ? 'bg-orange-500' :
                            type === IntelType.ST ? 'bg-green-500' :
                            'bg-purple-500'
                          }`} 
                          style={{ width: `${percent}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Confidence</p>
                  <p className="text-xl font-black">{selectedSession?.result?.confidenceLevel}</p>
                </div>
                <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reliability</p>
                  <p className={`text-xl font-black ${selectedSession?.result?.reliability === 'Valid' ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedSession?.result?.reliability}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-2 flex flex-col justify-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Consistency Check</p>
                   <p className="text-xs font-bold text-slate-700">
                     {selectedSession?.result?.conflictDetected ? '⚠️ Potential mismatch between Explorer and Stabilizer scores.' : '✅ High pattern consistency across situation responses.'}
                   </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest">Audited Timeline</h3>
            <div className="space-y-4 mb-20">
              {selectedSession?.responses.map((resp, i) => {
                const q = QUESTIONS.find(q => q.id === resp.questionId);
                const chosenOption = q?.options.find(o => o.id === resp.selectedOptionId);
                return (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 rounded">QUESTION {resp.questionId}</span>
                      <div className="flex gap-4 items-center">
                        {resp.optionChanged && <span className="text-[9px] font-black text-blue-600 uppercase">Revised Answer</span>}
                        <span className={`text-[9px] font-black uppercase ${resp.responseTimeMs < 1200 ? 'text-red-500' : 'text-slate-400'}`}>
                          Latency: {(resp.responseTimeMs / 1000).toFixed(2)}s
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-800 font-bold text-md mb-4 leading-snug">{q?.text}</p>
                    <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Selected Intelligence Profile: {resp.selectedType}</p>
                       <p className="text-slate-700 font-semibold italic">"{chosenOption?.text}"</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
