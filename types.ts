
export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: 'exterior' | 'interior' | 'dining' | 'nature';
  roomTag?: 'emerald' | 'canopy' | 'mist' | 'none';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
