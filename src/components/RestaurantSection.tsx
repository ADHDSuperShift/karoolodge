import React, { useState } from 'react';
import { Clock, Users, Star, Calendar, ChefHat, Wine, Utensils, X } from 'lucide-react';
import { useGlobalState } from '../contexts/GlobalStateContext';

const RestaurantSection: React.FC = () => {
  const { sectionBackgrounds } = useGlobalState();
  const restaurantBackground = sectionBackgrounds.find(bg => bg.section === 'restaurant');
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState(2);

  const availableTimes = [
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the reservation data to your backend
    alert(`Reservation request sent for ${guestCount} guests on ${selectedDate} at ${selectedTime}`);
    setShowBookingModal(false);
  };

  const menuItems = [
    {
      category: "☕ Hot Drinks",
      items: [
        { name: "Espresso (single/double)", price: "", description: "Bold, rich perfection" },
        { name: "Americano", price: "", description: "Smooth & strong" },
        { name: "Cappuccino", price: "", description: "Classic Italian style" },
        { name: "Hazelnut Cappuccino", price: "", description: "Nutty twist on a classic" },
        { name: "Latte", price: "", description: "Creamy, comforting (almond milk available)" },
        { name: "Café Mocha", price: "", description: "Coffee meets chocolate" },
        { name: "Hot Chocolate", price: "", description: "Silky indulgence" },
        { name: "Rooibos / Ceylon Tea", price: "", description: "Pure relaxation" }
      ]
    },
    {
      category: "🧊 Cold Refreshments",
      items: [
        { name: "Appletizer / Grapetizer", price: "", description: "Crisp sparkling fruit" },
        { name: "Fruit Juices", price: "", description: "Fresh & fruity" },
        { name: "Iced Tea", price: "", description: "Cool & refreshing" },
        { name: "Sodas", price: "", description: "Classic favourites" },
        { name: "Still / Sparkling Water (500ml)", price: "", description: "Pure hydration" }
      ]
    },
    {
      category: "🍨 Milkshakes",
      price: "R35",
      items: [
        { name: "Thick & Creamy Milkshakes", price: "R35", description: "Chocolate • Banana • Bubblegum • Strawberry • Lime • Vanilla" }
      ]
    },
    {
      category: "🍳 Breakfast Favourites",
      items: [
        { name: "Farmstyle Breakfast", price: "R130", description: "2 eggs, bacon, sausage, grilled tomato, mushrooms, chips & toast" },
        { name: "Omelette Your Way", price: "R78", description: "Two fillings of your choice (onion, spinach, feta, mushroom, tomato, cheddar, ham, bacon, mince). Extra filling +R10" },
        { name: "Bolognese Toast", price: "R60", description: "Savoury beef & tomato Bolognese on toast, topped with a fried egg" },
        { name: "Baked Bean Toast", price: "R60", description: "Spicy beans on toast — a classic done right" },
        { name: "Breakfast Croissant", price: "R65", description: "Flaky pastry filled with scrambled egg & bacon" },
        { name: "Filled Croissant", price: "R60", description: "Ham, cheese & tomato tucked into buttery layers" },
        { name: "Veggie Stack", price: "R95", description: "Black mushroom & tomato on corn crumpets with avocado. Add an egg +R10" },
        { name: "Salmon Croissant", price: "R135", description: "Smoked salmon on a warm croissant with fluffy scrambled eggs" }
      ]
    },
    {
      category: "🧇 Savoury Waffles",
      items: [
        { name: "Bolognese & Melted Cheddar", price: "R110", description: "" },
        { name: "Chicken Mayo", price: "R110", description: "" },
        { name: "Creamed Spinach with Mozzarella & Feta", price: "R120", description: "" }
      ]
    },
    {
      category: "🥪 Toasted Sandwiches",
      subtitle: "All served with chips or salad",
      items: [
        { name: "Chicken Mayo", price: "R60", description: "" },
        { name: "Smoked Chicken, Mozzarella & Mayo", price: "R65", description: "" },
        { name: "Bacon, Egg & Cheese", price: "R65", description: "" },
        { name: "Ham, Cheese & Tomato", price: "R60", description: "" },
        { name: "Tuna Mayo with onion & peppers", price: "R60", description: "" },
        { name: "Bolognese & Cheese", price: "R65", description: "" }
      ]
    },
    {
      category: "🥖 Tramezzinis",
      subtitle: "Served with chips or salad",
      items: [
        { name: "Smoked Chicken, Bacon & Sweet Chilli Mayo", price: "R115", description: "" },
        { name: "Spinach, Feta & Olives", price: "R110", description: "" },
        { name: "Tuna Mayo with Gherkins", price: "R110", description: "" },
        { name: "Chicken Mayo & Mozzarella", price: "R110", description: "" },
        { name: "Ham & Mushroom", price: "R110", description: "" }
      ]
    },
    {
      category: "🍴 Mains",
      items: [
        { name: "Grilled / Battered Hake", price: "R98", description: "" },
        { name: "Fish Basket", price: "R160", description: "Fish, calamari, crab stick & onion rings" },
        { name: "Calamari", price: "R105", description: "Deep-fried or grilled, with lemon butter, peri-peri, or tartar sauce" },
        { name: "Sirloin Steak & Egg", price: "R120", description: "250g steak, fried egg, onion rings" },
        { name: "Prego Roll", price: "R102", description: "Tender beef steak in prego sauce" },
        { name: "Chicken Parmigiano", price: "R102", description: "Crumbed chicken, mushrooms, napoletano, mozzarella" },
        { name: "Chicken & Mushroom Pie", price: "R120", description: "With side salad" }
      ]
    },
    {
      category: "🍔 Burgers",
      subtitle: "All served with chips or salad",
      items: [
        { name: "Classic Beef", price: "R80", description: "150g patty, house sauce, garnish" },
        { name: "Cheese Burger", price: "R90", description: "150g patty, melted cheddar" },
        { name: "Breakfast Burger", price: "R120", description: "Patty, onion rings, bacon & fried egg" },
        { name: "Chicken Burger", price: "R90", description: "Grilled chicken breast, house sauce" }
      ]
    },
    {
      category: "🍝 Pasta",
      items: [
        { name: "Fettuccine Alfredo", price: "R119", description: "Ham & mushroom in creamy sauce" },
        { name: "Spaghetti Bolognese", price: "R112", description: "Traditional beef ragu, mozzarella" },
        { name: "Lasagne", price: "R110", description: "Classic layered bake with side salad" }
      ]
    },
    {
      category: "🥗 Salads",
      items: [
        { name: "Greek Salad", price: "R88", description: "Feta & olives" },
        { name: "Chicken Salad", price: "R110", description: "Grilled chicken, avocado & bacon or feta" },
        { name: "Smoked Chicken Salad", price: "R92", description: "Sweet chilli drizzle" },
        { name: "Potato Salad", price: "R60", description: "Mayo, egg & gherkins" }
      ]
    },
    {
      category: "🍰 Desserts",
      items: [
        { name: "Ice Cream & Chocolate Sauce", price: "R50", description: "" },
        { name: "Fruit Salad & Ice Cream", price: "R60", description: "" },
        { name: "Cake of the Day", price: "SQ", description: "" },
        { name: "Waffle with Ice Cream", price: "R80", description: "" },
        { name: "Waffle with Chocolate Mousse", price: "R80", description: "" }
      ]
    },
    {
      category: "Freshly Baked & Extras",
      items: [
        { name: "Muffin of the day", price: "SQ", description: "Ask your server" },
        { name: "Scones", price: "R45", description: "With butter, jam & your choice of cheese or cream" },
        { name: "Portion of Chips", price: "R40", description: "" }
      ]
    }
  ];

  return (
    <section id="restaurant" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-6">
              Vintage Car Restaurant
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Barrydale's Route 62 dining spot — fresh, hearty, and made with love. Our unique restaurant features 
              a beautifully restored vintage car as the centerpiece, serving everything from hearty breakfasts 
              to satisfying mains in a charming, nostalgic atmosphere.
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

            <button 
              onClick={() => setShowBookingModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Reserve Table
            </button>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src={restaurantBackground?.imageUrl || "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528584345_d1dfcb47.webp"}
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
          <div className="text-center mb-8">
            <h3 className="text-3xl font-serif font-semibold text-gray-900 mb-2">
              Vintage Car Restaurant Menu
            </h3>
            <p className="text-gray-600">Fresh, hearty, and made with love</p>
          </div>
          
          {!showFullMenu ? (
            // Menu Preview - Show first few categories
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems.slice(0, 6).map((section, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-amber-600 mb-4 border-b border-amber-200 pb-2">
                      {section.category}
                    </h4>
                    {section.subtitle && (
                      <p className="text-sm text-gray-500 mb-3 italic">{section.subtitle}</p>
                    )}
                    <div className="space-y-3">
                      {section.items.slice(0, 3).map((item, itemIndex) => (
                        <div key={itemIndex}>
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-gray-900 text-sm">{item.name}</h5>
                            {item.price && (
                              <span className="font-semibold text-amber-600 ml-2 text-sm">{item.price}</span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                          )}
                        </div>
                      ))}
                      {section.items.length > 3 && (
                        <p className="text-xs text-gray-500 italic">...and more</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <button 
                  onClick={() => setShowFullMenu(true)}
                  className="border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  View Full Menu
                </button>
              </div>
            </div>
          ) : (
            // Full Menu Display
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {menuItems.map((section, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-xl font-semibold text-amber-600 mb-4 border-b border-amber-200 pb-2">
                      {section.category}
                    </h4>
                    {section.subtitle && (
                      <p className="text-sm text-gray-600 mb-4 italic">{section.subtitle}</p>
                    )}
                    <div className="space-y-4">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900">{item.name}</h5>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              )}
                            </div>
                            {item.price && (
                              <span className="font-semibold text-amber-600 ml-4">{item.price}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Special Notes */}
              <div className="mt-8 bg-amber-50 rounded-lg p-6 text-center">
                <h4 className="font-semibold text-amber-800 mb-2">🌱 Vegetarian Options Available</h4>
                <p className="text-amber-700">Ask your server about our vegetarian alternatives</p>
              </div>
              
              <div className="text-center mt-6">
                <button 
                  onClick={() => setShowFullMenu(false)}
                  className="border border-gray-400 text-gray-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Show Less
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-semibold text-gray-900">Reserve Your Table</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleReservation} className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <div className="space-y-3">
                    {/* Time Input */}
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      min="17:00"
                      max="22:00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                      required
                    />
                    
                    {/* Quick Select Buttons */}
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Popular times:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {availableTimes.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Restaurant Hours Info */}
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>Restaurant Hours:</strong> Dinner 17:00 - 22:00 | Last orders at 21:30
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-lg font-semibold"
                    >
                      -
                    </button>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-amber-600" />
                      <span className="text-lg font-semibold">{guestCount}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.min(12, guestCount + 1))}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-lg font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+27 XX XXX XXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    placeholder="Dietary requirements, celebration details, etc."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Confirm Reservation
                  </button>
                </div>
              </form>

              {/* Contact Note */}
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Your reservation will be confirmed within 24 hours. For immediate assistance, call us at +27 28 572 1012.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RestaurantSection;