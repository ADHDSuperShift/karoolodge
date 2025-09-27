import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGlobalState } from '../contexts/GlobalStateContext';

const GallerySection: React.FC = () => {
  const { galleryImages } = useGlobalState();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'All Photos' },
    { key: 'rooms', label: 'Accommodation' },
    { key: 'dining', label: 'Restaurant' },
    { key: 'bar', label: 'Bar' },
    { key: 'wine', label: 'Wine' },
    { key: 'scenery', label: 'Scenery' }
  ];

  const filteredImages = activeFilter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter || !img.category); // Show uncategorized images too

  // Debug logging for mobile issues
  React.useEffect(() => {
    console.log('=== GALLERY RENDERING DEBUG ===');
    console.log('Total gallery images:', galleryImages.length);
    console.log('Active filter:', activeFilter);
    console.log('Filtered images:', filteredImages.length);
    console.log('Gallery images details:', galleryImages);
    console.log('Filtered images details:', filteredImages);
    console.log('Mobile user agent:', navigator.userAgent);
    console.log('Screen dimensions:', window.screen.width, 'x', window.screen.height);
    console.log('Viewport dimensions:', window.innerWidth, 'x', window.innerHeight);
  }, [galleryImages, filteredImages, activeFilter]);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
            Photo Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the beauty of Barrydale Klein Karoo Boutique Hotel through our curated collection of images
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                activeFilter === filter.key
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Image Grid - Mobile-first responsive design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredImages.length === 0 && galleryImages.length > 0 && (
            <div className="col-span-full text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800">
                🔍 Debug: {galleryImages.length} total images, but {filteredImages.length} shown with "{activeFilter}" filter
              </p>
              <p className="text-sm text-yellow-600 mt-2">
                Image categories: {galleryImages.map(img => img.category || 'none').join(', ')}
              </p>
            </div>
          )}
          
          {filteredImages.length === 0 && galleryImages.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No images available</p>
            </div>
          )}
          
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer bg-gray-200"
              onClick={() => openLightbox(index)}
              style={{
                // Ensure minimum dimensions on mobile
                minHeight: '200px',
                minWidth: '200px'
              }}
            >
              {/* Debug overlay for mobile */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded z-10">
                  {image.id}
                </div>
              )}
              
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(event) => {
                  const img = event.currentTarget as HTMLImageElement;
                  console.error('Image failed to load:', image.src);
                  // Simple fallback like room images
                  img.src = '/placeholder.svg';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', image.src);
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-amber-400 z-10"
              >
                <X className="w-8 h-8" />
              </button>
              
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-amber-400 z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-amber-400 z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              <img
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].title}
                className="max-w-full max-h-full object-contain"
                onError={(event) => {
                  const img = event.currentTarget as HTMLImageElement;
                  console.error('Lightbox image failed to load:', filteredImages[selectedImage].src);
                  img.src = '/placeholder.svg';
                }}
                onLoad={() => {
                  console.log('Lightbox image loaded successfully:', filteredImages[selectedImage].src);
                }}
              />
              
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold">{filteredImages[selectedImage].title}</h3>
                <p className="text-gray-300">{selectedImage + 1} of {filteredImages.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
