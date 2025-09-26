import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CognitoTest from './CognitoTest';

const SimpleTestAdmin: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, authError, signIn, signOut } = useAuth();
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  const defaultRedirectTarget =
    typeof window !== 'undefined' ? window.location.origin : import.meta.env.VITE_OIDC_LOGOUT_URI;

  const signOutRedirect = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID ?? '';
    const logoutUri = import.meta.env.VITE_OIDC_LOGOUT_URI ?? defaultRedirectTarget ?? '';
    const cognitoDomain = (import.meta.env.VITE_COGNITO_DOMAIN ?? '').replace(/\/$/, '');

    if (!clientId || !logoutUri || !cognitoDomain) {
      console.warn('Missing Cognito logout configuration. Falling back to OIDC user removal.');
      if (oidcAuth?.removeUser) {
        void oidcAuth.removeUser();
      }
      return;
    }

    if (oidcAuth?.removeUser) {
      void oidcAuth.removeUser();
    }

    window.location.href = `${cognitoDomain}/logout?client_id=${encodeURIComponent(
      clientId
    )}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(authUsername.trim(), authPassword);
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <h2>Loading...</h2>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#1a202c', 
        color: 'white',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <div style={{ 
          maxWidth: '400px', 
          width: '100%',
          backgroundColor: '#2d3748',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Sign In</h1>
          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
              <input
                type="email"
                value={authUsername}
                onChange={(e) => setAuthUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#4a5568',
                  border: '1px solid #718096',
                  borderRadius: '4px',
                  color: 'white'
                }}
                placeholder="admin@example.com"
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#4a5568',
                  border: '1px solid #718096',
                  borderRadius: '4px',
                  color: 'white'
                }}
                placeholder="••••••••"
              />
            </div>
            {authError && (
              <div style={{ 
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#fed7d7',
                color: '#c53030',
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}>
                {authError}
              </div>
            )}
            <button
              type="submit"
              disabled={authLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: authLoading ? '#a0aec0' : '#f6ad55',
                color: authLoading ? '#4a5568' : '#1a202c',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: authLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {authLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <button
            type="button"
            onClick={() => oidcAuth?.signinRedirect?.()}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginTop: '1rem',
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Sign In Via Hosted UI
          </button>
        </div>
        
        <CognitoTest />
        
        <div style={{ 
          maxWidth: '600px',
          width: '100%',
          backgroundColor: '#2d3748',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <h3>📋 User Pool Configuration</h3>
          <p style={{ marginBottom: '1rem', color: '#a0aec0' }}>
            This User Pool has self-registration disabled and uses email aliases. Create users via AWS CLI:
          </p>
          <div style={{ 
            backgroundColor: '#1a202c',
            padding: '1rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            overflowX: 'auto'
          }}>
            <div>aws cognito-idp admin-create-user \</div>
            <div>&nbsp;&nbsp;--user-pool-id us-east-1_fzogF46tc \</div>
            <div>&nbsp;&nbsp;--username testuser \</div>
            <div>&nbsp;&nbsp;--user-attributes Name=email,Value=test@example.com \</div>
            <div>&nbsp;&nbsp;--temporary-password TempPass123! \</div>
            <div>&nbsp;&nbsp;--message-action SUPPRESS \</div>
            <div>&nbsp;&nbsp;--region us-east-1</div>
            <br/>
            <div>aws cognito-idp admin-set-user-password \</div>
            <div>&nbsp;&nbsp;--user-pool-id us-east-1_fzogF46tc \</div>
            <div>&nbsp;&nbsp;--username testuser \</div>
            <div>&nbsp;&nbsp;--password TestPass123! \</div>
            <div>&nbsp;&nbsp;--permanent \</div>
            <div>&nbsp;&nbsp;--region us-east-1</div>
          </div>
          <p style={{ marginTop: '1rem', color: '#68d391' }}>
            Then sign in with: <strong>test@example.com / TestPass123!</strong><br/>
            <small style={{ color: '#a0aec0' }}>(Use the email, not the username "testuser")</small>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1a202c', 
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1>Admin Dashboard</h1>
        <button
          onClick={() => {
            signOut();
            signOutRedirect();
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e53e3e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#2d3748',
        padding: '2rem',
        borderRadius: '8px'
      }}>
        <h2>🎉 Authentication Successful!</h2>
        <p>Your Cognito authentication is working correctly. The 400 errors have been resolved!</p>
        <p style={{ marginTop: '1rem' }}>
          You can now safely use the full ComprehensiveAdmin component once the syntax errors are fixed.
        </p>
      </div>

      {oidcAuth?.isAuthenticated && (
        <div
          style={{
            marginTop: '2rem',
            backgroundColor: '#2d3748',
            padding: '1.5rem',
            borderRadius: '8px',
            fontFamily: 'monospace'
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>OIDC Session</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
{`Email: ${oidcAuth.user?.profile?.email ?? 'N/A'}
ID Token: ${oidcAuth.user?.id_token ?? 'N/A'}
Access Token: ${oidcAuth.user?.access_token ?? 'N/A'}`}
          </pre>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={() => oidcAuth?.removeUser?.()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4a5568',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Local Session
            </button>
            <button
              onClick={signOutRedirect}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ed8936',
                color: '#1a202c',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Hosted UI Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleTestAdmin;
