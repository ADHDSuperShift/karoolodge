import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '@/contexts/GlobalStateContext';

const Footer: React.FC = () => {
  const { siteContent } = useGlobalState();
  const { contactInfo, socialMedia, logoUrl } = siteContent;

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src={logoUrl}
                alt="Barrydale Karoo Boutique Hotel logo"
                className="h-14 w-auto"
                onError={(event) => {
                  (event.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="text-left">
                <h3 className="text-2xl font-serif font-bold">
                  Barrydale Karoo
                  <span className="block text-lg font-light text-amber-400">Boutique Hotel</span>
                </h3>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Experience authentic Klein Karoo hospitality in our luxury boutique hotel on the famous Route 62.
            </p>
            <div className="flex space-x-4">
              <a 
                href={socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href={socialMedia.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 transition-colors"
                aria-label="Follow us on Twitter"
              >
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
              <li>Restaurant</li>
              <li>Bar & Lounge</li>
              <li>Wine Tastings</li>
              <li>Private Events</li>
              <li>Wine Boutique</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-amber-400 mr-3" />
                <span className="text-gray-300">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-amber-400 mr-3" />
                <span className="text-gray-300">24/7 Emergency Contact Available</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-amber-400 mr-3" />
                <span className="text-gray-300">{contactInfo.email}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-amber-400 mr-3 mt-1" />
                <div className="text-gray-300 whitespace-pre-line">{contactInfo.address}</div>
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
            © 2024 Barrydale Klein Karoo Boutique Hotel. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Cookie Policy</Link>
            <Link to="/admin" className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
