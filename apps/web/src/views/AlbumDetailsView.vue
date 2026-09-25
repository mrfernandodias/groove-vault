<script setup lang="ts">
import { ref } from "vue";

import { useCollectionStore } from "@/stores/collection";
import type { Album } from "@/types/album";

const props = defineProps<{
  albumId: number;
}>();

const collectionStore = useCollectionStore();

const album = ref<Album | null>(null);
const isLoading = ref(false);
const isNotFound = ref(false);
const loadError = ref("");

async function loadAlbumDetails(albumIdParam: string): Promise<void> {
  album.value = null;
  isNotFound.value = false;
  loadError.value = "";

  const parsedAlbumId = Number(albumIdParam);

  if (!Number.isInteger(parsedAlbumId) || parsedAlbumId <= 0) {
    isNotFound.value = true;
    return;
  }

  isLoading.value = true;
}
</script>

<template>
  <div class="component"></div>
</template>

<style scoped></style>
