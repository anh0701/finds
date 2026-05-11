import { ref, onMounted, onUnmounted } from "vue";

export function useKeyboard() {
  const keys = ref<Record<string, boolean>>({});

  const down = (e: KeyboardEvent) => {
    keys.value[e.code] = true;
  };

  const up = (e: KeyboardEvent) => {
    keys.value[e.code] = false;
  };

  onMounted(() => {
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
  });

  return { keys };
}
