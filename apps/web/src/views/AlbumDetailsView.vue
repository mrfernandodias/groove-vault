<script setup lang="ts">
import { ref, watch } from "vue";
import { RouterLink } from "vue-router";

import { albumRepository } from "@/config/dependencies";
import { useCollectionStore } from "@/stores/collection";
import type { Album } from "@/types/album";

const props = defineProps<{
  albumId: string;
}>();

const collectionStore = useCollectionStore();

const album = ref<Album | null>(null);
const isLoading = ref(false);
const isNotFound = ref(false);
const loadError = ref("");

async function loadAlbum(albumIdParam: string): Promise<void> {
  album.value = null;
  isLoading.value = false;
  isNotFound.value = false;
  loadError.value = "";

  const parsedAlbumId = Number(albumIdParam);

  if (!Number.isInteger(parsedAlbumId) || parsedAlbumId <= 0) {
    isNotFound.value = true;
    return;
  }

  isLoading.value = true;

  try {
    const foundAlbum = await albumRepository.findById(parsedAlbumId);

    if (!foundAlbum) {
      isNotFound.value = true;
      return;
    }

    album.value = foundAlbum;
  } catch {
    loadError.value = "Não foi possível carregar os detalhes do álbum.";
  } finally {
    isLoading.value = false;
  }
}

function toggleCollection(): void {
  if (!album.value) {
    return;
  }

  if (collectionStore.isInCollection(album.value.id)) {
    collectionStore.removeFromCollection(album.value.id);
    return;
  }

  collectionStore.addToCollection(album.value);
}

watch(
  () => props.albumId,
  (newAlbumId) => {
    void loadAlbum(newAlbumId);
  },
  { immediate: true },
);
</script>

<template>
  <main
    class="relative min-h-screen overflow-hidden bg-zinc-950 px-6 py-10 text-zinc-100 sm:px-8 lg:px-12"
  >
    <div
      class="pointer-events-none absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/15 blur-3xl"
    ></div>

    <section class="relative mx-auto w-full max-w-6xl">
      <header class="flex items-center justify-between">
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-xl bg-violet-500 font-black text-white"
          >
            G
          </div>

          <div>
            <p class="font-semibold text-white">GrooveVault</p>
            <p class="text-xs text-zinc-500">Memórias musicais</p>
          </div>
        </RouterLink>

        <RouterLink
          :to="{ name: 'home' }"
          class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>

          Voltar
        </RouterLink>
      </header>

      <section
        v-if="isLoading"
        class="mt-16 flex min-h-96 items-center justify-center rounded-3xl border border-white/10 bg-white/5"
        role="status"
      >
        <div class="flex items-center gap-3 text-zinc-400">
          <svg
            class="size-5 animate-spin text-violet-400"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              stroke-width="3"
            />

            <path
              class="opacity-75"
              fill="currentColor"
              d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3Z"
            />
          </svg>

          Carregando álbum...
        </div>
      </section>

      <section
        v-else-if="loadError"
        class="mt-16 rounded-3xl border border-red-400/20 bg-red-400/10 px-8 py-16 text-center"
        role="alert"
      >
        <h1 class="text-xl font-semibold text-red-300">Não foi possível carregar o álbum</h1>

        <p class="mt-2 text-sm text-red-200/60">
          {{ loadError }}
        </p>
      </section>

      <section
        v-else-if="isNotFound"
        class="mt-16 rounded-3xl border border-dashed border-white/10 bg-white/3 px-8 py-16 text-center"
      >
        <p class="text-sm font-medium text-violet-400">Erro 404</p>

        <h1 class="mt-2 text-3xl font-bold text-white">Álbum não encontrado</h1>

        <p class="mx-auto mt-3 max-w-md text-zinc-500">
          O álbum solicitado não existe ou o endereço está incorreto.
        </p>

        <RouterLink
          :to="{ name: 'home' }"
          class="mt-6 inline-flex rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
        >
          Voltar para a pesquisa
        </RouterLink>
      </section>

      <section
        v-else-if="album"
        class="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center"
      >
        <div
          class="flex aspect-square items-center justify-center rounded-3xl bg-linear-to-br text-7xl font-black text-white shadow-2xl shadow-violet-950/40"
          :class="album.coverClass"
        >
          {{ album.initials }}
        </div>

        <div>
          <p class="text-sm font-semibold text-violet-400">
            {{ album.year }}
          </p>

          <h1 class="mt-3 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {{ album.title }}
          </h1>

          <p class="mt-4 text-xl text-zinc-400">
            {{ album.artist }}
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              class="rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
              :class="
                collectionStore.isInCollection(album.id)
                  ? 'border border-red-400/20 bg-red-400/10 text-red-300 hover:bg-red-400/20'
                  : 'bg-violet-500 text-white hover:bg-violet-400'
              "
              @click="toggleCollection"
            >
              {{
                collectionStore.isInCollection(album.id)
                  ? "Remover da coleção"
                  : "Adicionar à coleção"
              }}
            </button>

            <RouterLink
              :to="{ name: 'collection' }"
              class="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              Ver minha coleção
            </RouterLink>
          </div>

          <div class="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p class="text-sm font-medium text-zinc-300">
              A história deste álbum ainda não começou.
            </p>

            <p class="mt-2 text-sm leading-6 text-zinc-500">
              Futuramente este espaço mostrará edição, formato, condição, sessões de escuta e
              memórias relacionadas à sua cópia.
            </p>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>
