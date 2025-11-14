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

onMounted(() => {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.imageSmoothingEnabled = false

  const sprite = new Image()
  sprite.src = rabbitSprite

  sprite.onload = async () => {
    console.log('✅ Sprite loaded:', sprite.width, sprite.height)
    await nextTick()

    const totalFrames = 4
    const frameWidth = sprite.width / totalFrames
    const frameHeight = sprite.height

    // Scale sprite nhỏ hơn
    const scale = 0.05
    const drawWidth = frameWidth * scale
    const drawHeight = frameHeight * scale

    const groundHeight = 10
    const canvasHeight = canvas.value!.height
    const groundY = canvasHeight - groundHeight

    // vi tri tho dung (sat nen)
    y = groundY - drawHeight

    function drawFrame() {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)

      // nen
      ctx.fillStyle = '#e8dcc2'
      ctx.fillRect(0, groundY, canvas.value!.width, groundHeight)

      // bong tho do xuong nen dat
      // ctx.fillStyle = 'rgba(0,0,0,0.2)'
      // const shadowWidth = 16 - Math.abs(velocity * 4)
      // ctx.fillRect(150 + drawWidth / 2 - shadowWidth / 2, groundY - 6, shadowWidth, 4)

      // halo
      ctx.beginPath()
      ctx.ellipse(150 + drawWidth / 2, y + drawHeight / 2, 45 * scale, 45 * scale, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,200,0.4)'
      ctx.fill()

      // hinh tho
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

      // overlay 
      // ctx.fillStyle = 'rgba(255, 200, 200, 0.3)'
      // ctx.fillRect(150, y, drawWidth, drawHeight)

      if (isAnimating.value) frame = (frame + 1) % totalFrames

      //  JUMP PHYSICS 
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

  const handleKey = (e: KeyboardEvent) => {
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
  window.removeEventListener('keydown', () => {})
})
</script>

<template>
  <div class="flex items-center justify-center w-full h-full bg-[#f3efe3] relative">
    <canvas
      ref="canvas"
      class="h-[90vh] block overflow-hidden border border-gray-300 rounded shadow bg-[#faf7ef]"
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
