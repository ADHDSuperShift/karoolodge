import React, { useState } from 'react';
import { Image as ImageIcon, Save, Eye, Upload, Camera, X } from 'lucide-react';

interface SectionBackground {
  section: 'hero' | 'restaurant' | 'wine-boutique' | 'bar-events';
  imageUrl: string;
  title: string;
  description?: string;
}

interface SectionBackgroundManagerProps {
  backgrounds: SectionBackground[];
  onBackgroundsUpdate: (backgrounds: SectionBackground[]) => void;
}

const SectionBackgroundManager: React.FC<SectionBackgroundManagerProps> = ({ 
  backgrounds, 
  onBackgroundsUpdate 
}) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SectionBackground>>({});

  const sectionInfo = {
    'hero': {
      name: 'Hero Section',
      description: 'Main background image for the website header',
      icon: ImageIcon
    },
    'restaurant': {
      name: 'Restaurant Section',
      description: 'Background image for the dining area',
      icon: Camera
    },
    'wine-boutique': {
      name: 'Wine Boutique',
      description: 'Background image for the wine boutique section',
      icon: Camera
    },
    'bar-events': {
      name: 'Bar & Events',
      description: 'Background image for the bar and events section',
      icon: Camera
    }
  };

  const handleSave = () => {
    console.log('SectionBackgroundManager: handleSave called');
    console.log('editingSection:', editingSection, 'formData:', formData);
    console.log('Validation check - editingSection:', !!editingSection, 'imageUrl:', !!formData.imageUrl);
    if (editingSection && formData.imageUrl) {
      console.log('Validation passed, updating backgrounds');
      const updatedBackgrounds = backgrounds.map(bg => 
        bg.section === editingSection 
          ? { 
              ...bg, 
              imageUrl: formData.imageUrl!,
              description: formData.description || bg.description 
            }
          : bg
      );
      console.log('SectionBackgroundManager: calling onBackgroundsUpdate');
      onBackgroundsUpdate(updatedBackgrounds);
      setEditingSection(null);
      setFormData({});
    } else {
      console.log('Validation failed - missing required fields');
    }
  };

  const openEditModal = (section: string) => {
    const background = backgrounds.find(bg => bg.section === section);
    if (background) {
      setEditingSection(section);
      setFormData({
        section: background.section,
        imageUrl: background.imageUrl,
        title: background.title,
        description: background.description || ''
      });
    }
  };

  const closeModal = () => {
    setEditingSection(null);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-white">
          Section Backgrounds
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {backgrounds.map((background) => {
          const info = sectionInfo[background.section];
          const IconComponent = info.icon;
          
          return (
            <div key={background.section} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-video relative group">
                <img
                  src={background.imageUrl}
                  alt={background.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(background.imageUrl, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                      title="View full image"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(background.section)}
                      className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full"
                      title="Edit background"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <IconComponent className="w-5 h-5 text-amber-600" />
                  <h3 className="font-medium text-gray-900 dark:text-white">{info.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{info.description}</p>
                {background.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    "{background.description}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit {sectionInfo[editingSection as keyof typeof sectionInfo]?.name} Background
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Current Image Preview */}
                {formData.imageUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Background
                    </label>
                    <div className="aspect-video w-full max-w-md border rounded-lg overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Background preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/background-image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter a description for this background image"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Guidelines */}
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                    Background Image Guidelines:
                  </h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Recommended resolution: 1920x1080 or higher</li>
                    <li>• Use high-quality images with good contrast</li>
                    <li>• Ensure text readability over the image</li>
                    <li>• Consider the mobile viewing experience</li>
                  </ul>
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
                    onClick={handleSave}
                    disabled={!formData.imageUrl}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white rounded-lg flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Background</span>
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

export default SectionBackgroundManager;
