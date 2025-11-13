<script lang="ts" setup>
</script>

<template>
  <div class="game-container">
    <canvas ref="canvas" width="600" height="400"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const canvas = ref(null)
let ctx

const player = {
  x: 100,
  y: 100,
  size: 40,
  color: 'orange',
  speed: 4,
}

const keys = {}

function update() {
  if (keys['ArrowUp']) player.y -= player.speed
  if (keys['ArrowDown']) player.y += player.speed
  if (keys['ArrowLeft']) player.x -= player.speed
  if (keys['ArrowRight']) player.x += player.speed

  // Giới hạn trong canvas
  player.x = Math.max(0, Math.min(600 - player.size, player.x))
  player.y = Math.max(0, Math.min(400 - player.size, player.y))
}

function draw() {
  ctx.clearRect(0, 0, 600, 400)
  ctx.fillStyle = player.color
  ctx.fillRect(player.x, player.y, player.size, player.size)
}

function gameLoop() {
  update()
  draw()
  requestAnimationFrame(gameLoop)
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')

  document.addEventListener('keydown', e => (keys[e.key] = true))
  document.addEventListener('keyup', e => (keys[e.key] = false))

  gameLoop()
})
</script>

<style scoped>
.game-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
canvas {
  background: #222;
  border: 2px solid #555;
}
</style>
