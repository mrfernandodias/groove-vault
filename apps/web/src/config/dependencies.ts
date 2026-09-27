import type { AlbumRepository } from "@/repositories/albumRepository";
import { discogsAlbumRepository } from "@/repositories/discogsAlbumRepository";

export const albumRepository: AlbumRepository = discogsAlbumRepository;
