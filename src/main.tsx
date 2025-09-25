
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import './index.css';

// Polyfill Node globals required by amazon-cognito-identity-js
const globalForPolyfill = globalThis as unknown as Record<string, unknown>;
if (typeof globalForPolyfill.global === 'undefined') {
  globalForPolyfill.global = globalThis;
}
if (typeof globalForPolyfill.Buffer === 'undefined') {
  globalForPolyfill.Buffer = Buffer;
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
