<script setup lang="ts">
const model = defineModel<string>({ default: '' })

defineProps<{
  options: string[]
  disabled?: boolean
}>()
</script>

<template>
  <div class="space-y-3">
    <button
      v-for="(option, index) in options"
      :key="option"
      type="button"
      :disabled="disabled"
      class="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-not-allowed"
      :class="
        model === option
          ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300'
          : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10'
      "
      @click="model = option"
    >
      <span
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
        :class="
          model === option
            ? 'bg-emerald-400 text-slate-950'
            : 'bg-white/10 text-slate-400'
        "
      >
        {{ String.fromCharCode(65 + index) }}
      </span>

      <span class="text-sm font-medium">
        {{ option }}
      </span>
    </button>
  </div>
</template>