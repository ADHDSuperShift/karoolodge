import React, { useEffect, useState } from 'react';

// Mock configuration for frontend-only mode
const IS_API_KEY_CONFIGURED = false;

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
      console.log('Frontend-only mode: Loading mock gallery images');
      
      // Mock gallery data
      const mockImages: GalleryItem[] = [
        {
          id: '1',
          url: '/placeholder.svg',
          folder: 'gallery',
          uploadedAt: Date.now() - 86400000 // 1 day ago
        },
        {
          id: '2',
          url: '/placeholder.svg',
          folder: 'gallery',
          uploadedAt: Date.now() - 172800000 // 2 days ago
        },
        {
          id: '3',
          url: '/placeholder.svg',
          folder: 'gallery',
          uploadedAt: Date.now() - 259200000 // 3 days ago
        }
      ];
      
      setImages(mockImages);
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
