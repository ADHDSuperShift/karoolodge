import React, { useCallback, useEffect, useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Image as ImageIcon,
  GripVertical,
  Upload,
  Trash2,
  Paintbrush,
  Type,
  Save,
  Lock,
  LogOut,
  Check,
  Plus,
  Bed,
  X,
  ChevronUp,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  Wine as WineIcon,
  Loader2,
  Eye,
  FileText,
  Layout,
  Settings,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { cn } from '@/lib/utils';
import UploadDebug from './UploadDebug';
import CreateTestUser from './CreateTestUser';

const galleryCategories: Array<{
  value: 'rooms' | 'dining' | 'bar' | 'wine' | 'scenery';
  label: string;
}> = [
  { value: 'rooms', label: 'Rooms' },
  { value: 'dining', label: 'Dining' },
  { value: 'bar', label: 'Bar & Events' },
  { value: 'wine', label: 'Wine Boutique' },
  { value: 'scenery', label: 'Scenery' }
];

const backgroundLabels: Record<'hero' | 'restaurant' | 'wine-boutique' | 'bar-events', string> = {
  hero: 'Hero Section',
  restaurant: 'Restaurant Section',
  'wine-boutique': 'Wine Boutique',
  'bar-events': 'Bar & Events'
};

type SortableGalleryProps = {
  image: {
    id: number;
    src: string;
    category: 'rooms' | 'dining' | 'bar' | 'wine' | 'scenery';
    title: string;
    description?: string;
  };
  onMetaChange: (id: number, updates: Partial<SortableGalleryProps['image']>) => void;
  onRemove: (id: number) => void;
};

const SortableGalleryCard: React.FC<SortableGalleryProps> = ({ image, onMetaChange, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id.toString()
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative overflow-hidden border border-slate-200 bg-white shadow-sm transition-all',
        isDragging && 'ring-2 ring-amber-500 shadow-lg'
      )}
    >
      <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-slate-500 shadow">
        <button
          type="button"
          className="flex items-center gap-2 text-slate-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
          Drag
        </button>
      </div>

      <div className="aspect-video w-full bg-slate-100 relative">
        <img
          src={image.src}
          alt={image.title}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(event) => {
            console.error('Image failed to load on mobile/device:', {
              src: image.src,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              error: 'Image load failed'
            });
            (event.currentTarget as HTMLImageElement).src = '/placeholder.svg';
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', image.src);
          }}
          style={{
            maxWidth: '100%',
            height: 'auto',
            objectFit: 'cover'
          }}
        />
        {/* Loading indicator for slow networks */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="text-slate-400 text-sm">Loading...</div>
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-slate-500">Title</Label>
          <Input
            value={image.title}
            onChange={(event) => onMetaChange(image.id, { title: event.target.value })}
            placeholder="Image title"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-slate-500">Category</Label>
            <Select
              value={image.category}
              onValueChange={(value) => onMetaChange(image.id, { category: value as SortableGalleryProps['image']['category'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {galleryCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-slate-500">Description</Label>
            <Textarea
              value={image.description ?? ''}
              onChange={(event) => onMetaChange(image.id, { description: event.target.value })}
              placeholder="Optional short caption"
              className="min-h-[88px]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="destructive"
            className="gap-1"
            onClick={() => onRemove(image.id)}
          >
            <Trash2 className="h-4 w-4" /> Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

type BackgroundTileProps = {
  background: {
    section: 'hero' | 'restaurant' | 'wine-boutique' | 'bar-events';
    imageUrl: string;
    title: string;
    description?: string;
  };
  onDropFile: (section: BackgroundTileProps['background']['section'], files: FileList | null) => void;
  onMetaChange: (section: BackgroundTileProps['background']['section'], updates: Partial<BackgroundTileProps['background']>) => void;
};

const BackgroundTile: React.FC<BackgroundTileProps> = ({ background, onDropFile, onMetaChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    onDropFile(background.section, event.dataTransfer.files);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDropFile(background.section, event.target.files);
  };

  return (
    <Card
      className={cn(
        'border border-slate-200 bg-white shadow-sm transition-all',
        isDragging && 'ring-2 ring-amber-500 ring-offset-2'
      )}
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-semibold">
          {backgroundLabels[background.section]}
        </CardTitle>
        <p className="text-xs text-slate-500">Drag an image onto the preview or choose a file to update this section background.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            'relative aspect-video w-full overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-100',
            isDragging && 'border-amber-500 bg-amber-50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img
            src={background.imageUrl}
            alt={background.title}
            className="h-full w-full object-cover"
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/30 text-white opacity-0 transition-opacity hover:opacity-100">
            <Upload className="h-6 w-6" />
            <p className="text-sm font-medium">Drop image to replace</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Image URL</p>
            <a
              href={background.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all text-sm text-amber-600 hover:underline"
            >
              {background.imageUrl}
            </a>
          </div>
          <div>
            <Input 
              id={`background-upload-${background.section}`}
              name={`background-upload-${background.section}`}
              type="file" 
              accept="image/*" 
              onChange={handleFileInput} 
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor={`title-${background.section}`} className="text-xs uppercase tracking-wide text-slate-500">Title</Label>
            <Input
              id={`title-${background.section}`}
              name={`title-${background.section}`}
              value={background.title}
              onChange={(event) => onMetaChange(background.section, { title: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-slate-500">Description</Label>
            <Textarea
              value={background.description ?? ''}
              onChange={(event) => onMetaChange(background.section, { description: event.target.value })}
              placeholder="Optional short description for internal use"
              className="min-h-[88px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type RoomItem = ReturnType<typeof useGlobalState>['rooms'][number];
type WineItemState = ReturnType<typeof useGlobalState>['wineCollection'][number];
type EventItem = ReturnType<typeof useGlobalState>['events'][number];
type GalleryItem = ReturnType<typeof useGlobalState>['galleryImages'][number];

const toSlug = (value: string, fallback: string) => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
};

type SortableRoomCardProps = {
  room: RoomItem;
  onUpdate: (id: number, updates: Partial<RoomItem>) => void;
  onDelete: (id: number) => void;
  onUpload: (file: File, folder: string) => Promise<string>;
};

const wineCategories: Array<{ value: WineItemState['category']; label: string }> = [
  { value: 'red', label: 'Red' },
  { value: 'white', label: 'White' },
  { value: 'rosé', label: 'Rosé' },
  { value: 'sparkling', label: 'Sparkling' },
  { value: 'dessert', label: 'Dessert' }
];

const SortableRoomCard: React.FC<SortableRoomCardProps> = ({ room, onUpdate, onDelete, onUpload }) => {
  const sortable = useSortable({ id: room.id.toString() });
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const imagePreview = (room.images ?? []).find(Boolean) || '/placeholder.svg';
  const images = room.images ?? [];

  const handleImageChange = (index: number, value: string) => {
    console.log('Room image change:', { roomId: room.id, index, value });
    const next = [...images];
    next[index] = value;
    onUpdate(room.id, { images: next });
  };

  const handleImageUpload = async (index: number, files: FileList | null) => {
    if (!files || !files.length) return;
    try {
      // Use simpler folder structure: just 'rooms' instead of 'rooms/slug'
      const publicUrl = await onUpload(files[0], 'rooms');
      handleImageChange(index, publicUrl);
    } catch (error) {
      // Toast already handled upstream
    }
  };

  const handleImageRemove = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    onUpdate(room.id, { images: next.length ? next : ['/placeholder.svg'] });
  };

  const handleImageMove = (index: number, direction: number) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = arrayMove(images, index, target);
    onUpdate(room.id, { images: next });
  };

  const handleAddImage = () => {
    onUpdate(room.id, { images: [...images, ''] });
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'border border-slate-200 bg-white shadow-sm transition-all',
        isDragging && 'ring-2 ring-amber-500 shadow-lg'
      )}
    >
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-900">{room.name}</CardTitle>
            <p className="text-sm text-slate-500">{room.category}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              {room.price || 'Set price'}
            </span>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onDelete(room.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" /> Drag to reorder
        </button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              <img
                src={imagePreview}
                alt={room.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  (event.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`room-name-${room.id}`} className="text-xs uppercase tracking-wide text-slate-500">Room name</Label>
              <Input 
                id={`room-name-${room.id}`}
                name={`room-name-${room.id}`}
                value={room.name} 
                onChange={(event) => onUpdate(room.id, { name: event.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`room-category-${room.id}`} className="text-xs uppercase tracking-wide text-slate-500">Category</Label>
              <Input 
                id={`room-category-${room.id}`}
                name={`room-category-${room.id}`}
                value={room.category} 
                onChange={(event) => onUpdate(room.id, { category: event.target.value })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`room-price-${room.id}`} className="text-xs uppercase tracking-wide text-slate-500">Nightly rate</Label>
                <Input 
                  id={`room-price-${room.id}`}
                  name={`room-price-${room.id}`}
                  value={room.price} 
                  onChange={(event) => onUpdate(room.id, { price: event.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-500">Guests</Label>
                <Input
                  type="number"
                  min={1}
                  value={room.guests ?? room.maxGuests ?? 2}
                  onChange={(event) => {
                    const value = Number(event.target.value || 0) || 0;
                    onUpdate(room.id, { guests: value, maxGuests: value });
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-500">Room size</Label>
                <Input value={room.size ?? ''} onChange={(event) => onUpdate(room.id, { size: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-500">Bed configuration</Label>
                <Input
                  value={room.bedConfiguration ?? ''}
                  onChange={(event) => onUpdate(room.id, { bedConfiguration: event.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Short description</Label>
              <Textarea
                value={room.description}
                onChange={(event) => onUpdate(room.id, { description: event.target.value })}
                className="min-h-[96px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Detailed description</Label>
              <Textarea
                value={room.detailedDescription}
                onChange={(event) => onUpdate(room.id, { detailedDescription: event.target.value })}
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wide text-slate-500">Room images</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddImage}>
                  <Plus className="h-4 w-4" /> Add image
                </Button>
              </div>
              <div className="space-y-2">
                {images.map((image, index) => (
                  <div
                    key={`${room.id}-image-${index}`}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 p-3"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-slate-100">
                      <img
                        src={image || '/placeholder.svg'}
                        alt={`${room.name} preview ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          (event.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        value={image}
                        onChange={(event) => handleImageChange(index, event.target.value)}
                        placeholder="https://..."
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <div>
                          <button
                            type="button"
                            className="inline-flex cursor-pointer items-center rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:border-amber-500 hover:text-amber-600"
                            onClick={() => document.getElementById(`room-${room.id}-image-upload-${index}`)?.click()}
                          >
                            Upload image
                          </button>
                          <Input
                            id={`room-${room.id}-image-upload-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              handleImageUpload(index, event.target.files);
                              event.target.value = '';
                            }}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleImageMove(index, -1)}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleImageMove(index, 1)}
                          disabled={index === images.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleImageRemove(index)}
                          disabled={images.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Amenities</Label>
              <Textarea
                value={(room.amenities ?? []).join('\n')}
                onChange={(event) => onUpdate(room.id, { amenities: multiLine(event.target.value) })}
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Highlights</Label>
              <Textarea
                value={(room.features ?? []).join('\n')}
                onChange={(event) => onUpdate(room.id, { features: multiLine(event.target.value) })}
                className="min-h-[120px]"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type SortableWineCardProps = {
  wine: WineItemState;
  onUpdate: (id: number, updates: Partial<WineItemState>) => void;
  onDelete: (id: number) => void;
  onUpload: (file: File, folder: string) => Promise<string>;
};

const SortableWineCard: React.FC<SortableWineCardProps> = ({ wine, onUpdate, onDelete, onUpload }) => {
  const sortable = useSortable({ id: wine.id.toString() });
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    try {
      // Use simpler folder structure: just 'wine' instead of 'wine/slug'
      const publicUrl = await onUpload(files[0], 'wine');
      onUpdate(wine.id, { image: publicUrl });
    } catch (error) {
      // toast handled upstream
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn('border border-slate-200 bg-white shadow-sm transition-shadow', isDragging && 'ring-2 ring-amber-500 shadow-lg')}
    >
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-slate-900">{wine.name}</CardTitle>
            <p className="text-sm text-slate-500">{wine.origin || 'Klein Karoo, South Africa'}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              {wine.price}
            </span>
            <Button type="button" variant="destructive" size="icon" onClick={() => onDelete(wine.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" /> Drag to reorder
        </button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative h-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              <img
                src={wine.image || '/placeholder.svg'}
                alt={wine.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  (event.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Image URL</Label>
              <Input
                value={wine.image}
                onChange={(event) => onUpdate(wine.id, { image: event.target.value })}
                placeholder="https://..."
              />
              <label htmlFor={`wine-${wine.id}-upload`}>
                <Input
                  type="file"
                  id={`wine-${wine.id}-upload`}
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    handleImageUpload(event.target.files);
                    if (event.target.value) event.target.value = '';
                  }}
                />
                <span className="inline-flex cursor-pointer items-center rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:border-amber-500 hover:text-amber-600">
                  Upload image
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-500">Wine name</Label>
                <Input value={wine.name} onChange={(event) => onUpdate(wine.id, { name: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-500">Price</Label>
                <Input value={wine.price} onChange={(event) => onUpdate(wine.id, { price: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-500">Vintage</Label>
                <Input value={wine.vintage ?? ''} onChange={(event) => onUpdate(wine.id, { vintage: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-500">Category</Label>
                <Select
                  value={wine.category}
                  onValueChange={(value) => onUpdate(wine.id, { category: value as WineItemState['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {wineCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs uppercase tracking-wide text-slate-500">Origin</Label>
                <Input value={wine.origin ?? ''} onChange={(event) => onUpdate(wine.id, { origin: event.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Description</Label>
              <Textarea
                value={wine.description}
                onChange={(event) => onUpdate(wine.id, { description: event.target.value })}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type SortableEventCardProps = {
  eventItem: EventItem;
  onUpdate: (id: number, updates: Partial<EventItem>) => void;
  onDelete: (id: number) => void;
};

const SortableEventCard: React.FC<SortableEventCardProps> = ({ eventItem, onUpdate, onDelete }) => {
  const sortable = useSortable({ id: eventItem.id.toString() });
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn('border border-slate-200 bg-white shadow-sm transition-shadow', isDragging && 'ring-2 ring-amber-500 shadow-lg')}
    >
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-slate-900">{eventItem.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {eventItem.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {eventItem.time}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {eventItem.type}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              {eventItem.type}
            </span>
            <Button type="button" variant="destructive" size="icon" onClick={() => onDelete(eventItem.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" /> Drag to reorder
        </button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-slate-500">Event title</Label>
            <Input value={eventItem.title} onChange={(event) => onUpdate(eventItem.id, { title: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-slate-500">Event type</Label>
            <Input value={eventItem.type} onChange={(event) => onUpdate(eventItem.id, { type: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-slate-500">Date</Label>
            <Input value={eventItem.date} onChange={(event) => onUpdate(eventItem.id, { date: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-slate-500">Time</Label>
            <Input value={eventItem.time} onChange={(event) => onUpdate(eventItem.id, { time: event.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs uppercase tracking-wide text-slate-500">Description</Label>
            <Textarea
              value={eventItem.description}
              onChange={(event) => onUpdate(eventItem.id, { description: event.target.value })}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const multiLine = (value: string): string[] => value
  .split('\n')
  .map(s => s.trim())
  .filter(Boolean);

const ComprehensiveAdmin: React.FC = () => {
  // Mobile diagnostics - log device info
  React.useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window;
    console.log('Device diagnostics:', {
      userAgent: navigator.userAgent,
      isMobile,
      isTouch,
      screenSize: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio,
      onlineStatus: navigator.onLine
    });
  }, []);

  // Utility to clear localStorage if images aren't loading
  const clearStorageAndRefresh = useCallback(() => {
    if (confirm('This will clear all cached data and refresh the page. Are you sure?')) {
      localStorage.removeItem('karoo-gallery-state');
      localStorage.removeItem('karoo-global-state');
      window.location.reload();
    }
  }, []);

  const {
    rooms,
    updateRooms,
    addRoom,
    deleteRoom,
    galleryImages,
    updateGalleryImages,
    deleteGalleryImage,
    addGalleryImage,
    forceDeduplicateGallery,
    wineCollection,
    updateWineCollection,
    addWine,
    deleteWine,
    events,
    updateEvents,
    addEvent,
    deleteEvent,
    sectionBackgrounds,
    updateSectionBackground,
    siteContent,
    updateSiteContent,
    updateLogo
  } = useGlobalState();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, authError, signIn, signOut } = useAuth();

  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'rooms' | 'gallery' | 'backgrounds' | 'content' | 'wine' | 'events' | 'users'>('rooms');

  const [roomsDraft, setRoomsDraft] = useState(rooms);
  const [wineDraft, setWineDraft] = useState(wineCollection);
  const [eventsDraft, setEventsDraft] = useState(events);
  const [localGallery, setLocalGallery] = useState(galleryImages);
  const [contentDraft, setContentDraft] = useState(siteContent);

  useEffect(() => {
    setRoomsDraft(rooms);
  }, [rooms]);

  useEffect(() => {
    setWineDraft(wineCollection);
  }, [wineCollection]);

  useEffect(() => {
    setEventsDraft(events);
  }, [events]);

  useEffect(() => {
    setLocalGallery(galleryImages);
    // Debug gallery changes
    const urls = galleryImages.map(img => img.src);
    const uniqueUrls = [...new Set(urls)];
    if (urls.length !== uniqueUrls.length) {
      console.warn(`Gallery has duplicates: ${urls.length} total, ${uniqueUrls.length} unique`);
      console.log('Duplicate URLs found:', urls.filter((url, index) => urls.indexOf(url) !== index));
    } else {
      console.log(`Gallery is clean: ${urls.length} unique images`);
    }
    
    // Test a few URLs for accessibility
    if (urls.length > 0) {
      console.log('Testing first few image URLs for accessibility...');
      urls.slice(0, 3).forEach(async (url, index) => {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          console.log(`Image ${index + 1} status:`, response.status, response.statusText, url);
        } catch (error) {
          console.error(`Image ${index + 1} failed:`, error, url);
        }
      });
    }
  }, [galleryImages]);

  useEffect(() => {
    setContentDraft(siteContent);
  }, [siteContent]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (contentDraft !== siteContent) {
        updateSiteContent(contentDraft);
      }
    }, 200);
    return () => window.clearTimeout(id);
  }, [contentDraft, siteContent, updateSiteContent]);

  // Debounced synchronizers to avoid updating GlobalState during render of this component
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (roomsDraft !== rooms) {
        updateRooms(roomsDraft);
      }
    }, 150);
    return () => window.clearTimeout(id);
  }, [roomsDraft, rooms, updateRooms]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (wineDraft !== wineCollection) {
        updateWineCollection(wineDraft);
      }
    }, 150);
    return () => window.clearTimeout(id);
  }, [wineDraft, wineCollection, updateWineCollection]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (eventsDraft !== events) {
        updateEvents(eventsDraft);
      }
    }, 150);
    return () => window.clearTimeout(id);
  }, [eventsDraft, events, updateEvents]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (localGallery !== galleryImages) {
        updateGalleryImages(localGallery);
      }
    }, 150);
    return () => window.clearTimeout(id);
  }, [localGallery, galleryImages, updateGalleryImages]);

  const sensors = useSensors(useSensor(PointerSensor));

  // Upload to S3 and return a public URL (no base64 fallback)
  const uploadFileToS3 = useCallback(
    async (file: File, folder: string): Promise<string> => {
      try {
        console.log('Processing file upload:', file.name, 'to', folder);

        if (!file.type.startsWith('image/')) throw new Error('Please select an image file');
        if (file.size > 5 * 1024 * 1024) throw new Error('Image must be smaller than 5MB');

        // Map folder names to Amplify storage paths
        const folderMapping: Record<string, string> = {
          'rooms': 'media/rooms',
          'backgrounds': 'media/backgrounds', 
          'gallery': 'media/gallery',
          'wine': 'media/gallery', // wine images go to gallery
          'events': 'media/gallery' // event images go to gallery
        };
        
        const amplifyPath = folderMapping[folder] || `media/${folder}`;
        const key = `${amplifyPath}/${Date.now()}-${file.name}`;
        console.log('Uploading to S3 with Amplify path:', key);

        const uploadOutput = await uploadData({
          key,
          data: file,
          options: { contentType: file.type }
        }).result;

        // Wait a moment for the upload to fully complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Upload result:', uploadOutput);
        console.log('Upload result path:', (uploadOutput as any)?.path);
        console.log('Upload result key:', (uploadOutput as any)?.key);

        // Validate that the upload actually succeeded
        if (!(uploadOutput as any)?.key) {
          throw new Error('Upload failed - no key returned from S3');
        }

        // Build a stable, publicly addressable URL (requires bucket policy allowing public read)
        // Use the Amplify-generated bucket name that matches aws-exports.js
        const bucket = 'karoolodge3ad9e6f1467e4bda8acaa46cbb246f78b557e-dev';
        const region = 'us-east-1';
        console.log('Debug - Using Amplify bucket - bucket:', bucket, 'region:', region);
        
        const resolvedKey = (uploadOutput as any)?.path || `public/${key}`; // Ensure public/ prefix
        console.log('Debug - resolvedKey:', resolvedKey);
        console.log('Debug - original key:', key);
        const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${resolvedKey}`;
        console.log('S3 object public URL:', publicUrl);

        // Gallery convenience: push into state immediately
        if (folder === 'gallery') {
          addGalleryImage({
            id: Date.now() + Math.floor(Math.random() * 1000),
            src: publicUrl,
            category: 'scenery',
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim(),
            description: `Uploaded ${new Date().toLocaleDateString()}`
          });
        }

        // small UX delay
        await new Promise((r) => setTimeout(r, 300));

        toast({ title: 'Upload successful', description: `${file.name} uploaded to cloud storage` });
        return publicUrl;
      } catch (error) {
        console.error('S3 upload failed:', error);
        toast({
          title: 'Upload failed',
          description: error instanceof Error ? error.message : 'Failed to upload file',
          variant: 'destructive'
        });
        return '/placeholder.svg';
      }
    },
    [toast, addGalleryImage]
  );  const handleRoomsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = roomsDraft.findIndex((room) => room.id.toString() === active.id.toString());
    const newIndex = roomsDraft.findIndex((room) => room.id.toString() === over.id.toString());

    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(roomsDraft, oldIndex, newIndex);
    setRoomsDraft(reordered);
    updateRooms(reordered);
  };

  const handleRoomUpdate = (id: number, updates: Partial<RoomItem>) => {
    console.log('Room update:', { id, updates });
    setRoomsDraft((prev) => prev.map((room) => (room.id === id ? { ...room, ...updates } : room)));
  };

  const handleRoomDelete = (id: number) => {
    deleteRoom(id);
    setRoomsDraft((prev) => prev.filter((room) => room.id !== id));
    toast({
      title: 'Room removed',
      description: 'The room has been deleted from your accommodation list.'
    });
  };

  const handleAddRoom = () => {
    const timestamp = Date.now();
    const newRoom: RoomItem = {
      id: timestamp,
      name: 'New Room',
      category: 'Room Category',
      images: ['/placeholder.svg'],
      price: 'R0',
      guests: 2,
      maxGuests: 2,
      size: '',
      bedConfiguration: '',
      amenities: [],
      features: [],
      description: 'Describe this room...',
      detailedDescription: 'Add a detailed description here.'
    };

    addRoom(newRoom);
    setRoomsDraft((prev) => [...prev, newRoom]);
    toast({
      title: 'Room added',
      description: 'A new room has been added to the accommodation list.'
    });
  };

  const handleWineDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = wineDraft.findIndex((wine) => wine.id.toString() === active.id.toString());
    const newIndex = wineDraft.findIndex((wine) => wine.id.toString() === over.id.toString());

    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(wineDraft, oldIndex, newIndex);
    setWineDraft(reordered);
    updateWineCollection(reordered);
  };

  const handleWineUpdate = (id: number, updates: Partial<WineItemState>) => {
  setWineDraft((prev) => prev.map((wine) => (wine.id === id ? { ...wine, ...updates } : wine)));
  };

  const handleWineDelete = (id: number) => {
    deleteWine(id);
    setWineDraft((prev) => prev.filter((wine) => wine.id !== id));
    toast({
      title: 'Wine removed',
      description: 'The wine has been removed from the collection.'
    });
  };

  const handleAddWineItem = () => {
    const timestamp = Date.now();
    const newWine = {
      id: timestamp,
      name: 'New Wine',
      vintage: '',
      price: 'R0',
      description: 'Describe this wine...',
      image: '/placeholder.svg',
      category: 'red' as const,
      origin: 'Klein Karoo, South Africa'
    };

    addWine(newWine);
    setWineDraft((prev) => [...prev, newWine]);
    toast({
      title: 'Wine added',
      description: 'A new wine has been added to the boutique list.'
    });
  };

  const handleEventsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = eventsDraft.findIndex((item) => item.id.toString() === active.id.toString());
    const newIndex = eventsDraft.findIndex((item) => item.id.toString() === over.id.toString());

    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(eventsDraft, oldIndex, newIndex);
    setEventsDraft(reordered);
    updateEvents(reordered);
  };

  const handleEventUpdate = (id: number, updates: Partial<EventItem>) => {
  setEventsDraft((prev) => prev.map((eventItem) => (eventItem.id === id ? { ...eventItem, ...updates } : eventItem)));
  };

  const handleEventDelete = (id: number) => {
    deleteEvent(id);
    setEventsDraft((prev) => prev.filter((eventItem) => eventItem.id !== id));
    toast({
      title: 'Event removed',
      description: 'The event has been deleted.'
    });
  };

  const handleAddEvent = () => {
    const timestamp = Date.now();
    const newEvent = {
      id: timestamp,
      title: 'New Event',
      date: 'Date',
      time: 'Time',
      description: 'Describe the event...',
      type: 'General'
    };

    addEvent(newEvent);
    setEventsDraft((prev) => [...prev, newEvent]);
    toast({
      title: 'Event added',
      description: 'A new event has been added to the lineup.'
    });
  };

  const handleAuthSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signIn(authUsername.trim(), authPassword);
      setAuthPassword('');
      toast({
        title: 'Welcome back!',
        description: 'You are now signed in to the admin panel.'
      });
    } catch (error) {
      toast({
        title: 'Access denied',
        description:
          error instanceof Error ? error.message : 'Could not verify your credentials.',
        variant: 'destructive'
      });
    }
  };

  const handleSignOut = () => {
    signOut();
    toast({
      title: 'Signed out',
      description: 'You have been signed out of the admin console.'
    });
  };

  const handleGalleryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localGallery.findIndex((item) => item.id.toString() === active.id.toString());
    const newIndex = localGallery.findIndex((item) => item.id.toString() === over.id.toString());

    const reordered = arrayMove(localGallery, oldIndex, newIndex).map((item, index) => ({
      ...item,
      order: index
    }));

    setLocalGallery(reordered);
    updateGalleryImages(reordered);
  };

  const handleGalleryMetaChange = (id: number, updates: Partial<SortableGalleryProps['image']>) => {
  setLocalGallery((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleGalleryRemove = (id: number) => {
    deleteGalleryImage(id);
    toast({
      title: 'Image removed',
      description: 'The image has been deleted from the gallery.'
    });
  };

  const handleGalleryFileDrop = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
      if (imageFiles.length === 0) return;

      try {
        const newItems = [] as typeof galleryImages;
        for (const file of imageFiles) {
          const id = Date.now() + Math.floor(Math.random() * 1000);
          const publicUrl = await uploadFileToS3(file, 'gallery');
          const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
          const image: GalleryItem = {
            id,
            src: publicUrl,
            category: 'scenery',
            title: title || 'New Image',
            description: ''
          };
          // TODO: Persist to new backend
          console.log('Would save to backend:', image);
          
          newItems.push(image);
        }
        // TODO: Re-fetch gallery from new backend
        console.log('Would fetch gallery from backend');
        
        setLocalGallery(prev => [...prev, ...newItems]);
        toast({
          title: 'Gallery updated',
          description: `${newItems.length} image${newItems.length > 1 ? 's' : ''} added to the gallery.`
        });
      } catch (error) {
        console.error('Failed to add gallery image', error);
      }
    },
    [toast, uploadFileToS3]
  );

  const handleBackgroundFileDrop = useCallback(
    async (section: BackgroundTileProps['background']['section'], files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = Array.from(files).find((item) => item.type.startsWith('image/'));
      if (!file) return;

      try {
        const publicUrl = await uploadFileToS3(file, 'backgrounds');
        updateSectionBackground({
          section,
          imageUrl: publicUrl,
          title: backgroundLabels[section],
          description: sectionBackgrounds.find((bg) => bg.section === section)?.description ?? ''
        });

        toast({
          title: 'Background updated',
          description: `${backgroundLabels[section]} image replaced successfully.`
        });
      } catch (error) {
        console.error('Failed to update background image', error);
      }
    },
    [sectionBackgrounds, toast, updateSectionBackground, uploadFileToS3]
  );
  const handleBackgroundMetaChange = (
    section: BackgroundTileProps['background']['section'],
    updates: Partial<BackgroundTileProps['background']>
  ) => {
    const previous = sectionBackgrounds.find((bg) => bg.section === section);
    if (!previous) return;
    updateSectionBackground({ ...previous, ...updates });
  };

  const handleLogoUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    try {
      const publicUrl = await uploadFileToS3(files[0], 'branding');
      setContentDraft((prev) => ({ ...prev, logoUrl: publicUrl }));
      updateLogo(publicUrl);
      toast({
        title: 'Logo updated',
        description: 'The site logo has been replaced with your new upload.'
      });
    } catch (error) {
      // uploadFileToS3 already reports via toast
    }
  };

  const handleLogoUrlChange = (value: string) => {
    setContentDraft((prev) => ({ ...prev, logoUrl: value }));
    updateLogo(value);
  };

  useEffect(() => {
    const handleStorageWarning = (event: Event) => {
      const customEvent = event as CustomEvent<{ size: number; message: string }>;
      toast({
        title: 'Storage warning',
        description: customEvent.detail?.message || 'Content too large to save locally.',
        variant: 'destructive'
      });
    };

    window.addEventListener('karoo-storage-warning', handleStorageWarning);
    return () => window.removeEventListener('karoo-storage-warning', handleStorageWarning);
  }, [toast]);

  const handleContentDraftChange = <K extends keyof typeof contentDraft>(key: K, value: typeof contentDraft[K]) => {
    setContentDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleContentSave = () => {
    updateSiteContent(contentDraft);
    toast({
      title: 'Content saved',
      description: 'Site copy has been updated successfully.'
    });
  };

  const renderRoomsTab = () => (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Room Collection</h2>
            <p className="text-sm text-slate-500">Drag to reorder rooms and edit content in place.</p>
          </div>
          <Button type="button" className="gap-2" onClick={handleAddRoom}>
            <Plus className="h-4 w-4" /> Add room
          </Button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleRoomsDragEnd}>
          <SortableContext items={roomsDraft.map((room) => room.id.toString())} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {roomsDraft.map((room) => (
                <SortableRoomCard
                  key={room.id}
                  room={room}
                  onUpdate={handleRoomUpdate}
                  onDelete={handleRoomDelete}
                  onUpload={uploadFileToS3}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {roomsDraft.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
            <Bed className="h-10 w-10 text-slate-400" />
            <div>
              <p className="text-lg font-semibold text-slate-700">No rooms yet</p>
              <p className="text-sm text-slate-500">Use “Add room” to create your first accommodation listing.</p>
            </div>
          </div>
        )}
      </div>
    );

  const renderGalleryTab = () => (
      <div className="space-y-6">
        <UploadDebug />
        <Card className="border border-dashed border-amber-400 bg-amber-50/60 shadow-none">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900">Drag & drop images here</h3>
              <p className="text-sm text-amber-700">
                Drop images anywhere on this card or use the file picker below. New images default to the "Scenery"
                category.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Supported</p>
              <p className="text-sm text-amber-800">JPG, PNG, WEBP — maximum 5 files at a time</p>
            </div>
            <Input
              multiple
              type="file"
              accept="image/*"
              className="max-w-sm"
              onChange={(event) => handleGalleryFileDrop(event.target.files)}
            />
          </CardContent>
        </Card>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleGalleryDragEnd}
        >
          <SortableContext
            items={localGallery.map((item) => item.id.toString())}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {localGallery.map((image) => (
                <SortableGalleryCard
                  key={image.id}
                  image={image}
                  onMetaChange={handleGalleryMetaChange}
                  onRemove={handleGalleryRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {localGallery.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
            <ImageIcon className="h-12 w-12 text-slate-400" />
            <div>
              <h3 className="text-lg font-semibold text-slate-700">No images yet</h3>
              <p className="text-sm text-slate-500">Drop images above or use the file picker to start building your gallery.</p>
            </div>
          </div>
        )}
      </div>
    );

  const renderWineTab = () => (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Wine Collection</h2>
            <p className="text-sm text-slate-500">Reorder bottles and update tasting notes, pricing, and imagery.</p>
          </div>
          <Button type="button" className="gap-2" onClick={handleAddWineItem}>
            <Plus className="h-4 w-4" /> Add wine
          </Button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleWineDragEnd}>
          <SortableContext
            items={wineDraft.map((wine) => wine.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-6">
              {wineDraft.map((wine) => (
                <SortableWineCard
                  key={wine.id}
                  wine={wine}
                  onUpdate={handleWineUpdate}
                  onDelete={handleWineDelete}
                  onUpload={uploadFileToS3}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {wineDraft.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
            <WineIcon className="h-10 w-10 text-slate-400" />
            <div>
              <p className="text-lg font-semibold text-slate-700">No wines listed</p>
              <p className="text-sm text-slate-500">Add your first bottle to populate the boutique section.</p>
            </div>
          </div>
        )}
      </div>
    );

  const renderEventsTab = () => (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Events & Experiences</h2>
            <p className="text-sm text-slate-500">Keep your Windpomp Bar listings fresh with new happenings.</p>
          </div>
          <Button type="button" className="gap-2" onClick={handleAddEvent}>
            <Plus className="h-4 w-4" /> Add event
          </Button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEventsDragEnd}>
          <SortableContext
            items={eventsDraft.map((eventItem) => eventItem.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-6">
              {eventsDraft.map((eventItem) => (
                <SortableEventCard
                  key={eventItem.id}
                  eventItem={eventItem}
                  onUpdate={handleEventUpdate}
                  onDelete={handleEventDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {eventsDraft.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
            <Calendar className="h-10 w-10 text-slate-400" />
            <div>
              <p className="text-lg font-semibold text-slate-700">No events scheduled</p>
              <p className="text-sm text-slate-500">Add an event to populate the Windpomp Bar section.</p>
            </div>
          </div>
        )}
      </div>
    );

  const renderBackgroundTab = () => (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sectionBackgrounds.map((background) => (
          <BackgroundTile
            key={background.section}
            background={background}
            onDropFile={handleBackgroundFileDrop}
            onMetaChange={handleBackgroundMetaChange}
          />
        ))}
      </div>
    );

  const renderContentTab = () => (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Brand assets</CardTitle>
              <p className="text-sm text-slate-500">Swap out the site logo or point to an external asset.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
                <img
                  src={contentDraft.logoUrl}
                  alt="Site logo preview"
                  className="h-full w-full object-contain"
                  onError={(event) => {
                    (event.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <label htmlFor="admin-logo-upload">
                <Input
                  id="admin-logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    handleLogoUpload(event.target.files);
                    if (event.target.value) event.target.value = '';
                  }}
                />
                <span className="inline-flex cursor-pointer items-center rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:border-amber-500 hover:text-amber-600">
                  Upload logo
                </span>
              </label>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Logo URL</Label>
              <Input
                value={contentDraft.logoUrl}
                onChange={(event) => handleLogoUrlChange(event.target.value)}
                placeholder="https://..."
              />
            </div>
            <p className="text-xs text-slate-500">
              Uploading a logo automatically updates the live site. You can also paste a URL for an externally hosted SVG or image.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Hero Content</CardTitle>
              <p className="text-sm text-slate-500">Update the headline copy that appears at the top of the public site.</p>
            </div>
            <Button type="button" className="gap-2" onClick={handleContentSave}>
              <Save className="h-4 w-4" /> Save changes
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Hero title</Label>
              <Input
                value={contentDraft.heroTitle}
                onChange={(event) => handleContentDraftChange('heroTitle', event.target.value)}
                placeholder="Experience the Klein Karoo"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Hero subtitle</Label>
              <Input
                value={contentDraft.heroSubtitle}
                onChange={(event) => handleContentDraftChange('heroSubtitle', event.target.value)}
                placeholder="A luxury boutique retreat..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">About headline / body</Label>
              <Textarea
                value={contentDraft.aboutText}
                onChange={(event) => handleContentDraftChange('aboutText', event.target.value)}
                className="min-h-[140px]"
                placeholder="Tell guests what makes your property special."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Primary phone</Label>
              <Input
                value={contentDraft.contactInfo.phone}
                onChange={(event) =>
                  handleContentDraftChange('contactInfo', {
                    ...contentDraft.contactInfo,
                    phone: event.target.value
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Email address</Label>
              <Input
                value={contentDraft.contactInfo.email}
                onChange={(event) =>
                  handleContentDraftChange('contactInfo', {
                    ...contentDraft.contactInfo,
                    email: event.target.value
                  })
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Street address</Label>
              <Textarea
                value={contentDraft.contactInfo.address}
                onChange={(event) =>
                  handleContentDraftChange('contactInfo', {
                    ...contentDraft.contactInfo,
                    address: event.target.value
                  })
                }
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Social Media</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Facebook</Label>
              <Input
                value={contentDraft.socialMedia.facebook}
                onChange={(event) =>
                  handleContentDraftChange('socialMedia', {
                    ...contentDraft.socialMedia,
                    facebook: event.target.value
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Instagram</Label>
              <Input
                value={contentDraft.socialMedia.instagram}
                onChange={(event) =>
                  handleContentDraftChange('socialMedia', {
                    ...contentDraft.socialMedia,
                    instagram: event.target.value
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Twitter (X)</Label>
              <Input
                value={contentDraft.socialMedia.twitter}
                onChange={(event) =>
                  handleContentDraftChange('socialMedia', {
                    ...contentDraft.socialMedia,
                    twitter: event.target.value
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );

  if (authLoading && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100">
          <CardContent className="flex items-center gap-3 py-10 text-sm text-slate-300">
            <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
            Checking your session...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100">
          <CardHeader className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              <Lock className="h-5 w-5" />
            </div>
            <CardTitle className="text-2xl font-semibold">Barrydale Admin Access</CardTitle>
            <p className="text-sm text-slate-400">
              Sign in with your admin account to manage gallery assets, section backgrounds, and site copy.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleAuthSubmit}>
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-xs uppercase tracking-wide text-slate-400">Admin email</Label>
                <Input
                  id="admin-email"
                  name="username"
                  type="email"
                  value={authUsername}
                  onChange={(event) => setAuthUsername(event.target.value)}
                  className="border-slate-700 bg-slate-800 text-slate-100"
                  placeholder="you@example.com"
                  autoFocus
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-xs uppercase tracking-wide text-slate-400">Password</Label>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  className="border-slate-700 bg-slate-800 text-slate-100"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              {authError && <p className="text-sm text-rose-400">{authError}</p>}
              <Button
                type="submit"
                className="w-full gap-2 bg-amber-500 text-slate-900 hover:bg-amber-400"
                disabled={authLoading}
              >
                {authLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Sign in
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-600">Barrydale Karoo Lodge</p>
            <h1 className="text-2xl font-semibold text-slate-900">Content & Media Console</h1>
            <p className="text-xs text-slate-500">v2.1.0 - Build {new Date().toISOString().slice(0,16).replace('T',' ')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="gap-2" onClick={clearStorageAndRefresh}>
              <Trash2 className="h-4 w-4" /> Clear cache
            </Button>
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={async () => {
                // Mobile debug info with network test
                const testImageUrl = galleryImages[0]?.src;
                let networkTest = 'No images to test';
                
                if (testImageUrl) {
                  try {
                    const response = await fetch(testImageUrl, { method: 'HEAD' });
                    networkTest = `Status: ${response.status} ${response.statusText}`;
                  } catch (error) {
                    networkTest = `Error: ${error}`;
                  }
                }
                
                const debugInfo = {
                  userAgent: navigator.userAgent,
                  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                  screenSize: `${screen.width}x${screen.height}`,
                  viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                  pixelRatio: window.devicePixelRatio,
                  onlineStatus: navigator.onLine,
                  galleryCount: galleryImages.length,
                  sampleImageUrl: testImageUrl,
                  networkTest
                };
                alert(`Mobile Debug Info:\n${JSON.stringify(debugInfo, null, 2)}`);
              }}
            >
              <Eye className="h-4 w-4" /> Debug
            </Button>
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={() => {
                console.log('Before force deduplication:', galleryImages.length, 'images');
                forceDeduplicateGallery();
                toast({
                  title: "Gallery Deduplication",
                  description: "Force deduplication completed. Check console for details."
                });
              }}
            >
              <Trash2 className="h-4 w-4" /> Fix Duplicates
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 text-red-600" 
              onClick={async () => {
                console.log('Testing all gallery images for accessibility...');
                const workingImages = [];
                const brokenImages = [];
                
                // Show immediate feedback
                toast({
                  title: "Testing Images",
                  description: `Testing ${galleryImages.length} images...`
                });
                
                for (const image of galleryImages) {
                  try {
                    console.log('Testing:', image.src);
                    const response = await fetch(image.src, { 
                      method: 'HEAD',
                      mode: 'cors',
                      cache: 'no-cache'
                    });
                    if (response.ok) {
                      workingImages.push(image);
                      console.log('✓ Working (', response.status, '):', image.title);
                    } else {
                      brokenImages.push({ ...image, status: response.status });
                      console.log('✗ Broken (', response.status, '):', image.title, image.src);
                    }
                  } catch (error) {
                    brokenImages.push({ ...image, error: error.toString() });
                    console.log('✗ Failed:', image.title, error.toString(), image.src);
                  }
                }
                
                console.log(`Results: ${workingImages.length} working, ${brokenImages.length} broken`);
                console.log('Broken images:', brokenImages);
                
                if (brokenImages.length > 0) {
                  const removedCount = brokenImages.length;
                  updateGalleryImages(workingImages);
                  toast({
                    title: "Broken Images Removed",
                    description: `Removed ${removedCount} broken images. ${workingImages.length} working images remain.`
                  });
                } else {
                  toast({
                    title: "All Images Working",
                    description: "No broken images found."
                  });
                }
              }}
            >
              <Trash2 className="h-4 w-4" /> Remove Broken
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 bg-blue-50" 
              onClick={() => {
                console.log('=== GALLERY DEBUG INFO ===');
                console.log('Total images:', galleryImages.length);
                console.log('Gallery state:', galleryImages);
                console.log('LocalStorage gallery:', localStorage.getItem('karoo-gallery-state'));
                console.log('LocalStorage global:', localStorage.getItem('karoo-global-state'));
                
                // Test a simple image load
                if (galleryImages.length > 0) {
                  const testImg = new Image();
                  testImg.onload = () => console.log('✓ Test image loaded successfully');
                  testImg.onerror = (error) => console.log('✗ Test image failed:', error);
                  testImg.src = galleryImages[0].src;
                  console.log('Testing first image:', galleryImages[0].src);
                }
                
                toast({
                  title: "Debug Info",
                  description: `Gallery has ${galleryImages.length} images. Check console for details.`
                });
              }}
            >
              <Eye className="h-4 w-4" /> Quick Debug
            </Button>
            <Button 
              variant="destructive" 
              className="gap-2" 
              onClick={() => {
                if (confirm('This will clear ALL gallery images. Are you sure?')) {
                  updateGalleryImages([]);
                  localStorage.removeItem('karoo-gallery-state');
                  toast({
                    title: "Gallery Cleared",
                    description: "All gallery images have been removed."
                  });
                  console.log('Gallery cleared - you can now upload fresh images');
                }
              }}
            >
              <Trash2 className="h-4 w-4" /> Clear All
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 bg-green-50" 
              onClick={async () => {
                toast({
                  title: "Mobile Fix Applied",
                  description: "Refreshing gallery with mobile optimizations..."
                });
                
                // Force a gallery refresh with mobile-specific optimizations
                const currentImages = [...galleryImages];
                
                // Clear and reload to force fresh image loading
                updateGalleryImages([]);
                
                setTimeout(() => {
                  // Add back images with mobile-optimized URLs
                  const mobileOptimizedImages = currentImages.map(img => ({
                    ...img,
                    src: img.src.includes('?') 
                      ? `${img.src}&mobile=1&t=${Date.now()}`
                      : `${img.src}?mobile=1&t=${Date.now()}`
                  }));
                  
                  updateGalleryImages(mobileOptimizedImages);
                  console.log('Applied mobile optimizations to', mobileOptimizedImages.length, 'images');
                  
                  toast({
                    title: "Mobile Fix Complete",
                    description: "Gallery refreshed with mobile optimizations. Test on mobile now!"
                  });
                }, 1000);
              }}
            >
              <ImageIcon className="h-4 w-4" /> Fix Mobile
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 bg-purple-50" 
              onClick={() => {
                console.log('=== COMPREHENSIVE MOBILE DIAGNOSTIC ===');
                
                // Check protocol issues
                const currentProtocol = window.location.protocol;
                console.log('Current site protocol:', currentProtocol);
                
                // Check for mixed content issues
                const httpsImages = galleryImages.filter(img => img.src.startsWith('https://'));
                const httpImages = galleryImages.filter(img => img.src.startsWith('http://'));
                
                console.log('HTTPS images:', httpsImages.length);
                console.log('HTTP images:', httpImages.length);
                
                if (currentProtocol === 'https:' && httpImages.length > 0) {
                  console.warn('⚠️ MIXED CONTENT DETECTED! HTTPS site loading HTTP images.');
                  console.log('Problematic HTTP images:', httpImages.map(img => img.src));
                }
                
                // Check for signed URL patterns
                const signedUrls = galleryImages.filter(img => 
                  img.src.includes('X-Amz-Algorithm') || 
                  img.src.includes('Signature') || 
                  img.src.includes('Expires')
                );
                
                if (signedUrls.length > 0) {
                  console.warn('⚠️ SIGNED URLs DETECTED! These expire after 15 minutes.');
                  console.log('Signed URLs:', signedUrls.map(img => img.src));
                } else {
                  console.log('✅ Using permanent S3 URLs (no expiry)');
                }
                
                // Check viewport and CSS
                console.log('Viewport width:', window.innerWidth);
                console.log('Screen width:', screen.width);
                console.log('Device pixel ratio:', window.devicePixelRatio);
                console.log('Is mobile user agent:', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
                
                // Check for Safari/iOS
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
                
                if (isIOS || isSafari) {
                  console.warn('⚠️ iOS/Safari detected - using simplified loading strategy');
                }
                
                // Check gallery container dimensions
                const gallerySection = document.querySelector('#gallery') || document.querySelector('[id="gallery"]');
                if (gallerySection) {
                  const rect = gallerySection.getBoundingClientRect();
                  console.log('Gallery section dimensions:', {
                    width: rect.width,
                    height: rect.height,
                    visible: rect.width > 0 && rect.height > 0
                  });
                }
                
                // Check image grid dimensions
                const imageGrid = document.querySelector('.grid');
                if (imageGrid) {
                  const gridRect = imageGrid.getBoundingClientRect();
                  console.log('Image grid dimensions:', {
                    width: gridRect.width,
                    height: gridRect.height,
                    visible: gridRect.width > 0 && gridRect.height > 0
                  });
                }
                
                // Test first image dimensions and visibility
                if (galleryImages.length > 0) {
                  const testImg = new Image();
                  testImg.onload = function() {
                    console.log('✅ Test image natural size:', this.naturalWidth, 'x', this.naturalHeight);
                  };
                  testImg.onerror = function() {
                    console.error('❌ Test image failed to load');
                  };
                  testImg.src = galleryImages[0].src;
                  
                  // Check actual DOM image elements
                  const domImages = document.querySelectorAll('img[src*="karoolodge"]');
                  console.log('Found', domImages.length, 'gallery images in DOM');
                  
                  domImages.forEach((img, index) => {
                    const rect = img.getBoundingClientRect();
                    const computedStyle = window.getComputedStyle(img);
                    console.log(`Image ${index + 1} DOM status:`, {
                      src: img.getAttribute('src'),
                      visible: rect.width > 0 && rect.height > 0,
                      dimensions: `${rect.width}x${rect.height}`,
                      display: computedStyle.display,
                      visibility: computedStyle.visibility,
                      opacity: computedStyle.opacity
                    });
                  });
                }
                
                toast({
                  title: "Mobile Diagnostic Complete",
                  description: "Check console for detailed mobile compatibility analysis."
                });
              }}
            >
              <Eye className="h-4 w-4" /> Mobile Diagnostic
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 bg-orange-50" 
              onClick={() => {
                // Create CSS debugging overlay
                const existingOverlay = document.getElementById('mobile-debug-overlay');
                if (existingOverlay) {
                  existingOverlay.remove();
                  return;
                }
                
                const overlay = document.createElement('div');
                overlay.id = 'mobile-debug-overlay';
                overlay.style.cssText = `
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: rgba(0,0,0,0.8);
                  color: white;
                  padding: 20px;
                  z-index: 9999;
                  overflow: auto;
                  font-family: monospace;
                  font-size: 12px;
                `;
                
                const info = `
=== MOBILE CSS DEBUG OVERLAY ===
Click anywhere to close

Viewport: ${window.innerWidth}x${window.innerHeight}
Screen: ${screen.width}x${screen.height}
Pixel Ratio: ${window.devicePixelRatio}
User Agent: ${navigator.userAgent}

Gallery Images: ${galleryImages.length}
Protocol: ${window.location.protocol}

Image URLs:
${galleryImages.slice(0, 5).map((img, i) => `${i+1}. ${img.src}`).join('\n')}

CSS Breakpoints Test:
- Mobile (< 640px): ${window.innerWidth < 640 ? '✅ ACTIVE' : '❌ inactive'}
- SM (≥ 640px): ${window.innerWidth >= 640 ? '✅ ACTIVE' : '❌ inactive'}
- LG (≥ 1024px): ${window.innerWidth >= 1024 ? '✅ ACTIVE' : '❌ inactive'}
- XL (≥ 1280px): ${window.innerWidth >= 1280 ? '✅ ACTIVE' : '❌ inactive'}

Grid Columns Expected: ${window.innerWidth < 640 ? '1' : window.innerWidth < 1024 ? '2' : window.innerWidth < 1280 ? '3' : '4'}
                `;
                
                overlay.textContent = info;
                overlay.onclick = () => overlay.remove();
                document.body.appendChild(overlay);
                
                toast({
                  title: "CSS Debug Overlay",
                  description: "Debug overlay active - click anywhere on screen to close"
                });
              }}
            >
              <Eye className="h-4 w-4" /> CSS Debug
            </Button>
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={() => {
                // Create a mobile test page
                const testWindow = window.open('', '_blank');
                if (testWindow) {
                  const testImages = galleryImages.slice(0, 5);
                  const html = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Mobile Image Test</title>
                      <style>
                        body { 
                          font-family: Arial, sans-serif; 
                          padding: 20px; 
                          background: #f5f5f5;
                        }
                        .test-image { 
                          display: block; 
                          max-width: 100%; 
                          height: 200px;
                          width: 100%;
                          object-fit: cover;
                          margin: 10px 0; 
                          border: 2px solid #ccc; 
                          background: #fff;
                        }
                        .test-result { 
                          padding: 10px; 
                          margin: 5px 0; 
                          border-radius: 5px; 
                          font-size: 14px;
                        }
                        .success { background-color: #d4edda; color: #155724; }
                        .error { background-color: #f8d7da; color: #721c24; }
                        .info { background-color: #d1ecf1; color: #0c5460; }
                        .loading { background-color: #fff3cd; color: #856404; }
                        h1 { color: #333; text-align: center; }
                        .stats { 
                          background: white; 
                          padding: 15px; 
                          border-radius: 8px; 
                          margin: 15px 0;
                          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                      </style>
                    </head>
                    <body>
                      <h1>🔧 Mobile Image Test</h1>
                      <div class="stats">
                        <strong>Testing ${testImages.length} images...</strong>
                      </div>
                      <div id="results"></div>
                      <div id="images"></div>
                      
                      <script>
                        const results = document.getElementById('results');
                        const images = document.getElementById('images');
                        const testImages = ${JSON.stringify(testImages)};
                        
                        let loadedCount = 0;
                        let failedCount = 0;
                        
                        // Device info
                        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                        results.innerHTML += '<div class="test-result info"><strong>Device:</strong> ' + (isMobile ? 'Mobile' : 'Desktop') + '</div>';
                        results.innerHTML += '<div class="test-result info"><strong>User Agent:</strong> ' + navigator.userAgent + '</div>';
                        results.innerHTML += '<div class="test-result info"><strong>Online:</strong> ' + navigator.onLine + '</div>';
                        results.innerHTML += '<div class="test-result info"><strong>Screen:</strong> ' + screen.width + 'x' + screen.height + '</div>';
                        results.innerHTML += '<div class="test-result info"><strong>Viewport:</strong> ' + window.innerWidth + 'x' + window.innerHeight + '</div>';
                        
                        function updateStats() {
                          const total = testImages.length;
                          const pending = total - loadedCount - failedCount;
                          document.querySelector('.stats').innerHTML = 
                            '<strong>Results:</strong> ' + 
                            loadedCount + ' loaded, ' + 
                            failedCount + ' failed, ' + 
                            pending + ' pending';
                        }
                        
                        testImages.forEach((image, index) => {
                          const container = document.createElement('div');
                          container.style.marginBottom = '20px';
                          
                          const title = document.createElement('div');
                          title.innerHTML = '<strong>Image ' + (index + 1) + ':</strong> ' + image.title;
                          title.style.marginBottom = '5px';
                          container.appendChild(title);
                          
                          const img = document.createElement('img');
                          img.className = 'test-image';
                          img.alt = image.title;
                          img.style.border = '2px solid orange';
                          
                          // Add multiple fallback strategies for mobile
                          img.crossOrigin = 'anonymous';
                          img.referrerPolicy = 'no-referrer';
                          img.loading = 'eager'; // Force immediate loading for test
                          
                          const resultDiv = document.createElement('div');
                          resultDiv.className = 'test-result loading';
                          resultDiv.textContent = '⏳ Loading...';
                          
                          img.onload = function() {
                            loadedCount++;
                            resultDiv.className = 'test-result success';
                            resultDiv.innerHTML = '✅ <strong>SUCCESS!</strong> Loaded successfully<br><small>' + image.src + '</small>';
                            img.style.border = '2px solid green';
                            updateStats();
                            console.log('✅ Mobile test - Image loaded:', image.src);
                          };
                          
                          img.onerror = function(error) {
                            failedCount++;
                            resultDiv.className = 'test-result error';
                            resultDiv.innerHTML = '❌ <strong>FAILED!</strong> Could not load<br><small>' + image.src + '</small><br><em>Error: ' + error.type + '</em>';
                            img.style.border = '2px solid red';
                            img.style.display = 'none'; // Hide broken image
                            updateStats();
                            console.error('❌ Mobile test - Image failed:', image.src, error);
                          };
                          
                          // Try loading with cache busting
                          const cacheBustUrl = image.src + (image.src.includes('?') ? '&' : '?') + 'mobile-test=' + Date.now();
                          img.src = cacheBustUrl;
                          
                          container.appendChild(img);
                          container.appendChild(resultDiv);
                          images.appendChild(container);
                        });
                        
                        // Final summary after 10 seconds
                        setTimeout(() => {
                          const summary = document.createElement('div');
                          summary.className = 'stats';
                          summary.innerHTML = '<h3>🎯 Final Results:</h3>' +
                            '<p><strong>Successfully Loaded:</strong> ' + loadedCount + '/' + testImages.length + '</p>' +
                            '<p><strong>Failed to Load:</strong> ' + failedCount + '/' + testImages.length + '</p>' +
                            '<p><strong>Success Rate:</strong> ' + Math.round((loadedCount / testImages.length) * 100) + '%</p>';
                          
                          if (failedCount > 0) {
                            summary.innerHTML += '<p style="color: red;"><strong>⚠️ Issues detected!</strong> Some images are not loading on mobile.</p>';
                          } else {
                            summary.innerHTML += '<p style="color: green;"><strong>✅ All good!</strong> All images loaded successfully.</p>';
                          }
                          
                          images.appendChild(summary);
                        }, 10000);
                      </script>
                    </body>
                    </html>
                  `;
                  testWindow.document.write(html);
                  testWindow.document.close();
                }
              }}
            >
              <ImageIcon className="h-4 w-4" /> Mobile Test Page
            </Button>
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={async () => {
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                console.log('Mobile Image Test Starting...', { isMobile });
                
                const testResults = [];
                
                for (let i = 0; i < Math.min(3, galleryImages.length); i++) {
                  const image = galleryImages[i];
                  console.log(`Testing image ${i + 1}:`, image.src);
                  
                  try {
                    // Test with fetch
                    const fetchResponse = await fetch(image.src, { method: 'HEAD' });
                    console.log(`Fetch test ${i + 1}:`, fetchResponse.status, fetchResponse.statusText);
                    
                    // Test with Image object
                    const imgElement = new Image();
                    const loadPromise = new Promise((resolve, reject) => {
                      imgElement.onload = () => resolve('loaded');
                      imgElement.onerror = (error) => reject(error);
                      imgElement.src = image.src;
                    });
                    
                    const imageResult = await Promise.race([
                      loadPromise,
                      new Promise((_, reject) => setTimeout(() => reject('timeout'), 10000))
                    ]);
                    
                    console.log(`Image load test ${i + 1}:`, imageResult);
                    testResults.push({ url: image.src, status: 'success' });
                  } catch (error) {
                    console.error(`Image test ${i + 1} failed:`, error);
                    testResults.push({ url: image.src, status: 'failed', error: error.toString() });
                  }
                }
                
                alert(`Mobile Image Test Complete!\nResults: ${testResults.map(r => `${r.status}`).join(', ')}\nCheck console for details.`);
              }}
            >
              <ImageIcon className="h-4 w-4" /> Test Mobile Images
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-6xl space-y-6 px-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="rooms" className="gap-2">
              <Bed className="h-4 w-4" /> Rooms
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <ImageIcon className="h-4 w-4" /> Gallery
            </TabsTrigger>
            <TabsTrigger value="backgrounds" className="gap-2">
              <Paintbrush className="h-4 w-4" /> Backgrounds
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <Type className="h-4 w-4" /> Text Content
            </TabsTrigger>
            <TabsTrigger value="wine" className="gap-2">
              <WineIcon className="h-4 w-4" /> Wine
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Settings className="h-4 w-4" /> Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="pt-6">
            {renderRoomsTab()}
          </TabsContent>

          <TabsContent value="gallery" className="pt-6">
            {renderGalleryTab()}
          </TabsContent>

          <TabsContent value="backgrounds" className="pt-6">
            {renderBackgroundTab()}
          </TabsContent>

          <TabsContent value="content" className="pt-6">
            {renderContentTab()}
          </TabsContent>

          <TabsContent value="wine" className="pt-6">
            {renderWineTab()}
          </TabsContent>

          <TabsContent value="events" className="pt-6">
            {renderEventsTab()}
          </TabsContent>

          <TabsContent value="users" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CreateTestUser />
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Authentication Instructions:</h4>
                  <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                    <li>Create a user using the form above</li>
                    <li>Check your email for the confirmation code</li>
                    <li>Once confirmed, use the email/password to sign in</li>
                    <li>After signing in with Cognito, S3 uploads will work properly</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ComprehensiveAdmin;
