import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">
              Barrydale Karoo
              <span className="block text-lg font-light text-amber-400">Boutique Hotel</span>
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Experience authentic Karoo hospitality in our luxury boutique hotel on the famous Route 62.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#accommodation" className="text-gray-300 hover:text-amber-400 transition-colors">Accommodation</a></li>
              <li><a href="#restaurant" className="text-gray-300 hover:text-amber-400 transition-colors">Restaurant</a></li>
              <li><a href="#wine" className="text-gray-300 hover:text-amber-400 transition-colors">Wine Boutique</a></li>
              <li><a href="#bar" className="text-gray-300 hover:text-amber-400 transition-colors">Bar & Events</a></li>
              <li><a href="#gallery" className="text-gray-300 hover:text-amber-400 transition-colors">Gallery</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-amber-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Luxury Accommodation</li>
              <li>Fine Dining Restaurant</li>
              <li>Wine Tastings</li>
              <li>Private Events</li>
              <li>Conference Facilities</li>
              <li>Spa Services</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-amber-400 mr-3" />
                <span className="text-gray-300">+27 28 572 1012</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-amber-400 mr-3" />
                <span className="text-gray-300">info@barrydalekaroo.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-amber-400 mr-3 mt-1" />
                <div className="text-gray-300">
                  <p>123 Route 62</p>
                  <p>Barrydale, 6750</p>
                  <p>Western Cape</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for special offers and events</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Barrydale Karoo Boutique Hotel. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;