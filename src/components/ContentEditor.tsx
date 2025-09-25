import React, { useState } from 'react';
import { Save, Edit3, Eye, FileText, Image, Type, Palette } from 'lucide-react';

interface ContentSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'html' | 'image';
  category: string;
}

interface ContentEditorProps {
  sections: ContentSection[];
  onUpdateSection: (id: string, content: string) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ sections, onUpdateSection }) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [activeCategory, setActiveCategory] = useState('hero');

  const categories = [
    { id: 'hero', name: 'Hero Section', icon: Image },
    { id: 'about', name: 'About Us', icon: FileText },
    { id: 'accommodation', name: 'Accommodation', icon: Type },
    { id: 'restaurant', name: 'Restaurant', icon: Type },
    { id: 'contact', name: 'Contact Info', icon: Type }
  ];

  const defaultSections: ContentSection[] = [
    {
      id: 'hero-title',
      title: 'Hero Title',
      content: 'Experience the Klein Karoo',
      type: 'text',
      category: 'hero'
    },
    {
      id: 'hero-subtitle',
      title: 'Hero Subtitle',
      content: 'A luxury boutique retreat where authentic Klein Karoo charm meets world-class hospitality',
      type: 'text',
      category: 'hero'
    },
    {
      id: 'about-title',
      title: 'About Section Title',
      content: 'Welcome to Barrydale Klein Karoo Lodge',
      type: 'text',
      category: 'about'
    },
    {
      id: 'about-text',
      title: 'About Description',
      content: 'At Barrydale Klein Karoo Lodge, every room tells its own story. Named after indigenous plants of the Klein Karoo, each accommodation offers a unique experience while maintaining our commitment to luxury and comfort.',
      type: 'text',
      category: 'about'
    },
    {
      id: 'restaurant-title',
      title: 'Restaurant Title',
      content: 'Karoo Cuisine Restaurant',
      type: 'text',
      category: 'restaurant'
    },
    {
      id: 'restaurant-description',
      title: 'Restaurant Description',
      content: 'Experience authentic Klein Karoo flavors with our farm-to-table cuisine, featuring locally sourced ingredients and traditional recipes with a modern twist.',
      type: 'text',
      category: 'restaurant'
    },
    {
      id: 'contact-phone',
      title: 'Phone Number',
      content: '028 572 1020',
      type: 'text',
      category: 'contact'
    },
    {
      id: 'contact-email',
      title: 'Email Address',
      content: 'info@barrydalekaroolodge.co.za',
      type: 'text',
      category: 'contact'
    },
    {
      id: 'contact-address',
      title: 'Physical Address',
      content: '11 Tennant Street, Barrydale, Western Cape, South Africa, 6750',
      type: 'text',
      category: 'contact'
    }
  ];

  const allSections = [...defaultSections, ...sections];
  const filteredSections = allSections.filter(section => section.category === activeCategory);

  const startEditing = (section: ContentSection) => {
    setEditingSection(section.id);
    setEditContent(section.content);
  };

  const saveEdit = () => {
    if (editingSection) {
      onUpdateSection(editingSection, editContent);
      setEditingSection(null);
      setEditContent('');
    }
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditContent('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-white">
          Content Management
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Palette className="w-4 h-4" />
          <span>Website Content Editor</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeCategory === category.id
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSections.map((section) => (
          <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {section.type} content
                  </p>
                </div>
                {editingSection !== section.id && (
                  <button
                    onClick={() => startEditing(section)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {editingSection === section.id ? (
                <div className="space-y-4">
                  {section.type === 'text' && (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={section.id.includes('description') || section.id.includes('subtitle') ? 4 : 2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    />
                  )}
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    {section.type === 'text' && (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {section.content}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{section.content.length} characters</span>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Live on website</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
              Content Management Tips
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <p>• Changes are applied immediately to your website</p>
              <p>• Keep hero titles concise and impactful</p>
              <p>• Use descriptive text for better SEO</p>
              <p>• Contact information is displayed in multiple sections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
