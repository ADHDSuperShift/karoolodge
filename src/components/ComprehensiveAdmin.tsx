import React, { useCallback, useEffect, useState } from 'react';
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
import { uploadData, getUrl } from 'aws-amplify/storage';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { cn } from '@/lib/utils';

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

      <div className="aspect-video w-full bg-slate-100">
        <img
          src={image.src}
          alt={image.title}
          className="h-full w-full object-cover"
          onError={(event) => {
            (event.currentTarget as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
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

  const imagePreview = room.images?.[0] ?? '/placeholder.svg';
  const multiLine = (value: string) =>
    value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

  const images = room.images ?? [];

  const handleImageChange = (index: number, value: string) => {
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

const ComprehensiveAdmin: React.FC = () => {
  const {
    rooms,
    updateRooms,
    addRoom,
    deleteRoom,
    galleryImages,
    updateGalleryImages,
    deleteGalleryImage,
    addGalleryImage,
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
  const [activeTab, setActiveTab] = useState<'rooms' | 'gallery' | 'backgrounds' | 'content' | 'wine' | 'events'>('rooms');

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

  // AWS Amplify S3 upload function
  const uploadFileToS3 = useCallback(
    async (file: File, folder: string): Promise<string> => {
      try {
        // Create a unique filename
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
        
        console.log('Uploading to S3:', fileName);
        
        // Upload file to S3 using Amplify Storage
        const result = await uploadData({
          path: fileName,
          data: file,
          options: {
            contentType: file.type,
            onProgress: ({ totalBytes, transferredBytes }) => {
              if (totalBytes) {
                const progress = Math.round((transferredBytes / totalBytes) * 100);
                console.log(`Upload progress: ${progress}%`);
              }
            },
          },
        }).result;

        console.log('Upload successful:', result);
        
        // Get the public URL for the uploaded file
        const urlResult = await getUrl({
          key: fileName,
        });

        const publicUrl = urlResult.url.toString();
        console.log('Public URL:', publicUrl);

        toast({
          title: 'Upload successful',
          description: `${file.name} uploaded successfully`,
        });

        return publicUrl;
      } catch (error) {
        console.error('Upload failed:', error);
        toast({
          title: 'Upload failed',
          description: error instanceof Error ? error.message : 'Failed to upload file',
          variant: 'destructive',
        });
        
        // Return placeholder on error
        return '/placeholder.svg';
      }
    },
    [toast]
  );

  const handleRoomsDragEnd = (event: DragEndEvent) => {
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
          <Button variant="outline" className="gap-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-6xl space-y-6 px-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-6">
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
        </Tabs>
      </main>
    </div>
  );
};

export default ComprehensiveAdmin;
