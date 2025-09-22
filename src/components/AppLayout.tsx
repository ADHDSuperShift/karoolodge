import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import AccommodationSection from './AccommodationSection';
import RestaurantSection from './RestaurantSection';
import WineBoutiqueSection from './WineBoutiqueSection';
import BarEventsSection from './BarEventsSection';
import ContactSection from './ContactSection';
import TestimonialsSection from './TestimonialsSection';
import GallerySection from './GallerySection';
import Footer from './Footer';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <AccommodationSection />
        <RestaurantSection />
        <WineBoutiqueSection />
        <BarEventsSection />
        <GallerySection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
