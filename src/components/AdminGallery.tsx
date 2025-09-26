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
    const loadImages = async () => {
      console.log('Loading images from localStorage');
      
      try {
        // Load uploaded images from localStorage
        const uploadedImagesJson = localStorage.getItem('uploadedImages');
        if (uploadedImagesJson) {
          const uploadedImages = JSON.parse(uploadedImagesJson);
          const galleryImages = uploadedImages
            .filter((upload: any) => upload.folder === 'gallery')
            .map((upload: any) => upload.base64);
          
          setImages(galleryImages);
          console.log(`Loaded ${galleryImages.length} uploaded images`);
        } else {
          // Show some placeholder images if no uploads exist
          const placeholderImages = [
            '/placeholder.svg',
            '/placeholder.svg',
            '/placeholder.svg'
          ];
          setImages(placeholderImages);
        }
      } catch (error) {
        console.error('Failed to load images:', error);
        // Fallback to default placeholder images
        setImages(['/placeholder.svg']);
      }
    };

    loadImages();
  }, []);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      console.log('Processing file upload:', file.name);
      
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be smaller than 5MB');
      }
      
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      
      // Create unique filename with timestamp
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const uniqueFileName = `gallery-${timestamp}.${fileExtension}`;
      
      // Store in localStorage with metadata
      const imageData = {
        id: uniqueFileName,
        name: file.name,
        folder: 'gallery',
        base64,
        size: file.size,
        type: file.type,
        uploadedAt: timestamp
      };
      
      // Get existing uploads from localStorage
      const existingUploads = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
      existingUploads.push(imageData);
      
      // Store updated list
      localStorage.setItem('uploadedImages', JSON.stringify(existingUploads));
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the new image to the gallery display
      setImages((prev) => [base64, ...prev]);
      
      console.log('Upload completed successfully');
    } catch (error) {
      console.error('Error in file upload:', error);
      alert(error instanceof Error ? error.message : 'Upload failed');
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
