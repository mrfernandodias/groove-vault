import type {
  DiscogsMasterDto,
  DiscogsSearchResponseDto,
} from "@/integrations/discogs/discogs.types";
import {
  mapDiscogsMasterToAlbum,
  mapDiscogsSearchResultToAlbum,
} from "@/integrations/discogs/discogsAlbumMapper";
import type { Album } from "@/types/album";

import type { AlbumRepository } from "./albumRepository";

const DISCOGS_API_URL = "https://api.discogs.com";

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

    throw new Error(`A API do Discogs respondeu com o status ${response.status}: ${errorBody}`);
  }

  return (await response.json()) as T;
}

export const discogsAlbumRepository: AlbumRepository = {
  async search(query: string): Promise<Album[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    const url = new URL(`${DISCOGS_API_URL}/database/search`);

    url.searchParams.set("q", normalizedQuery);
    url.searchParams.set("type", "master");
    url.searchParams.set("page", "1");
    url.searchParams.set("per_page", "12");

    const response = await requestDiscogs<DiscogsSearchResponseDto>(url);

    return response.results
      .map(mapDiscogsSearchResultToAlbum)
      .filter((album): album is Album => album !== null);
  },

  async findById(id: number): Promise<Album | null> {
    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }

    const response = await requestDiscogs<DiscogsMasterDto>(`${DISCOGS_API_URL}/masters/${id}`);

    return mapDiscogsMasterToAlbum(response);
  },
};
