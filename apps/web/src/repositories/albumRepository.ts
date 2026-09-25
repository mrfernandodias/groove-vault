import type { Album } from "@/types/album";

export interface AlbumRepository {
  search(term: string): Promise<Album[]>;
  findById(albumId: number): Promise<Album | null | undefined>;
}

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

export const localAlbumRepository: AlbumRepository = {
  async search(term: string): Promise<Album[]> {
    const normalizedTerm = normalizeSearchText(term);

    if (!normalizedTerm) {
      return [];
    }

    return albums.filter((album) => {
      const searchableContent = normalizeSearchText(`${album.title} ${album.artist}`);

      return searchableContent.includes(normalizedTerm);
    });
  },

  async findById(albumId: number): Promise<Album | null | undefined> {
    return albums.find((album) => album.id === albumId) ?? null;
  },
};

function normalizeSearchText(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");
}
