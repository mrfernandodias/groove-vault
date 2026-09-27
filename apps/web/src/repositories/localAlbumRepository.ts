import type {
  AlbumRepository,
  AlbumSearchParams,
  AlbumSearchResult,
} from "@/repositories/albumRepository";
import type { Album } from "@/types/album";

const albums: Album[] = [
  {
    id: 1,
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    year: 1973,
    initials: "DS",
    coverClass: "from-indigo-500 to-fuchsia-600",
  },
  {
    id: 2,
    title: "Clube da Esquina",
    artist: "Milton Nascimento & Lô Borges",
    year: 1972,
    initials: "CE",
    coverClass: "from-amber-400 to-orange-600",
  },
  {
    id: 3,
    title: "A Tábua de Esmeralda",
    artist: "Jorge Ben Jor",
    year: 1974,
    initials: "TE",
    coverClass: "from-emerald-400 to-teal-700",
  },
  {
    id: 4,
    title: "In Rainbows",
    artist: "Radiohead",
    year: 2007,
    initials: "IR",
    coverClass: "from-rose-500 to-orange-500",
  },
  {
    id: 5,
    title: "Construção",
    artist: "Chico Buarque",
    year: 1971,
    initials: "CB",
    coverClass: "from-sky-500 to-blue-800",
  },
  {
    id: 6,
    title: "Random Access Memories",
    artist: "Daft Punk",
    year: 2013,
    initials: "RAM",
    coverClass: "from-yellow-300 to-yellow-700",
  },
];

function normalizeSearchText(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");
}

export const localAlbumRepository: AlbumRepository = {
  async search({ query, page = 1, perPage = 12 }: AlbumSearchParams): Promise<AlbumSearchResult> {
    const normalizedQuery = normalizeSearchText(query);

    if (!normalizedQuery) {
      return {
        albums: [],
        page: 1,
        totalPages: 0,
        totalItems: 0,
      };
    }

    const filteredAlbums = albums.filter((album) => {
      const searchableContent = normalizeSearchText(`${album.title} ${album.artist}`);

      return searchableContent.includes(normalizedQuery);
    });

    const safePage = Math.max(1, page);
    const safePerPage = Math.max(1, perPage);
    const startIndex = (safePage - 1) * safePerPage;

    return {
      albums: filteredAlbums.slice(startIndex, startIndex + safePerPage),
      page: safePage,
      totalPages: Math.ceil(filteredAlbums.length / safePerPage),
      totalItems: filteredAlbums.length,
    };
  },

  async findById(albumId: number): Promise<Album | null> {
    return albums.find((album) => album.id === albumId) ?? null;
  },
};
