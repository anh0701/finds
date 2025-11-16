import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";
import Chess from "@/views/Chess.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "Home", component: Home },
  { path: "/chess", name: "Chess", component: Chess },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
