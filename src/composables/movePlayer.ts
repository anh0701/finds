import type { Player } from "./models/player";

export function movePlayer(keys: Record<string, boolean>, player: Player) {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  // Giới hạn trong canvas
  player.x = Math.max(0, Math.min(600 - player.size, player.x));
  player.y = Math.max(0, Math.min(400 - player.size, player.y));
}
