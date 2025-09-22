import React from 'react';
import { Clock, Star, Utensils } from 'lucide-react';

const RestaurantSection: React.FC = () => {
  const menuItems = [
    {
      category: "Starters",
      items: [
        { name: "Karoo Lamb Carpaccio", price: "R95", description: "Thinly sliced local lamb with rocket and parmesan" },
        { name: "Ostrich Biltong Platter", price: "R75", description: "Selection of house-made biltong with preserves" }
      ]
    },
    {
      category: "Mains",
      items: [
        { name: "Slow-roasted Karoo Lamb", price: "R285", description: "With rosemary jus and seasonal vegetables" },
        { name: "Grilled Springbok Loin", price: "R245", description: "Served with sweet potato puree and wild mushrooms" }
      ]
    }
  ];

  return (
    <section id="restaurant" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-6">
              Vintage Car Restaurant
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Dine in our unique restaurant featuring a beautifully restored vintage car as the centerpiece. 
              Our chef creates exceptional dishes using the finest local Karoo ingredients, paired perfectly 
              with wines from our boutique selection.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-amber-600 mr-3" />
                <div>
                  <p className="font-semibold text-gray-900">Dinner</p>
                  <p className="text-gray-600">18:00 - 21:30</p>
                </div>
              </div>
              <div className="flex items-center">
                <Utensils className="w-6 h-6 text-amber-600 mr-3" />
                <div>
                  <p className="font-semibold text-gray-900">Breakfast</p>
                  <p className="text-gray-600">07:00 - 10:00</p>
                </div>
              </div>
            </div>

            <div className="flex items-center mb-8">
              <div className="flex text-amber-500 mr-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">Rated 4.8/5 by guests</span>
            </div>

            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Reserve Table
            </button>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528584345_d1dfcb47.webp"
              alt="Vintage Car Restaurant"
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-xl"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-serif font-semibold mb-2">Fine Dining Experience</h3>
              <p className="text-gray-200">Where culinary art meets automotive history</p>
            </div>
          </div>
        </div>

        {/* Menu Preview */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <h3 className="text-3xl font-serif font-semibold text-gray-900 mb-8 text-center">
            Featured Menu Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {menuItems.map((section, index) => (
              <div key={index}>
                <h4 className="text-xl font-semibold text-amber-600 mb-4 border-b border-amber-200 pb-2">
                  {section.category}
                </h4>
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <span className="font-semibold text-amber-600 ml-4">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
              View Full Menu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantSection;