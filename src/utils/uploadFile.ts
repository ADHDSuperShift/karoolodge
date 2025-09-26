import { API_KEY, IS_API_KEY_CONFIGURED, SAVE_IMAGE_ENDPOINT, UPLOAD_URL_ENDPOINT } from '@/utils/apiConfig';

export async function uploadFile(file: File, folder = 'backgrounds'): Promise<string> {
  if (!IS_API_KEY_CONFIGURED) {
    throw new Error('VITE_UPLOAD_API_KEY is not configured.');
  }

  // 1. Ask backend for signed URL + CloudFront URL
  const res = await fetch(UPLOAD_URL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      folder
    })
  });

  if (!res.ok) {
    throw new Error(`Failed to get upload URL: ${res.status}`);
  }

  const { uploadURL, fileUrl } = (await res.json()) as {
    uploadURL: string;
    fileUrl: string;
  };

  // 2. Upload to S3 using the signed URL
  const uploadRes = await fetch(uploadURL, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  });

  if (!uploadRes.ok) {
    throw new Error(`Failed to upload file to S3: ${uploadRes.status}`);
  }

  // 3. Save CloudFront URL in DB
  const saveRes = await fetch(SAVE_IMAGE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({ fileUrl, folder })
  });

  if (!saveRes.ok) {
    throw new Error(`Failed to save image metadata: ${saveRes.status}`);
  }

  // 4. Return CloudFront URL for immediate display
  return fileUrl;
}
