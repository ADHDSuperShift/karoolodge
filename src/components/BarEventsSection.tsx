import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { useGlobalState } from '../contexts/GlobalStateContext';

const BarEventsSection: React.FC = () => {
  const { sectionBackgrounds, events } = useGlobalState();
  const barEventsBackground = sectionBackgrounds.find(bg => bg.section === 'bar-events');
  const cocktails = [
    { name: "Klein Karoo Sunset", price: "R85", description: "Amarula, whiskey, and orange bitters" },
    { name: "Route 62 Spritz", price: "R75", description: "Local wine, soda, and fresh herbs" },
    { name: "Windpomp Mule", price: "R80", description: "Gin, ginger beer, and lime" },
    { name: "Bokmakirie Martini", price: "R90", description: "Vodka with local honey and thyme" }
  ];

  return (
    <section id="bar" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
              Windpomp Bar & Events
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Unwind at our iconic Windpomp Bar, where traditional Klein Karoo hospitality meets modern mixology. 
              Enjoy craft cocktails, local wines, and live entertainment under the vast Klein Karoo sky.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-amber-400 mr-3" />
                <div>
                  <p className="font-semibold">Bar Hours</p>
                  <p className="text-gray-400">16:00 - 24:00</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="w-6 h-6 text-amber-400 mr-3" />
                <div>
                  <p className="font-semibold">Private Events</p>
                  <p className="text-gray-400">Up to 80 guests</p>
                </div>
              </div>
            </div>

            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              View Event Calendar
            </button>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src={barEventsBackground?.imageUrl || "/placeholder.svg"}
              alt="Windpomp Bar"
              className="w-full h-96 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-xl"></div>
            <div className="absolute bottom-6 left-6">
              <h3 className="text-2xl font-serif font-semibold mb-2">Authentic Klein Karoo Experience</h3>
              <p className="text-gray-200">Where stories are shared and memories made</p>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif font-semibold mb-8 text-center">
            Upcoming Events
          </h3>
          {events.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold mb-2">{event.title}</h4>
                      <div className="flex items-center text-amber-400 text-sm mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{event.date}</span>
                        <Clock className="w-4 h-4 ml-4 mr-2" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {event.type}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{event.description}</p>
                  <button className="text-amber-400 hover:text-amber-300 font-medium text-sm">
                    Learn More →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-amber-500/40 bg-gray-800/40 p-10 text-center">
              <Calendar className="mx-auto mb-3 h-8 w-8 text-amber-400" />
              <p className="text-lg font-semibold">No events scheduled</p>
              <p className="text-sm text-gray-400">Check back soon for the latest happenings at the Windpomp Bar.</p>
            </div>
          )}
        </div>

        {/* Cocktail Menu */}
        <div className="bg-gray-800 rounded-xl p-8">
          <h3 className="text-3xl font-serif font-semibold mb-8 text-center">
            Signature Cocktails
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cocktails.map((cocktail, index) => (
              <div key={index} className="flex justify-between items-start border-b border-gray-700 pb-4 last:border-b-0">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">{cocktail.name}</h4>
                  <p className="text-gray-400 text-sm">{cocktail.description}</p>
                </div>
                <span className="font-semibold text-amber-400 ml-4">{cocktail.price}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="border border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
              Full Drinks Menu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BarEventsSection;
