import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  API_BASE,
  API_KEY,
  IS_API_KEY_CONFIGURED,
  LIST_IMAGES_ENDPOINT,
  SAVE_IMAGE_ENDPOINT,
  UPLOAD_URL_ENDPOINT
} from '@/utils/apiConfig';

type MediaItem = {
  id?: string;
  url?: string;
  fileUrl?: string;
  folder?: string;
};

export default function AdminGallery() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      if (!IS_API_KEY_CONFIGURED) {
        console.error('Missing VITE_UPLOAD_API_KEY; cannot fetch admin gallery.');
        return;
      }
      try {
        const response = await fetch(LIST_IMAGES_ENDPOINT, {
          headers: { 'x-api-key': API_KEY },
        });

        if (!response.ok) {
          throw new Error(`Failed to load images: ${response.status}`);
        }

        const data = (await response.json()) as MediaItem[];
        if (Array.isArray(data)) {
          setImages(
            data
              .map((item) => item.url || item.fileUrl)
              .filter((url): url is string => typeof url === 'string' && url.length > 0)
          );
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    loadImages();
  }, []);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      if (!IS_API_KEY_CONFIGURED) {
        throw new Error('VITE_UPLOAD_API_KEY is not configured.');
      }
      const uploadResponse = await fetch(UPLOAD_URL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: 'backgrounds',
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to get upload URL: ${uploadResponse.status}`);
      }

      const { uploadURL, fileUrl } = (await uploadResponse.json()) as {
        uploadURL: string;
        fileUrl: string;
      };

      await fetch(uploadURL, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      const saveResponse = await fetch(SAVE_IMAGE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ fileUrl, folder: 'backgrounds' }),
      });

      if (!saveResponse.ok) {
        throw new Error(`Failed to save image metadata: ${saveResponse.status}`);
      }

      setImages((prev) => [fileUrl, ...prev]);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div>
      <h2>Admin Image Gallery</h2>

      <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />

      {uploading && <p>Uploading...</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        {images.map((url, index) => (
          <img key={`${url}-${index}`} src={url} alt={`Uploaded ${index}`} style={{ width: '100%', borderRadius: '8px' }} />
        ))}
      </div>
    </div>
  );
}
