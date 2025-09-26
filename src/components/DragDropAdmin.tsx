import React, { useState, useEffect, useRef } from 'react';

interface ImageItem {
  id: string;
  url: string;
  title: string;
  order: number;
}

interface BackgroundItem {
  section: string;
  url: string;
  label: string;
}

const DragDropAdmin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('gallery');
  
  // Gallery state
  const [images, setImages] = useState<ImageItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  
  // Background state
  const [backgrounds, setBackgrounds] = useState<BackgroundItem[]>([
  { section: 'hero', url: '/placeholder.svg', label: 'Hero Section' },
  { section: 'restaurant', url: '/placeholder.svg', label: 'Restaurant Section' },
  { section: 'wine', url: '/placeholder.svg', label: 'Wine Section' },
  { section: 'bar', url: '/placeholder.svg', label: 'Bar Section' }
  ]);
  
  // File drop refs
  const galleryDropRef = useRef<HTMLDivElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Load data
  useEffect(() => {
    const savedImages = localStorage.getItem('lodge-gallery');
    const savedBackgrounds = localStorage.getItem('lodge-backgrounds');
    
    if (savedImages) {
      try {
        setImages(JSON.parse(savedImages));
      } catch (e) {
        console.log('Failed to load images');
      }
    }
    
    if (savedBackgrounds) {
      try {
        setBackgrounds(JSON.parse(savedBackgrounds));
      } catch (e) {
        console.log('Failed to load backgrounds');
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('lodge-gallery', JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    localStorage.setItem('lodge-backgrounds', JSON.stringify(backgrounds));
  }, [backgrounds]);

  const handleLogin = () => {
    if (password === 'lodge123') {
      setIsLoggedIn(true);
      setPassword('');
    } else {
      alert('Wrong password! Try: lodge123');
    }
  };

  // Drag and drop for reordering
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    setDragOverItem(itemId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, dropItemId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === dropItemId) {
      return;
    }

    const draggedIndex = images.findIndex(img => img.id === draggedItem);
    const dropIndex = images.findIndex(img => img.id === dropItemId);
    
    const newImages = [...images];
    const draggedImg = newImages[draggedIndex];
    
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImg);
    
    // Update order
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      order: index
    }));
    
    setImages(updatedImages);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // File drop handling
  const handleFileDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleFileDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    for (const file of imageFiles) {
      const objectUrl = URL.createObjectURL(file);
      const newImage: ImageItem = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: objectUrl,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        order: images.length
      };
      setImages(prev => [...prev, newImage]);
    }
    
    if (imageFiles.length > 0) {
      alert(`Added ${imageFiles.length} image(s)!`);
    }
  };

  const addImageByUrl = () => {
    const url = prompt('Enter image URL:');
    const title = prompt('Enter image title:');
    
    if (url && title) {
      const newImage: ImageItem = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: url.trim(),
        title: title.trim(),
        order: images.length
      };
      setImages(prev => [...prev, newImage]);
      alert('Image added!');
    }
  };

  const deleteImage = (id: string) => {
    if (confirm('Delete this image?')) {
      setImages(prev => prev.filter(img => img.id !== id));
    }
  };

  const updateBackground = (section: string) => {
    const newUrl = prompt('Enter new background URL:');
    if (newUrl) {
      setBackgrounds(prev => 
        prev.map(bg => 
          bg.section === section 
            ? { ...bg, url: newUrl.trim() }
            : bg
        )
      );
      alert('Background updated!');
    }
  };

  const handleBackgroundDrop = async (e: React.DragEvent, section: string) => {
    e.preventDefault();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setBackgrounds(prev => 
          prev.map(bg => 
            bg.section === section 
              ? { ...bg, url: result }
              : bg
          )
        );
        alert(`${section} background updated!`);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '3rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          width: '400px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            marginBottom: '2rem', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            🏨 Lodge Admin
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter password..."
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e1e5e9',
              borderRadius: '12px',
              fontSize: '1rem',
              marginBottom: '1.5rem',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🔓 Login
          </button>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Hint: lodge123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      minHeight: '100vh', 
      background: '#f8fafc' 
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          margin: 0, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          🏨 Lodge Admin Dashboard
        </h1>
        <button
          onClick={() => setIsLoggedIn(false)}
          style={{
            padding: '0.5rem 1rem',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Navigation */}
      <div style={{
        background: 'white',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setActiveTab('gallery')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'gallery' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f1f5f9',
              color: activeTab === 'gallery' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            🖼️ Gallery ({images.length})
          </button>
          <button
            onClick={() => setActiveTab('backgrounds')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'backgrounds' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f1f5f9',
              color: activeTab === 'backgrounds' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            🎨 Backgrounds
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '2rem' }}>
        {activeTab === 'gallery' && (
          <div>
            <h2 style={{ marginBottom: '2rem', color: '#1e293b' }}>Gallery Management</h2>
            
            {/* Drop Zone */}
            <div
              ref={galleryDropRef}
              onDragOver={handleFileDragOver}
              onDragLeave={handleFileDragLeave}
              onDrop={handleFileDrop}
              style={{
                border: `3px dashed ${isDraggingFile ? '#667eea' : '#cbd5e1'}`,
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'center',
                marginBottom: '2rem',
                background: isDraggingFile ? '#f0f4ff' : '#f8fafc',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onClick={addImageByUrl}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {isDraggingFile ? '📤' : '📁'}
              </div>
              <h3 style={{ margin: '0 0 1rem 0', color: '#475569' }}>
                {isDraggingFile ? 'Drop your images here!' : 'Drag & Drop Images'}
              </h3>
              <p style={{ margin: 0, color: '#64748b' }}>
                Drag images here or <strong>click to add by URL</strong>
              </p>
            </div>

            {/* Images Grid */}
            {images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                {images
                  .sort((a, b) => a.order - b.order)
                  .map((image) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, image.id)}
                      onDragOver={(e) => handleDragOver(e, image.id)}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, image.id)}
                      style={{
                        background: 'white',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: draggedItem === image.id 
                          ? '0 10px 30px rgba(0,0,0,0.3)' 
                          : '0 4px 15px rgba(0,0,0,0.1)',
                        transform: draggedItem === image.id ? 'rotate(5deg)' : 'none',
                        transition: 'all 0.3s',
                        cursor: 'grab',
                        border: dragOverItem === image.id ? '3px solid #667eea' : 'none'
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div style={{ padding: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>
                          {image.title}
                        </h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => deleteImage(image.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              fontWeight: 'bold'
                            }}
                          >
                            🗑️ Delete
                          </button>
                          <div style={{
                            padding: '0.5rem',
                            background: '#f1f5f9',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            color: '#64748b'
                          }}>
                            #{image.order + 1}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {images.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#64748b',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📷</div>
                <h3>No images yet</h3>
                <p>Drag and drop images above to get started!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'backgrounds' && (
          <div>
            <h2 style={{ marginBottom: '2rem', color: '#1e293b' }}>Section Backgrounds</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {backgrounds.map((bg) => (
                <div
                  key={bg.section}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleBackgroundDrop(e, bg.section)}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s'
                  }}
                >
                  <img
                    src={bg.url}
                    alt={bg.label}
                    style={{
                      width: '100%',
                      height: '220px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>
                      {bg.label}
                    </h3>
                    <button
                      onClick={() => updateBackground(bg.section)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      🖼️ Change Background
                    </button>
                    <p style={{ 
                      margin: '1rem 0 0 0', 
                      fontSize: '0.8rem', 
                      color: '#64748b',
                      textAlign: 'center'
                    }}>
                      Drag & drop images here too!
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropAdmin;
