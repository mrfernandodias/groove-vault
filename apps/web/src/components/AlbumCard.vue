<script setup lang="ts">
import { RouterLink } from "vue-router";

import type { Album } from "@/types/album";

defineProps<{
  album: Album;
  isInCollection: boolean;
}>();

const emit = defineEmits<{
  "add-to-collection": [album: Album];
}>();
</script>

<template>
  <article
    class="group rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/10"
  >
    <div
      class="flex aspect-square items-center justify-center rounded-xl bg-linear-to-br text-3xl font-black text-white shadow-lg"
      :class="album.coverClass"
    >
      {{ album.initials }}
    </div>

    <div class="px-1 pt-4 pb-2">
      <h3 class="truncate text-lg font-semibold text-white">
        {{ album.title }}
      </h3>

      <p class="mt-1 truncate text-sm text-zinc-400">
        {{ album.artist }}
      </p>

      <p class="mt-3 text-xs font-medium tracking-wider text-zinc-500 uppercase">
        {{ album.year }}
      </p>

      <RouterLink
        :to="{
          name: 'album-details',
          params: {
            albumId: album.id,
          },
        }"
        class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-400 transition hover:text-violet-300"
      >
        Ver detalhes

        <svg
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </RouterLink>

      <button
        type="button"
        :disabled="isInCollection"
        class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-default disabled:bg-emerald-400/10 disabled:text-emerald-300"
        @click="emit('add-to-collection', album)"
      >
        <svg
          v-if="isInCollection"
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>

        <svg
          v-else
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        {{ isInCollection ? "Na coleção" : "Adicionar à coleção" }}
      </button>
    </div>
  </article>
</template>
