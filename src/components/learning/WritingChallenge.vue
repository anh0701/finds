<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { Lightbulb, Mic, Send } from "lucide-vue-next";

const answer = defineModel<string>({ default: "" });

const props = withDefaults(
  defineProps<{
    minWords: number;
    keywords: string[];
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const wordCount = computed(() => {
  return answer.value.trim().split(/\s+/).filter(Boolean).length;
});

const remainingWords = computed(() => {
  return Math.max(0, props.minWords - wordCount.value);
});

const canSubmit = computed(() => {
  return wordCount.value >= props.minWords && !props.disabled;
});

const emit = defineEmits<{
  submit: [];
}>();

function submitAnswer() {
  if (!canSubmit.value) return;
  emit("submit");
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey) {
    event.preventDefault();
    submitAnswer();
  }
}

watch(
  () => props.disabled,
  async (disabled) => {
    if (!disabled) {
      await nextTick();
      textareaRef.value?.focus();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3">
      <p class="text-sm font-medium text-slate-300">Your answer</p>

      <span class="text-xs text-slate-400">
        {{ wordCount }} / {{ minWords }} words
      </span>
    </div>

    <textarea
      ref="textareaRef"
      v-model="answer"
      :disabled="disabled"
      :placeholder="'Type your answer here...'"
      rows="4"
      class="w-full resize-none rounded-xl border border-slate-600 bg-slate-900/80 p-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
      @keydown="handleKeydown"
    />

    <div class="flex items-center justify-between gap-3">
      <p
        class="text-xs"
        :class="remainingWords > 0 ? 'text-amber-400' : 'text-emerald-400'"
      >
        <template v-if="remainingWords > 0">
          {{ remainingWords }} more words needed
        </template>
        <template v-else> Minimum word count reached </template>
      </p>

      <span class="flex items-center gap-1 text-xs text-slate-400">
        <Mic class="h-3.5 w-3.5" />
        Voice typing supported
      </span>
    </div>

    <div class="rounded-lg bg-slate-800/70 p-3">
      <div
        class="mb-1 flex items-center gap-2 text-xs font-medium text-cyan-300"
      >
        <Lightbulb class="h-4 w-4" />
        Writing tips
      </div>

      <p class="text-xs text-slate-400">
        Write at least {{ minWords }} words.
        <template v-if="keywords.length">
          Required keywords: {{ keywords.join(", ") }}
        </template>
        <template v-else> No required keywords. </template>
      </p>
    </div>

    <button
      type="button"
      :disabled="!canSubmit"
      class="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      @click="submitAnswer"
    >
      <Send class="h-4 w-4" />
      Submit answer
      <span class="text-xs font-normal opacity-70">(Enter)</span>
    </button>
  </div>
</template>
