<script setup lang="ts">
import { computed, ref } from "vue";

import AlbumCard from "@/components/AlbumCard.vue";
import type { Album } from "@/types/album";

const searchTerm = ref("");
const submittedTerm = ref("");
const collection = ref<Album[]>([]);

const albums: Album[] = [
  {
    id: 1,
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    year: 1973,
    initials: "DS",
    coverClass: "from-indigo-500 to-fuchsia-600",
  },
  {
    id: 2,
    title: "Clube da Esquina",
    artist: "Milton Nascimento & Lô Borges",
    year: 1972,
    initials: "CE",
    coverClass: "from-amber-400 to-orange-600",
  },
  {
    id: 3,
    title: "A Tábua de Esmeralda",
    artist: "Jorge Ben Jor",
    year: 1974,
    initials: "TE",
    coverClass: "from-emerald-400 to-teal-700",
  },
  {
    id: 4,
    title: "In Rainbows",
    artist: "Radiohead",
    year: 2007,
    initials: "IR",
    coverClass: "from-rose-500 to-orange-500",
  },
  {
    id: 5,
    title: "Construção",
    artist: "Chico Buarque",
    year: 1971,
    initials: "CB",
    coverClass: "from-sky-500 to-blue-800",
  },
  {
    id: 6,
    title: "Random Access Memories",
    artist: "Daft Punk",
    year: 2013,
    initials: "RAM",
    coverClass: "from-yellow-300 to-yellow-700",
  },
];

const filteredAlbums = computed(() => {
  if (!submittedTerm.value) {
    return [];
  }

  const normalizedTerm = submittedTerm.value.toLocaleLowerCase("pt-BR");

  return albums.filter((album) => {
    const searchableContent = `${album.title} ${album.artist}`.toLocaleLowerCase("pt-BR");

    return searchableContent.includes(normalizedTerm);
  });
});

function handleSearch() {
  submittedTerm.value = searchTerm.value.trim();
}

function isInCollection(albumId: number): boolean {
  return collection.value.some((album) => album.id === albumId);
}

function addToCollection(album: Album): void {
  if (isInCollection(album.id)) {
    return;
  }

  collection.value.push(album);
}
</script>

<template>
  <main
    class="relative min-h-screen overflow-x-hidden bg-zinc-950 px-6 py-16 text-zinc-100 sm:py-24"
  >
    <div
      class="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl"
    ></div>

    <section class="relative mx-auto w-full max-w-5xl text-center">
      <span
        class="inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-1.5 text-sm font-medium text-violet-300"
      >
        Sua coleção, suas histórias
      </span>

      <h1 class="mt-6 text-5xl font-bold tracking-tight sm:text-7xl">
        Encontre o próximo capítulo da sua
        <span class="text-violet-400">memória musical.</span>
      </h1>

      <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
        Pesquise discos, organize sua coleção e registre as experiências que cada álbum deixou.
      </p>

      <form class="mx-auto mt-10 max-w-2xl text-left" @submit.prevent="handleSearch">
        <label for="album-search" class="sr-only"> Pesquisar álbuns ou artistas </label>

        <div
          class="flex items-center rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-violet-950/30 backdrop-blur"
        >
          <svg
            class="ml-3 size-5 shrink-0 text-zinc-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            id="album-search"
            v-model="searchTerm"
            type="search"
            placeholder="Busque por álbum ou artista..."
            class="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-white outline-none placeholder:text-zinc-600"
          />

          <button
            type="submit"
            class="rounded-xl bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          >
            Pesquisar
          </button>
        </div>

        <p v-if="submittedTerm" class="mt-4 text-sm text-zinc-500">
          Pesquisando por:
          <strong class="font-medium text-violet-300">
            {{ submittedTerm }}
          </strong>
        </p>
      </form>

      <section v-if="submittedTerm" class="mt-10 text-left">
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-violet-300">Resultados</p>

            <h2 class="mt-1 text-2xl font-semibold text-white">
              {{ filteredAlbums.length }}
              {{ filteredAlbums.length === 1 ? "álbum encontrado" : "álbuns encontrados" }}
            </h2>
          </div>
          <span
            class="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-400"
          >
            {{ collection.length }}
            {{ collection.length === 1 ? "álbum na coleção" : "álbuns na coleção" }}
          </span>
        </div>

        <div v-if="filteredAlbums.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AlbumCard
            v-for="album in filteredAlbums"
            :key="album.id"
            :album="album"
            :is-in-collection="isInCollection(album.id)"
            @add-to-collection="addToCollection"
          />
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-white/10 bg-white/3 px-6 py-12 text-center"
        >
          <p class="font-medium text-zinc-300">Nenhum álbum encontrado</p>

          <p class="mt-2 text-sm text-zinc-500">Tente pesquisar por outro álbum ou artista.</p>
        </div>
      </section>
    </section>
  </main>
</template>
