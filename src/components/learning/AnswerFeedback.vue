<script setup lang="ts">
import {
  CheckCircle2,
  Lightbulb,
  XCircle,
} from 'lucide-vue-next'

import type { ChallengeResult } from '@/types/learning'

defineProps<{
  result: ChallengeResult
}>()
</script>

<template>
  <section
    class="rounded-2xl border p-5"
    :class="
      result.isCorrect
        ? 'border-emerald-400/20 bg-emerald-400/5'
        : 'border-amber-400/20 bg-amber-400/5'
    "
  >
    <div class="mb-4 flex items-center gap-3">
      <CheckCircle2
        v-if="result.isCorrect"
        :size="28"
        class="text-emerald-400"
      />

      <XCircle
        v-else
        :size="28"
        class="text-amber-400"
      />

      <div>
        <h3
          class="font-bold"
          :class="
            result.isCorrect
              ? 'text-emerald-300'
              : 'text-amber-300'
          "
        >
          {{ result.isCorrect ? 'Excellent work!' : 'Good try!' }}
        </h3>

        <p class="text-xs text-slate-400">
          {{
            result.isCorrect
              ? `You earned ${result.xpEarned} XP`
              : 'Your combo has been reset. Keep practicing!'
          }}
        </p>
      </div>
    </div>

    <div class="space-y-3">
      <div>
        <p class="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          Your answer
        </p>

        <p class="break-words text-sm text-slate-200">
          {{ result.userAnswer || 'No answer' }}
        </p>
      </div>

      <div v-if="!result.isCorrect">
        <p class="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          Correct answer
        </p>

        <p class="text-sm text-emerald-300">
          {{ result.correctAnswer }}
        </p>
      </div>

      <div class="rounded-xl bg-black/20 p-3">
        <div class="mb-2 flex items-center gap-2 text-xs font-bold text-purple-300">
          <Lightbulb :size="15" />
          Explanation
        </div>

        <p class="text-sm leading-relaxed text-slate-300">
          {{ result.explanation }}
        </p>
      </div>
    </div>
  </section>
</template>