<script setup lang="ts">
import { Trophy, Zap, Gauge, Target } from "lucide-vue-next";

defineProps<{
  score: number;
  bestScore: number;
  level: number;
  speedMultiplier: string;
  levelScore: number;
  targetScore: number;
  levelProgress: number;
}>();
</script>

<template>
  <section class="grid grid-cols-2 gap-3">
    <!-- Total score -->
    <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div
        class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400"
      >
        <Zap :size="15" class="text-emerald-400" />
        Score
      </div>

      <p class="mt-2 text-4xl font-black text-emerald-400">
        {{ score }}
      </p>
    </article>

    <!-- Best score -->
    <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div
        class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400"
      >
        <Trophy :size="15" class="text-yellow-400" />
        Best
      </div>

      <p class="mt-2 text-4xl font-black text-yellow-300">
        {{ bestScore }}
      </p>
    </article>

    <!-- Level -->
    <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p class="text-xs font-bold uppercase tracking-widest text-slate-400">
        Level
      </p>

      <p class="mt-2 text-3xl font-black text-sky-400">
        {{ level }}
      </p>
    </article>

    <!-- Speed -->
    <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div
        class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400"
      >
        <Gauge :size="15" class="text-purple-400" />
        Speed
      </div>

      <p class="mt-2 text-3xl font-black text-purple-400">
        {{ speedMultiplier }}x
      </p>
    </article>

    <!-- Level progress -->
    <article
      class="col-span-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5"
    >
      <div class="flex items-center justify-between gap-3">
        <div
          class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400"
        >
          <Target :size="15" class="text-emerald-400" />
          Level progress
        </div>

        <span class="text-sm font-bold text-emerald-400">
          {{ levelScore }} / {{ targetScore }}
        </span>
      </div>

      <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          class="h-full rounded-full bg-emerald-400 transition-all duration-300"
          :style="{
            width: `${Math.min(Math.max(levelProgress, 0), 100)}%`,
          }"
        />
      </div>

      <p class="mt-3 text-xs text-slate-500">
        {{ Math.max(targetScore - levelScore, 0) }} points left to unlock the
        level test.
      </p>
    </article>
  </section>
</template>
