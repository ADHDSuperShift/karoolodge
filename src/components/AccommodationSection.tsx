import React, { useMemo, useState } from 'react';
import { Wifi, Coffee, Bed, Users, ChevronLeft, ChevronRight, Star, MapPin, Waves, Wine } from 'lucide-react';
import { useGlobalState } from '@/contexts/GlobalStateContext';

const AccommodationSection: React.FC = () => {
  const { rooms: accommodationRooms } = useGlobalState();
  const [expandedRoom, setExpandedRoom] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({});

  const rooms = useMemo(() => accommodationRooms ?? [], [accommodationRooms]);

  const toggleRoom = (roomId: number) => {
    setExpandedRoom((prev) => (prev === roomId ? null : roomId));
    setCurrentImageIndex((prev) => {
      if (prev[roomId] !== undefined) {
        return prev;
      }
      return { ...prev, [roomId]: 0 };
    });
  };

  const nextImage = (roomId: number, imageCount: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: ((prev[roomId] ?? 0) + 1) % Math.max(imageCount, 1)
    }));
  };

  const prevImage = (roomId: number, imageCount: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] ?? 0) === 0 ? Math.max(imageCount - 1, 0) : (prev[roomId] ?? 0) - 1
    }));
  };

  if (!rooms.length) {
    return (
      <section id="accommodation" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-white mb-4">Rooms Coming Soon</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We're updating our accommodation details. Please check back shortly for the full room collection.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="accommodation" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">
            🛏️ Our Rooms
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-6">
            At Barrydale Klein Karoo Lodge, every room tells its own story — inspired by the beauty of the Klein Karoo and designed for comfort, style, and relaxation. All rooms are en-suite and include:
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-gray-700 dark:text-gray-300">
            <span className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <Wifi className="w-4 h-4 text-amber-600" />
              ✔ Free Wi-Fi
            </span>
            <span className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <Coffee className="w-4 h-4 text-amber-600" />
              ✔ Mini fridge
            </span>
            <span className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <Coffee className="w-4 h-4 text-amber-600" />
              ✔ Coffee/tea station
            </span>
            <span className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <Bed className="w-4 h-4 text-amber-600" />
              ✔ Fresh linen & towels
            </span>
            <span className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <Coffee className="w-4 h-4 text-amber-600" />
              ✔ Daily breakfast
            </span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Two of our rooms are fully wheelchair-accessible, and we're proud to be inclusive and mobility-friendly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {rooms.map((room) => {
            const images = room.images ?? [];
            const isExpanded = expandedRoom === room.id;
            const currentIndex = currentImageIndex[room.id] ?? 0;
            const previewImage = images[currentIndex] ?? '/placeholder.svg';
            const baseAmenities = (room.amenities ?? []).slice(0, 4);
            const extendedAmenities = [...(room.amenities ?? []), ...(room.features ?? [])].filter(Boolean);
            const guestCount = room.guests ?? room.maxGuests ?? 2;

            return (
              <div
                key={room.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'md:col-span-2 shadow-2xl dark:shadow-gray-900/80' : 'hover:shadow-xl dark:hover:shadow-gray-900/60'
                }`}
              >
                <div className={`${isExpanded ? 'lg:flex' : ''}`}>
                  <div className={`relative ${isExpanded ? 'lg:w-1/2 h-96' : 'h-64'}`}>
                    <img
                      src={previewImage}
                      alt={`${room.name} - Image ${currentIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        (event.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {room.price}/night
                    </div>

                    {isExpanded && images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(room.id, images.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all duration-200"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => nextImage(room.id, images.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all duration-200"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex((prev) => ({ ...prev, [room.id]: index }))}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className={`p-6 ${isExpanded ? 'lg:w-1/2' : ''}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">{room.name}</h3>
                        <p className="text-amber-600 dark:text-amber-400 font-medium text-sm mb-1">{room.category}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{guestCount} guests</span>
                          </div>
                          {isExpanded && room.size && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{room.size}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">{room.description}</p>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {baseAmenities.map((amenity, index) => (
                        <div key={`${room.id}-amenity-${index}`} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                          {amenity}
                        </div>
                      ))}
                    </div>

                    {isExpanded && (
                      <div className="mt-6 space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About This Room</h4>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{room.detailedDescription}</p>
                        </div>

                        {extendedAmenities.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">All Amenities</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {extendedAmenities.map((feature, index) => (
                                <div key={`${room.id}-feature-${index}`} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                  <Star className="w-3 h-3 text-amber-600 mr-2" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <a
                        href="https://nightsbridge.com/karoo-lodge"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 text-center no-underline"
                      >
                        Book Now
                      </a>
                      <button
                        onClick={() => toggleRoom(room.id)}
                        className="flex-1 border border-gray-300 hover:border-amber-600 text-gray-700 dark:text-gray-200 hover:text-amber-600 py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                      >
                        {isExpanded ? 'Show Less' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mt-12">
          <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-6 text-center">Hotel Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-700 dark:text-gray-200">
            <div className="text-center">
              <Wifi className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Free Wi-Fi</span>
            </div>
            <div className="text-center">
              <Wine className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Bar</span>
            </div>
            <div className="text-center">
              <Coffee className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Restaurant</span>
            </div>
            <div className="text-center">
              <Waves className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Swimming Pool</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccommodationSection;
