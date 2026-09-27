import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

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

function stubRawStoredCollection(value: string | null): void {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(() => value),
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

  it("ignores malformed persisted JSON", () => {
    stubRawStoredCollection("not-json");

    const store = useCollectionStore();

    expect(store.collection).toEqual([]);
  });

  it("keeps valid albums when persisted data contains invalid entries", () => {
    stubStoredCollection([albumWithUnknownYear, { ...albumWithUnknownYear, id: "invalid" }]);

    const store = useCollectionStore();

    expect(store.collection).toEqual([albumWithUnknownYear]);
  });

  it("adds an album only once and persists the collection", async () => {
    stubStoredCollection([]);
    const store = useCollectionStore();

    store.addToCollection(albumWithUnknownYear);
    store.addToCollection(albumWithUnknownYear);
    await nextTick();

    expect(store.collection).toEqual([albumWithUnknownYear]);
    expect(store.isInCollection(albumWithUnknownYear.id)).toBe(true);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      "groove-vault:collection:v1",
      JSON.stringify([albumWithUnknownYear]),
    );
  });

  it("removes an album from the collection", async () => {
    stubStoredCollection([albumWithUnknownYear]);
    const store = useCollectionStore();

    store.removeFromCollection(albumWithUnknownYear.id);
    await nextTick();

    expect(store.collection).toEqual([]);
    expect(store.isInCollection(albumWithUnknownYear.id)).toBe(false);
    expect(localStorage.setItem).toHaveBeenLastCalledWith("groove-vault:collection:v1", "[]");
  });
});
