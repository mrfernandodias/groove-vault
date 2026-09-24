<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

import type { Album } from "@/types/album";

const props = defineProps<{
  isOpen: boolean;
  albums: Album[];
}>();

const emit = defineEmits<{
  close: [];
  "remove-album": [albumId: number];
}>();

const closeButton = ref<HTMLButtonElement | null>(null);
const drawerPanel = ref<HTMLElement | null>(null);

const focusableElementSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

let previouslyFocusedElement: HTMLElement | null = null;
let previousBodyOverflow = "";

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    emit("close");
    return;
  }

  if (event.key !== "Tab" || !props.isOpen) {
    return;
  }

  const focusableElements = getFocusableElements();

  if (!focusableElements.length) {
    event.preventDefault();
    drawerPanel.value?.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault();
    lastElement?.focus();
    return;
  }

  if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement?.focus();
  }
}

function cleanupDrawerEffects(): void {
  document.body.style.overflow = previousBodyOverflow;
  window.removeEventListener("keydown", handleKeydown);
}

function getFocusableElements(): HTMLElement[] {
  if (!drawerPanel.value) {
    return [];
  }

  return Array.from(drawerPanel.value.querySelectorAll<HTMLElement>(focusableElementSelector));
}

watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocusedElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      window.addEventListener("keydown", handleKeydown);

      await nextTick();
      closeButton.value?.focus();

      return;
    }

    cleanupDrawerEffects();

    previouslyFocusedElement?.focus();
    previouslyFocusedElement = null;
  },
);

onBeforeUnmount(() => {
  cleanupDrawerEffects();
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out motion-reduce:transition-none"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in motion-reduce:transition-none"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <button
        v-if="isOpen"
        type="button"
        class="fixed inset-0 z-40 cursor-default bg-black/70 backdrop-blur-sm"
        aria-label="Fechar coleção"
        @click="emit('close')"
      ></button>
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out motion-reduce:transition-none"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in motion-reduce:transition-none"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="isOpen"
        id="collection-drawer"
        ref="drawerPanel"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="collection-title"
        class="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-zinc-950 shadow-2xl"
      >
        <header class="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p class="text-sm font-medium text-violet-400">GrooveVault</p>

            <h2 id="collection-title" class="mt-1 text-xl font-semibold text-white">
              Minha coleção
            </h2>
          </div>

          <button
            ref="closeButton"
            type="button"
            class="cursor-pointer rounded-xl border border-white/10 p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar coleção"
            @click="emit('close')"
          >
            <svg
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div class="flex-1 overflow-y-auto px-6 py-5">
          <div
            v-if="!albums.length"
            class="flex h-full flex-col items-center justify-center text-center"
          >
            <div class="flex size-14 items-center justify-center rounded-2xl bg-violet-400/10">
              <svg
                class="size-7 text-violet-400"
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

            <h3 class="mt-5 font-semibold text-white">Sua coleção está vazia</h3>

            <p class="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
              Pesquise um álbum e adicione sua primeira memória musical.
            </p>
          </div>

          <ul v-else class="space-y-3">
            <li
              v-for="album in albums"
              :key="album.id"
              class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <div
                class="flex size-16 shrink-0 items-center justify-center rounded-xl bg-linear-to-br font-bold text-white"
                :class="album.coverClass"
              >
                {{ album.initials }}
              </div>

              <div class="min-w-0 flex-1">
                <p class="truncate font-semibold text-white">
                  {{ album.title }}
                </p>

                <p class="mt-1 truncate text-sm text-zinc-400">
                  {{ album.artist }}
                </p>

                <p class="mt-1 text-xs text-zinc-600">
                  {{ album.year }}
                </p>
              </div>

              <button
                type="button"
                class="rounded-xl p-2 text-zinc-500 transition hover:bg-red-400/10 hover:text-red-400"
                :aria-label="`Remover ${album.title} da coleção`"
                @click="emit('remove-album', album.id)"
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
            </li>
          </ul>
        </div>

        <footer class="border-t border-white/10 px-6 py-5 text-sm text-zinc-500">
          {{ albums.length }}
          {{ albums.length === 1 ? "álbum guardado" : "álbuns guardados" }}
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>
