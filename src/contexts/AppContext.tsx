import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { buildCdnUrl } from '@/utils/cdn';

interface GalleryImage {
  id: number;
  src: string;
  category: 'rooms' | 'dining' | 'bar' | 'wine' | 'scenery';
  title: string;
  description?: string;
}

interface SectionBackground {
  section: 'hero' | 'restaurant' | 'wine-boutique' | 'bar-events';
  imageUrl: string;
  title: string;
  description?: string;
}

interface WineItem {
  id: number;
  name: string;
  vintage?: string;
  price: string;
  description: string;
  image: string;
  category: 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert';
  origin?: string;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  galleryImages: GalleryImage[];
  sectionBackgrounds: SectionBackground[];
  wineCollection: WineItem[];
  logoUrl: string;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  galleryImages: [],
  sectionBackgrounds: [],
  wineCollection: [],
  logoUrl: '/logo.png',
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const cdn = (key: string) => buildCdnUrl(key);

  // Default data - in a real app, this would come from your backend/admin system
  const [galleryImages] = useState<GalleryImage[]>([
    { id: 1, src: cdn('68d104194c27c84c671a33c8_1758528577396_a70a7693.webp'), category: 'rooms', title: 'Luxury Suite' },
    { id: 2, src: cdn('68d104194c27c84c671a33c8_1758528579398_fe84a640.webp'), category: 'rooms', title: 'Klein Karoo Cottage' },
    { id: 3, src: cdn('68d104194c27c84c671a33c8_1758528584345_d1dfcb47.webp'), category: 'dining', title: 'Vintage Car Restaurant' },
    { id: 4, src: cdn('68d104194c27c84c671a33c8_1758528602433_419a9c1d.webp'), category: 'bar', title: 'Windpomp Bar' },
    { id: 5, src: cdn('68d104194c27c84c671a33c8_1758528591318_fc7cb320.webp'), category: 'wine', title: 'Wine Boutique' },
    { id: 6, src: cdn('68d104194c27c84c671a33c8_1758528809003_d680fef6.webp'), category: 'scenery', title: 'Klein Karoo Landscape' },
    { id: 7, src: cdn('68d104194c27c84c671a33c8_1758528810823_190418d4.webp'), category: 'scenery', title: 'Mountain Views' },
    { id: 8, src: cdn('68d104194c27c84c671a33c8_1758528813169_24c3c65c.webp'), category: 'scenery', title: 'Sunset Vista' }
  ]);

  const [sectionBackgrounds] = useState<SectionBackground[]>([
    {
      section: 'hero',
      imageUrl: cdn('68d104194c27c84c671a33c8_1758528576432_f0fe5cce.webp'),
      title: 'Hero Background',
      description: 'Main hero section background showcasing Klein Karoo beauty'
    },
    {
      section: 'restaurant',
      imageUrl: cdn('68d104194c27c84c671a33c8_1758528584345_d1dfcb47.webp'),
      title: 'Restaurant Background',
      description: 'Vintage car restaurant atmosphere'
    },
    {
      section: 'wine-boutique',
      imageUrl: cdn('68d104194c27c84c671a33c8_1758528591318_fc7cb320.webp'),
      title: 'Wine Boutique Background',
      description: 'Wine cellar and boutique ambiance'
    },
    {
      section: 'bar-events',
      imageUrl: cdn('68d104194c27c84c671a33c8_1758528602433_419a9c1d.webp'),
      title: 'Bar & Events Background',
      description: 'Windpomp bar and event space'
    }
  ]);

  const [wineCollection] = useState<WineItem[]>([
    {
      id: 1,
      name: "Klein Karoo Reserve Cabernet",
      vintage: "2020",
      price: "R450",
      description: "Full-bodied red wine with rich tannins and notes of blackcurrant and oak",
      image: cdn('68d104194c27c84c671a33c8_1758528592120_cf63c543.webp'),
      category: 'red',
      origin: "Klein Karoo, South Africa"
    },
    {
      id: 2,
      name: "Route 62 Chardonnay",
      vintage: "2022",
      price: "R320",
      description: "Crisp white wine with citrus notes and a mineral finish",
      image: cdn('68d104194c27c84c671a33c8_1758528593828_73d944fd.webp'),
      category: 'white',
      origin: "Western Cape, South Africa"
    },
    {
      id: 3,
      name: "Barrydale Blush",
      vintage: "2023",
      price: "R290",
      description: "Light and refreshing rosé with strawberry and peach flavors",
      image: cdn('68d104194c27c84c671a33c8_1758528595529_41ddb688.webp'),
      category: 'rosé',
      origin: "Barrydale, Western Cape"
    },
    {
      id: 4,
      name: "Karoo Sparkle",
      vintage: "2021",
      price: "R480",
      description: "Elegant sparkling wine perfect for celebrations",
      image: cdn('68d104194c27c84c671a33c8_1758528598192_5cfeb00f.webp'),
      category: 'sparkling',
      origin: "Robertson Valley, South Africa"
    }
  ]);

  const [logoUrl] = useState('/logo.png');

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        galleryImages,
        sectionBackgrounds,
        wineCollection,
        logoUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
