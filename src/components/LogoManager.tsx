import React, { useState } from 'react';
import { Upload, X, Image, Save, Eye, RefreshCw } from 'lucide-react';

interface LogoManagerProps {
  currentLogo?: string;
  onLogoUpdate: (logoUrl: string) => void;
}

const LogoManager: React.FC<LogoManagerProps> = ({ currentLogo = '/logo.png', onLogoUpdate }) => {
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentLogo);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFileUpload(file);
      } else {
        alert('Please upload an image file (PNG, JPG, SVG)');
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    // In a real app, you would upload to your server/cloud storage
    // For demo, we'll create a local URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setNewLogoUrl(url);
    setIsLoading(false);
  };

  const handleUrlSubmit = () => {
    if (newLogoUrl.trim()) {
      setPreviewUrl(newLogoUrl.trim());
    }
  };

  const handleSave = () => {
    onLogoUpdate(previewUrl);
    setNewLogoUrl('');
  };

  const resetToDefault = () => {
    setPreviewUrl('/logo.png');
    setNewLogoUrl('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <Image className="w-5 h-5 mr-2" />
          Logo Management
        </h3>
        <button
          onClick={resetToDefault}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Reset
        </button>
      </div>

      {/* Current Logo Preview */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Current Logo</h4>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
          {isLoading ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <img
              src={previewUrl}
              alt="Logo Preview"
              className="max-h-16 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          )}
        </div>
      </div>

      {/* Upload Methods */}
      <div className="space-y-4">
        {/* URL Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Logo URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={newLogoUrl}
              onChange={(e) => setNewLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleUrlSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Logo File
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragActive 
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' 
                : 'border-gray-300 dark:border-gray-600 hover:border-amber-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Drag and drop your logo here, or click to select
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block"
            >
              Choose File
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Recommended: PNG or SVG format, max 200px height
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 pt-4 border-t dark:border-gray-700">
        <button
          onClick={handleSave}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Update Logo</span>
        </button>
      </div>

      {/* Logo Guidelines */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h5 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Logo Guidelines</h5>
        <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Use PNG for photos, SVG for vector graphics</li>
          <li>• Maximum height: 200px (will auto-scale to 48px)</li>
          <li>• Ensure good contrast for both light/dark themes</li>
          <li>• Keep file size under 1MB for fast loading</li>
        </ul>
      </div>
    </div>
  );
};

export default LogoManager;
