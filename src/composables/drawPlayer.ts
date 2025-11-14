import type { Ref } from "vue";
import type { Player } from "./models/player";

export function draw(
  ctx: any,
  groundY: number,
  W: number,
  H: number,
  groundHeight: number,
  player: Ref<Player>,
  drawHeight: number,
  drawWidth: number,
  scale: number,
  facing: Ref<"left" | "right">,
  sprite: any,
  frame: Ref<number>,
  frameWidth: number,
  frameHeight: number,
  isAnimating: Ref<true | false>,
  totalFrames: number,
) {
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);

  // nền đất
  ctx.fillStyle = "#e8dcc2";
  ctx.fillRect(0, groundY, W, groundHeight);

  // shadow
  ctx.beginPath();
  ctx.ellipse(
    player.value.x + drawWidth / 2,
    player.value.y + drawHeight / 2,
    55 * scale,
    55 * scale,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = "rgba(255,255,200,0.35)";
  ctx.fill();

  ctx.save();

  if (facing.value === "left") {
    // lật ngang theo trục x
    ctx.translate(player.value.x + drawWidth / 2, 0);
    ctx.scale(-1, 1);
    ctx.translate(-(player.value.x + drawWidth / 2), 0);
  }

  // sprite thỏ
  ctx.drawImage(
    sprite,
    frame.value * frameWidth,
    0,
    frameWidth,
    frameHeight,
    player.value.x,
    player.value.y,
    drawWidth,
    drawHeight,
  );

  ctx.restore();

  // animation
  if (isAnimating.value) frame.value = (frame.value + 1) % totalFrames;
}
