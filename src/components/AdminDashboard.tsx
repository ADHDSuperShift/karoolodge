import React, { useState } from 'react';
import { Camera, Calendar, FileText, Users, Settings, LogOut, Eye, Edit3, Save, X, Plus, Trash2, Image as ImageIcon, Wine } from 'lucide-react';
import { useGlobalState } from '../contexts/GlobalStateContext';
import type { Room, Event, GalleryImage, SectionBackground, WineItem } from '../contexts/GlobalStateContext';
import RoomEditor from './RoomEditor';
import EventEditor from './EventEditor';
import ContentEditor from './ContentEditor';
import LogoManager from './LogoManager';
import GalleryManager from './GalleryManager';
import SectionBackgroundManager from './SectionBackgroundManager';
import WineCollectionManager from './WineCollectionManager';

interface ContentSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'html' | 'image';
  category: string;
}

interface AdminData {
  rooms: Room[];
  events: Event[];
  siteContent: {
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
  };
  galleryImages: Array<{
    id: number;
    src: string;
    category: 'rooms' | 'dining' | 'bar' | 'wine' | 'scenery';
    title: string;
    description?: string;
  }>;
  sectionBackgrounds: Array<{
    section: 'hero' | 'restaurant' | 'wine-boutique' | 'bar-events';
    imageUrl: string;
    title: string;
    description?: string;
  }>;
  wineCollection: Array<{
    id: number;
    name: string;
    vintage?: string;
    price: string;
    description: string;
    image: string;
    category: 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert';
    origin?: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  console.log('AdminDashboard component rendered');
  
  const {
    rooms,
    events,
    siteContent,
    galleryImages,
    sectionBackgrounds,
    wineCollection,
    addRoom,
    updateRoom,
    deleteRoom,
    addEvent,
    updateEvent,
    deleteEvent,
    updateSiteContent,
    updateGalleryImages,
    updateSectionBackgrounds,
    updateWineCollection
  } = useGlobalState();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showRoomEditor, setShowRoomEditor] = useState(false);
  const [showEventEditor, setShowEventEditor] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);



  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in production, use proper authentication
    if (credentials.username === 'admin' && credentials.password === 'karoo2025') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    console.log('Logout button clicked');
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
  };

  const testButtonClick = () => {
    console.log('Test button clicked - buttons are working!');
  };

  const handleSaveRoom = (room: Room) => {
    if (editingRoom) {
      updateRoom(room);
    } else {
      addRoom(room);
    }
    setEditingRoom(null);
  };

  const handleSaveEvent = (event: Event) => {
    if (editingEvent) {
      updateEvent(event);
    } else {
      addEvent(event);
    }
    setEditingEvent(null);
  };

  const handleDeleteRoom = (roomId: number) => {
    if (confirm('Are you sure you want to delete this room?')) {
      deleteRoom(roomId);
    }
  };

  const handleDeleteEvent = (eventId: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
    }
  };

  const openRoomEditor = (room?: Room) => {
    setEditingRoom(room || null);
    setShowRoomEditor(true);
  };

  const openEventEditor = (event?: Event) => {
    setEditingEvent(event || null);
    setShowEventEditor(true);
  };

  const handleUpdateContent = (sectionId: string, content: string) => {
    setContentSections(prev => {
      const existing = prev.find(s => s.id === sectionId);
      if (existing) {
        return prev.map(s => s.id === sectionId ? { ...s, content } : s);
      } else {
        return [...prev, { 
          id: sectionId, 
          content, 
          title: sectionId, 
          type: 'text' as const, 
          category: 'general' 
        }];
      }
    });
  };

  const handleLogoUpdate = (logoUrl: string) => {
    updateSiteContent({ logoUrl });
  };

  const handleGalleryImagesUpdate = (images: GalleryImage[]) => {
    console.log('handleGalleryImagesUpdate called with:', images.length, 'images');
    updateGalleryImages(images);
  };

  const handleSectionBackgroundsUpdate = (backgrounds: SectionBackground[]) => {
    console.log('handleSectionBackgroundsUpdate called with:', backgrounds.length, 'backgrounds');
    updateSectionBackgrounds(backgrounds);
  };

  const handleWineCollectionUpdate = (wines: WineItem[]) => {
    console.log('handleWineCollectionUpdate called with:', wines.length, 'wines');
    updateWineCollection(wines);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              Admin Console
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Barrydale Klein Karoo Lodge
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Demo credentials:</strong><br/>
              Username: admin<br/>
              Password: karoo2025
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabItems = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'rooms', name: 'Rooms', icon: Camera },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'gallery', name: 'Gallery', icon: ImageIcon },
    { id: 'backgrounds', name: 'Backgrounds', icon: Camera },
    { id: 'wines', name: 'Wine Collection', icon: Wine },
    { id: 'content', name: 'Content', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                Admin Console
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
              >
                <Eye className="w-5 h-5" />
              </a>
              <button
                onClick={testButtonClick}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Test Click
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <nav className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <ul className="space-y-2">
                {tabItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === item.id
                            ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-white">
                  Dashboard Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Rooms</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">9</p>
                      </div>
                      <Camera className="w-8 h-8 text-amber-600" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Events</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{events.length}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-amber-600" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Content Sections</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
                      </div>
                      <FileText className="w-8 h-8 text-amber-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setActiveTab('rooms')}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Manage Rooms
                    </button>
                    <button
                      onClick={() => openEventEditor()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add Event
                    </button>
                    <button
                      onClick={() => setActiveTab('content')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Edit Content
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-white">
                    Room Management
                  </h2>
                  <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                    onClick={() => openRoomEditor()}>
                    <Plus className="w-4 h-4" />
                    <span>Add Room</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <div key={room.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{room.name}</h3>
                          <span className="text-amber-600 dark:text-amber-400 font-medium">{room.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{room.category}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{room.description}</p>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openRoomEditor(room)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteRoom(room.id)}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-white">
                    Event Management
                  </h2>
                  <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                    onClick={() => openEventEditor()}>
                    <Plus className="w-4 h-4" />
                    <span>Add Event</span>
                  </button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {events.map((event) => (
                          <tr key={event.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{event.description}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {event.date} at {event.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                                {event.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button 
                                onClick={() => openEventEditor(event)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400">Edit</button>
                              <button 
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <GalleryManager
                images={galleryImages}
                onImagesUpdate={handleGalleryImagesUpdate}
              />
            )}

            {activeTab === 'backgrounds' && (
              <SectionBackgroundManager
                backgrounds={sectionBackgrounds}
                onBackgroundsUpdate={handleSectionBackgroundsUpdate}
              />
            )}

            {activeTab === 'wines' && (
              <WineCollectionManager
                wines={wineCollection}
                onWinesUpdate={handleWineCollectionUpdate}
              />
            )}

            {activeTab === 'content' && (
              <ContentEditor
                sections={contentSections}
                onUpdateSection={handleUpdateContent}
              />
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-white">
                  Settings
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Logo Management */}
                  <LogoManager
                    currentLogo={siteContent.logoUrl}
                    onLogoUpdate={handleLogoUpdate}
                  />
                  
                  {/* Website Settings */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Website Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Site Title
                        </label>
                        <input
                          type="text"
                          defaultValue="Barrydale Klein Karoo Lodge"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          rows={3}
                          defaultValue="Experience authentic Klein Karoo hospitality at our luxury boutique hotel on Route 62."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                          Enable online booking
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                          Show availability calendar
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Social Media Settings */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Social Media Links</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Facebook URL
                        </label>
                        <input
                          type="url"
                          defaultValue={siteContent.socialMedia.facebook}
                          placeholder="https://www.facebook.com/your-page"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Instagram URL
                        </label>
                        <input
                          type="url"
                          defaultValue={siteContent.socialMedia.instagram}
                          placeholder="https://www.instagram.com/your-account"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Twitter URL
                        </label>
                        <input
                          type="url"
                          defaultValue={siteContent.socialMedia.twitter}
                          placeholder="https://twitter.com/your-handle"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <button className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium">
                        Update Social Links
                      </button>
                    </div>
                  </div>

                  {/* Data Management */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Management</h3>
                    <div className="space-y-4">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                        Export All Content
                      </button>
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                        Create Backup
                      </button>
                      <button className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium">
                        Import Content
                      </button>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Security</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Editor Modals */}
      <RoomEditor
        room={editingRoom}
        isOpen={showRoomEditor}
        onClose={() => {
          setShowRoomEditor(false);
          setEditingRoom(null);
        }}
        onSave={handleSaveRoom}
      />
      
      <EventEditor
        event={editingEvent}
        isOpen={showEventEditor}
        onClose={() => {
          setShowEventEditor(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
      />
    </div>
  );
};

export default AdminDashboard;
