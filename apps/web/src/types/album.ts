export interface Album {
  id: number;
  title: string;
  artist: string;
  year: number | null;
  initials: string;
  coverClass: string;
  coverUrl?: string;
}
