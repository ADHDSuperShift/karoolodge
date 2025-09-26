import { getUrl } from 'aws-amplify/storage';

// Amplify Storage CDN utility
export const buildCdnUrl = async (key: string): Promise<string> => {
  // If it's already a full URL, return as-is
  if (key.startsWith('http')) {
    return key;
  }
  
  try {
    // Get the signed URL from Amplify Storage
    const result = await getUrl({ 
      key,
      options: {
        validateObjectExistence: false, // Don't check if object exists
        expiresIn: 3600 // 1 hour expiration
      }
    });
    return result.url.toString();
  } catch (error) {
    console.warn('Failed to get CDN URL for', key, error);
    // Return placeholder for development
    return `/placeholder-${key}`;
  }
};

// Synchronous version for components that need immediate URLs
export const buildCdnUrlSync = (key: string): string => {
  // For now, return placeholder URLs
  // This will be replaced with proper Amplify Storage URLs after deployment
  if (key.startsWith('http')) {
    return key;
  }
  
  // Return placeholder for local development
  return `/placeholder-${key}`;
};

export default buildCdnUrlSync;
