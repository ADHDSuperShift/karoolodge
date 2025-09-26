import React, { useState } from 'react';
import { signUp, confirmSignUp } from 'aws-amplify/auth';

const CreateTestUser: React.FC = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('TestPass123!');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const createUser = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const { user } = await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
          },
        },
      });

      setResult(`✅ User created successfully! Username: ${user.username}. Check your email for confirmation code.`);
    } catch (error: any) {
      console.error('Sign up error:', error);
      setResult(`❌ Error creating user: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '5px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>Create Test User</h3>
      <div style={{ marginBottom: '15px' }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '8px', 
            marginTop: '5px',
            border: '1px solid #ccc',
            borderRadius: '3px'
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '8px', 
            marginTop: '5px',
            border: '1px solid #ccc',
            borderRadius: '3px'
          }}
        />
        <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
          Password must contain: 8+ chars, uppercase, lowercase, number, special char
        </small>
      </div>
      <button 
        onClick={createUser}
        disabled={isLoading}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: isLoading ? '#ccc' : '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '3px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Creating User...' : 'Create Test User'}
      </button>
      {result && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: result.includes('❌') ? '#f8d7da' : '#d4edda', 
          borderRadius: '3px',
          border: `1px solid ${result.includes('❌') ? '#f5c6cb' : '#c3e6cb'}`
        }}>
          {result}
        </div>
      )}
    </div>
  );
};

export default CreateTestUser;
