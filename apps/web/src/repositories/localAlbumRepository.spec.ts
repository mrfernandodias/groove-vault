import { describe, expect, it } from "vitest";

import { localAlbumRepository } from "@/repositories/localAlbumRepository";

describe("localAlbumRepository", () => {
  it("searches an album by title ignoring letter case", async () => {
    const results = await localAlbumRepository.search("dark side");

    expect(results).toHaveLength(1);
    expect(results[0]?.title).toBe("The Dark Side of the Moon");
  });

  it("searches albums by artist", async () => {
    const results = await localAlbumRepository.search("milton");

    expect(results).toHaveLength(1);
    expect(results[0]?.title).toBe("Clube da Esquina");
  });

  it("returns an empty array when no album matches", async () => {
    const results = await localAlbumRepository.search("álbum inexistente");

    expect(results).toEqual([]);
  });

  it("returns an empty array when the search term is empty", async () => {
    const results = await localAlbumRepository.search("");

    expect(results).toEqual([]);
  });

  it("searches ignoring accents", async () => {
    const results = await localAlbumRepository.search("tabua");

    expect(results).toHaveLength(1);
    expect(results[0]?.title).toBe("A Tábua de Esmeralda");
  });

  it("searches ignoring cedillas and accents", async () => {
    const results = await localAlbumRepository.search("construcao");

    expect(results).toHaveLength(1);
    expect(results[0]?.title).toBe("Construção");
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
