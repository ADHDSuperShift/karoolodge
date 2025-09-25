import React, { useState } from 'react';
import { X, Save, Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  type: string;
  location?: string;
  maxParticipants?: number;
  price?: string;
  image?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
}

interface EventEditorProps {
  event?: Event;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
}

const EventEditor: React.FC<EventEditorProps> = ({ event, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Event>(
    event || {
      id: Date.now(),
      title: '',
      date: '',
      time: '',
      description: '',
      type: '',
      location: '',
      maxParticipants: undefined,
      price: '',
      image: '',
      isRecurring: false,
      recurringPattern: ''
    }
  );

  const eventTypes = [
    'Wine Tasting',
    'Restaurant Special',
    'Live Music',
    'Cultural Event',
    'Outdoor Activity',
    'Workshop',
    'Private Dining',
    'Seasonal Event',
    'Conference',
    'Wedding',
    'Other'
  ];

  const recurringPatterns = [
    'Daily',
    'Weekly',
    'Bi-weekly',
    'Monthly',
    'Quarterly',
    'Annually'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
              {event ? 'Edit Event' : 'Add New Event'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select type</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Restaurant, Wine Cellar, Garden"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Max Participants
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value ? parseInt(e.target.value) : undefined }))}
                  placeholder="Leave empty for unlimited"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price per Person
                </label>
                <input
                  type="text"
                  value={formData.price || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., R150, Free"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Event Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Image URL
              </label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Event preview"
                    className="w-32 h-20 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Recurring Event Options */}
            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.isRecurring || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="recurring" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  This is a recurring event
                </label>
              </div>

              {formData.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recurring Pattern
                  </label>
                  <select
                    value={formData.recurringPattern || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurringPattern: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select pattern</option>
                    {recurringPatterns.map(pattern => (
                      <option key={pattern} value={pattern}>{pattern}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Event</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditor;
