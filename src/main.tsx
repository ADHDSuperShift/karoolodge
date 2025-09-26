import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// ✅ Amplify v6+ import
import { Amplify } from "aws-amplify";
// Use amplifyconfiguration.ts (aws-exports is not present in this repo)
import amplifyconfig from "./amplifyconfiguration";

// ✅ Configure Amplify
Amplify.configure(amplifyconfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
