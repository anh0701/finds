
<script setup lang="ts">
import {
  Play,
  Pause,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-vue-next'

defineProps<{
  isPlaying: boolean
}>()

const emit = defineEmits<{
  start: []
  pause: []
  restart: []
  up: []
  down: []
  left: []
  right: []
}>()
</script>

<template>
  <section class="space-y-4">
    <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 class="mb-4 text-sm font-bold uppercase tracking-widest text-slate-300">
        Game controls
      </h3>

      <button
        v-if="isPlaying"
        class="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
        @click="emit('pause')"
      >
        <Pause :size="18" />
        Pause game
      </button>

      <button
        v-else
        class="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
        @click="emit('start')"
      >
        <Play :size="18" />
        Start game
      </button>

      <button
        class="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
        @click="emit('restart')"
      >
        <RotateCcw :size="17" />
        Restart
      </button>
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 p-5 lg:hidden">
      <h3 class="mb-4 text-sm font-bold uppercase tracking-widest text-slate-300">
        Touch controls
      </h3>

      <div class="mx-auto grid w-40 grid-cols-3 gap-2">
        <span />
        <button class="direction-button" aria-label="Up" @click="emit('up')">
          <ArrowUp />
        </button>
        <span />

        <button class="direction-button" aria-label="Left" @click="emit('left')">
          <ArrowLeft />
        </button>
        <button class="direction-button" aria-label="Down" @click="emit('down')">
          <ArrowDown />
        </button>
        <button class="direction-button" aria-label="Right" @click="emit('right')">
          <ArrowRight />
        </button>
      </div>
    </div>
  </section>
</template>
