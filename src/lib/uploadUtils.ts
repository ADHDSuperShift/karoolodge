// Utility functions for managing uploaded images in localStorage

export interface UploadedImage {
  id: string;
  name: string;
  folder: string;
  base64: string;
  size: number;
  type: string;
  uploadedAt: number;
}

export const getUploadedImages = (): UploadedImage[] => {
  try {
    const imagesJson = localStorage.getItem('uploadedImages');
    return imagesJson ? JSON.parse(imagesJson) : [];
  } catch (error) {
    console.error('Failed to load uploaded images:', error);
    return [];
  }
};

export const getUploadedImagesByFolder = (folder: string): UploadedImage[] => {
  return getUploadedImages().filter(img => img.folder === folder);
};

export const clearUploadedImages = (): void => {
  localStorage.removeItem('uploadedImages');
  console.log('All uploaded images cleared from localStorage');
};

export const clearUploadedImagesByFolder = (folder: string): void => {
  const allImages = getUploadedImages();
  const filteredImages = allImages.filter(img => img.folder !== folder);
  localStorage.setItem('uploadedImages', JSON.stringify(filteredImages));
  console.log(`Cleared uploaded images from folder: ${folder}`);
};

export const getUploadedImagesStats = () => {
  const images = getUploadedImages();
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  const folderCounts = images.reduce((counts, img) => {
    counts[img.folder] = (counts[img.folder] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  return {
    totalCount: images.length,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    folderCounts
  };
};
