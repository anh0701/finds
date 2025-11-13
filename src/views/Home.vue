<script lang="ts" setup>
import { useCounter } from "@/composables/useCounter";
import ButtonPrimary from "@/components/ButtonPrimary.vue";
import GameCanvas from "@/components/GameCanvas.vue";

const { count, increment } = useCounter(0);
</script>

<template>
  <div class="text-center mt-10">
    <h1 class="text-3xl font-bold text-blue-600">Demo Counter Game</h1>
    <p>Count: {{ count }}</p>
    <ButtonPrimary label="Increment" @click="increment" />
    <GameCanvas />
  </div>
</template>
