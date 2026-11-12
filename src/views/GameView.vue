<script setup lang="ts">
import { onMounted, ref } from "vue";

import {
  Play,
  RotateCcw,
  Trophy,
  Skull,
  Crown,
  Keyboard,
  Gamepad2,
  Apple,
  BookOpen,
  Pause,
} from "lucide-vue-next";

import SnakeBoard from "@/components/game/SnakeBoard.vue";
import SnakeStats from "@/components/game/SnakeStats.vue";
import SnakeControls from "@/components/game/SnakeControls.vue";

import LearningStats from "@/components/learning/LearningStats.vue";
import ChallengeModal from "@/components/learning/ChallengeModal.vue";

import { useSnakeGame } from "@/composables/useSnakeGame";
import { useLearningEngine } from "@/composables/useLearningEngine";
import { useLearningStore } from "@/stores/learningStore";

const challengeOpen = ref(false);

const learning = useLearningEngine();
const learningStore = useLearningStore();

const {
  currentChallenge,
  lastResult,
  stats,
  startChallenge,
  submitAnswer,
  closeChallenge,
} = learning;

const {
  snake,
  food,
  score,
  bestScore,
  level,
  speedMultiplier,
  isPlaying,
  isStarted,
  isGameOver,
  isWon,
  startGame,
  pauseGame,
  resetGame,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
} = useSnakeGame({
  onFoodEaten: handleFoodEaten,
  isInputBlocked: () => challengeOpen.value,
});

function handleFoodEaten(): void {
  startChallenge();
  challengeOpen.value = true;
}

function handleSubmitAnswer(answer: string): void {
  submitAnswer(answer);
}

function handleChallengeClose(): void {
  closeChallenge();
  challengeOpen.value = false;

  if (!isGameOver.value && !isWon.value) {
    startGame();
  }
}

function handleRestart(): void {
  if (challengeOpen.value) return;

  closeChallenge();
  resetGame();
}

function handlePlayAgain(): void {
  if (challengeOpen.value) return;

  closeChallenge();
  resetGame();
  startGame();
}

function handleStart(): void {
  if (challengeOpen.value) return;

  startGame();
}

function handlePause(): void {
  if (challengeOpen.value) return;

  pauseGame();
}

function handleMoveUp(): void {
  if (!challengeOpen.value) moveUp();
}

function handleMoveDown(): void {
  if (!challengeOpen.value) moveDown();
}

function handleMoveLeft(): void {
  if (!challengeOpen.value) moveLeft();
}

function handleMoveRight(): void {
  if (!challengeOpen.value) moveRight();
}

onMounted(() => {
  learningStore.loadProgress();
});
</script>

<template>
  <main class="min-h-screen overflow-hidden bg-[#080b16] px-4 py-8 text-white">
    <div class="mx-auto max-w-5xl">
      <!-- Header -->
      <header class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="mb-2 flex items-center gap-2">
            <span
              class="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_#39ff88]"
            />

            <span
              class="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400"
            >
              Arcade edition
            </span>
          </div>

          <h1 class="text-4xl font-black tracking-tight sm:text-5xl">
            NEON
            <span class="text-emerald-400 drop-shadow-[0_0_15px_#39ff88]">
              SNAKE
            </span>
          </h1>

          <p class="mt-2 text-sm text-slate-400">Eat. Grow. Survive. Learn.</p>
        </div>

        <div
          class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur"
        >
          <p
            class="text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Your best
          </p>

          <p class="mt-1 text-2xl font-black text-yellow-300">
            {{ bestScore }}
          </p>
        </div>
      </header>

      <!-- Main layout -->
      <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <!-- Board -->
        <section class="min-w-0">
          <div
            class="relative mx-auto max-w-[600px] rounded-3xl border border-emerald-400/30 bg-[#0d1324] p-2 shadow-[0_0_25px_#39ff8830]"
          >
            <SnakeBoard :snake="snake" :food="food" />

            <!-- Start overlay -->
            <div
              v-if="!isStarted && !isGameOver && !isWon"
              class="absolute inset-2 flex flex-col items-center justify-center rounded-2xl bg-[#080b16]/90 px-4 text-center backdrop-blur-sm"
            >
              <div
                class="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_30px_#39ff8830]"
              >
                <Gamepad2 :size="42" class="text-emerald-400" />
              </div>

              <h2 class="text-3xl font-black">
                READY
                <span class="text-emerald-400">TO PLAY?</span>
              </h2>

              <p class="mt-2 text-sm text-slate-400">
                Use WASD or arrow keys to move.
              </p>

              <p class="mt-1 text-xs text-slate-500">
                Eat food to unlock English challenges.
              </p>

              <button
                type="button"
                class="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-7 py-3 font-black text-slate-950 shadow-[0_0_20px_#39ff8860] transition hover:scale-105 hover:bg-emerald-300"
                @click="handleStart"
              >
                <Play :size="18" />
                Start game
              </button>
            </div>

            <!-- Pause overlay -->
            <div
              v-else-if="
                isStarted &&
                !isPlaying &&
                !isGameOver &&
                !isWon &&
                !challengeOpen
              "
              class="absolute inset-2 flex flex-col items-center justify-center rounded-2xl bg-[#080b16]/85 backdrop-blur-sm"
            >
              <Pause :size="38" class="text-yellow-300" />

              <h2 class="mt-3 text-3xl font-black text-yellow-300">PAUSED</h2>

              <button
                type="button"
                class="mt-5 rounded-xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
                @click="handleStart"
              >
                Continue
              </button>
            </div>

            <!-- Game over / Win overlay -->
            <div
              v-else-if="isGameOver || isWon"
              class="absolute inset-2 flex flex-col items-center justify-center rounded-2xl bg-[#080b16]/90 text-center backdrop-blur-sm"
            >
              <div
                class="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border"
                :class="
                  isWon
                    ? 'border-yellow-400/30 bg-yellow-400/10'
                    : 'border-pink-400/30 bg-pink-400/10'
                "
              >
                <Crown v-if="isWon" :size="42" class="text-yellow-400" />

                <Skull v-else :size="42" class="text-pink-400" />
              </div>

              <h2
                class="text-3xl font-black"
                :class="isWon ? 'text-yellow-300' : 'text-pink-400'"
              >
                {{ isWon ? "YOU WIN!" : "GAME OVER" }}
              </h2>

              <p class="mt-2 text-slate-300">Final score: {{ score }}</p>

              <button
                type="button"
                class="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-7 py-3 font-black text-slate-950 transition hover:scale-105 hover:bg-emerald-300"
                @click="handlePlayAgain"
              >
                <RotateCcw :size="18" />
                Play again
              </button>
            </div>
          </div>
        </section>

        <!-- Sidebar -->
        <aside class="space-y-4">
          <SnakeStats
            :score="score"
            :best-score="bestScore"
            :level="level"
            :speed-multiplier="speedMultiplier"
          />

          <LearningStats
            :xp="stats.xp"
            :stars="stats.stars"
            :combo="stats.combo"
            :accuracy="stats.accuracy"
            :learned-words="stats.learnedWords"
            :review-words="stats.reviewWords"
          />

          <SnakeControls
            :is-playing="isPlaying"
            @start="handleStart"
            @pause="handlePause"
            @restart="handleRestart"
            @up="handleMoveUp"
            @down="handleMoveDown"
            @left="handleMoveLeft"
            @right="handleMoveRight"
          />

          <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div class="mb-4 flex items-center gap-2">
              <Keyboard :size="18" class="text-emerald-400" />

              <h3
                class="text-sm font-bold uppercase tracking-widest text-slate-300"
              >
                How to play
              </h3>
            </div>

            <div class="space-y-4 text-sm text-slate-400">
              <div class="flex items-center gap-3">
                <Apple :size="17" class="shrink-0 text-pink-400" />
                <span>Eat food to gain 10 points and start a challenge.</span>
              </div>

              <div class="flex items-center gap-3">
                <Trophy :size="17" class="shrink-0 text-yellow-400" />
                <span>Every 50 points increases your level.</span>
              </div>

              <div class="flex items-center gap-3">
                <Keyboard :size="17" class="shrink-0 text-sky-400" />
                <span>Move with WASD or arrow keys.</span>
              </div>

              <div class="flex items-center gap-3">
                <Pause :size="17" class="shrink-0 text-purple-400" />
                <span>Press Space to pause or resume.</span>
              </div>

              <div class="flex items-center gap-3">
                <BookOpen :size="17" class="shrink-0 text-purple-300" />
                <span>Answer English questions to earn XP and stars.</span>
              </div>
            </div>
          </section>

          <section
            class="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-4"
          >
            <p
              class="mb-1 text-xs font-bold uppercase tracking-widest text-purple-300"
            >
              Pro tip
            </p>

            <p class="text-sm text-slate-400">
              Plan your route ahead. The higher your level, the faster the snake
              gets!
            </p>
          </section>
        </aside>
      </div>

      <footer class="mt-8 text-center text-xs text-slate-600">
        NEON SNAKE ARCADE · VUE 3 · ENGLISH SURVIVAL
      </footer>
    </div>

    <!-- Learning challenge -->
    <ChallengeModal
      v-if="challengeOpen && currentChallenge"
      :challenge="currentChallenge"
      :result="lastResult"
      @submit="handleSubmitAnswer"
      @close="handleChallengeClose"
    />
  </main>
</template>
