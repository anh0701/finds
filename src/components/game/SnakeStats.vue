
<script setup lang="ts">
import { Trophy, Zap, Gauge } from 'lucide-vue-next'

defineProps<{
  score: number
  bestScore: number
  level: number
  speedMultiplier: string
}>()
</script>

<template>
  <section class="grid grid-cols-2 gap-3">
    <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Zap :size="15" class="text-emerald-400" />
        Score
      </div>
      <p class="mt-2 text-4xl font-black text-emerald-400">
        {{ score }}
      </p>
    </article>

    <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Trophy :size="15" class="text-yellow-400" />
        Best
      </div>
      <p class="mt-2 text-4xl font-black text-yellow-300">
        {{ bestScore }}
      </p>
    </article>

    <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p class="text-xs font-bold uppercase tracking-widest text-slate-400">
        Level
      </p>
      <p class="mt-2 text-3xl font-black text-sky-400">
        {{ level }}
      </p>
    </article>

    <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Gauge :size="15" class="text-purple-400" />
        Speed
      </div>
      <p class="mt-2 text-3xl font-black text-purple-400">
        {{ speedMultiplier }}x
      </p>
    </article>
  </section>
</template>
