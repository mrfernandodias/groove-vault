import { defineStore } from "pinia";
import { ref, watch } from "vue";

import type { Album } from "@/types/album";

const COLLECTION_STORAGE_KEY = "groove-vault:collection:v1";

function isAlbum(value: unknown): value is Album {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const album = value as Record<string, unknown>;

  return (
    typeof album.id === "number" &&
    typeof album.title === "string" &&
    typeof album.artist === "string" &&
    typeof album.year === "number" &&
    typeof album.initials === "string" &&
    typeof album.coverClass === "string"
  );
}

function loadCollection(): Album[] {
  try {
    const storedCollection = localStorage.getItem(COLLECTION_STORAGE_KEY);

    if (!storedCollection) {
      return [];
    }

    const parsedCollection: unknown = JSON.parse(storedCollection);

    if (!Array.isArray(parsedCollection)) {
      return [];
    }

    return parsedCollection.filter(isAlbum);
  } catch {
    return [];
  }
}

export const useCollectionStore = defineStore("collection", () => {
  const collection = ref<Album[]>(loadCollection());

  watch(
    collection,
    (newCollection) => {
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(newCollection));
    },
    { deep: true },
  );

  function isInCollection(albumId: number): boolean {
    return collection.value.some((album) => album.id === albumId);
  }

  function addToCollection(album: Album): void {
    if (isInCollection(album.id)) {
      return;
    }

    collection.value.push(album);
  }

  function removeFromCollection(albumId: number): void {
    collection.value = collection.value.filter((album) => album.id !== albumId);
  }

  return {
    collection,
    isInCollection,
    addToCollection,
    removeFromCollection,
  };
});
