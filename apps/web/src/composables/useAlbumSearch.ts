import { computed, ref } from "vue";

import type { AlbumRepository } from "@/repositories/albumRepository";
import type { Album } from "@/types/album";

const RESULTS_PER_PAGE = 12;

export function useAlbumSearch(albumRepository: AlbumRepository) {
  const searchTerm = ref("");
  const submittedTerm = ref("");
  const searchResults = ref<Album[]>([]);
  const isSearching = ref(false);
  const searchError = ref("");
  const currentPage = ref(0);
  const totalPages = ref(0);
  const totalItems = ref(0);
  const isLoadingMore = ref(false);
  const paginationError = ref("");

  let searchVersion = 0;

  const hasMoreResults = computed(() => {
    return currentPage.value < totalPages.value;
  });

  async function handleSearch(): Promise<void> {
    const requestVersion = ++searchVersion;
    const query = searchTerm.value.trim();

    submittedTerm.value = query;
    searchResults.value = [];
    searchError.value = "";
    currentPage.value = 0;
    totalPages.value = 0;
    totalItems.value = 0;
    paginationError.value = "";
    isSearching.value = false;
    isLoadingMore.value = false;

    if (!query) {
      return;
    }

    isSearching.value = true;

    try {
      const result = await albumRepository.search({
        query,
        page: 1,
        perPage: RESULTS_PER_PAGE,
      });

      if (requestVersion !== searchVersion) {
        return;
      }

      searchResults.value = result.albums;
      currentPage.value = result.page;
      totalPages.value = result.totalPages;
      totalItems.value = result.totalItems;
    } catch (error: unknown) {
      if (requestVersion !== searchVersion) {
        return;
      }

      console.error("Falha ao pesquisar álbuns:", error);

      searchError.value = "Não foi possível pesquisar os álbuns. Tente novamente.";
    } finally {
      if (requestVersion === searchVersion) {
        isSearching.value = false;
      }
    }
  }

  async function loadMoreResults(): Promise<void> {
    if (!submittedTerm.value || !hasMoreResults.value || isLoadingMore.value) {
      return;
    }

    const requestVersion = searchVersion;
    const query = submittedTerm.value;
    const nextPage = currentPage.value + 1;

    isLoadingMore.value = true;
    paginationError.value = "";

    try {
      const result = await albumRepository.search({
        query,
        page: nextPage,
        perPage: RESULTS_PER_PAGE,
      });

      if (requestVersion !== searchVersion || query !== submittedTerm.value) {
        return;
      }

      const existingIds = new Set(searchResults.value.map((album) => album.id));

      const newAlbums = result.albums.filter((album) => {
        if (existingIds.has(album.id)) {
          return false;
        }

        existingIds.add(album.id);

        return true;
      });

      searchResults.value.push(...newAlbums);
      currentPage.value = result.page;
      totalPages.value = result.totalPages;
      totalItems.value = result.totalItems;
    } catch (error: unknown) {
      if (requestVersion !== searchVersion) {
        return;
      }

      console.error("Falha ao carregar mais álbuns:", error);

      paginationError.value = "Não foi possível carregar mais resultados. Tente novamente.";
    } finally {
      if (requestVersion === searchVersion) {
        isLoadingMore.value = false;
      }
    }
  }

  return {
    searchTerm,
    submittedTerm,
    searchResults,
    isSearching,
    searchError,
    currentPage,
    totalPages,
    totalItems,
    isLoadingMore,
    paginationError,
    hasMoreResults,
    handleSearch,
    loadMoreResults,
  };
}
