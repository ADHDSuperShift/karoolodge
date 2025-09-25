import React, { useState } from 'react';
import { Upload, X, Camera, Link as LinkIcon } from 'lucide-react';

interface PhotoManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  title?: string;
}

const PhotoManager: React.FC<PhotoManagerProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  title = "Photos" 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    // In a real app, you would upload files to your server/cloud storage
    // For now, we'll create local URLs for demo purposes
    const newImages: string[] = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newImages.push(url);
      }
    });

    if (images.length + newImages.length <= maxImages) {
      onImagesChange([...images, ...newImages]);
    } else {
      alert(`Maximum ${maxImages} images allowed`);
    }
  };

  const addImageByUrl = () => {
    if (newImageUrl.trim()) {
      if (images.length < maxImages) {
        onImagesChange([...images, newImageUrl.trim()]);
        setNewImageUrl('');
      } else {
        alert(`Maximum ${maxImages} images allowed`);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Camera className="w-5 h-5 mr-2" />
          {title} ({images.length}/{maxImages})
        </h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setUploadMethod('url')}
            className={`px-3 py-1 text-sm rounded ${
              uploadMethod === 'url' 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <LinkIcon className="w-4 h-4 inline mr-1" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setUploadMethod('file')}
            className={`px-3 py-1 text-sm rounded ${
              uploadMethod === 'file' 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-1" />
            Upload
          </button>
        </div>
      </div>

      {uploadMethod === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <button
            type="button"
            onClick={addImageByUrl}
            disabled={images.length >= maxImages}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>
      )}

      {uploadMethod === 'file' && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' 
              : 'border-gray-300 dark:border-gray-600 hover:border-amber-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop images here, or click to select files
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block"
          >
            Choose Files
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Maximum {maxImages} images, JPG, PNG, WebP supported
          </p>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              
              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex space-x-2">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100"
                      title="Move left"
                    >
                      ←
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100"
                      title="Move right"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
              
              {/* Primary image indicator */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No images added yet</p>
          <p className="text-sm">Add images using the URL or upload method above</p>
        </div>
      )}
    </div>
  );
};

export default PhotoManager;
