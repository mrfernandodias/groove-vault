import type { Album } from "@/types/album";

export interface AlbumSearchParams {
  query: string;
  page?: number;
  perPage?: number;
}

export interface AlbumSearchResult {
  albums: Album[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface AlbumRepository {
  search(params: AlbumSearchParams): Promise<AlbumSearchResult>;
  findById(id: number): Promise<Album | null>;
}
