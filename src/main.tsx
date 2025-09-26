
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import amplifyConfig from './amplifyconfiguration';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import './index.css';

Amplify.configure(amplifyConfig);

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Cache bust: Thu Sep 25 10:24:16 SAST 2025
