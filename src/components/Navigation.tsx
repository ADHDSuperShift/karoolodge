import React, { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useGlobalState } from '../contexts/GlobalStateContext';

const Navigation: React.FC = () => {
  const { siteContent } = useGlobalState();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Accommodation', href: '#accommodation' },
    { name: 'Restaurant', href: '#restaurant' },
    { name: 'Bar & Events', href: '#bar' },
    { name: 'Wine Boutique', href: '#wine' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm shadow-sm dark:shadow-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 -ml-2 md:-ml-8">
            <a href="#home" className="flex items-center gap-3">
              <img 
                src={siteContent.logoUrl} 
                alt="Barrydale Karoo Boutique Hotel Logo" 
                className="h-12 w-auto mr-3"
                onError={(e) => {
                  // Hide image and show text fallback if logo fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                  const textFallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                  if (textFallback) textFallback.style.display = 'block';
                }}
              />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-serif font-semibold text-gray-900 dark:text-white tracking-wide uppercase">
                  Barrydale Karoo
                </span>
                <span className="text-xs font-medium tracking-[0.35em] text-amber-600 dark:text-amber-400 uppercase">
                  Boutique Hotel
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation - moved to the right */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
            {/* Admin button removed from header */}
            <ThemeToggle />
            <a 
              href="https://nightsbridge.com/karoo-lodge" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white px-3 py-1.5 rounded-md font-medium text-sm transition-colors duration-200 inline-block whitespace-nowrap ml-40"
            >
              Book Now
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {/* Admin button removed from mobile navigation */}
              <div className="px-3 py-2 border-t dark:border-gray-700 mt-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>+27 28 572 1012</span>
                </div>
                <a 
                  href="https://nightsbridge.com/karoo-lodge" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold inline-block text-center"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
