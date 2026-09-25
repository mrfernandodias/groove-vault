import { describe, expect, it } from "vitest";

import type { DiscogsSearchResultDto } from "./discogs.types";
import { mapDiscogsSearchResultToAlbum } from "./discogsAlbumMapper";

describe("mapDiscogsSearchResultToAlbum", () => {
  it("converte um resultado do Discogs em um Album", () => {
    const dto: DiscogsSearchResultDto = {
      id: 249504,
      type: "master",
      title: "Nirvana - Nevermind",
      year: "1991",
      cover_image: "https://example.com/nevermind.jpg",
      thumb: "https://example.com/nevermind-thumb.jpg",
      resource_url: "https://api.discogs.com/masters/249504",
      uri: "/master/249504-Nirvana-Nevermind",
    };

    expect(mapDiscogsSearchResultToAlbum(dto)).toEqual({
      id: 249504,
      title: "Nevermind",
      artist: "Nirvana",
      year: 1991,
      initials: "N",
      coverClass: "from-violet-500 to-fuchsia-600",
      coverUrl: "https://example.com/nevermind.jpg",
    });
  });

  it("representa a ausência do ano com null", () => {
    const dto: DiscogsSearchResultDto = {
      id: 10,
      type: "release",
      title: "Álbum sem artista informado",
      resource_url: "https://api.discogs.com/releases/10",
      uri: "/release/10",
    };

    const album = mapDiscogsSearchResultToAlbum(dto);

    expect(album?.artist).toBe("Artista desconhecido");
    expect(album?.title).toBe("Álbum sem artista informado");
    expect(album?.year).toBeNull();
    expect(album).not.toHaveProperty("coverUrl");
  });

  it("ignora resultados que não representam álbuns", () => {
    const dto: DiscogsSearchResultDto = {
      id: 20,
      type: "artist",
      title: "Nirvana",
      resource_url: "https://api.discogs.com/artists/20",
      uri: "/artist/20",
    };

    expect(mapDiscogsSearchResultToAlbum(dto)).toBeNull();
  });
});
