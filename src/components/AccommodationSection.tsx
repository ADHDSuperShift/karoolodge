import React from 'react';
import { Wifi, Car, Coffee, Bath, Bed, Users } from 'lucide-react';

const AccommodationSection: React.FC = () => {
  const rooms = [
    {
      id: 1,
      name: "Luxury Suite",
      image: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528577396_a70a7693.webp",
      price: "R2,500",
      guests: 2,
      amenities: ["King Bed", "Mountain View", "Private Patio", "Fireplace"],
      description: "Spacious suite with panoramic Karoo views and luxury amenities."
    },
    {
      id: 2,
      name: "Karoo Cottage",
      image: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528579398_fe84a640.webp",
      price: "R1,800",
      guests: 4,
      amenities: ["Two Bedrooms", "Kitchen", "Garden View", "BBQ Area"],
      description: "Self-catering cottage perfect for families and longer stays."
    },
    {
      id: 3,
      name: "Classic Room",
      image: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528581314_da77209e.webp",
      price: "R1,200",
      guests: 2,
      amenities: ["Queen Bed", "En-suite", "Air Con", "Work Desk"],
      description: "Comfortable room with modern amenities and authentic Karoo charm."
    },
    {
      id: 4,
      name: "Family Suite",
      image: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528583145_23ec49ac.webp",
      price: "R2,200",
      guests: 6,
      amenities: ["Three Beds", "Two Bathrooms", "Lounge", "Kitchenette"],
      description: "Spacious accommodation ideal for families exploring Route 62."
    }
  ];

  return (
    <section id="accommodation" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
            Luxury Accommodation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our carefully curated selection of rooms and suites, each designed to provide comfort and tranquility in the heart of the Karoo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {room.price}/night
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-serif font-semibold text-gray-900">{room.name}</h3>
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">{room.guests} guests</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{room.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                      {amenity}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                    Book Now
                  </button>
                  <button className="flex-1 border border-gray-300 hover:border-amber-600 text-gray-700 hover:text-amber-600 py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-6 text-center">Hotel Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Wifi className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Free WiFi</span>
            </div>
            <div className="text-center">
              <Car className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Free Parking</span>
            </div>
            <div className="text-center">
              <Coffee className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Restaurant</span>
            </div>
            <div className="text-center">
              <Bath className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Spa Services</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccommodationSection;