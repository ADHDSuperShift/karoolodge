import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn as amplifySignIn, signOut as amplifySignOut, getCurrentUser } from 'aws-amplify/auth';

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
    const checkAuthState = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        // User is not authenticated
        setIsAuthenticated(false);
      }
    };
    checkAuthState();
  }, []);

  const signIn = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { isSignedIn } = await amplifySignIn({ username, password });
      if (isSignedIn) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await amplifySignOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
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
