<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Headphones,
  Keyboard,
  RotateCcw,
  SkipForward,
  Volume2,
  X,
  XCircle,
} from "lucide-vue-next";

import type { Challenge, ChallengeResult } from "@/types/learning";

import QuestionOptions from "./QuestionOptions.vue";
import WritingChallenge from "./WritingChallenge.vue";
import AnswerFeedback from "./AnswerFeedback.vue";
import ChallengeAnswer from "./ChallengeAnswer.vue";

type TestStatus = "idle" | "in-progress" | "passed" | "failed";

const resultSection = ref<HTMLElement | null>(null);

async function scrollToResult(): Promise<void> {
  await nextTick();

  resultSection.value?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

const props = withDefaults(
  defineProps<{
    challenge: Challenge;
    result: ChallengeResult | null;

    questionNumber?: number;
    totalQuestions?: number;
    progress?: number;
    correctCount?: number;
    testStatus?: TestStatus;
    testPassed?: boolean | null;
  }>(),
  {
    questionNumber: 1,
    totalQuestions: 0,
    progress: 0,
    correctCount: 0,
    testStatus: "idle",
    testPassed: null,
  },
);

const emit = defineEmits<{
  submit: [answer: string];
  showAnswer: [];
  skip: [];
  close: [];
  next: [];
  finish: [];
  retry: [];
}>();

const answer = ref("");
const isAnswerRevealed = ref(false);

const isListening = computed(() => props.challenge.skill === "listening");

const isTestMode = computed(() => props.totalQuestions > 0);

const isTestCompleted = computed(
  () =>
    isTestMode.value &&
    (props.testStatus === "passed" || props.testStatus === "failed"),
);

const isLastQuestion = computed(
  () => props.questionNumber >= props.totalQuestions,
);

const hasAnswerContent = computed(() => {
  if (props.challenge.type === "writing") {
    return Boolean(props.challenge.sampleAnswer);
  }

  return Boolean(props.challenge.correctAnswer || props.challenge.transcript);
});

const canSubmit = computed(
  () =>
    !props.result && !isAnswerRevealed.value && answer.value.trim().length > 0,
);

const isLocked = computed(
  () => Boolean(props.result) || isAnswerRevealed.value,
);

const progressWidth = computed(() =>
  Math.min(Math.max(props.progress, 0), 100),
);

watch(
  () => props.challenge.id,
  () => {
    answer.value = "";
    isAnswerRevealed.value = false;
  },
);

function playAudio(): void {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(
    props.challenge.audioText ?? props.challenge.question,
  );

  utterance.lang = "en-US";
  utterance.rate = 0.85;

  window.speechSynthesis.speak(utterance);
}

function handleSubmit(): void {
  if (!canSubmit.value) return;

  emit("submit", answer.value.trim());
  void scrollToResult();
}

function handleShowAnswer(): void {
  if (props.result || isAnswerRevealed.value) return;
  if (!hasAnswerContent.value) return;

  isAnswerRevealed.value = true;
  emit("showAnswer");
  void scrollToResult();
}

function handleSkip(): void {
  if (props.result || isAnswerRevealed.value) return;

  emit("skip");
  void scrollToResult();
}

function handleClose(): void {
  if (isTestMode.value && !isTestCompleted.value) return;
  if (!props.result && !isAnswerRevealed.value) return;

  emit("close");
}

function handleNext(): void {
  if (!props.result) return;

  emit("next");
}

function handleFinish(): void {
  if (!isTestCompleted.value) return;

  emit("finish");
}

function handleRetry(): void {
  if (props.testStatus !== "failed") return;

  emit("retry");
}

onBeforeUnmount(() => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
  >
    <section
      class="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0d1324] shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-title"
    >
      <!-- Header -->
      <header
        class="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-5"
      >
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-purple-400/10 p-3 text-purple-300">
            <Headphones v-if="isListening" :size="20" />
            <Keyboard v-else :size="20" />
          </div>

          <div>
            <p
              class="text-xs font-bold uppercase tracking-widest text-purple-300"
            >
              {{ isTestMode ? "Level test" : `${challenge.skill} challenge` }}
            </p>

            <h2 id="challenge-title" class="font-bold text-white">
              {{ isTestMode ? "English Assessment" : challenge.title }}
            </h2>
          </div>
        </div>

        <button
          v-if="
            isTestCompleted || (!isTestMode && (result || isAnswerRevealed))
          "
          type="button"
          class="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Close challenge"
          @click="handleClose"
        >
          <X :size="20" />
        </button>
      </header>

      <!-- Main content -->
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <!-- Scrollable content -->
        <div class="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
          <!-- TEST RESULT -->
          <template v-if="isTestCompleted">
            <div class="py-5 text-center">
              <div
                class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border"
                :class="
                  testPassed
                    ? 'border-emerald-400/30 bg-emerald-400/10'
                    : 'border-pink-400/30 bg-pink-400/10'
                "
              >
                <CheckCircle2
                  v-if="testPassed"
                  :size="42"
                  class="text-emerald-400"
                />

                <XCircle v-else :size="42" class="text-pink-400" />
              </div>

              <h2
                class="text-3xl font-black"
                :class="testPassed ? 'text-emerald-400' : 'text-pink-400'"
              >
                {{ testPassed ? "LEVEL PASSED!" : "TEST FAILED" }}
              </h2>

              <p class="mt-3 text-slate-400">
                {{
                  testPassed
                    ? "Great job! You are ready for the next level."
                    : "Keep practicing! You can try this level test again."
                }}
              </p>

              <div
                class="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p
                  class="text-sm font-bold uppercase tracking-widest text-slate-400"
                >
                  Your result
                </p>

                <p
                  class="mt-3 text-5xl font-black"
                  :class="testPassed ? 'text-emerald-400' : 'text-pink-400'"
                >
                  {{ correctCount }} / {{ totalQuestions }}
                </p>

                <p class="mt-2 text-sm text-slate-400">Correct answers</p>

                <div class="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="testPassed ? 'bg-emerald-400' : 'bg-pink-400'"
                    :style="{
                      width: `${(correctCount / totalQuestions) * 100}%`,
                    }"
                  />
                </div>

                <p class="mt-3 text-xs text-slate-500">
                  You need at least 5 correct answers to pass.
                </p>
              </div>
            </div>
          </template>

          <!-- QUESTION CONTENT -->
          <template v-else>
            <!-- Test progress -->
            <div v-if="isTestMode" class="space-y-3">
              <div class="flex items-center justify-between">
                <span
                  class="text-xs font-bold uppercase tracking-widest text-slate-400"
                >
                  Question {{ questionNumber }} of {{ totalQuestions }}
                </span>

                <span class="text-xs font-bold text-emerald-400">
                  {{ correctCount }} correct
                </span>
              </div>

              <div class="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  class="h-full rounded-full bg-emerald-400 transition-all duration-300"
                  :style="{ width: `${progressWidth}%` }"
                />
              </div>
            </div>

            <!-- Question -->
            <div>
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <span
                  class="rounded-full bg-purple-400/10 px-3 py-1 text-xs font-bold capitalize text-purple-300"
                >
                  {{ challenge.difficulty }}
                </span>

                <span class="text-xs text-slate-400">
                  {{ challenge.instruction }}
                </span>
              </div>

              <h3 class="text-xl font-black leading-relaxed text-white">
                {{ challenge.question }}
              </h3>
            </div>

            <!-- Listening audio -->
            <div
              v-if="isListening"
              class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div>
                <p class="font-bold text-white">Listen carefully</p>

                <p class="mt-1 text-xs text-slate-500">
                  Audio is generated by your browser.
                </p>
              </div>

              <button
                type="button"
                class="rounded-xl bg-emerald-400 p-3 text-slate-950 transition hover:bg-emerald-300"
                aria-label="Play audio"
                @click="playAudio"
              >
                <Volume2 :size="20" />
              </button>
            </div>

            <!-- Multiple choice -->
            <QuestionOptions
              v-if="challenge.type === 'multiple-choice' && !isAnswerRevealed"
              v-model="answer"
              :options="challenge.options ?? []"
              :disabled="isLocked"
            />

            <!-- Writing -->
            <WritingChallenge
              v-else-if="challenge.type === 'writing' && !isAnswerRevealed"
              v-model="answer"
              :min-words="challenge.minWords ?? 1"
              :keywords="challenge.requiredKeywords ?? []"
              :disabled="isLocked"
              @submit="handleSubmit"
            />

            <div
              v-if="isAnswerRevealed || result"
              ref="resultSection"
              class="scroll-mt-6 space-y-4"
            >
              <ChallengeAnswer v-if="isAnswerRevealed" :challenge="challenge" />

              <AnswerFeedback
                v-else-if="result && result.userAnswer !== 'Skipped'"
                :result="result"
              />
            </div>
          </template>
        </div>

        <!-- Fixed actions -->
        <div
          v-if="!isTestCompleted"
          class="shrink-0 border-t border-white/10 bg-[#0d1324] p-6"
        >
          <!-- Actions before answering -->
          <div v-if="!result && !isAnswerRevealed" class="flex flex-wrap gap-2">
            <button
              type="button"
              class="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 font-bold text-slate-300 transition hover:bg-white/10"
              @click="handleSkip"
            >
              <SkipForward :size="17" />
              Skip
            </button>

            <button
              v-if="hasAnswerContent"
              type="button"
              class="flex items-center justify-center gap-2 rounded-xl border border-purple-400/20 px-4 py-3 font-bold text-purple-300 transition hover:bg-purple-400/10"
              @click="handleShowAnswer"
            >
              <BookOpen :size="17" />
              Show answer
            </button>

            <button
              type="button"
              :disabled="!canSubmit"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3.5 font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
              @click="handleSubmit"
            >
              Submit answer
              <ArrowRight :size="18" />
            </button>
          </div>

          <!-- After answering: TEST -->
          <button
            v-else-if="result && isTestMode"
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 font-black text-slate-950 transition hover:bg-emerald-300"
            @click="handleNext"
          >
            {{ isLastQuestion ? "View test result" : "Next question" }}
            <ArrowRight :size="18" />
          </button>

          <!-- After answering: NORMAL CHALLENGE -->
          <button
            v-else
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 font-black text-slate-950 transition hover:bg-emerald-300"
            @click="handleClose"
          >
            Continue game
            <ArrowRight :size="18" />
          </button>
        </div>

        <!-- Test result actions -->
        <div v-else class="shrink-0 border-t border-white/10 bg-[#0d1324] p-6">
          <!-- PASS -->
          <button
            v-if="testPassed"
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 font-black text-slate-950 transition hover:bg-emerald-300"
            @click="handleFinish"
          >
            Continue to next level
            <ArrowRight :size="18" />
          </button>

          <!-- FAIL -->
          <button
            v-else
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-400 px-5 py-3.5 font-black text-slate-950 transition hover:bg-purple-300"
            @click="handleRetry"
          >
            <RotateCcw :size="18" />
            Retry test
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
