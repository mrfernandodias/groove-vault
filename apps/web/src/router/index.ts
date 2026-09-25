import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/collection",
      name: "collection",
      component: () => import("@/views/CollectionView.vue"),
    },
    {
      path: "/album/:albumId",
      name: "album",
      component: () => import("@/views/AlbumDetailsView.vue"),
      props: true,
    },
  ],
});
