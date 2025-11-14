import type { Ref } from "vue";
import type { Player } from "./models/player";

export function movePlayer(
  keys: Record<string, boolean>,
  player: Player,
  W: number,
  drawWidth: number,
  drawHeight: number,
  groundY: number,
  facing: Ref<"left" | "right">,
) {
  if (keys["ArrowLeft"] || keys["KeyA"]) {
    player.x -= 4;
    facing.value = "left";
  }
  if (keys["ArrowRight"] || keys["KeyD"]) {
    player.x += 4;
    facing.value = "right";
  }

  // Chặn ra ngoài canvas
  player.x = Math.max(0, Math.min(W - drawWidth, player.x));

  // Nhảy
  if (player.jump) {
    player.y += player.velocity;
    player.velocity += 0.8;

    if (player.y >= groundY - drawHeight) {
      player.y = groundY - drawHeight;
      player.velocity = 0;
      player.jump = false;
    }
  }
}
