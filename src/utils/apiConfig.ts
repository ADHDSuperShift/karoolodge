import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Generate the Amplify Data client lazily to ensure Amplify is configured first
export const getAmplifyClient = () => generateClient<Schema>();

// Legacy API configuration for backward compatibility
// These will be replaced with Amplify Data client calls
export const API_BASE = import.meta.env.VITE_API_URL || 'https://api.amplify.aws';
export const API_KEY = import.meta.env.VITE_API_KEY || '';
export const IS_API_KEY_CONFIGURED = true; // Always true with Amplify

// API Endpoints - replaced with Amplify GraphQL
export const LIST_IMAGES_ENDPOINT = `${API_BASE}/gallery`;
export const SAVE_IMAGE_ENDPOINT = `${API_BASE}/gallery`;
export const UPLOAD_URL_ENDPOINT = `${API_BASE}/upload/signed-url`;

// Amplify handles authentication automatically
export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  // Amplify handles auth headers automatically
});

export default {
  API_BASE,
  API_KEY,
  IS_API_KEY_CONFIGURED,
  LIST_IMAGES_ENDPOINT,
  SAVE_IMAGE_ENDPOINT,
  UPLOAD_URL_ENDPOINT,
  getAuthHeaders,
  getAmplifyClient
};
