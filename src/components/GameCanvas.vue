<template>
  <div class="flex justify-center mt-5">
    <canvas class="bg-[#222] border-2 border-[#555]" 
    ref="canvas" width="600" height="400">
  </canvas>
  </div>
</template>

<script lang="ts" setup>

import { movePlayer } from '@/composables/movePlayer';
import type { Player } from '@/composables/models/player';
import { onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

const player: Player = {
  x: 100,
  y: 100,
  size: 40,
  color: 'orange',
  speed: 4,
}

const keys: Record<string, boolean>  = {}

function draw() {
  if (!ctx) return

  ctx.clearRect(0, 0, 600, 400)
  ctx.fillStyle = player.color
  ctx.fillRect(player.x, player.y, player.size, player.size)
}

function gameLoop() {
  movePlayer(keys, player)
  draw()
  requestAnimationFrame(gameLoop)
}

onMounted(() => {
  const context = canvas.value?.getContext('2d')
  if (!context) return
  ctx = context

  document.addEventListener('keydown', e => (keys[e.key] = true))
  document.addEventListener('keyup', e => (keys[e.key] = false))

  gameLoop()
})
</script>

