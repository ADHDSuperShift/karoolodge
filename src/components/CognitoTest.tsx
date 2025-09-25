import React, { useState } from 'react';

// Simple test component to check Cognito connectivity
const CognitoTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  const testCognitoConfig = () => {
    const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    
    console.log('Testing Cognito configuration...');
    console.log('User Pool ID:', userPoolId);
    console.log('Client ID:', clientId);
    
    if (!userPoolId || !clientId) {
      setTestResult('❌ Environment variables not set properly');
      return;
    }
    
    try {
      // Just test if we can create the user pool object
      const { CognitoUserPool } = require('amazon-cognito-identity-js');
      const userPool = new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId });
      
      if (userPool) {
        setTestResult('✅ Cognito User Pool object created successfully');
      } else {
        setTestResult('❌ Failed to create User Pool object');
      }
    } catch (error) {
      setTestResult(`❌ Error creating User Pool: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', margin: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Cognito Configuration Test</h3>
      <button onClick={testCognitoConfig} style={{ 
        padding: '10px 20px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none', 
        borderRadius: '3px',
        cursor: 'pointer'
      }}>
        Test Cognito Config
      </button>
      {testResult && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '3px' }}>
          {testResult}
        </div>
      )}
    </div>
  );
};

export default CognitoTest;
