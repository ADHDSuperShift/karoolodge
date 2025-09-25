import React, { useState, useEffect } from 'react';
import { Camera, Calendar, FileText, Users, Settings, LogOut, Eye, Plus, Save, X } from 'lucide-react';

const SimpleAdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('overview');
  
  // Simple local state for testing
  const [galleryImages, setGalleryImages] = useState([
    { id: 1, src: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528577396_a70a7693.webp", category: 'rooms', title: 'Luxury Suite' },
    { id: 2, src: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528579398_fe84a640.webp", category: 'rooms', title: 'Klein Karoo Cottage' }
  ]);
  
  const [newImage, setNewImage] = useState({ src: '', title: '', category: 'rooms' });
  const [showAddModal, setShowAddModal] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('simple-admin-data', JSON.stringify({ galleryImages }));
    console.log('Saved to localStorage:', galleryImages.length, 'images');
  }, [galleryImages]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', credentials);
    if (credentials.username === 'admin' && credentials.password === 'karoo2025') {
      setIsAuthenticated(true);
      console.log('Login successful');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleAddImage = () => {
    console.log('Add image clicked:', newImage);
    if (newImage.src && newImage.title) {
      const image = {
        id: Date.now(),
        src: newImage.src,
        title: newImage.title,
        category: newImage.category
      };
      console.log('Adding new image:', image);
      setGalleryImages(prev => [...prev, image]);
      setNewImage({ src: '', title: '', category: 'rooms' });
      setShowAddModal(false);
    } else {
      console.log('Validation failed - missing fields');
    }
  };

  const testButton = () => {
    console.log('Test button clicked!');
    alert('Button works!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
            Simple Admin Console
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="karoo2025"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Simple Admin Console</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={testButton}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Test Button
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Gallery Images ({galleryImages.length})</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium">{image.title}</h3>
                    <p className="text-sm text-gray-600 capitalize">{image.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Image</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={newImage.src}
                    onChange={(e) => setNewImage(prev => ({ ...prev, src: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newImage.title}
                    onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter image title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newImage.category}
                    onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="rooms">Rooms</option>
                    <option value="dining">Dining</option>
                    <option value="bar">Bar</option>
                    <option value="wine">Wine</option>
                    <option value="scenery">Scenery</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Add Image</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAdminDashboard;
