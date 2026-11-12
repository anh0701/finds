<script setup lang="ts">
import {
  Play,
  Pause,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-vue-next";

defineProps<{
  isPlaying: boolean;
}>();

const emit = defineEmits<{
  start: [];
  pause: [];
  restart: [];
  up: [];
  down: [];
  left: [];
  right: [];
}>();
</script>

<template>
  <section class="space-y-4">
    <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3
        class="mb-4 text-sm font-bold uppercase tracking-widest text-slate-300"
      >
        Game controls
      </h3>

      <button
        v-if="isPlaying"
        type="button"
        class="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
        @click="emit('pause')"
      >
        <Pause :size="18" />
        Pause game
      </button>

      <button
        v-else
        type="button"
        class="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
        @click="emit('start')"
      >
        <Play :size="18" />
        Start game
      </button>

      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
        @click="emit('restart')"
      >
        <RotateCcw :size="17" />
        Restart
      </button>
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 p-5 lg:hidden">
      <h3
        class="mb-4 text-sm font-bold uppercase tracking-widest text-slate-300"
      >
        Touch controls
      </h3>

      <div class="mx-auto grid w-40 grid-cols-3 gap-2">
        <span />

        <button
          type="button"
          aria-label="Up"
          class="flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:bg-emerald-400 active:text-slate-950"
          @click="emit('up')"
        >
          <ArrowUp :size="22" />
        </button>

        <span />

        <button
          type="button"
          aria-label="Left"
          class="flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:bg-emerald-400 active:text-slate-950"
          @click="emit('left')"
        >
          <ArrowLeft :size="22" />
        </button>

        <button
          type="button"
          aria-label="Down"
          class="flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:bg-emerald-400 active:text-slate-950"
          @click="emit('down')"
        >
          <ArrowDown :size="22" />
        </button>

        <button
          type="button"
          aria-label="Right"
          class="flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:bg-emerald-400 active:text-slate-950"
          @click="emit('right')"
        >
          <ArrowRight :size="22" />
        </button>
      </div>
    </div>
  </section>
</template>
