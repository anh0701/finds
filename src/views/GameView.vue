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

const learning = useLearningEngine();
const learningStore = useLearningStore();

const challengeOpen = ref(false);

const {
  stats,
  currentTestQuestion,
  lastTestResult,
  testQuestionIndex,
  testCorrectCount,
  testProgress,
  testStatus,
  testPassed,
  isTestCompleted,
  startLevelTest,
  submitTestAnswer,
  skipTestQuestion,
  revealTestAnswer,
  advanceTest,
  closeLevelTest,
} = learning;

const {
  snake,
  food,
  score,
  walls,
  levelScore,
  bestScore,
  level,
  targetScore,
  levelProgress,
  speedMultiplier,
  isPlaying,
  isStarted,
  isGameOver,
  isWon,
  isLevelTestRequired,
  startGame,
  pauseGame,
  resetGame,
  completeLevelTest,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
} = useSnakeGame({
  onLevelTargetReached: handleLevelTargetReached,
  isInputBlocked: () => challengeOpen.value,
});

/**
 * Khi đạt mục tiêu điểm của level:
 * - Snake tự động tạm dừng.
 * - Bắt đầu bài kiểm tra 10 câu.
 */
function handleLevelTargetReached(): void {
  challengeOpen.value = true;
  startLevelTest();
}

/**
 * Gửi câu trả lời của bài kiểm tra level.
 */
function handleSubmitTestAnswer(answer: string): void {
  submitTestAnswer(answer);
}

/**
 * Chuyển sang câu tiếp theo.
 * Sau câu thứ 10, engine sẽ xác định PASS / FAIL.
 */
function handleNextTestQuestion(): void {
  advanceTest();
}

/**
 * Người chơi bỏ qua câu hỏi.
 * Câu hỏi được tính là sai, không nhận XP.
 */
function handleSkipTestQuestion(): void {
  skipTestQuestion();
}

/**
 * Người chơi xem đáp án.
 * Câu hỏi được tính là sai, không nhận XP.
 */
function handleRevealTestAnswer(): void {
  revealTestAnswer();
}

/**
 * Hoàn thành bài kiểm tra:
 * - PASS: tăng level và tiếp tục Snake.
 * - FAIL: giữ level, mở lại bài kiểm tra khi người chơi chọn thử lại.
 */
function handleFinishTest(): void {
  if (!isTestCompleted.value) return;

  const passed = testPassed.value === true;

  closeLevelTest();
  challengeOpen.value = false;

  completeLevelTest(passed);
}

/**
 * Làm lại bài kiểm tra nếu không đạt.
 */
function handleRetryTest(): void {
  startLevelTest();
}

/**
 * Khởi động lại toàn bộ lượt chơi.
 */
function handleRestart(): void {
  if (challengeOpen.value) return;

  closeLevelTest();
  resetGame();
}

/**
 * Chơi lại sau khi game over / win.
 */
function handlePlayAgain(): void {
  if (challengeOpen.value) return;

  closeLevelTest();
  resetGame();
  startGame();
}

function handleStart(): void {
  if (challengeOpen.value || isLevelTestRequired.value) return;

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
    <div class="mx-auto max-w-[1600px]">
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
      </header>

      <!-- Main layout -->
      <div
        class="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)_280px] xl:grid-cols-[280px_minmax(0,1fr)_300px]"
      >
        <!-- LEFT: STATS -->
        <aside class="space-y-4">
          <SnakeStats
            :score="score"
            :best-score="bestScore"
            :level="level"
            :speed-multiplier="speedMultiplier"
            :level-score="levelScore"
            :target-score="targetScore"
            :level-progress="levelProgress"
          />

          <LearningStats
            :xp="stats.xp"
            :stars="stats.stars"
            :combo="stats.combo"
            :accuracy="stats.accuracy"
            :learned-words="stats.learnedWords"
            :review-words="stats.reviewWords"
          />
        </aside>

        <!-- CENTER: GAME BOARD -->
        <section class="min-w-0">
          <div
            class="relative mx-auto w-full max-w-[700px] rounded-3xl border border-emerald-400/30 bg-[#0d1324] p-2 shadow-[0_0_25px_#39ff8830]"
          >
            <SnakeBoard :snake="snake" :food="food" :walls="walls" />

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
                Eat 5 foods to unlock a level test.
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

        <!-- RIGHT: CONTROLS + INSTRUCTIONS -->
        <aside class="space-y-4">
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

          <!-- How to play -->
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
              <div class="flex items-start gap-3">
                <Apple :size="17" class="mt-0.5 shrink-0 text-pink-400" />

                <span>
                  Eat food to earn 10 points. Collect 50 points to unlock a
                  level test.
                </span>
              </div>

              <div class="flex items-start gap-3">
                <Trophy :size="17" class="mt-0.5 shrink-0 text-yellow-400" />

                <span>
                  Pass the 10-question test with at least 5 correct answers to
                  advance.
                </span>
              </div>

              <div class="flex items-start gap-3">
                <Keyboard :size="17" class="mt-0.5 shrink-0 text-sky-400" />

                <span>Move with WASD or arrow keys.</span>
              </div>

              <div class="flex items-start gap-3">
                <Pause :size="17" class="mt-0.5 shrink-0 text-purple-400" />

                <span>Press Space to pause or resume.</span>
              </div>

              <div class="flex items-start gap-3">
                <BookOpen :size="17" class="mt-0.5 shrink-0 text-purple-300" />

                <span>
                  Each level test includes Vocabulary, Grammar, Reading,
                  Listening and Writing.
                </span>
              </div>
            </div>
          </section>

          <!-- Pro tip -->
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

      <!-- Footer -->
      <footer class="mt-8 text-center text-xs text-slate-600">
        NEON SNAKE ARCADE · VUE 3 · ENGLISH SURVIVAL
      </footer>
    </div>

    <!-- Level test -->
    <ChallengeModal
      v-if="challengeOpen && currentTestQuestion"
      :challenge="currentTestQuestion"
      :result="lastTestResult"
      :question-number="testQuestionIndex + 1"
      :total-questions="10"
      :progress="testProgress"
      :correct-count="testCorrectCount"
      :test-status="testStatus"
      :test-passed="testPassed"
      @submit="handleSubmitTestAnswer"
      @next="handleNextTestQuestion"
      @show-answer="handleRevealTestAnswer"
      @skip="handleSkipTestQuestion"
      @finish="handleFinishTest"
      @retry="handleRetryTest"
      @close="handleFinishTest"
    />
  </main>
</template>
