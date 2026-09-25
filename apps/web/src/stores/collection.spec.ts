import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCollectionStore } from "@/stores/collection";
import type { Album } from "@/types/album";

const albumWithUnknownYear: Album = {
  id: 7,
  title: "Álbum sem ano",
  artist: "Artista desconhecido",
  year: null,
  initials: "ASA",
  coverClass: "from-zinc-500 to-zinc-700",
  coverUrl: "https://example.com/cover.jpg",
};

function stubStoredCollection(value: unknown): void {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(() => JSON.stringify(value)),
    setItem: vi.fn(),
  });
}

describe("collection store persistence", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.unstubAllGlobals();
  });

  it("restores albums with a null year and a string cover URL", () => {
    stubStoredCollection([albumWithUnknownYear]);

    const store = useCollectionStore();

    expect(store.collection).toEqual([albumWithUnknownYear]);
  });

  it("restores albums without an optional cover URL", () => {
    const { coverUrl: _coverUrl, ...albumWithoutCoverUrl } = albumWithUnknownYear;
    stubStoredCollection([albumWithoutCoverUrl]);

    const store = useCollectionStore();

    expect(store.collection).toEqual([albumWithoutCoverUrl]);
  });

  it("rejects persisted albums with an invalid cover URL", () => {
    stubStoredCollection([{ ...albumWithUnknownYear, coverUrl: 42 }]);

    const store = useCollectionStore();

    expect(store.collection).toEqual([]);
  });
});
