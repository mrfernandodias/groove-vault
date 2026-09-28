import type {
  DiscogsMasterDto,
  DiscogsSearchResponseDto,
} from "@/integrations/discogs/discogs.types";
import {
  mapDiscogsMasterToAlbum,
  mapDiscogsSearchResultToAlbum,
} from "@/integrations/discogs/discogsAlbumMapper";
import type { Album } from "@/types/album";

import type { AlbumRepository, AlbumSearchParams, AlbumSearchResult } from "./albumRepository";

const DISCOGS_API_URL = "https://api.discogs.com";

class DiscogsApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);

    this.name = "DiscogsApiError";
    this.status = status;
  }
}

function getDiscogsAuthorizationHeader(): string {
  const key = import.meta.env.VITE_DISCOGS_CONSUMER_KEY?.trim();

  const secret = import.meta.env.VITE_DISCOGS_CONSUMER_SECRET?.trim();

  if (!key || !secret) {
    throw new Error("As credenciais do Discogs não foram configuradas.");
  }

  return `Discogs key=${key}, secret=${secret}`;
}

async function requestDiscogs<T>(url: URL | string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.discogs.v2.discogs+json",
      Authorization: getDiscogsAuthorizationHeader(),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new DiscogsApiError(
      404,
      `A API do Discogs respondeu com o status ${response.status}: ${errorBody}`,
    );
  }

  return (await response.json()) as T;
}

export const discogsAlbumRepository: AlbumRepository = {
  async search({ query, page = 1, perPage = 12 }: AlbumSearchParams): Promise<AlbumSearchResult> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return {
        albums: [],
        page: 1,
        totalPages: 0,
        totalItems: 0,
      };
    }

    const safePage = Math.max(1, page);
    const safePerPage = Math.min(50, Math.max(1, perPage));

    const url = new URL(`${DISCOGS_API_URL}/database/search`);

    url.searchParams.set("q", normalizedQuery);
    url.searchParams.set("type", "master");
    url.searchParams.set("page", String(safePage));
    url.searchParams.set("per_page", String(safePerPage));

    const response = await requestDiscogs<DiscogsSearchResponseDto>(url);

    const albums = response.results
      .map(mapDiscogsSearchResultToAlbum)
      .filter((album): album is Album => album !== null);

    return {
      albums,
      page: response.pagination.page,
      totalPages: response.pagination.pages,
      totalItems: response.pagination.items,
    };
  },

  async findById(id: number): Promise<Album | null> {
    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }

    try {
      const response = await requestDiscogs<DiscogsMasterDto>(`${DISCOGS_API_URL}/masters/${id}`);

      return mapDiscogsMasterToAlbum(response);
    } catch (error: unknown) {
      if (error instanceof DiscogsApiError && error.status === 404) {
        return null;
      }

      throw error;
    }
  },
};
