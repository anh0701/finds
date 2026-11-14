export function useSpeech() {
  function speak(text: string) {
    window.speechSynthesis.cancel();

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let index = 0;

    function speakNext() {
      if (index >= lines.length) return;

      const utterance = new SpeechSynthesisUtterance(lines[index]);

      utterance.lang = "en-US";
      utterance.rate = 0.85;

      utterance.onend = () => {
        index++;
        setTimeout(speakNext, 600)
      };

      window.speechSynthesis.speak(utterance);
    }

    speakNext();
  }

  function stop() {
    window.speechSynthesis.cancel();
  }

  return {
    speak,
    stop,
  };
}
