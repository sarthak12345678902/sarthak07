
import { UserSession } from '../types';

const STORAGE_KEY = 'intel_engine_v1_sessions';

export const storage = {
  saveSession: (session: UserSession) => {
    const sessions = storage.getAllSessions();
    const existingIndex = sessions.findIndex(s => s.sessionId === session.sessionId);
    if (existingIndex > -1) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  },

  getSession: (sessionId: string): UserSession | undefined => {
    return storage.getAllSessions().find(s => s.sessionId === sessionId);
  },

  getAllSessions: (): UserSession[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
