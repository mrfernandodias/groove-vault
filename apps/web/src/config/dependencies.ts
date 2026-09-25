import type { AlbumRepository } from "@/repositories/albumRepository";
import { localAlbumRepository } from "@/repositories/localAlbumRepository";

export const albumRepository: AlbumRepository = localAlbumRepository;
