<script setup lang="ts">
import { computed, ref, watch } from "vue";

import type { Album } from "@/types/album";

const props = withDefaults(
  defineProps<{
    album: Album;
    eager?: boolean;
  }>(),
  {
    eager: false,
  },
);

const imageHasLoaded = ref(false);
const imageHasFailed = ref(false);

const imageUrl = computed(() => {
  const coverUrl = props.album.coverUrl?.trim();

  if (!coverUrl || imageHasFailed.value) {
    return null;
  }

  return coverUrl;
});

watch(
  () => props.album.coverUrl,
  () => {
    imageHasFailed.value = false;
    imageHasLoaded.value = false;
  },
);

function handleImageLoad(): void {
  imageHasLoaded.value = true;
}

function handleImageError(): void {
  imageHasLoaded.value = false;
  imageHasFailed.value = true;
}
</script>

<template>
  <div
    role="image"
    :aria-label="`Capa do album ${album.title} de ${album.artist}`"
    class="relative isolate overflow-hidden bg-zinc-900"
  >
    <div
      class="absolute inset-0 flex items-center justify-center bg-linear-to-br text-3xl font-black text-white"
      :class="album.coverClass"
    >
      <span aria-hidden="true">
        {{ album.initials }}
      </span>
    </div>

    <img
      v-if="imageUrl"
      :src="imageUrl"
      alt=""
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      class="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
      :class="imageHasLoaded ? 'opacity-100' : 'scale-105 opacity-0'"
      @load="handleImageLoad"
      @error="handleImageError"
    />
  </div>
</template>

<style scoped></style>
