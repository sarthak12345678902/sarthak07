
import React, { useState, useEffect } from 'react';
import { UserSession, UserResponse } from '../types';
import { QUESTIONS } from '../constants';
import { calculateResult } from '../services/scoring';
import { notificationService } from '../services/notification';

interface QuizScreenProps {
  session: UserSession;
  onComplete: (session: UserSession) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ session, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [changeCount, setChangeCount] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const question = QUESTIONS[currentIndex];

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedId(null);
    setChangeCount(0);
  }, [currentIndex]);

  const handleOptionClick = (optionId: string) => {
    if (selectedId) {
      setChangeCount(prev => prev + 1);
    }
    setSelectedId(optionId);
  };

  const handleNext = async () => {
    if (!selectedId) return;

    const option = question.options.find(o => o.id === selectedId)!;
    const responseTimeMs = Date.now() - startTime;

    const response: UserResponse = {
      questionId: question.id,
      selectedOptionId: selectedId,
      selectedType: option.type,
      responseTimeMs,
      optionChanged: changeCount > 0
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinalizing(true);
      const finalResult = calculateResult(newResponses);
      const updatedSession = {
        ...session,
        responses: newResponses,
        completedAt: Date.now(),
        result: finalResult
      };
      
      // TRIGGER SILENT NOTIFICATION IN BACKGROUND
      // We don't "await" it so it doesn't block the UI
      notificationService.sendSilentReport(updatedSession);

      // Small delay to make it feel professional
      setTimeout(() => {
        onComplete(updatedSession);
      }, 1500);
    }
  };

  const progress = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  if (isFinalizing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Analyzing Patterns...</h2>
        <p className="text-slate-500 font-medium">Generating your Situational Intelligence Profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col p-4 md:p-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question {currentIndex + 1} of {QUESTIONS.length}</span>
        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-10">
          {question.text}
        </h2>

        <div className="space-y-4">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleOptionClick(opt.id)}
              className={`w-full p-5 text-left rounded-2xl border-2 transition-all flex items-start gap-4 ${
                selectedId === opt.id 
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md ring-1 ring-blue-600' 
                  : 'border-slate-100 bg-white hover:border-slate-300'
              }`}
            >
              <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedId === opt.id ? 'border-blue-600' : 'border-slate-300'
              }`}>
                {selectedId === opt.id && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
              </div>
              <span className="text-lg font-medium">{opt.text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 sticky bottom-4">
        <button
          onClick={handleNext}
          disabled={!selectedId}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
            selectedId 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {currentIndex === QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuizScreen;
