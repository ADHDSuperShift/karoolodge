import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useGlobalState } from '../contexts/GlobalStateContext';

const HeroSection: React.FC = () => {
  const { sectionBackgrounds, siteContent } = useGlobalState();
  const heroBackground = sectionBackgrounds.find(bg => bg.section === 'hero');
  const heroHeadline = siteContent.heroTitle || 'Experience the Klein Karoo';
  const heroSubtitle = siteContent.heroSubtitle || (
    'A luxury boutique retreat where authentic Klein Karoo charm meets world-class hospitality'
  );
  const [primaryLine, accentLine] = heroHeadline.split('|');

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${heroBackground?.imageUrl || '/placeholder.svg'}')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center text-white max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 leading-tight">
            {primaryLine.trim()}
            <span className="block font-medium text-amber-300">
              {(accentLine ?? 'Klein Karoo').trim()}
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a 
              href="https://nightsbridge.com/karoo-lodge" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 no-underline"
            >
              Book Your Stay <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#accommodation"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 no-underline"
            >
              Explore Rooms
            </a>
          </div>

          {/* Quick Info */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm">
            <a 
              href="https://maps.google.com/?q=Barrydale,+Route+62,+South+Africa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-amber-300 transition-colors duration-300 no-underline text-white"
            >
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>Barrydale, Route 62</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
