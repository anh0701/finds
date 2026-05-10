import type { Obstacle } from "./models/obstacle";
import type { Player } from "./models/player";

export function isColliding(
  player: Player,
  pw: number,
  ph: number,
  obstacle: Obstacle,
): boolean {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + pw > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + ph > obstacle.y
  );
}
