<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{ label: string }>();
</script>

<template>
  <button class="btn-primary">{{ props.label }}</button>
</template>

<style scoped>
.btn-primary {
  background-color: #4f46e5;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-primary:hover {
  background-color: #3730a3;
}
</style>
