import { ref } from 'vue';

export function useCounter(initial: number = 0) {
  const count = ref<number>(initial);

  const increment = (): void => {
    count.value++;
  }

  const decrement = (): void => {
    count.value--;
  }
  
  return { count, increment, decrement };
}
