<script setup lang="ts">
import { BookOpen, CheckCircle2, Lightbulb } from "lucide-vue-next";

import type { Challenge } from "@/types/learning";

defineProps<{
  challenge: Challenge;
}>();
</script>

<template>
  <section
    class="space-y-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5"
  >
    <div class="flex items-center gap-2">
      <CheckCircle2 :size="20" class="text-emerald-400" />

      <h3 class="font-bold text-emerald-300">Answer & Explanation</h3>
    </div>

    <!-- Writing sample -->
    <template v-if="challenge.type === 'writing'">
      <div>
        <div class="mb-2 flex items-center gap-2">
          <BookOpen :size="16" class="text-purple-300" />

          <h4 class="font-bold text-white">Sample answer</h4>
        </div>

        <p class="whitespace-pre-line text-sm leading-7 text-slate-300">
          {{ challenge.sampleAnswer || "No sample answer available." }}
        </p>

        <p class="mt-2 text-xs text-slate-500">
          This is one possible answer. You can express the same idea in
          different ways.
        </p>
      </div>

      <div v-if="challenge.usefulVocabulary?.length" class="space-y-3">
        <h4 class="font-bold text-white">Useful vocabulary</h4>

        <div
          v-for="item in challenge.usefulVocabulary"
          :key="item.word"
          class="flex items-start justify-between gap-4 text-sm"
        >
          <span class="font-semibold text-emerald-300">
            {{ item.word }}
          </span>

          <span class="text-right text-slate-400">
            {{ item.meaning }}
          </span>
        </div>
      </div>

      <div v-if="challenge.usefulStructures?.length" class="space-y-2">
        <h4 class="flex items-center gap-2 font-bold text-white">
          <Lightbulb :size="16" class="text-amber-300" />
          Useful structures
        </h4>

        <div
          v-for="structure in challenge.usefulStructures"
          :key="structure"
          class="rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300"
        >
          {{ structure }}
        </div>
      </div>
    </template>

    <!-- Multiple choice -->
    <template v-else>
      <div>
        <p
          class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          Correct answer
        </p>

        <p class="font-bold text-emerald-300">
          {{ challenge.correctAnswer || "Answer unavailable." }}
        </p>
      </div>

      <div v-if="challenge.transcript">
        <p
          class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          Transcript
        </p>

        <p class="whitespace-pre-line text-sm leading-7 text-slate-300">
          {{ challenge.transcript }}
        </p>
      </div>
    </template>

    <!-- Explanation -->
    <div v-if="challenge.explanation">
      <div class="mb-2 flex items-center gap-2">
        <Lightbulb :size="16" class="text-amber-300" />

        <h4 class="font-bold text-white">Explanation</h4>
      </div>

      <p class="whitespace-pre-line text-sm leading-6 text-slate-400">
        {{ challenge.explanation }}
      </p>
    </div>
  </section>
</template>
