import React, { useState, useEffect } from 'react';

// Simple, working admin interface
const WorkingAdmin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState('gallery');
  
  // Gallery state
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  
  // Section backgrounds state
  const [backgrounds, setBackgrounds] = useState({
    hero: 'https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528576432_f0fe5cce.webp',
    restaurant: 'https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528584345_d1dfcb47.webp',
    wine: 'https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528591318_fc7cb320.webp',
    bar: 'https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528602433_419a9c1d.webp'
  });

  // Load data from localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('admin-images');
    const savedBackgrounds = localStorage.getItem('admin-backgrounds');
    
    if (savedImages) {
      try {
        setImages(JSON.parse(savedImages));
      } catch (e) {
        console.log('Error loading images');
      }
    }
    
    if (savedBackgrounds) {
      try {
        setBackgrounds(JSON.parse(savedBackgrounds));
      } catch (e) {
        console.log('Error loading backgrounds');
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('admin-images', JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    localStorage.setItem('admin-backgrounds', JSON.stringify(backgrounds));
  }, [backgrounds]);

  const handleLogin = () => {
    if (username === 'admin' && password === 'karoo2025') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials. Use admin/karoo2025');
    }
  };

  const addImage = () => {
    if (newImageUrl && newImageTitle) {
      const newImage = {
        id: Date.now(),
        url: newImageUrl,
        title: newImageTitle
      };
      setImages([...images, newImage]);
      setNewImageUrl('');
      setNewImageTitle('');
      alert('Image added successfully!');
    } else {
      alert('Please fill in both URL and title');
    }
  };

  const deleteImage = (id) => {
    if (window.confirm('Delete this image?')) {
      setImages(images.filter(img => img.id !== id));
      alert('Image deleted!');
    }
  };

  const updateBackground = (section, url) => {
    if (url) {
      setBackgrounds({ ...backgrounds, [section]: url });
      alert(`${section} background updated!`);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '400px'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h1>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              placeholder="admin"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              placeholder="karoo2025"
            />
          </div>
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>Karoo Lodge Admin</h1>
        <button
          onClick={() => setIsLoggedIn(false)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div style={{
          width: '250px',
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          minHeight: 'calc(100vh - 73px)',
          padding: '1rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setActiveSection('gallery')}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: activeSection === 'gallery' ? '#f59e0b' : '#f3f4f6',
                color: activeSection === 'gallery' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              Gallery Images ({images.length})
            </button>
          </div>
          <div>
            <button
              onClick={() => setActiveSection('backgrounds')}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: activeSection === 'backgrounds' ? '#f59e0b' : '#f3f4f6',
                color: activeSection === 'backgrounds' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Section Backgrounds
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '2rem' }}>
          {activeSection === 'gallery' && (
            <div>
              <h2>Gallery Management</h2>
              
              {/* Add Image Form */}
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <h3>Add New Image</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image URL:</label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title:</label>
                  <input
                    type="text"
                    value={newImageTitle}
                    onChange={(e) => setNewImageTitle(e.target.value)}
                    placeholder="Image title"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <button
                  onClick={addImage}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Add Image
                </button>
              </div>

              {/* Images Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem'
              }}>
                {images.map((image) => (
                  <div
                    key={image.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjhmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmI3Mjg2Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                      }}
                    />
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>{image.title}</h4>
                      <button
                        onClick={() => deleteImage(image.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {images.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  color: '#6b7280'
                }}>
                  No images yet. Add your first image above!
                </div>
              )}
            </div>
          )}

          {activeSection === 'backgrounds' && (
            <div>
              <h2>Section Backgrounds</h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {Object.entries(backgrounds).map(([section, url]) => (
                  <div
                    key={section}
                    style={{
                      backgroundColor: 'white',
                      padding: '1.5rem',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <h3 style={{ textTransform: 'capitalize', marginBottom: '1rem' }}>
                      {section} Section
                    </h3>
                    <img
                      src={url}
                      alt={`${section} background`}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginBottom: '1rem'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjhmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmI3Mjg2Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                      }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="url"
                        placeholder="New background URL"
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const target = e.target as HTMLInputElement;
                            updateBackground(section, target.value);
                            target.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const button = e.target as HTMLButtonElement;
                          const input = button.parentElement?.querySelector('input') as HTMLInputElement;
                          if (input) {
                            updateBackground(section, input.value);
                            input.value = '';
                          }
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkingAdmin;
