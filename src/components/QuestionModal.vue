<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div
      class="w-[420px] bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
    >
      <h2 class="text-2xl font-bold text-slate-800">
        {{ question.question }}
      </h2>

      <button
        v-for="choice in question.choices"
        :key="choice"
        :disabled="answered"
        @click="selectAnswer(choice)"
        class="p-3 rounded-xl text-left font-semibold border transition-all duration-200"
        :class="getButtonClass(choice)"
      >
        {{ choice }}
      </button>

      <!-- Result -->
      <div
        v-if="answered"
        class="text-center mt-4 font-black uppercase tracking-[4px]"
      >
        <div
          v-if="isCorrect"
          class="text-green-500 text-4xl drop-shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-bounce"
        >
          Correct
        </div>

        <div
          v-else
          class="text-red-500 text-4xl drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse"
        >
          Wrong
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Question } from "../types/game";

const props = defineProps<{
  question: Question;
}>();

const emit = defineEmits<{
  (e: "answer", choice: string): void;
}>();

const answered = ref(false);
const selectedChoice = ref("");
const isCorrect = ref(false);

function selectAnswer(choice: string) {
  if (answered.value) return;

  selectedChoice.value = choice;
  answered.value = true;

  isCorrect.value = choice === props.question.answer;

  // delay để người chơi nhìn kết quả
  setTimeout(() => {
    emit("answer", choice);

    answered.value = false;
    selectedChoice.value = "";
  }, 1200);
}

function getButtonClass(choice: string) {
  // chưa trả lời
  if (!answered.value) {
    return `
      bg-white
      text-slate-900
      border-slate-300
      hover:bg-blue-500
      hover:text-white
      hover:border-blue-500
      active:scale-[0.98]
    `;
  }

  // đáp án đúng
  if (choice === props.question.answer) {
    return `
      bg-green-500
      text-white
      border-green-600
      scale-[1.02]
    `;
  }

  // đáp án sai đã chọn
  if (choice === selectedChoice.value && choice !== props.question.answer) {
    return `
      bg-red-500
      text-white
      border-red-600
    `;
  }

  // đáp án còn lại
  return `
    bg-slate-100
    text-slate-400
    border-slate-200
  `;
}
</script>
