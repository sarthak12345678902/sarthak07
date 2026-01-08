
import React, { useState, useEffect } from 'react';
import EntryScreen from './components/EntryScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import AdminDashboard from './components/AdminDashboard';
import { UserSession } from './types';
import { storage } from './services/storage';

type View = 'entry' | 'quiz' | 'result' | 'admin';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('entry');
  const [activeSession, setActiveSession] = useState<UserSession | null>(null);
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  // Handle Hash navigation for Admin shortcut
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '') {
        setCurrentView('entry');
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleStart = (name: string) => {
    const session: UserSession = {
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      startedAt: Date.now(),
      responses: []
    };
    setActiveSession(session);
    storage.saveSession(session);
    setCurrentView('quiz');
  };

  const handleComplete = (finalSession: UserSession) => {
    setActiveSession(finalSession);
    storage.saveSession(finalSession);
    setCurrentView('result');
  };

  const reset = () => {
    setActiveSession(null);
    setCurrentView('entry');
    window.location.hash = '';
    setIsAdminAuth(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {currentView === 'entry' && (
        <EntryScreen onStart={handleStart} />
      )}
      
      {currentView === 'quiz' && activeSession && (
        <QuizScreen session={activeSession} onComplete={handleComplete} />
      )}
      
      {currentView === 'result' && activeSession && activeSession.result && (
        <ResultScreen session={activeSession} onReset={reset} />
      )}
      
      {currentView === 'admin' && (
        <AdminDashboard 
          onBack={reset} 
          isAuthenticated={isAdminAuth} 
          onAuthenticate={() => setIsAdminAuth(true)} 
        />
      )}
    </div>
  );
};

export default App;
