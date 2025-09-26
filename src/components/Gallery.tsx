import React, { useEffect, useState } from 'react';
import { API_KEY, IS_API_KEY_CONFIGURED, LIST_IMAGES_ENDPOINT } from '@/utils/apiConfig';

interface GalleryItem {
  id: string;
  url: string;
  folder?: string;
  uploadedAt?: number;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);

  useEffect(() => {
    async function fetchImages() {
      if (!IS_API_KEY_CONFIGURED) {
        console.error('Missing VITE_UPLOAD_API_KEY; cannot fetch gallery images.');
        return;
      }

      const res = await fetch(LIST_IMAGES_ENDPOINT, {
        headers: { 'x-api-key': API_KEY },
      });
      if (!res.ok) {
        console.error('Failed to fetch images', res.status, res.statusText);
        return;
      }
      const data = await res.json();
      setImages(data);
    }

    fetchImages();
  }, []);

  return (
    <div>
      <h2>Uploaded Images</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt="Uploaded"
            style={{ width: '200px', borderRadius: '8px' }}
          />
        ))}
      </div>
    </div>
  );
}
