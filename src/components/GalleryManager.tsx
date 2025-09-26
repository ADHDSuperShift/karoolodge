import React, { useState } from 'react';
import { Camera, Plus, Edit3, Trash2, Save, Eye, Image as ImageIcon, X } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  category: 'rooms' | 'dining' | 'bar' | 'wine' | 'scenery';
  title: string;
  description?: string;
}

interface GalleryManagerProps {
  images: GalleryImage[];
  onImagesUpdate: (images: GalleryImage[]) => void;
}

const GalleryManager: React.FC<GalleryManagerProps> = ({ images, onImagesUpdate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'rooms' | 'dining' | 'bar' | 'wine' | 'scenery'>('all');
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryImage>>({
    src: '',
    category: 'rooms',
    title: '',
    description: ''
  });

  const categories = [
    { id: 'all', name: 'All Images', count: images.length },
    { id: 'rooms', name: 'Rooms', count: images.filter(img => img.category === 'rooms').length },
    { id: 'dining', name: 'Dining', count: images.filter(img => img.category === 'dining').length },
    { id: 'bar', name: 'Bar', count: images.filter(img => img.category === 'bar').length },
    { id: 'wine', name: 'Wine', count: images.filter(img => img.category === 'wine').length },
    { id: 'scenery', name: 'Scenery', count: images.filter(img => img.category === 'scenery').length }
  ];

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  const handleAddImage = () => {
    console.log('GalleryManager: handleAddImage called');
    console.log('formData:', formData);
    console.log('Validation check - src:', !!formData.src, 'title:', !!formData.title, 'category:', !!formData.category);
    if (formData.src && formData.title && formData.category) {
      console.log('Validation passed, creating new image');
      const newImage: GalleryImage = {
        id: Date.now(),
        src: formData.src,
        category: formData.category as 'rooms' | 'dining' | 'bar' | 'wine' | 'scenery',
        title: formData.title,
        description: formData.description || ''
      };
      console.log('GalleryManager: calling onImagesUpdate with new image');
      onImagesUpdate([...images, newImage]);
      setFormData({ src: '', category: 'rooms', title: '', description: '' });
      setShowAddModal(false);
    } else {
      console.log('Validation failed - missing required fields');
    }
  };

  const handleUpdateImage = () => {
    console.log('GalleryManager: handleUpdateImage called');
    if (editingImage && formData.src && formData.title && formData.category) {
      const updatedImages = images.map(img => 
        img.id === editingImage.id 
          ? { ...img, ...formData } as GalleryImage
          : img
      );
      console.log('GalleryManager: calling onImagesUpdate with updated images');
      onImagesUpdate(updatedImages);
      setEditingImage(null);
      setFormData({ src: '', category: 'rooms', title: '', description: '' });
    }
  };

  const handleDeleteImage = (id: number) => {
    console.log('GalleryManager: handleDeleteImage called for id:', id);
    if (window.confirm('Are you sure you want to delete this image?')) {
      console.log('GalleryManager: calling onImagesUpdate with filtered images');
      onImagesUpdate(images.filter(img => img.id !== id));
    }
  };

  const openEditModal = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      src: image.src,
      category: image.category,
      title: image.title,
      description: image.description || ''
    });
  };

  const closeModal = () => {
    setEditingImage(null);
    setShowAddModal(false);
    setFormData({ src: '', category: 'rooms', title: '', description: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-white">
          Gallery Management
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Image</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as 'rooms' | 'dining' | 'bar' | 'wine' | 'scenery' | 'all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden">
              <div className="aspect-video relative group">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(image.src, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                      title="View full image"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(image)}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
                      title="Edit image"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{image.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{image.category}</p>
                {image.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                    {image.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No images found</p>
            <p className="text-sm">Add your first image to get started</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingImage) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingImage ? 'Edit Image' : 'Add New Image'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.src || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, src: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                  {formData.src && (
                    <div className="mt-2">
                      <img
                        src={formData.src}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter image title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category || 'rooms'}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'rooms' | 'dining' | 'bar' | 'wine' | 'scenery' }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="rooms">Rooms</option>
                    <option value="dining">Dining</option>
                    <option value="bar">Bar</option>
                    <option value="wine">Wine</option>
                    <option value="scenery">Scenery</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter image description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={editingImage ? handleUpdateImage : handleAddImage}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingImage ? 'Update' : 'Add'} Image</span>
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

export default GalleryManager;
