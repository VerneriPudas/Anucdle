import { Game } from "../game/Game";

export class DomController {
  constructor(private game: Game) {}

  bindEvents() {
    const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
    const showBtn = document.getElementById("showBtn") as HTMLButtonElement;
    const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
    const guessInput = document.getElementById("guessInput") as HTMLInputElement;
    const result = document.getElementById("result") as HTMLParagraphElement;
    const iframe = document.getElementById("ytplayer") as HTMLIFrameElement;
    const cover = document.getElementById("cover") as HTMLDivElement;

    startBtn.addEventListener("click", () => {
      const videoId = this.game.start();
      iframe.src = `https://www.youtube.com/embed/${videoId}?&autoplay=1&mute=0`;
      iframe.style.display = "block";
      cover.style.display = "flex";
      cover.textContent = "It's Anuc time!";
    });

    // Show video button: reveals the iframe for manual playback
    showBtn.addEventListener("click", () => {
      iframe.style.display = "block"; // unhide iframe
      cover.style.display = "none";    // hide cover
    });

    // Submit guess button
    submitBtn.addEventListener("click", () => {
      const guess = guessInput.value;
      if (this.game.checkGuess(guess)) {
        result.textContent = "✅ Correct!";
      } else {
        result.textContent = `❌ Wrong! The answer was: ${this.game.getAnswer()}`;
      }
    });
  }
}
