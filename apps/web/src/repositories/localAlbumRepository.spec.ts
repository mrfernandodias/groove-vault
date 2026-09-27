import { describe, expect, it } from "vitest";

import { localAlbumRepository } from "@/repositories/localAlbumRepository";

describe("localAlbumRepository", () => {
  it("searches an album by title ignoring letter case", async () => {
    const result = await localAlbumRepository.search({ query: "DARK SIDE" });

    expect(result.albums).toHaveLength(1);
    expect(result.albums[0]?.title).toBe("The Dark Side of the Moon");
    expect(result).toMatchObject({ page: 1, totalPages: 1, totalItems: 1 });
  });

  it("searches albums by artist", async () => {
    const result = await localAlbumRepository.search({ query: "milton" });

    expect(result.albums).toHaveLength(1);
    expect(result.albums[0]?.title).toBe("Clube da Esquina");
  });

  it("returns an empty paginated result when no album matches", async () => {
    const result = await localAlbumRepository.search({ query: "álbum inexistente" });

    expect(result).toEqual({ albums: [], page: 1, totalPages: 0, totalItems: 0 });
  });

  it("returns an empty paginated result when the search term is blank", async () => {
    const result = await localAlbumRepository.search({ query: "   " });

    expect(result).toEqual({ albums: [], page: 1, totalPages: 0, totalItems: 0 });
  });

  it("searches ignoring accents", async () => {
    const result = await localAlbumRepository.search({ query: "tabua" });

    expect(result.albums).toHaveLength(1);
    expect(result.albums[0]?.title).toBe("A Tábua de Esmeralda");
  });

  it("searches ignoring cedillas and accents", async () => {
    const result = await localAlbumRepository.search({ query: "construcao" });

    expect(result.albums).toHaveLength(1);
    expect(result.albums[0]?.title).toBe("Construção");
  });

  it("paginates matching albums and reports the full result count", async () => {
    const result = await localAlbumRepository.search({ query: "a", page: 2, perPage: 2 });

    expect(result.albums.map((album) => album.id)).toEqual([3, 4]);
    expect(result).toMatchObject({ page: 2, totalPages: 3, totalItems: 6 });
  });

  it("normalizes invalid pagination values", async () => {
    const result = await localAlbumRepository.search({ query: "pink", page: 0, perPage: 0 });

    expect(result.albums).toHaveLength(1);
    expect(result).toMatchObject({ page: 1, totalPages: 1, totalItems: 1 });
  });

  it("finds an album by its ID", async () => {
    const album = await localAlbumRepository.findById(4);

    expect(album).toBeDefined();
    expect(album?.title).toBe("In Rainbows");
  });

  it("returns null when an album with the given ID does not exist", async () => {
    const album = await localAlbumRepository.findById(999);

    expect(album).toBeNull();
  });
});
