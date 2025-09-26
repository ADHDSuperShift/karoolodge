import React, { useState } from 'react';
import { Wine, Plus, Edit3, Trash2, Save, Eye, X } from 'lucide-react';

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

interface WineCollectionManagerProps {
  wines: WineItem[];
  onWinesUpdate: (wines: WineItem[]) => void;
}

const WineCollectionManager: React.FC<WineCollectionManagerProps> = ({ wines, onWinesUpdate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert'>('all');
  const [editingWine, setEditingWine] = useState<WineItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<WineItem>>({
    name: '',
    vintage: '',
    price: '',
    description: '',
    image: '',
    category: 'red',
    origin: ''
  });

  const categories = [
    { id: 'all', name: 'All Wines', count: wines.length },
    { id: 'red', name: 'Red Wines', count: wines.filter(w => w.category === 'red').length },
    { id: 'white', name: 'White Wines', count: wines.filter(w => w.category === 'white').length },
    { id: 'rosé', name: 'Rosé Wines', count: wines.filter(w => w.category === 'rosé').length },
    { id: 'sparkling', name: 'Sparkling', count: wines.filter(w => w.category === 'sparkling').length },
    { id: 'dessert', name: 'Dessert Wines', count: wines.filter(w => w.category === 'dessert').length }
  ];

  const filteredWines = activeCategory === 'all' 
    ? wines 
    : wines.filter(wine => wine.category === activeCategory);

  const handleAddWine = () => {
    console.log('WineCollectionManager: handleAddWine called');
    console.log('formData:', formData);
    console.log('Validation check - name:', !!formData.name, 'price:', !!formData.price, 'image:', !!formData.image, 'category:', !!formData.category);
    if (formData.name && formData.price && formData.image && formData.category) {
      console.log('Validation passed, creating new wine');
      const newWine: WineItem = {
        id: Date.now(),
        name: formData.name,
        vintage: formData.vintage || '',
        price: formData.price,
        description: formData.description || '',
        image: formData.image,
        category: formData.category as 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert',
        origin: formData.origin || ''
      };
      console.log('WineCollectionManager: calling onWinesUpdate with new wine');
      onWinesUpdate([...wines, newWine]);
      resetForm();
    } else {
      console.log('Validation failed - missing required fields');
    }
  };

  const handleUpdateWine = () => {
    console.log('WineCollectionManager: handleUpdateWine called');
    if (editingWine && formData.name && formData.price && formData.image && formData.category) {
      const updatedWines = wines.map(wine => 
        wine.id === editingWine.id 
          ? { ...wine, ...formData } as WineItem
          : wine
      );
      console.log('WineCollectionManager: calling onWinesUpdate with updated wines');
      onWinesUpdate(updatedWines);
      resetForm();
    }
  };

  const handleDeleteWine = (id: number) => {
    console.log('WineCollectionManager: handleDeleteWine called for id:', id);
    if (window.confirm('Are you sure you want to delete this wine?')) {
      console.log('WineCollectionManager: calling onWinesUpdate with filtered wines');
      onWinesUpdate(wines.filter(wine => wine.id !== id));
    }
  };

  const openEditModal = (wine: WineItem) => {
    setEditingWine(wine);
    setFormData({
      name: wine.name,
      vintage: wine.vintage,
      price: wine.price,
      description: wine.description,
      image: wine.image,
      category: wine.category,
      origin: wine.origin
    });
  };

  const resetForm = () => {
    setEditingWine(null);
    setShowAddModal(false);
    setFormData({
      name: '',
      vintage: '',
      price: '',
      description: '',
      image: '',
      category: 'red',
      origin: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-white">
          Wine Collection
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Wine</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert' | 'all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Wines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWines.map((wine) => (
            <div key={wine.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden">
              <div className="aspect-[3/4] relative group">
                <img
                  src={wine.image}
                  alt={wine.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(wine.image, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                      title="View full image"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(wine)}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
                      title="Edit wine"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteWine(wine.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                      title="Delete wine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">{wine.name}</h3>
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">{wine.price}</span>
                </div>
                {wine.vintage && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{wine.vintage}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-2">{wine.category}</p>
                {wine.origin && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{wine.origin}</p>
                )}
                {wine.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    {wine.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredWines.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Wine className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No wines found</p>
            <p className="text-sm">Add your first wine to get started</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingWine) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingWine ? 'Edit Wine' : 'Add New Wine'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Wine Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Wine Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Cabernet Sauvignon"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  {/* Vintage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vintage
                    </label>
                    <input
                      type="text"
                      value={formData.vintage || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, vintage: e.target.value }))}
                      placeholder="e.g. 2020"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price *
                    </label>
                    <input
                      type="text"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g. R450"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category || 'red'}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert' }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="red">Red Wine</option>
                      <option value="white">White Wine</option>
                      <option value="rosé">Rosé Wine</option>
                      <option value="sparkling">Sparkling Wine</option>
                      <option value="dessert">Dessert Wine</option>
                    </select>
                  </div>
                </div>

                {/* Origin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Origin
                  </label>
                  <input
                    type="text"
                    value={formData.origin || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                    placeholder="e.g. Stellenbosch, South Africa"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Wine Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Wine Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.image || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/wine-bottle.jpg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Wine preview"
                        className="w-20 h-26 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the wine's characteristics, tasting notes, etc."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={editingWine ? handleUpdateWine : handleAddWine}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingWine ? 'Update' : 'Add'} Wine</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WineCollectionManager;
