import type { Album } from "@/types/album";

export interface AlbumRepository {
  search(term: string): Promise<Album[]>;
  findById(albumId: number): Promise<Album | null>;
}
