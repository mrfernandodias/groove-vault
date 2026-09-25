<script setup lang="ts">
import { RouterLink } from "vue-router";

import { useCollectionStore } from "@/stores/collection";

const collectionStore = useCollectionStore();
</script>

<template>
  <main
    class="relative min-h-screen overflow-hidden bg-zinc-950 px-6 py-10 text-zinc-100 sm:px-8 lg:px-12"
  >
    <div
      class="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl"
    ></div>

    <div
      class="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-3xl"
    ></div>

    <section class="relative mx-auto w-full max-w-7xl">
      <header
        class="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-3 text-left">
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
          class="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-violet-400/30 hover:bg-white/10 hover:text-white sm:self-auto"
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

          Voltar para a pesquisa
        </RouterLink>
      </header>

      <div class="mt-12">
        <p class="text-sm font-semibold text-violet-400">Acervo pessoal</p>

        <div class="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">Minha coleção</h1>

            <p class="mt-3 max-w-2xl text-zinc-400">
              Os discos que fazem parte da sua história musical.
            </p>
          </div>

          <span
            class="w-fit rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-300"
          >
            {{ collectionStore.collection.length }}
            {{ collectionStore.collection.length === 1 ? "álbum" : "álbuns" }}
          </span>
        </div>
      </div>

      <section class="mt-10">
        <div
          v-if="collectionStore.collection.length"
          class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <article
            v-for="album in collectionStore.collection"
            :key="album.id"
            class="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/10"
          >
            <div
              class="flex aspect-square items-center justify-center rounded-xl bg-linear-to-br text-3xl font-black text-white shadow-lg"
              :class="album.coverClass"
            >
              {{ album.initials }}
            </div>

            <div class="flex items-end gap-4 px-1 pt-4 pb-2">
              <div class="min-w-0 flex-1">
                <h2 class="truncate text-lg font-semibold text-white">
                  {{ album.title }}
                </h2>

                <p class="mt-1 truncate text-sm text-zinc-400">
                  {{ album.artist }}
                </p>

                <p class="mt-3 text-xs font-medium tracking-wider text-zinc-500 uppercase">
                  {{ album.year }}
                </p>
              </div>

              <button
                type="button"
                class="rounded-xl p-2 text-zinc-500 transition hover:bg-red-400/10 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                :aria-label="`Remover ${album.title} da coleção`"
                @click="collectionStore.removeFromCollection(album.id)"
              >
                <svg
                  class="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
                </svg>
              </button>
            </div>
          </article>
        </div>

        <div
          v-else
          class="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/3 px-6 py-16 text-center"
        >
          <div class="flex size-16 items-center justify-center rounded-2xl bg-violet-400/10">
            <svg
              class="size-8 text-violet-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="2" />
              <path d="M12 3v7" />
            </svg>
          </div>

          <h2 class="mt-6 text-xl font-semibold text-white">Sua coleção está vazia</h2>

          <p class="mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Pesquise um álbum e adicione a primeira memória musical ao seu acervo.
          </p>

          <RouterLink
            :to="{ name: 'home' }"
            class="mt-6 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
          >
            Pesquisar álbuns
          </RouterLink>
        </div>
      </section>
    </section>
  </main>
</template>
