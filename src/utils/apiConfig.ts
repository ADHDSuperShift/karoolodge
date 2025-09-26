const FALLBACK_API_BASE = 'https://maqo7zgd3h.execute-api.us-east-1.amazonaws.com/dev/api';
const FALLBACK_API_KEY = 'your_api_key_here';

const rawUploadEndpoint = import.meta.env.VITE_UPLOAD_ENDPOINT || `${FALLBACK_API_BASE}/upload-url`;
const normalisedBase = rawUploadEndpoint
  .replace(/\/?(?:get-)?upload-url$/i, '')
  .replace(/\/$/, '');

export const API_BASE = normalisedBase || FALLBACK_API_BASE;
export const API_KEY = import.meta.env.VITE_UPLOAD_API_KEY || FALLBACK_API_KEY;
export const IS_API_KEY_CONFIGURED = API_KEY !== FALLBACK_API_KEY && Boolean(API_KEY);

export const UPLOAD_URL_ENDPOINT = `${API_BASE}/upload-url`;
export const SAVE_IMAGE_ENDPOINT = `${API_BASE}/save-image`;
export const LIST_IMAGES_ENDPOINT = `${API_BASE}/list-images`;
export const GET_API_KEY_ENDPOINT = `${API_BASE}/get-api-key`;
