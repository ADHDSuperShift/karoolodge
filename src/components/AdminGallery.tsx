import React, { useEffect, useState, ChangeEvent } from 'react';

// Mock configuration for frontend-only mode
const IS_API_KEY_CONFIGURED = false;

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
    // Show placeholders by default; comprehensive admin manages real gallery
    setImages(['/placeholder.svg']);
  }, []);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      alert('This demo gallery no longer stores images locally. Use the new Admin console to upload to S3.');
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
