
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// ✅ Amplify v6+ import
import { Amplify } from "aws-amplify";
import amplifyconfig from "./amplifyconfiguration.json";

// ✅ Configure Amplify
Amplify.configure(amplifyconfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
