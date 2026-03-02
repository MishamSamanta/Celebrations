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
}

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
