import React, { useState } from 'react';
import { X, Plus, Trash2, Upload, Save, Eye } from 'lucide-react';
import PhotoManager from './PhotoManager';

interface Room {
  id: number;
  name: string;
  category: string;
  images: string[];
  price: string;
  description: string;
  detailedDescription: string;
  amenities: string[];
  maxGuests: number;
  bedConfiguration: string;
  size: string;
}

interface RoomEditorProps {
  room?: Room;
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Room) => void;
}

const RoomEditor: React.FC<RoomEditorProps> = ({ room, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Room>(
    room || {
      id: Date.now(),
      name: '',
      category: '',
      images: [],
      price: '',
      description: '',
      detailedDescription: '',
      amenities: [],
      maxGuests: 2,
      bedConfiguration: '',
      size: ''
    }
  );

  const [newImage, setNewImage] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  const roomCategories = [
    'Standard Twin Room',
    'Deluxe Twin Room',
    'Family Room',
    'Suite',
    'Luxury Suite'
  ];

  const commonAmenities = [
    'Air Conditioning',
    'Free Wi-Fi',
    'Flat-screen TV',
    'Mini Fridge',
    'Tea/Coffee Facilities',
    'Private Bathroom',
    'Hairdryer',
    'Safe',
    'Work Desk',
    'Room Service',
    'Balcony',
    'Mountain View',
    'Garden View'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addAmenity = (amenity: string) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
              {room ? 'Edit Room' : 'Add New Room'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select category</option>
                  {roomCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price per Night
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g., R1,200"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Guests
                  </label>
                  <input
                    type="number"
                    value={formData.maxGuests}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: parseInt(e.target.value) }))}
                    min="1"
                    max="8"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bed Configuration
                  </label>
                  <input
                    type="text"
                    value={formData.bedConfiguration}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedConfiguration: e.target.value }))}
                    placeholder="e.g., 2 x Single Beds"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Size
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="e.g., 25m²"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, detailedDescription: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Images and Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Images & Amenities</h3>
              
              {/* Image Management */}
              <PhotoManager
                images={formData.images}
                onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                maxImages={8}
                title="Room Images"
              />

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amenities
                </label>
                <div className="space-y-3">
                  <div className="max-h-32 overflow-y-auto border dark:border-gray-600 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {commonAmenities.map(amenity => (
                        <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                addAmenity(amenity);
                              } else {
                                removeAmenity(amenity);
                              }
                            }}
                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Add custom amenity"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={addCustomAmenity}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map(amenity => (
                      <span
                        key={amenity}
                        className="inline-flex items-center px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-full"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="ml-1 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Room</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomEditor;
