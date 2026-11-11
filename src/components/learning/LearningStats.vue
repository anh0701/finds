<script setup lang="ts">
import {
  BookOpen,
  Flame,
  Star,
  Target,
  Zap,
} from 'lucide-vue-next'

defineProps<{
  xp: number
  stars: number
  combo: number
  accuracy: number
  learnedWords: number
  reviewWords: number
}>()
</script>

<template>
  <section class="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-5">
    <div class="mb-4 flex items-center gap-2">
      <BookOpen :size="18" class="text-purple-300" />
      <h3 class="text-sm font-bold uppercase tracking-widest text-slate-200">
        Learning progress
      </h3>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <article class="rounded-xl border border-white/5 bg-white/5 p-3">
        <div class="flex items-center gap-2 text-xs text-slate-400">
          <Zap :size="14" class="text-yellow-300" />
          XP
        </div>
        <p class="mt-2 text-2xl font-black text-yellow-300">
          {{ xp }}
        </p>
      </article>

      <article class="rounded-xl border border-white/5 bg-white/5 p-3">
        <div class="flex items-center gap-2 text-xs text-slate-400">
          <Star :size="14" class="text-amber-300" />
          Stars
        </div>
        <p class="mt-2 text-2xl font-black text-amber-300">
          {{ stars }}
        </p>
      </article>

      <article class="rounded-xl border border-white/5 bg-white/5 p-3">
        <div class="flex items-center gap-2 text-xs text-slate-400">
          <Flame :size="14" class="text-orange-300" />
          Combo
        </div>
        <p class="mt-2 text-2xl font-black text-orange-300">
          {{ combo }}
        </p>
      </article>

      <article class="rounded-xl border border-white/5 bg-white/5 p-3">
        <div class="flex items-center gap-2 text-xs text-slate-400">
          <Target :size="14" class="text-emerald-300" />
          Accuracy
        </div>
        <p class="mt-2 text-2xl font-black text-emerald-300">
          {{ accuracy }}%
        </p>
      </article>
    </div>

    <div class="mt-4 space-y-3">
      <div class="flex items-center justify-between text-sm">
        <span class="text-slate-400">Words learned</span>
        <span class="font-bold text-white">{{ learnedWords }}</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-slate-400">Words to review</span>
        <span class="font-bold text-white">{{ reviewWords }}</span>
      </div>

      <div class="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          class="h-full rounded-full bg-emerald-400 transition-all"
          :style="{ width: `${accuracy}%` }"
        />
      </div>
    </div>
  </section>
</template>