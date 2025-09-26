import React from 'react';

const UploadDebug: React.FC = () => {
  const handleShowStats = () => {
    try {
      const galleryJson = localStorage.getItem('karoo-gallery-state');
      const galleryData = galleryJson ? JSON.parse(galleryJson) : [];
      alert(`Gallery Stats:\nTotal Images: ${galleryData.length}`);
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
    alert('No base64 uploads to clear. Use Clear All to reset gallery cache.');
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
