
<script setup lang="ts">
import {
  CheckCircle2,
  Lightbulb,
  XCircle,
  BookOpen,
  SpellCheck,
  Target,
  Type,
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
    <!-- Result heading -->
    <div class="mb-5 flex items-center gap-3">
      <CheckCircle2
        v-if="result.isCorrect"
        :size="28"
        class="shrink-0 text-emerald-400"
      />

      <XCircle
        v-else
        :size="28"
        class="shrink-0 text-amber-400"
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

    <div class="space-y-4">
      <!-- User answer -->
      <div>
        <p class="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          Your answer
        </p>

        <p class="break-words text-sm leading-relaxed text-slate-200">
          {{ result.userAnswer || 'No answer' }}
        </p>
      </div>

      <!-- Correct answer -->
      <div v-if="!result.isCorrect && !result.writingGrade">
        <p class="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          Correct answer
        </p>

        <p class="text-sm text-emerald-300">
          {{ result.correctAnswer }}
        </p>
      </div>

      <!-- Writing grade -->
      <div
        v-if="result.writingGrade"
        class="space-y-4 rounded-xl border border-slate-700/60 bg-black/20 p-4"
      >
        <div class="flex items-center justify-between">
          <h4 class="flex items-center gap-2 text-sm font-bold text-slate-200">
            <BookOpen :size="16" class="text-purple-300" />
            Writing assessment
          </h4>

          <span
            class="rounded-full px-2.5 py-1 text-xs font-bold"
            :class="
              result.writingGrade.passed
                ? 'bg-emerald-400/10 text-emerald-300'
                : 'bg-amber-400/10 text-amber-300'
            "
          >
            {{ result.writingGrade.score }}/100
          </span>
        </div>

        <!-- Word count -->
        <div class="flex items-center justify-between text-sm">
          <span class="flex items-center gap-2 text-slate-400">
            <Type :size="15" />
            Word count
          </span>

          <span
            class="font-semibold"
            :class="
              result.writingGrade.wordCountPassed
                ? 'text-emerald-300'
                : 'text-amber-300'
            "
          >
            {{ result.writingGrade.wordCount }}
            /
            {{ result.writingGrade.requiredWordCount }}
          </span>
        </div>

        <!-- Grammar -->
        <div class="flex items-center justify-between text-sm">
          <span class="flex items-center gap-2 text-slate-400">
            <SpellCheck :size="15" />
            Grammar
          </span>

          <span
            class="font-semibold"
            :class="
              result.writingGrade.grammarPassed
                ? 'text-emerald-300'
                : 'text-amber-300'
            "
          >
            {{ result.writingGrade.grammarPassed ? 'Good' : 'Needs improvement' }}
          </span>
        </div>

        <!-- Required keywords -->
        <div>
          <p class="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Target :size="14" />
            Required words
          </p>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="keyword in result.writingGrade.matchedKeywords"
              :key="`matched-${keyword}`"
              class="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300"
            >
              <CheckCircle2 :size="12" class="mr-1 inline" />
              {{ keyword }}
            </span>

            <span
              v-for="keyword in result.writingGrade.missingKeywords"
              :key="`missing-${keyword}`"
              class="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs text-amber-300"
            >
              <XCircle :size="12" class="mr-1 inline" />
              {{ keyword }}
            </span>
          </div>
        </div>

        <!-- Writing errors -->
        <div
          v-if="result.writingGrade.errors.length > 0"
          class="space-y-3 border-t border-slate-700/60 pt-3"
        >
          <p class="text-xs font-bold uppercase tracking-wider text-slate-500">
            What to improve
          </p>

          <div
            v-for="(error, index) in result.writingGrade.errors"
            :key="`${error.type}-${index}`"
            class="rounded-lg bg-black/20 p-3"
          >
            <p class="text-sm font-medium text-amber-300">
              {{ error.message }}
            </p>

            <p
              v-if="error.suggestion"
              class="mt-1 text-xs leading-relaxed text-slate-400"
            >
              {{ error.suggestion }}
            </p>
          </div>
        </div>

        <p
          v-else
          class="text-sm text-emerald-300"
        >
          Great! No issues were detected by the current writing checker.
        </p>
      </div>

      <!-- Explanation -->
      <div
        v-if="!result.writingGrade && result.explanation"
        class="rounded-xl bg-black/20 p-3"
      >
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
