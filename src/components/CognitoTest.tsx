import React, { useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';

// Simple test component to check Amplify Auth connectivity
const CognitoTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  const testAmplifyAuth = async () => {
    try {
      // Test if Amplify Auth is configured properly
      await getCurrentUser();
      setTestResult('✅ Amplify Auth is configured and working');
    } catch (error: any) {
      if (error.name === 'UserUnAuthenticatedException') {
        setTestResult('✅ Amplify Auth is configured (no user logged in)');
      } else {
        setTestResult(`❌ Amplify Auth error: ${error.message}`);
      }
    }
  };

  return (
    <div style={{ padding: '20px', margin: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Amplify Auth Configuration Test</h3>
      <button onClick={testAmplifyAuth} style={{ 
        padding: '10px 20px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none', 
        borderRadius: '3px',
        cursor: 'pointer'
      }}>
        Test Amplify Auth
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
