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
        // Check Amplify/Cognito auth first
        await getCurrentUser();
        setIsAuthenticated(true);
        return;
      } catch (error) {
        // Fall back to checking temporary auth
        const savedAuth = localStorage.getItem('temp-auth');
        if (savedAuth === 'authenticated') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      }
    };
    checkAuthState();
  }, []);

  const signIn = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Try Amplify/Cognito auth first
      const { isSignedIn } = await amplifySignIn({ username, password });
      if (isSignedIn) {
        setIsAuthenticated(true);
        return;
      }
    } catch (cognitoError) {
      console.warn('Cognito auth failed, trying fallback:', cognitoError);
      
      // Fallback to simple auth for development
      if (username === 'admin@example.com' && password === 'temporary123') {
        setIsAuthenticated(true);
        localStorage.setItem('temp-auth', 'authenticated');
        return;
      }
      
      // If both fail, throw the original error
      setAuthError(cognitoError instanceof Error ? cognitoError.message : 'Authentication failed');
      throw cognitoError;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Clear temporary auth
      localStorage.removeItem('temp-auth');
      
      // Try Amplify sign out
      await amplifySignOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if Amplify sign out fails, clear local state
      setIsAuthenticated(false);
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
