import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Define all the interfaces
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

interface Room {
  id: number;
  name: string;
  category: string;
  images: string[];
  price: string;
  description: string;
  detailedDescription: string;
  amenities: string[];
  features?: string[];
  size?: string;
  maxGuests?: number;
  guests?: number;
  bedConfiguration?: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  type: string;
  image?: string;
}

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  logoUrl: string;
}

interface GlobalState {
  galleryImages: GalleryImage[];
  sectionBackgrounds: SectionBackground[];
  wineCollection: WineItem[];
  rooms: Room[];
  events: Event[];
  siteContent: SiteContent;
}

interface GlobalStateContextType extends GlobalState {
  // Gallery management
  updateGalleryImages: (images: GalleryImage[]) => void;
  addGalleryImage: (image: GalleryImage) => void;
  updateGalleryImage: (image: GalleryImage) => void;
  deleteGalleryImage: (id: number) => void;
  
  // Section backgrounds management
  updateSectionBackgrounds: (backgrounds: SectionBackground[]) => void;
  updateSectionBackground: (background: SectionBackground) => void;
  
  // Wine collection management
  updateWineCollection: (wines: WineItem[]) => void;
  addWine: (wine: WineItem) => void;
  updateWine: (wine: WineItem) => void;
  deleteWine: (id: number) => void;
  
  // Room management
  updateRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: number) => void;
  
  // Event management
  updateEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: number) => void;
  
  // Site content management
  updateSiteContent: (content: Partial<SiteContent>) => void;
  updateLogo: (logoUrl: string) => void;
}

// Utility function to create local placeholder images
const createPlaceholderSvg = (width: number, height: number, color: string, textColor: string, text: string): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

// Utility function to ensure URLs have proper protocol
const fixUrlProtocol = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('data:')) return url;
  if (url.startsWith('/')) return url; // relative URLs are OK
  
  // Fix broken URLs that contain undefined values
  if (url.includes('undefined.s3.undefined.amazonaws.com')) {
    // Extract the path part after the broken domain
    const pathMatch = url.match(/undefined\.s3\.undefined\.amazonaws\.com\/(.+)$/);
    if (pathMatch) {
      const path = pathMatch[1];
      return `https://barrydalekaroo185607-dev.s3.us-east-1.amazonaws.com/${path}`;
    }
  }
  
  // If it looks like an S3 key/path without protocol, add the S3 URL
  if (url.includes('.amazonaws.com') && !url.startsWith('http')) {
    return `https://${url}`;
  }
  
  // If it's just a filename or path, assume it's an S3 object
  if (url && !url.includes('://') && !url.startsWith('data:') && !url.startsWith('/')) {
    // Use the S3 bucket from the configuration (aligned with amplifyconfiguration.ts)
    const bucketName = 'barrydalekaroo185607-dev';
    const region = 'us-east-1';
    return `https://${bucketName}.s3.${region}.amazonaws.com/${url}`;
  }
  
  return url;
};

// Default state with proper URL protocols
const defaultState: GlobalState = {
  galleryImages: [
    { id: 1, src: createPlaceholderSvg(800, 600, '8B4513', 'FFF', 'Luxury Suite'), category: 'rooms', title: 'Luxury Suite' },
    { id: 2, src: createPlaceholderSvg(800, 600, 'D2691E', 'FFF', 'Klein Karoo Cottage'), category: 'rooms', title: 'Klein Karoo Cottage' },
    { id: 3, src: createPlaceholderSvg(800, 600, 'CD853F', 'FFF', 'Vintage Restaurant'), category: 'dining', title: 'Vintage Car Restaurant' },
    { id: 4, src: createPlaceholderSvg(800, 600, 'DEB887', 'FFF', 'Windpomp Bar'), category: 'bar', title: 'Windpomp Bar' },
    { id: 5, src: createPlaceholderSvg(800, 600, 'F4A460', 'FFF', 'Wine Boutique'), category: 'wine', title: 'Wine Boutique' },
    { id: 6, src: createPlaceholderSvg(800, 600, 'DAA520', 'FFF', 'Karoo Landscape'), category: 'scenery', title: 'Klein Karoo Landscape' },
    { id: 7, src: createPlaceholderSvg(800, 600, 'B8860B', 'FFF', 'Mountain Views'), category: 'scenery', title: 'Mountain Views' },
    { id: 8, src: createPlaceholderSvg(800, 600, 'A0522D', 'FFF', 'Sunset Vista'), category: 'scenery', title: 'Sunset Vista' }
  ],
  sectionBackgrounds: [
    {
      section: 'hero',
      imageUrl: createPlaceholderSvg(1200, 600, '8B4513', 'FFF', 'Hero Background'),
      title: 'Hero Background',
      description: 'Main hero section background image'
    },
    {
      section: 'restaurant',
      imageUrl: createPlaceholderSvg(1200, 600, 'D2691E', 'FFF', 'Restaurant Background'),
      title: 'Restaurant Background',
      description: 'Restaurant section background image'
    },
    {
      section: 'wine-boutique',
      imageUrl: createPlaceholderSvg(1200, 600, 'CD853F', 'FFF', 'Wine Boutique'),
      title: 'Wine Boutique Background',
      description: 'Wine boutique section background image'
    },
    {
      section: 'bar-events',
      imageUrl: createPlaceholderSvg(1200, 600, 'DEB887', 'FFF', 'Bar Events'),
      title: 'Bar Events Background',
      description: 'Bar and events section background image'
    }
  ],
  wineCollection: [
    {
      id: 1,
      name: "Klein Karoo Cabernet Sauvignon",
      vintage: "2020",
      price: "R245",
      description: "Full-bodied red wine with rich tannins and notes of blackcurrant, cedar, and vanilla. Aged in French oak barrels for 18 months.",
      image: createPlaceholderSvg(400, 600, '722F37', 'FFF', 'Cabernet'),
      category: 'red',
      origin: "Klein Karoo, South Africa"
    },
    {
      id: 2,
      name: "Barrydale Chardonnay",
      vintage: "2021",
      price: "R180",
      description: "Crisp and elegant white wine with citrus notes, balanced acidity, and hints of oak. Perfect with seafood and poultry.",
      image: createPlaceholderSvg(400, 600, 'F7E7CE', '333', 'Chardonnay'),
      category: 'white',
      origin: "Barrydale, South Africa"
    },
    {
      id: 3,
      name: "Route 62 Rosé",
      vintage: "2022",
      price: "R150",
      description: "Light and refreshing rosé with delicate strawberry flavors and a crisp finish. Ideal for summer evenings.",
      image: createPlaceholderSvg(400, 600, 'E8B4B8', 'FFF', 'Rosé'),
      category: 'rosé',
      origin: "Route 62, South Africa"
    },
    {
      id: 4,
      name: "Karoo Sparkling Wine",
      vintage: "2021",
      price: "R220",
      description: "Traditional method sparkling wine with fine bubbles, citrus notes, and a long elegant finish.",
      image: createPlaceholderSvg(400, 600, 'F0E68C', '333', 'Sparkling'),
      category: 'sparkling',
      origin: "Robertson Valley, South Africa"
    }
  ],
  rooms: [
    {
      id: 1,
      name: "Aloe Ferox",
      category: "Standard Twin Room",
      images: [
        createPlaceholderSvg(800, 600, '8B4513', 'FFF', 'Aloe Ferox 1'),
        createPlaceholderSvg(800, 600, 'D2691E', 'FFF', 'Aloe Ferox 2'),
        createPlaceholderSvg(800, 600, 'CD853F', 'FFF', 'Aloe Ferox 3')
      ],
      price: "R1,200",
      guests: 2,
      maxGuests: 2,
      bedConfiguration: "Twin beds",
      size: "30 m²",
      amenities: [
        "Twin beds",
        "En-suite bathroom",
        "Free Wi-Fi",
        "Mini fridge",
        "Coffee/tea station",
        "Fresh linen & towels",
        "Daily breakfast"
      ],
      features: [
        "Route 62 explorer-friendly",
        "Cosy atmosphere",
        "Essential amenities",
        "Perfect for friends",
        "Thoughtfully designed"
      ],
      description: "A cosy, restful Twin room with everything you need for a good night's sleep after exploring Route 62.",
      detailedDescription:
        "Our Aloe Ferox room provides comfortable twin beds in a thoughtfully designed space perfect for friends or family. Featuring all essential amenities including en-suite bathroom, free Wi-Fi, mini fridge, and coffee/tea station. Wake up refreshed and ready to explore the Klein Karoo with daily breakfast included."
    },
    {
      id: 2,
      name: "Agapanthus",
      category: "Standard Twin Room (Accessible)",
      images: [
        createPlaceholderSvg(800, 600, 'DEB887', 'FFF', 'Accessible Room 1'),
        createPlaceholderSvg(800, 600, 'F4A460', 'FFF', 'Accessible Room 2'),
        createPlaceholderSvg(800, 600, 'DAA520', 'FFF', 'Accessible Room 3')
      ],
      price: "R1,200",
      guests: 2,
      maxGuests: 2,
      bedConfiguration: "Twin beds",
      size: "32 m²",
      amenities: [
        "Twin beds",
        "Wheelchair accessible",
        "Accessible bathroom with handrails",
        "Shower chair",
        "Free Wi-Fi",
        "Mini fridge",
        "Coffee/tea station",
        "Fresh linen & towels",
        "Daily breakfast"
      ],
      features: [
        "Fully wheelchair accessible",
        "Thoughtfully designed",
        "Safety features",
        "Mobility-friendly",
        "Handrails and shower chair"
      ],
      description:
        "Wheelchair-friendly Twin room with a thoughtfully designed bathroom featuring handrails and a shower chair for ease and comfort.",
      detailedDescription:
        "The Agapanthus room is specially designed for accessibility without compromising on comfort. Features include twin beds, a fully accessible en-suite bathroom with handrails, shower chair, and wider doorways. All standard amenities are provided including free Wi-Fi, mini fridge, and daily breakfast."
    },
    {
      id: 3,
      name: "Botterboom",
      category: "Standard Twin Room (Accessible)",
      images: [
        createPlaceholderSvg(800, 600, '8B7355', 'FFF', 'Botterboom 1'),
        createPlaceholderSvg(800, 600, 'A0522D', 'FFF', 'Botterboom 2'),
        createPlaceholderSvg(800, 600, 'CD853F', 'FFF', 'Botterboom 3')
      ],
      price: "R1,200",
      guests: 2,
      maxGuests: 2,
      bedConfiguration: "Twin beds",
      size: "35 m²",
      amenities: [
        "Twin beds",
        "Wheelchair accessible",
        "Spacious layout",
        "Accessible bathroom with full support",
        "Free Wi-Fi",
        "Mini fridge",
        "Coffee/tea station",
        "Fresh linen & towels",
        "Daily breakfast"
      ],
      features: [
        "Spacious design",
        "Full bathroom support",
        "Comfort and practicality",
        "Independence-focused",
        "Accessible features"
      ],
      description:
        "Another spacious, accessible Twin option with full bathroom support, designed for both comfort and practicality.",
      detailedDescription:
        "Botterboom offers spacious accommodation with full accessibility features. This twin room provides comfort and independence with carefully designed spaces, accessible bathroom facilities, and all the amenities needed for a pleasant stay in the Klein Karoo."
    },
    {
      id: 4,
      name: "Geelkatstert",
      category: "Luxury King Room (Accessible)",
      images: [
        createPlaceholderSvg(800, 600, 'DAA520', 'FFF', 'Geelkatstert 1'),
        createPlaceholderSvg(800, 600, 'B8860B', 'FFF', 'Geelkatstert 2'),
        createPlaceholderSvg(800, 600, 'F4A460', 'FFF', 'Geelkatstert 3')
      ],
      price: "R1,800",
      guests: 2,
      maxGuests: 2,
      bedConfiguration: "King-size bed",
      size: "40 m²",
      amenities: [
        "King-size bed",
        "Wheelchair accessible",
        "Courtyard views",
        "Elegant furnishings",
        "Accessible bathroom",
        "Free Wi-Fi",
        "Mini fridge",
        "Coffee/tea station",
        "Fresh linen & towels",
        "Daily breakfast"
      ],
      features: [
        "Accessible luxury",
        "Courtyard access",
        "Stylish comfort",
        "Spacious layout",
        "Premium experience"
      ],
      description:
        "Enjoy the comfort of a King-size bed in this elegant, wheelchair-friendly room. The space opens onto a charming courtyard with easy access and stylish finishings.",
      detailedDescription:
        "Geelkatstert pairs accessible design with boutique luxury. A king-size bed, elegant furnishings, and courtyard views create a gracious atmosphere, while the thoughtfully designed bathroom ensures ease of movement without sacrificing style."
    },
    {
      id: 5,
      name: "Vygie",
      category: "Luxury King Room",
      images: [
        createPlaceholderSvg(800, 600, 'DDA0DD', 'FFF', 'Vygie 1'),
        createPlaceholderSvg(800, 600, 'D8BFD8', 'FFF', 'Vygie 2'),
        createPlaceholderSvg(800, 600, 'E6E6FA', '333', 'Vygie 3')
      ],
      price: "R1,800",
      guests: 2,
      maxGuests: 2,
      bedConfiguration: "King-size bed",
      size: "38 m²",
      amenities: [
        "King-size bed",
        "Bright and airy design",
        "Courtyard views",
        "Modern comforts",
        "En-suite bathroom",
        "Free Wi-Fi",
        "Mini fridge",
        "Coffee/tea station",
        "Fresh linen & towels",
        "Daily breakfast"
      ],
      features: [
        "Perfect for couples",
        "Calming views",
        "Modern amenities",
        "Romantic atmosphere",
        "Bright and airy"
      ],
      description: "A romantic, light-filled luxury king room ideal for couples seeking a tranquil Klein Karoo escape.",
      detailedDescription:
        "Vygie is a bright and airy luxury king room designed for relaxation and romance. Featuring a comfortable king-size bed, modern amenities, and peaceful courtyard views that create the perfect ambiance for couples. The room combines contemporary comfort with Klein Karoo charm."
    },
    {
      id: 6,
      name: "Gousblom",
      category: "Superior King Room",
      images: [
        createPlaceholderSvg(800, 600, 'FFD700', '333', 'Gousblom 1'),
        createPlaceholderSvg(800, 600, 'FFA500', 'FFF', 'Gousblom 2'),
        createPlaceholderSvg(800, 600, 'FF8C00', 'FFF', 'Gousblom 3')
      ],
      price: "R2,000",
      guests: 2,
      maxGuests: 2,
      bedConfiguration: "King-size bed",
      size: "42 m²",
      amenities: [
        "King-size bed",
        "Direct pool access",
        "Lower ground floor location",
        "Courtyard views",
        "Premium amenities",
        "Private pool area access",
        "Free Wi-Fi",
        "Mini fridge",
        "Coffee/tea station",
        "Fresh linen & towels",
        "Daily breakfast"
      ],
      features: [
        "Poolside luxury",
        "Private access",
        "Courtyard serenity",
        "Premium amenities",
        "Relaxed ambiance"
      ],
      description: "Superior king room with direct pool access and serene courtyard views for a tranquil retreat.",
      detailedDescription:
        "Gousblom offers the ultimate in luxury accommodation with direct pool access and stunning courtyard views. Located on the lower ground floor, this superior king room provides privacy and tranquility with premium amenities and elegant furnishings."
    },
    {
      id: 7,
      name: "Buchu",
      category: "Superior King Room",
      images: [
        createPlaceholderSvg(800, 600, '90EE90', '333', 'Buchu 1'),
        createPlaceholderSvg(800, 600, '98FB98', '333', 'Buchu 2'),
        createPlaceholderSvg(800, 600, '00FF7F', 'FFF', 'Buchu 3')
      ],
      price: "R2,000",
      guests: 2,
      maxGuests: 2,
      bedConfiguration: "King-size bed",
      size: "45 m²",
      amenities: [
        "Plush King-size bed",
        "Spacious layout",
        "Courtyard views",
        "Pool terrace access",
        "Elegant furnishings",
        "Premium comfort",
        "Free Wi-Fi",
        "Mini fridge",
        "Coffee/tea station",
        "Fresh linen & towels",
        "Daily breakfast"
      ],
      features: [
        "Spacious and indulgent",
        "Pool terrace access",
        "Plush comfort",
        "Elegant design",
        "Premium experience"
      ],
      description: "Elegant superior king room with plush finishes and access to the pool terrace.",
      detailedDescription:
        "Buchu is designed for those seeking premium comfort. With elegant furnishings, generous space, and access to the pool terrace, this superior king room delivers a refined Klein Karoo experience."
    },
    {
      id: 8,
      name: "Arum Lily",
      category: "Superior King Room",
      images: [
        createPlaceholderSvg(800, 600, 'FFF8DC', '333', 'Arum Lily 1'),
        createPlaceholderSvg(800, 600, 'F0F8FF', '333', 'Arum Lily 2'),
        createPlaceholderSvg(800, 600, 'F5F5DC', '333', 'Arum Lily 3')
      ],
      price: "R2,200",
      guests: 2,
      maxGuests: 2,
      bedConfiguration: "King-size bed",
      size: "48 m²",
      amenities: [
        "King-size bed",
        "Stylish appointments",
        "Refined comfort",
        "Sophisticated décor",
        "Serene atmosphere",
        "Premium amenities",
        "Free Wi-Fi",
        "Mini fridge",
        "Coffee/tea station",
        "Fresh linen & towels",
        "Daily breakfast"
      ],
      features: [
        "Ultimate Klein Karoo escape",
        "Refined luxury",
        "Sophisticated design",
        "Serene atmosphere",
        "Pinnacle of comfort"
      ],
      description: "Stylishly appointed superior king room offering refined comfort and serene atmosphere.",
      detailedDescription:
        "Arum Lily represents the pinnacle of our accommodation offerings - a stylishly appointed superior king room that embodies the essence of the Klein Karoo. With refined comfort, sophisticated décor, and a serene atmosphere, this room provides the ultimate escape for discerning travelers."
    },
    {
      id: 9,
      name: "Protea",
      category: "Superior King Room",
      images: [
        createPlaceholderSvg(800, 600, 'DC143C', 'FFF', 'Protea 1'),
        createPlaceholderSvg(800, 600, 'B22222', 'FFF', 'Protea 2'),
        createPlaceholderSvg(800, 600, 'CD5C5C', 'FFF', 'Protea 3')
      ],
      price: "R2,200",
      guests: 2,
      maxGuests: 2,
      bedConfiguration: "King-size bed",
      size: "44 m²",
      amenities: [
        "King-size bed",
        "Mountain views",
        "Premium furnishings",
        "Luxury amenities",
        "Spacious bathroom",
        "Balcony access",
        "Free Wi-Fi",
        "Mini fridge",
        "Coffee/tea station",
        "Fresh linen & towels",
        "Daily breakfast"
      ],
      features: [
        "Mountain views",
        "Elevated position",
        "Private balcony",
        "Premium appointments",
        "Spectacular landscape"
      ],
      description: "Our most elevated superior king room featuring breathtaking mountain views and premium appointments.",
      detailedDescription:
        "Protea crowns our accommodation collection with its elevated position offering spectacular mountain views across the Klein Karoo. This superior king room features premium furnishings, luxury amenities, and a private balcony perfect for taking in the stunning landscape."
    }
  ],
  events: [
    {
      id: 1,
      title: "Live Jazz Evening",
      date: "Every Friday",
      time: "19:00 - 22:00",
      description: "Enjoy smooth jazz with local musicians",
      type: "Music"
    },
    {
      id: 2,
      title: "Wine Tasting",
      date: "Saturdays",
      time: "16:00 - 18:00",
      description: "Guided tasting of Route 62 wines",
      type: "Wine"
    },
    {
      id: 3,
      title: "Klein Karoo Sunset Sessions",
      date: "Daily",
      time: "17:30 - 19:00",
      description: "Cocktails with panoramic sunset views",
      type: "Happy Hour"
    },
    {
      id: 4,
      title: "Traditional Braai Night",
      date: "Sundays",
      time: "18:00 - 21:00",
      description: "Authentic South African barbecue experience",
      type: "Food"
    }
  ],
  siteContent: {
    heroTitle: "Experience the Klein Karoo",
    heroSubtitle: "A luxury boutique retreat where authentic Klein Karoo charm meets world-class hospitality",
    aboutText: "At Barrydale Klein Karoo Lodge, every room tells its own story",
    contactInfo: {
      phone: "028 572 1020",
      email: "info@barrydalekaroolodge.co.za",
      address: "11 Tennant Street, Barrydale, Western Cape, South Africa, 6750"
    },
    socialMedia: {
      facebook: "https://www.facebook.com/barrydalekaroolodge",
      instagram: "https://www.instagram.com/barrydalekaroolodge",
      twitter: "https://twitter.com/BarrydaleKaroo"
    },
    logoUrl: "/logo.png"
  }
};

// Create context with default values
const GlobalStateContext = createContext<GlobalStateContextType>({
  ...defaultState,
  updateGalleryImages: () => {},
  addGalleryImage: () => {},
  updateGalleryImage: () => {},
  deleteGalleryImage: () => {},
  updateSectionBackgrounds: () => {},
  updateSectionBackground: () => {},
  updateWineCollection: () => {},
  addWine: () => {},
  updateWine: () => {},
  deleteWine: () => {},
  updateRooms: () => {},
  addRoom: () => {},
  updateRoom: () => {},
  deleteRoom: () => {},
  updateEvents: () => {},
  addEvent: () => {},
  updateEvent: () => {},
  deleteEvent: () => {},
  updateSiteContent: () => {},
  updateLogo: () => {}
});

// Custom hook to use the global state
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

// Provider component
export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const normalizeRoom = (room: Room, index: number): Room => ({
    ...room,
    id: room.id ?? index + 1,
    images: room.images && room.images.length ? room.images : [createPlaceholderSvg(800, 600, '8B4513', 'FFF', `Room ${index + 1}`)],
    amenities: room.amenities ?? [],
    features: room.features ?? [],
    description: room.description ?? '',
    detailedDescription: room.detailedDescription ?? '',
    price: room.price ?? 'R0',
    category: room.category ?? 'Room'
  });

  const ensureRooms = (rooms: Room[] | undefined): Room[] => {
    const source = rooms && rooms.length >= 2 ? rooms : defaultState.rooms;
    return source.map((room, index) => normalizeRoom(room, index));
  };

const hydrateState = (saved: Partial<GlobalState> | null): GlobalState => {
    // Load saved global (non-gallery) state from localStorage
    let savedGlobal: Partial<GlobalState> | null = null;
    try {
      const savedGlobalJson = localStorage.getItem('karoo-global-state');
      if (savedGlobalJson) {
        savedGlobal = JSON.parse(savedGlobalJson);
        console.log('Loaded global state from localStorage');
      }
    } catch (error) {
      console.error('Failed to load global state from localStorage:', error);
    }

    // Load saved gallery from localStorage
    let savedGallery = null;
    try {
      const savedGalleryJson = localStorage.getItem('karoo-gallery-state');
      if (savedGalleryJson) {
        savedGallery = JSON.parse(savedGalleryJson);
        console.log(`Loaded ${savedGallery.length} gallery images from localStorage`);
      }
    } catch (error) {
      console.error('Failed to load gallery from localStorage:', error);
    }

    // Get base gallery images
    const baseGallery = savedGallery || (saved?.galleryImages && saved.galleryImages.length 
      ? saved.galleryImages 
      : defaultState.galleryImages);

    return {
      galleryImages: baseGallery.map(img => ({
        ...img,
        src: fixUrlProtocol(img.src)
      })),
      sectionBackgrounds:
        (savedGlobal?.sectionBackgrounds && savedGlobal.sectionBackgrounds.length
          ? savedGlobal.sectionBackgrounds
          : saved?.sectionBackgrounds) && (savedGlobal?.sectionBackgrounds?.length || saved?.sectionBackgrounds?.length)
          ? (savedGlobal?.sectionBackgrounds || saved!.sectionBackgrounds).map(bg => ({
              ...bg,
              imageUrl: fixUrlProtocol(bg.imageUrl)
            }))
          : defaultState.sectionBackgrounds,
      wineCollection:
        (savedGlobal?.wineCollection && savedGlobal.wineCollection.length
          ? savedGlobal.wineCollection
          : saved?.wineCollection) && (savedGlobal?.wineCollection?.length || saved?.wineCollection?.length)
          ? (savedGlobal?.wineCollection || saved!.wineCollection).map(wine => ({
              ...wine,
              image: fixUrlProtocol(wine.image)
            }))
          : defaultState.wineCollection,
      rooms: ensureRooms(savedGlobal?.rooms || saved?.rooms).map(room => ({
        ...room,
        images: room.images.map(fixUrlProtocol)
      })),
      events: savedGlobal?.events && savedGlobal.events.length
        ? savedGlobal.events
        : saved?.events && saved.events.length
          ? saved.events
          : defaultState.events,
      siteContent: {
        ...defaultState.siteContent,
        ...(savedGlobal?.siteContent ?? saved?.siteContent ?? {}),
        contactInfo: {
          ...defaultState.siteContent.contactInfo,
          ...((savedGlobal?.siteContent?.contactInfo ?? saved?.siteContent?.contactInfo) ?? {})
        },
        socialMedia: {
          ...defaultState.siteContent.socialMedia,
          ...((savedGlobal?.siteContent?.socialMedia ?? saved?.siteContent?.socialMedia) ?? {})
        }
      }
    };
  };

  const [state, setState] = useState<GlobalState>(() => {
    const initialState = hydrateState(null);
    console.log('GlobalStateContext: Initial state loaded with', initialState.galleryImages.length, 'gallery images');
    
    // Debug URL formats and clean up bad URLs
    const badUrls = [
      ...initialState.galleryImages,
      ...initialState.sectionBackgrounds.map(bg => ({ src: bg.imageUrl, title: bg.title })),
      ...initialState.wineCollection.map(wine => ({ src: wine.image, title: wine.name })),
      ...initialState.rooms.flatMap(room => room.images.map((img, idx) => ({ src: img, title: `${room.name} ${idx + 1}` })))
    ].filter(item => item.src && !item.src.startsWith('http') && !item.src.startsWith('data:') && !item.src.startsWith('/'));
    
    if (badUrls.length > 0) {
      console.warn('Found URLs without protocol:', badUrls);
      console.log('URLs have been fixed with S3 domain. If images still don\'t load, clear localStorage.');
    }
    
    return initialState;
  });
  // Hydrate gallery from backend only when an endpoint is configured
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const endpoint = import.meta.env.VITE_GALLERY_ENDPOINT as string | undefined;
    if (!endpoint) {
      return;
    }

    // TODO: Implement new backend API call
    console.log('Would fetch gallery from:', endpoint);

    /* 
    fetch(endpoint, {
      mode: 'cors',
      headers: {
        // Add authentication headers when new backend is implemented
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Gallery request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length) {
          setState(prev => ({ ...prev, galleryImages: data }));
        }
      })
      .catch(err => {
        console.error('Failed to fetch gallery images from backend', err);
      });
    */
  }, []);

  // Gallery management functions
  const updateGalleryImages = (images: GalleryImage[]) => {
    console.log('GlobalState: updateGalleryImages called with', images.length, 'images');
    setState(prev => ({ ...prev, galleryImages: images }));
    
    // Save gallery to localStorage
    try {
      localStorage.setItem('karoo-gallery-state', JSON.stringify(images));
    } catch (error) {
      console.error('Failed to save gallery to localStorage:', error);
    }
  };

  const addGalleryImage = (image: GalleryImage) => {
    const fixedImage = {
      ...image,
      src: fixUrlProtocol(image.src)
    };
    
    setState(prev => {
      const newGallery = [...prev.galleryImages, fixedImage];
      
      // Save to localStorage
      try {
        localStorage.setItem('karoo-gallery-state', JSON.stringify(newGallery));
      } catch (error) {
        console.error('Failed to save gallery to localStorage:', error);
      }
      
      return { ...prev, galleryImages: newGallery };
    });
  };

  const updateGalleryImage = (image: GalleryImage) => {
    setState(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.map(img => img.id === image.id ? image : img)
    }));
  };

  const deleteGalleryImage = (id: number) => {
    setState(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter(img => img.id !== id)
    }));
  };

  // Section backgrounds management
  const updateSectionBackgrounds = (backgrounds: SectionBackground[]) => {
    console.log('GlobalState: updateSectionBackgrounds called with', backgrounds.length, 'backgrounds');
    setState(prev => {
      const next = { ...prev, sectionBackgrounds: backgrounds };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  const updateSectionBackground = (background: SectionBackground) => {
    const fixedBackground = {
      ...background,
      imageUrl: fixUrlProtocol(background.imageUrl)
    };
    
    setState(prev => {
      const next = {
        ...prev,
        sectionBackgrounds: prev.sectionBackgrounds.map(bg => 
          bg.section === fixedBackground.section ? fixedBackground : bg
        )
      };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  // Wine collection management
  const updateWineCollection = (wines: WineItem[]) => {
    console.log('GlobalState: updateWineCollection called with', wines.length, 'wines');
    setState(prev => {
      const next = { ...prev, wineCollection: wines };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  const addWine = (wine: WineItem) => {
    setState(prev => {
      const next = { ...prev, wineCollection: [...prev.wineCollection, wine] };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  const updateWine = (wine: WineItem) => {
    setState(prev => {
      const next = {
        ...prev,
        wineCollection: prev.wineCollection.map(w => w.id === wine.id ? wine : w)
      };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  const deleteWine = (id: number) => {
    setState(prev => {
      const next = {
        ...prev,
        wineCollection: prev.wineCollection.filter(w => w.id !== id)
      };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  // Room management
  const updateRooms = (rooms: Room[]) => {
    setState(prev => {
      const next = { ...prev, rooms: ensureRooms(rooms) };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  const addRoom = (room: Room) => {
    setState(prev => {
      const next = { ...prev, rooms: ensureRooms([...prev.rooms, room]) };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  const updateRoom = (room: Room) => {
    setState(prev => {
      const next = {
        ...prev,
        rooms: ensureRooms(prev.rooms.map(r => r.id === room.id ? room : r))
      };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  const deleteRoom = (id: number) => {
    setState(prev => {
      const next = {
        ...prev,
        rooms: ensureRooms(prev.rooms.filter(r => r.id !== id))
      };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  // Event management
  const updateEvents = (events: Event[]) => {
    setState(prev => {
      const next = { ...prev, events };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  const addEvent = (event: Event) => {
    setState(prev => {
      const next = { ...prev, events: [...prev.events, event] };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  const updateEvent = (event: Event) => {
    setState(prev => {
      const next = {
        ...prev,
        events: prev.events.map(e => e.id === event.id ? event : e)
      };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  const deleteEvent = (id: number) => {
    setState(prev => {
      const next = {
        ...prev,
        events: prev.events.filter(e => e.id !== id)
      };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  // Site content management
  const updateSiteContent = (content: Partial<SiteContent>) => {
    setState(prev => {
      const next = {
        ...prev,
        siteContent: { ...prev.siteContent, ...content }
      };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  const updateLogo = (logoUrl: string) => {
    setState(prev => {
      const next = {
        ...prev,
        siteContent: { ...prev.siteContent, logoUrl }
      };
      try { localStorage.setItem('karoo-global-state', JSON.stringify({
        rooms: next.rooms,
        sectionBackgrounds: next.sectionBackgrounds,
        wineCollection: next.wineCollection,
        events: next.events,
        siteContent: next.siteContent
      })); } catch {}
      return next;
    });
  };

  const value: GlobalStateContextType = {
    ...state,
    updateGalleryImages,
    addGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    updateSectionBackgrounds,
    updateSectionBackground,
    updateWineCollection,
    addWine,
    updateWine,
    deleteWine,
    updateRooms,
    addRoom,
    updateRoom,
    deleteRoom,
    updateEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    updateSiteContent,
    updateLogo
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Export types for use in other components
export type { Room, Event, WineItem, GalleryImage, SectionBackground };

// Export the provider as default for better Fast Refresh compatibility
export default GlobalStateProvider;
