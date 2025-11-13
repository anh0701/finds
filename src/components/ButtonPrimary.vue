<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps<{ label: string }>();
</script>

<template>
  <button
    class="bg-[#4f46e5] text-white px-5 py-2.5 rounded-md cursor-pointer transition duration-200 hover:bg-[#3730a3]"
  >
    {{ props.label }}
  </button>
</template>
