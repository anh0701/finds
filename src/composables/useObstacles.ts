import { ref } from "vue";
import type { Obstacle } from "./models/obstacle";

export function useObstacles() {
  const obstacles = ref<Obstacle[]>([
    { x: 200, y: 0, width: 40, height: 40 },
    { x: 400, y: 0, width: 60, height: 30 },
  ]);

  function placeOnGround(groundY: number) {
    obstacles.value = obstacles.value.map((o) => ({
      ...o,
      y: groundY - o.height,
    }));
  }

  function drawObstacles(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#8b5e3b";
    obstacles.value.forEach((obs) => {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
  }

  return {
    obstacles,
    placeOnGround,
    drawObstacles,
  };
}
