<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import rabbitSprite from '@/assets/rabbit_sprites.png'

const canvas = ref<HTMLCanvasElement | null>(null)
const isAnimating = ref(true)

let jump = false
let y = 0
let velocity = 0
let frame = 0
let intervalId: number | undefined

let handleKey: (e: KeyboardEvent) => void

onMounted(async () => {
  await nextTick()

  const canvasEl = canvas.value!
  const ctx = canvasEl.getContext('2d')
  if (!ctx) return

  // scale dung ti le 
  const rect = canvasEl.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1

  canvasEl.width = rect.width * dpr
  canvasEl.height = rect.height * dpr

  ctx.scale(dpr, dpr)
  ctx.imageSmoothingEnabled = false

  const logicalWidth = rect.width
  const logicalHeight = rect.height

  const sprite = new Image()
  sprite.src = rabbitSprite

  sprite.onload = () => {
    const totalFrames = 4
    const frameWidth = sprite.width / totalFrames
    const frameHeight = sprite.height

    const scale = 0.25
    const drawWidth = frameWidth * scale
    const drawHeight = frameHeight * scale

    const groundHeight = 20
    const groundY = logicalHeight - groundHeight

    // vị trí đứng của thỏ
    y = groundY - drawHeight

    function drawFrame() {
      if(!ctx) return
      ctx.clearRect(0, 0, logicalWidth, logicalHeight)

      // nền đất
      ctx.fillStyle = '#e8dcc2'
      ctx.fillRect(0, groundY, logicalWidth, groundHeight)

      // halo
      ctx.beginPath()
      ctx.ellipse(
        150 + drawWidth / 2,
        y + drawHeight / 2,
        55 * scale,
        55 * scale,
        0,
        0,
        Math.PI * 2
      )
      ctx.fillStyle = 'rgba(255,255,200,0.35)'
      ctx.fill()

      // sprite thỏ
      ctx.drawImage(
        sprite,
        frame * frameWidth,
        0,
        frameWidth,
        frameHeight,
        50,
        y,
        drawWidth,
        drawHeight
      )

      // animation
      if (isAnimating.value) frame = (frame + 1) % totalFrames

      // jump physics
      if (jump) {
        y += velocity
        velocity += 0.8
        if (y >= groundY - drawHeight) {
          y = groundY - drawHeight
          velocity = 0
          jump = false
        }
      }
    }

    intervalId = window.setInterval(drawFrame, 120)
  }


  handleKey = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !jump) {
      jump = true
      velocity = -10
    } else if (e.key.toLowerCase() === 's') {
      isAnimating.value = !isAnimating.value
    }
  }

  window.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
  window.removeEventListener('keydown', handleKey)
})
</script>

<template>
  <div class="flex items-center justify-center w-full h-full bg-[#f3efe3] relative">
    <canvas
      ref="canvas"
      class="h-[90vh] w-[90vw] block overflow-hidden border border-gray-300 rounded shadow bg-[#faf7ef]"
    ></canvas>

    <div class="absolute top-2 left-2 text-sm text-gray-700 font-mono">
      Space: nhảy • S: bật/tắt animation
    </div>
  </div>
</template>

<style scoped>
canvas {
  image-rendering: pixelated;
}
</style>
