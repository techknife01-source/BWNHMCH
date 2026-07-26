import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SessionInfo } from '../modules/core/types/core.types';
import { sessionService } from '../modules/core/services/session.service';
import { useAuth } from '../hooks/useAuth';

interface SessionContextType {
  sessions: SessionInfo[];
  isLoading: boolean;
  error: string | null;
  refreshSessions: () => Promise<void>;
  terminateSession: (sessionId: string) => Promise<void>;
  terminateOthers: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSessions = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await sessionService.getActiveSessions();
      if (res.success && res.data) {
        setSessions(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load active sessions');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshSessions();
    } else {
      setSessions([]);
    }
  }, [isAuthenticated, refreshSessions]);

  const terminateSession = async (sessionId: string) => {
    await sessionService.terminateSession(sessionId);
    await refreshSessions();
  };

  const terminateOthers = async () => {
    await sessionService.terminateAllOtherSessions();
    await refreshSessions();
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        isLoading,
        error,
        refreshSessions,
        terminateSession,
        terminateOthers,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
};
