import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { discogsAlbumRepository } from "@/repositories/discogsAlbumRepository";

const fetchMock = vi.fn<typeof fetch>();

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("discogsAlbumRepository", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_DISCOGS_CONSUMER_KEY", "consumer-key");
    vi.stubEnv("VITE_DISCOGS_CONSUMER_SECRET", "consumer-secret");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("does not request the API for a blank search", async () => {
    const result = await discogsAlbumRepository.search({ query: "   " });

    expect(result).toEqual({ albums: [], page: 1, totalPages: 0, totalItems: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("searches masters with normalized pagination and maps valid albums", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        pagination: { page: 1, pages: 3, per_page: 50, items: 101 },
        results: [
          {
            id: 13814,
            type: "master",
            title: "Nirvana - Nevermind",
            year: "1991",
            cover_image: "https://example.com/nevermind.jpg",
            resource_url: "https://api.discogs.com/masters/13814",
            uri: "/master/13814-Nirvana-Nevermind",
          },
          {
            id: 125246,
            type: "artist",
            title: "Nirvana",
            resource_url: "https://api.discogs.com/artists/125246",
            uri: "/artist/125246-Nirvana",
          },
        ],
      }),
    );

    const result = await discogsAlbumRepository.search({
      query: "  Nevermind  ",
      page: 0,
      perPage: 100,
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [requestUrl, requestInit] = fetchMock.mock.calls[0] ?? [];
    const url = new URL(String(requestUrl));

    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      q: "Nevermind",
      type: "master",
      page: "1",
      per_page: "50",
    });
    expect(requestInit?.headers).toMatchObject({
      Accept: "application/vnd.discogs.v2.discogs+json",
      Authorization: "Discogs key=consumer-key, secret=consumer-secret",
    });
    expect(result.albums).toHaveLength(1);
    expect(result.albums[0]).toMatchObject({
      id: 13814,
      title: "Nevermind",
      artist: "Nirvana",
    });
    expect(result).toMatchObject({ page: 1, totalPages: 3, totalItems: 101 });
  });

  it("reports a helpful error when credentials are missing", async () => {
    vi.stubEnv("VITE_DISCOGS_CONSUMER_KEY", "");

    await expect(discogsAlbumRepository.search({ query: "Nevermind" })).rejects.toThrow(
      "As credenciais do Discogs não foram configuradas.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("includes the API status and body in request errors", async () => {
    fetchMock.mockResolvedValue(new Response('{"message":"Unauthorized"}', { status: 401 }));

    await expect(discogsAlbumRepository.search({ query: "Nevermind" })).rejects.toThrow(
      'A API do Discogs respondeu com o status 401: {"message":"Unauthorized"}',
    );
  });

  it("does not request an invalid album ID", async () => {
    await expect(discogsAlbumRepository.findById(0)).resolves.toBeNull();
    await expect(discogsAlbumRepository.findById(1.5)).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns null when the Discogs master does not exist", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          message: "Master not foud.",
        },
        404,
      ),
    );

    await expect(discogsAlbumRepository.findById(999999)).resolves.toBeNull();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.discogs.com/masters/999999",
      expect.any(Object),
    );
  });

  it("finds and maps a master by ID", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        id: 13814,
        title: "Nevermind",
        year: 1991,
        artists: [
          { id: 125246, name: "Nirvana", resource_url: "https://api.discogs.com/artists/125246" },
        ],
        images: [
          {
            type: "primary",
            uri: "https://example.com/cover.jpg",
            uri150: "https://example.com/cover-small.jpg",
            resource_url: "https://api.discogs.com/images/1",
            width: 600,
            height: 600,
          },
        ],
        resource_url: "https://api.discogs.com/masters/13814",
        uri: "/master/13814-Nirvana-Nevermind",
      }),
    );

    await expect(discogsAlbumRepository.findById(13814)).resolves.toMatchObject({
      id: 13814,
      title: "Nevermind",
      artist: "Nirvana",
      year: 1991,
      coverUrl: "https://example.com/cover.jpg",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.discogs.com/masters/13814",
      expect.any(Object),
    );
  });
});
