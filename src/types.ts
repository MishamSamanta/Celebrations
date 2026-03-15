export interface SurpriseData {
  id: string;
  senderName: string;
  receiverName: string;
  relationship: string;
  occasion: string;
  message: string;
  memories: string;
  photos: string[];
  videos: string[];
  voiceMessage?: string;
  music: string;
  theme: string;
  openingText: string;
  finalWish: string;
  password?: string;
  unlockTime?: string;
  oneTimeReveal: boolean;
  view_count?: number;
  virtualGift?: string;
  physicalGifts?: string[];
}

export interface PhysicalGift {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export const PHYSICAL_GIFTS: PhysicalGift[] = [
  {
    id: 'plush-bear',
    name: 'Giant Cuddle Bear',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&q=80&w=400',
    category: 'Plushies',
    description: 'A soft, huggable companion for your special someone.'
  },
  {
    id: 'flower-bouquet',
    name: 'Premium Rose Bouquet',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=400',
    category: 'Flowers',
    description: 'Freshly picked roses delivered in a beautiful wrap.'
  },
  {
    id: 'chocolate-box',
    name: 'Artisan Truffle Box',
    price: 24.50,
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=400',
    category: 'Sweets',
    description: 'Handcrafted chocolates with rich, creamy centers.'
  },
  {
    id: 'scented-candle',
    name: 'Lavender Dream Candle',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=400',
    category: 'Home',
    description: 'Relaxing lavender scent to set a peaceful mood.'
  },
  {
    id: 'instax-camera',
    name: 'Fujifilm Instax Mini',
    price: 79.00,
    image: 'https://images.unsplash.com/photo-1526170315873-3a920f1e8e0d?auto=format&fit=crop&q=80&w=400',
    category: 'Tech',
    description: 'Capture instant memories with this cute polaroid camera.'
  },
  {
    id: 'cozy-blanket',
    name: 'Weighted Throw Blanket',
    price: 55.00,
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&q=80&w=400',
    category: 'Home',
    description: 'The ultimate comfort for chilly nights.'
  }
];

export const OCCASIONS = [
  { id: 'birthday', name: 'Birthday', icon: 'Cake', defaultWish: 'Happy Birthday!' },
  { id: 'anniversary', name: 'Anniversary', icon: 'Heart', defaultWish: 'Happy Anniversary!' },
  { id: 'valentine', name: 'Valentine\'s Day', icon: 'Flame', defaultWish: 'Happy Valentine\'s Day!' },
  { id: 'graduation', name: 'Graduation', icon: 'GraduationCap', defaultWish: 'Congratulations on your Graduation!' },
  { id: 'promotion', name: 'Promotion', icon: 'TrendingUp', defaultWish: 'Congrats on the Promotion!' },
  { id: 'other', name: 'Other Special Moment', icon: 'Star', defaultWish: 'Celebrating You!' },
];

export const THEMES = [
  { id: 'classic', name: 'Royal Purple', primary: '#D946EF' },
  { id: 'romantic', name: 'Romantic Glow', primary: '#EC4899' },
  { id: 'elegant', name: 'Deep Violet', primary: '#8B5CF6' },
  { id: 'vibrant', name: 'Soft Orchid', primary: '#C084FC' },
];

export const MUSIC_OPTIONS = [
  { id: 'happy-birthday', name: 'Happy Birthday (Classic)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'lofi', name: 'Chill Lofi', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'celebration', name: 'Upbeat Celebration', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export const VIRTUAL_GIFTS = [
  { id: 'flowers', name: 'Bouquet of Flowers', icon: 'Flower2' },
  { id: 'chocolates', name: 'Box of Chocolates', icon: 'Candy' },
  { id: 'trophy', name: 'Golden Trophy', icon: 'Trophy' },
  { id: 'ring', name: 'Diamond Ring', icon: 'Gem' },
  { id: 'bear', name: 'Teddy Bear', icon: 'Baby' },
  { id: 'cake', name: 'Celebration Cake', icon: 'CakeSlice' },
];
