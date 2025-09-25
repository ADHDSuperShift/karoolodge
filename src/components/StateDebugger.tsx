import React from 'react';
import { useGlobalState } from '../contexts/GlobalStateContext';

const StateDebugger: React.FC = () => {
  const { galleryImages, sectionBackgrounds, wineCollection, rooms, events } = useGlobalState();

  const handleTestUpdate = () => {
    // This will help us test if state updates are working
    const testImage = {
      id: 999,
      src: 'https://example.com/test.jpg',
      category: 'rooms' as const,
      title: 'Test Image'
    };
    
    console.log('Testing state update...');
  };

  const showLocalStorage = () => {
    const stored = localStorage.getItem('karoo-lodge-state');
    console.log('LocalStorage content:', stored);
    alert('Check console for localStorage content');
  };

  return (
    <div className="p-4 bg-gray-100 m-4 rounded">
      <h3 className="font-bold mb-2">State Debugger</h3>
      <div className="text-sm">
        <p>Gallery Images: {galleryImages.length}</p>
        <p>Section Backgrounds: {sectionBackgrounds.length}</p>
        <p>Wine Collection: {wineCollection.length}</p>
        <p>Rooms: {rooms.length}</p>
        <p>Events: {events.length}</p>
      </div>
      <div className="mt-2 space-x-2">
        <button 
          onClick={handleTestUpdate}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Test Update
        </button>
        <button 
          onClick={showLocalStorage}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Show LocalStorage
        </button>
      </div>
    </div>
  );
};

export default StateDebugger;
