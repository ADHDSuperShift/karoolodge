import React, { createContext, useContext, useEffect, useState } from 'react';

// Simple placeholder authentication
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('temp-auth');
    if (savedAuth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const signIn = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Simple placeholder credentials
      if (username === 'admin@example.com' && password === 'temporary123') {
        setIsAuthenticated(true);
        localStorage.setItem('temp-auth', 'authenticated');
      } else {
        throw new Error('Invalid credentials. Use admin@example.com / temporary123');
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = (): void => {
    setIsAuthenticated(false);
    localStorage.removeItem('temp-auth');
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    authError,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
