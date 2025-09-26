import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, fetchAuthSession, signIn as amplifySignIn, signOut as amplifySignOut } from 'aws-amplify/auth';

// Amplify-backed authentication for admin console
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // On mount, check current user/session to decide auth state
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await getCurrentUser();
        // Ensure credentials are refreshed for Storage to use authenticated role
        await fetchAuthSession();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    void init();
  }, []);

  const signIn = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await amplifySignIn({ username, password });
      // After successful sign-in, refresh credentials so Storage picks up authenticated identity
      await fetchAuthSession();
      setIsAuthenticated(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      setAuthError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await amplifySignOut();
    } finally {
      setIsAuthenticated(false);
      setIsLoading(false);
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
