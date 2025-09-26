import React from 'react';

const UploadDebug: React.FC = () => {
  const handleShowStats = () => {
    try {
      const galleryJson = localStorage.getItem('karoo-gallery-state');
      const galleryData = galleryJson ? JSON.parse(galleryJson) : [];
      const uploadedImages = galleryData.filter((img: any) => img.src.startsWith('data:'));
      
      console.log('Gallery Stats:', {
        totalGallery: galleryData.length,
        uploadedImages: uploadedImages.length,
        defaultImages: galleryData.length - uploadedImages.length
      });
      
      alert(`Gallery Stats:
Total Images: ${galleryData.length}
Uploaded Images: ${uploadedImages.length}
Default Images: ${galleryData.length - uploadedImages.length}`);
    } catch (error) {
      alert('Error reading gallery stats');
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all uploaded images?')) {
      localStorage.removeItem('karoo-gallery-state');
      alert('Gallery cleared. Refresh the page to see changes.');
    }
  };

  const handleClearUploaded = () => {
    if (confirm('Are you sure you want to clear only uploaded images?')) {
      try {
        const galleryJson = localStorage.getItem('karoo-gallery-state');
        const galleryData = galleryJson ? JSON.parse(galleryJson) : [];
        const defaultImages = galleryData.filter((img: any) => !img.src.startsWith('data:'));
        localStorage.setItem('karoo-gallery-state', JSON.stringify(defaultImages));
        alert('Uploaded images cleared. Refresh the page to see changes.');
      } catch (error) {
        alert('Error clearing uploaded images');
      }
    }
  };

  return (
    <div style={{ padding: '10px', background: '#f0f0f0', margin: '10px', borderRadius: '5px' }}>
      <h4>Gallery Debug Tools</h4>
      <button onClick={handleShowStats} style={{ margin: '5px', padding: '5px 10px' }}>
        Show Stats
      </button>
      <button onClick={handleClearUploaded} style={{ margin: '5px', padding: '5px 10px' }}>
        Clear Uploaded
      </button>
      <button onClick={handleClearAll} style={{ margin: '5px', padding: '5px 10px', background: '#ff6b6b', color: 'white' }}>
        Clear All
      </button>
    </div>
  );
};

export default UploadDebug;
