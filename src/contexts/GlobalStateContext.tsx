import React, { createContext, useContext, useState, useEffect } from 'react';

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

// Default state
const defaultState: GlobalState = {
  galleryImages: [
    { id: 1, src: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528577396_a70a7693.webp", category: 'rooms', title: 'Luxury Suite' },
    { id: 2, src: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528579398_fe84a640.webp", category: 'rooms', title: 'Klein Karoo Cottage' },
    { id: 3, src: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528584345_d1dfcb47.webp", category: 'dining', title: 'Vintage Car Restaurant' },
    { id: 4, src: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528602433_419a9c1d.webp", category: 'bar', title: 'Windpomp Bar' },
    { id: 5, src: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528591318_fc7cb320.webp", category: 'wine', title: 'Wine Boutique' },
    { id: 6, src: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528809003_d680fef6.webp", category: 'scenery', title: 'Klein Karoo Landscape' },
    { id: 7, src: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528810823_190418d4.webp", category: 'scenery', title: 'Mountain Views' },
    { id: 8, src: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528813169_24c3c65c.webp", category: 'scenery', title: 'Sunset Vista' }
  ],
  sectionBackgrounds: [
    {
      section: 'hero',
      imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528576432_f0fe5cce.webp',
      title: 'Hero Background',
      description: 'Main hero section background showcasing Klein Karoo beauty'
    },
    {
      section: 'restaurant',
      imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528584345_d1dfcb47.webp',
      title: 'Restaurant Background',
      description: 'Vintage car restaurant atmosphere'
    },
    {
      section: 'wine-boutique',
      imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528591318_fc7cb320.webp',
      title: 'Wine Boutique Background',
      description: 'Wine cellar and boutique ambiance'
    },
    {
      section: 'bar-events',
      imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528602433_419a9c1d.webp',
      title: 'Bar & Events Background',
      description: 'Windpomp bar and event space'
    }
  ],
  wineCollection: [
    {
      id: 1,
      name: "Klein Karoo Reserve Cabernet",
      vintage: "2020",
      price: "R450",
      description: "Full-bodied red wine with rich tannins and notes of blackcurrant and oak",
      image: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528592120_cf63c543.webp",
      category: 'red',
      origin: "Klein Karoo, South Africa"
    },
    {
      id: 2,
      name: "Route 62 Chardonnay",
      vintage: "2022",
      price: "R320",
      description: "Crisp white wine with citrus notes and a mineral finish",
      image: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528593828_73d944fd.webp",
      category: 'white',
      origin: "Western Cape, South Africa"
    },
    {
      id: 3,
      name: "Barrydale Blush",
      vintage: "2023",
      price: "R290",
      description: "Light and refreshing rosé with strawberry and peach flavors",
      image: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528595529_41ddb688.webp",
      category: 'rosé',
      origin: "Barrydale, Western Cape"
    },
    {
      id: 4,
      name: "Karoo Sparkle",
      vintage: "2021",
      price: "R480",
      description: "Elegant sparkling wine perfect for celebrations",
      image: "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528598192_5cfeb00f.webp",
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
        "/placeholder.svg",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528582334_be1169ab.webp",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528553663_af1ebacf.webp"
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
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528579398_fe84a640.webp",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528553663_af1ebacf.webp",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528582334_be1169ab.webp"
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
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528582334_be1169ab.webp",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528579398_fe84a640.webp",
        "/placeholder.svg"
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
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528553663_af1ebacf.webp",
        "/placeholder.svg",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528579398_fe84a640.webp"
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
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528570707_b59abaa6.webp",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528576432_f0fe5cce.webp",
        "/placeholder.svg"
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
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528576432_f0fe5cce.webp",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528579398_fe84a640.webp",
        "/placeholder.svg"
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
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528570707_b59abaa6.webp",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528576432_f0fe5cce.webp",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528553663_af1ebacf.webp"
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
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528582334_be1169ab.webp",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528531865_3a62b23c.webp",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528570707_b59abaa6.webp"
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
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528577396_a70a7693.webp",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528576432_f0fe5cce.webp",
        "https://d64gsuwffb70l.cloudfront.net/68d104194c27c84c671a33c8_1758528581314_da77209e.webp"
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
    images: room.images && room.images.length ? room.images : ['/placeholder.svg'],
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

    return {
      galleryImages:
        saved?.galleryImages && saved.galleryImages.length ? saved.galleryImages : defaultState.galleryImages,
      sectionBackgrounds:
        saved?.sectionBackgrounds && saved.sectionBackgrounds.length
          ? saved.sectionBackgrounds
          : defaultState.sectionBackgrounds,
      wineCollection:
        saved?.wineCollection && saved.wineCollection.length ? saved.wineCollection : defaultState.wineCollection,
      rooms: ensureRooms(saved?.rooms),
      events: saved?.events && saved.events.length ? saved.events : defaultState.events,
      siteContent: {
        ...defaultState.siteContent,
        ...saved?.siteContent,
        contactInfo: {
          ...defaultState.siteContent.contactInfo,
          ...(saved?.siteContent?.contactInfo ?? {})
        },
        socialMedia: {
          ...defaultState.siteContent.socialMedia,
          ...(saved?.siteContent?.socialMedia ?? {})
        }
      }
    };
  };

  const [state, setState] = useState<GlobalState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('karoo-lodge-state');
      if (saved) {
        try {
          return hydrateState(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved state:', e);
        }
      }
    }
    return defaultState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    console.log('State changed, saving to localStorage:', {
      galleryImages: state.galleryImages.length,
      sectionBackgrounds: state.sectionBackgrounds.length,
      wineCollection: state.wineCollection.length
    });

    try {
      const serialized = JSON.stringify(state);

      if (serialized.length > 4_500_000) {
        console.warn('Global state exceeds 4.5MB; skipping localStorage write to avoid quota errors.');
        window.dispatchEvent(
          new CustomEvent('karoo-storage-warning', {
            detail: {
              size: serialized.length,
              message:
                'Your content changes are too large to save offline. Please reduce image sizes or use hosted URLs.'
            }
          })
        );
        return;
      }

      localStorage.setItem('karoo-lodge-state', serialized);
    } catch (error) {
      console.error('Failed to persist state to localStorage', error);
      window.dispatchEvent(
        new CustomEvent('karoo-storage-warning', {
          detail: {
            size: 0,
            message: 'We could not save your changes locally. Please try smaller images or hosted URLs.'
          }
        })
      );
    }
  }, [state]);

  // Gallery management functions
  const updateGalleryImages = (images: GalleryImage[]) => {
    console.log('GlobalState: updateGalleryImages called with', images.length, 'images');
    setState(prev => ({ ...prev, galleryImages: images }));
  };

  const addGalleryImage = (image: GalleryImage) => {
    setState(prev => ({ ...prev, galleryImages: [...prev.galleryImages, image] }));
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
    setState(prev => ({ ...prev, sectionBackgrounds: backgrounds }));
  };

  const updateSectionBackground = (background: SectionBackground) => {
    setState(prev => ({
      ...prev,
      sectionBackgrounds: prev.sectionBackgrounds.map(bg => 
        bg.section === background.section ? background : bg
      )
    }));
  };

  // Wine collection management
  const updateWineCollection = (wines: WineItem[]) => {
    console.log('GlobalState: updateWineCollection called with', wines.length, 'wines');
    setState(prev => ({ ...prev, wineCollection: wines }));
  };

  const addWine = (wine: WineItem) => {
    setState(prev => ({ ...prev, wineCollection: [...prev.wineCollection, wine] }));
  };

  const updateWine = (wine: WineItem) => {
    setState(prev => ({
      ...prev,
      wineCollection: prev.wineCollection.map(w => w.id === wine.id ? wine : w)
    }));
  };

  const deleteWine = (id: number) => {
    setState(prev => ({
      ...prev,
      wineCollection: prev.wineCollection.filter(w => w.id !== id)
    }));
  };

  // Room management
  const updateRooms = (rooms: Room[]) => {
    setState(prev => ({ ...prev, rooms: ensureRooms(rooms) }));
  };

  const addRoom = (room: Room) => {
    setState(prev => ({ ...prev, rooms: ensureRooms([...prev.rooms, room]) }));
  };

  const updateRoom = (room: Room) => {
    setState(prev => ({
      ...prev,
      rooms: ensureRooms(prev.rooms.map(r => (r.id === room.id ? room : r)))
    }));
  };

  const deleteRoom = (id: number) => {
    setState(prev => ({
      ...prev,
      rooms: ensureRooms(prev.rooms.filter(r => r.id !== id))
    }));
  };

  // Event management
  const updateEvents = (events: Event[]) => {
    setState(prev => ({ ...prev, events }));
  };

  const addEvent = (event: Event) => {
    setState(prev => ({ ...prev, events: [...prev.events, event] }));
  };

  const updateEvent = (event: Event) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === event.id ? event : e)
    }));
  };

  const deleteEvent = (id: number) => {
    setState(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== id)
    }));
  };

  // Site content management
  const updateSiteContent = (content: Partial<SiteContent>) => {
    setState(prev => ({
      ...prev,
      siteContent: { ...prev.siteContent, ...content }
    }));
  };

  const updateLogo = (logoUrl: string) => {
    setState(prev => ({
      ...prev,
      siteContent: { ...prev.siteContent, logoUrl }
    }));
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

// Export the provider as default for better Fast Refresh compatibility
export default GlobalStateProvider;
