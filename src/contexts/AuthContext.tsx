import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession
} from 'amazon-cognito-identity-js';

interface AuthUser {
  username: string;
  email?: string;
  name?: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  apiKey: string | null;
  idToken: string | null;
  user: AuthUser | null;
  authError: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  refreshSession: () => Promise<void>;
}

const missingContext = () => {
  throw new Error('useAuth must be used within an AuthProvider');
};

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: false,
  apiKey: null,
  idToken: null,
  user: null,
  authError: null,
  signIn: async () => missingContext(),
  signOut: () => missingContext(),
  refreshSession: async () => missingContext()
});

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID as string | undefined;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string | undefined;
const authEndpoint = import.meta.env.VITE_AUTH_ENDPOINT || 'http://localhost:4001/api/get-api-key';

// Debug logging (commented out for build compatibility)
// console.log('Cognito Config:', { userPoolId, clientId, authEndpoint });
// console.log('Environment variables:', {
//   VITE_AUTH_ENDPOINT: import.meta.env.VITE_AUTH_ENDPOINT,
//   VITE_COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID,
//   VITE_COGNITO_CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID
// });

// Validate configuration
if (userPoolId && clientId) {
  console.log('✅ Cognito configuration found');
} else {
  console.warn('⚠️ Cognito configuration missing:', { userPoolId: !!userPoolId, clientId: !!clientId });
}

const userPool = userPoolId && clientId ? new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId }) : null;

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  apiKey: string | null;
  idToken: string | null;
  user: AuthUser | null;
  authError: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  apiKey: null,
  idToken: null,
  user: null,
  authError: null
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  const fetchApiKey = useCallback(
    async (token: string) => {
      const response = await fetch(authEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken: token })
      });

      if (!response.ok) {
        let message = 'Failed to fetch upload credentials.';
        try {
          const body = await response.json();
          if (body?.message) {
            message = body.message;
          }
        } catch (error) {
          console.warn('Failed to parse auth response', error);
        }
        throw new Error(message);
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        authError: null,
        apiKey: data.apiKey ?? null,
        idToken: token,
        user: {
          username: data.user?.email ?? data.user?.sub ?? '',
          email: data.user?.email,
          name: data.user?.name
        }
      }));
    },
    [authEndpoint]
  );

  const refreshSession = useCallback(async () => {
    try {
      if (!userPool) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          authError: null // Remove the error for now
        }));
        return;
      }

      const currentUser = userPool.getCurrentUser();

      if (!currentUser) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          apiKey: null,
          idToken: null,
          user: null
        }));
        return;
      }

      await new Promise<void>((resolve) => {
        currentUser.getSession(async (err: Error | null, session: CognitoUserSession | null) => {
          if (err || !session || !session.isValid()) {
            currentUser.signOut();
            setState((prev) => ({
              ...prev,
              isLoading: false,
              isAuthenticated: false,
              apiKey: null,
              idToken: null,
              user: null,
              authError: null // Don't show error for expired/invalid sessions
            }));
            resolve();
            return;
          }

          try {
            await fetchApiKey(session.getIdToken().getJwtToken());
            setState((prev) => ({ ...prev, isLoading: false }));
          } catch (error) {
            console.error('Failed to refresh API key', error);
            setState((prev) => ({
              ...prev,
              isLoading: false,
              isAuthenticated: false,
              apiKey: null,
              idToken: null,
              user: null,
              authError: null // Don't show auth errors on initialization
            }));
            currentUser.signOut();
          }
          resolve();
        });
      });
    } catch (error) {
      console.error('Error in refreshSession:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        apiKey: null,
        idToken: null,
        user: null,
        authError: null
      }));
    }
  }, [fetchApiKey]);

  useEffect(() => {
    // Only refresh session if we actually have a user pool configured
    if (userPool) {
      const currentUser = userPool.getCurrentUser();
      // Only try to refresh if there's actually a current user
      if (currentUser) {
        refreshSession();
      } else {
        // No current user, just set loading to false
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          apiKey: null,
          idToken: null,
          user: null,
          authError: null
        }));
      }
    } else {
      // No user pool configured, just set loading to false
      setState((prev) => ({
        ...prev,
        isLoading: false,
        authError: null
      }));
    }
  }, [refreshSession]);

  const signIn = useCallback(
    async (username: string, password: string) => {
      if (!userPool) {
        const error = new Error('Cognito is not configured.');
        setState((prev) => ({ ...prev, authError: error.message, isLoading: false }));
        throw error;
      }

      setState((prev) => ({ ...prev, isLoading: true, authError: null }));

      await new Promise<void>((resolve, reject) => {
        const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
        const authenticationDetails = new AuthenticationDetails({ Username: username, Password: password });

        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: async (session) => {
            try {
              await fetchApiKey(session.getIdToken().getJwtToken());
              setState((prev) => ({ ...prev, isLoading: false }));
              resolve();
            } catch (error) {
              cognitoUser.signOut();
              const message =
                error instanceof Error ? error.message : 'Failed to fetch upload credentials after sign-in.';
              setState((prev) => ({
                ...prev,
                isLoading: false,
                authError: message,
                isAuthenticated: false,
                apiKey: null,
                idToken: null,
                user: null
              }));
              reject(error);
            }
          },
          onFailure: (err) => {
            console.error('Cognito authentication failed:', err);
            
            // Handle specific error types
            let errorMessage = 'Sign-in failed.';
            if (err?.message) {
              errorMessage = err.message;
            }
            
            // Handle common Cognito errors more user-friendly
            if (err?.code === 'UserNotFoundException') {
              errorMessage = 'User not found. Please check your email address.';
            } else if (err?.code === 'NotAuthorizedException') {
              errorMessage = 'Incorrect email or password.';
            } else if (err?.code === 'TooManyFailedAttemptsException') {
              errorMessage = 'Too many failed attempts. Please try again later.';
            } else if (err?.code === 'InvalidParameterException') {
              errorMessage = 'Invalid credentials format.';
            }
            
            setState((prev) => ({
              ...prev,
              isLoading: false,
              authError: errorMessage,
              isAuthenticated: false,
              apiKey: null,
              idToken: null,
              user: null
            }));
            reject(err);
          },
          newPasswordRequired: () => {
            const message = 'Password update required. Complete the reset flow in Cognito.';
            setState((prev) => ({
              ...prev,
              isLoading: false,
              authError: message,
              isAuthenticated: false,
              apiKey: null,
              idToken: null,
              user: null
            }));
            reject(new Error(message));
          }
        });
      });
    },
    [fetchApiKey]
  );

  const signOut = useCallback(() => {
    if (userPool) {
      const currentUser = userPool.getCurrentUser();
      currentUser?.signOut();
    }

    setState({
      isAuthenticated: false,
      isLoading: false,
      apiKey: null,
      idToken: null,
      user: null,
      authError: null
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn,
      signOut,
      refreshSession
    }),
    [state, signIn, signOut, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
