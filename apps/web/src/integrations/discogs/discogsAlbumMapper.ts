import type {
  DiscogsMasterDto,
  DiscogsSearchResultDto,
} from "@/integrations/discogs/discogs.types";
import type { Album } from "@/types/album";

const FALLBACK_COVER_CLASS = "from-violet-500 to-fuchsia-600";

interface ParsedDiscogsTitle {
  artist: string;
  title: string;
}

function parseDiscogsTitle(value: string): ParsedDiscogsTitle {
  const [artist, ...titleParts] = value.split(" - ");

  if (!artist || titleParts.length === 0) {
    return {
      artist: "Artista desconhecido",
      title: value.trim(),
    };
  }

  return {
    artist: artist.trim(),
    title: titleParts.join(" - ").trim(),
  };
}

function createInitials(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word.charAt(0))
    .join("")
    .toLocaleUpperCase("pt-BR");
}

function parseYear(year: number | string | undefined): number | null {
  if (year === undefined) {
    return null;
  }

  const parsedYear = typeof year === "number" ? year : Number.parseInt(year, 10);

  if (!Number.isInteger(parsedYear) || parsedYear <= 0) {
    return null;
  }

  return parsedYear;
}

export function mapDiscogsSearchResultToAlbum(dto: DiscogsSearchResultDto): Album | null {
  if (dto.type !== "master" && dto.type !== "release") {
    return null;
  }

  const { artist, title } = parseDiscogsTitle(dto.title);
  const coverUrl = dto.cover_image?.trim() || dto.thumb?.trim();

  const album: Album = {
    id: dto.id,
    title,
    artist,
    year: parseYear(dto.year),
    initials: createInitials(title),
    coverClass: FALLBACK_COVER_CLASS,
  };

  if (coverUrl) {
    album.coverUrl = coverUrl;
  }

  return album;
}

export function mapDiscogsMasterToAlbum(dto: DiscogsMasterDto): Album {
  const artist =
    dto.artists
      .map((discogsArtist) => discogsArtist.name.trim())
      .filter(Boolean)
      .join(", ") || "Artista desconhecido";

  const primaryImage = dto.images?.find((image) => image.type === "primary");
  const coverUrl = primaryImage?.uri || dto.images?.[0]?.uri;

  const album: Album = {
    id: dto.id,
    title: dto.title.trim(),
    artist,
    year: parseYear(dto.year),
    initials: createInitials(dto.title),
    coverClass: FALLBACK_COVER_CLASS,
  };

  if (coverUrl) {
    album.coverUrl = coverUrl;
  }

  return album;
}
