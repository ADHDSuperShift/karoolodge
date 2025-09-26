import React from 'react';
import { Wine, ShoppingCart, Award, MapPin } from 'lucide-react';
import { useGlobalState } from '../contexts/GlobalStateContext';

const WineBoutiqueSection: React.FC = () => {
  const { wineCollection, sectionBackgrounds } = useGlobalState();
  const wineBoutiqueBackground = sectionBackgrounds.find(bg => bg.section === 'wine-boutique');

  return (
    <section id="wine" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
            Wine Boutique
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the finest selection of premium South African wines. Our curated collection 
            features exceptional vintages that showcase the best of South Africa's renowned wine regions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Wine Shop Image */}
          <div className="relative">
            <img
              src={wineBoutiqueBackground?.imageUrl || "/placeholder.svg"}
              alt="Wine Boutique Interior"
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-xl"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-serif font-semibold mb-2">Boutique Wine Shop</h3>
              <p className="text-gray-200">Carefully curated local selections</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <Wine className="w-8 h-8 text-amber-600 mr-3" />
                <div>
                  <p className="font-semibold text-gray-900">50+ Wines</p>
                  <p className="text-gray-600">Local & Regional</p>
                </div>
              </div>
              <div className="flex items-center">
                <Award className="w-8 h-8 text-amber-600 mr-3" />
                <div>
                  <p className="font-semibold text-gray-900">Award Winners</p>
                  <p className="text-gray-600">Premium Selection</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-8 h-8 text-amber-600 mr-3" />
                <div>
                  <p className="font-semibold text-gray-900">Route 62</p>
                  <p className="text-gray-600">Klein Karoo Wines</p>
                </div>
              </div>
              <div className="flex items-center">
                <ShoppingCart className="w-8 h-8 text-amber-600 mr-3" />
                <div>
                  <p className="font-semibold text-gray-900">Take Home</p>
                  <p className="text-gray-600">Or Ship Nationwide</p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Our wine boutique features an expertly curated selection of premium South African wines. 
              From crisp Chenin Blancs to robust Cabernet Sauvignons, each bottle represents the finest 
              expressions of South Africa's diverse wine regions.
            </p>

            <div className="flex gap-4">
              <a 
                href="#bar" 
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 no-underline"
              >
                Next Wine Tasting
              </a>
            </div>
          </div>
        </div>

        {/* Featured Wines */}
        <div>
          <h3 className="text-3xl font-serif font-semibold text-gray-900 mb-8 text-center">
            Featured Wines
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wineCollection.map((wine) => (
              <div key={wine.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={wine.image}
                    alt={wine.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-amber-600 text-white px-2 py-1 rounded text-sm font-semibold">
                    {wine.vintage}
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-serif font-semibold text-gray-900 mb-2">{wine.name}</h4>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {wine.origin || 'Klein Karoo, South Africa'}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">{wine.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-amber-600">{wine.price}</span>
                    <button className="bg-gray-100 hover:bg-amber-600 hover:text-white text-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors duration-200">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WineBoutiqueSection;