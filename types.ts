
export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: 'exterior' | 'interior' | 'dining' | 'nature';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
