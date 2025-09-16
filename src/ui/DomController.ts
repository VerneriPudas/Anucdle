import { Game } from "../game/Game";

export class DomController {
  constructor(private game: Game) {}

  bindEvents() {
    const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
    const showBtn = document.getElementById("showBtn") as HTMLButtonElement;
    const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
    const colorblindBtn = document.getElementById(
      "colorblindBtn"
    ) as HTMLButtonElement;
    const guessInput = document.getElementById(
      "guessInput"
    ) as HTMLInputElement;
    const result = document.getElementById("result") as HTMLParagraphElement;
    const iframe = document.getElementById("ytplayer") as HTMLIFrameElement;
    const cover = document.getElementById("cover") as HTMLDivElement;

    // Add a container for previous guesses
    let guessesDiv = document.getElementById("guesses");
    if (!guessesDiv) {
      guessesDiv = document.createElement("div");
      guessesDiv.id = "guesses";
      guessInput.parentElement?.insertBefore(
        guessesDiv,
        guessInput.nextSibling
      );
    }

    let guesses: string[] = [];
    let attempts = 0;
    const maxAttempts = 6;
    let gameOver = false;
    let colorblindMode = false;

    // Highlight matching parts of guess in green

    // Highlight matching substrings in green, others in red
    const highlightGuess = (guess: string, answer: string): string => {
      if (!answer) return guess;
      let result = "";
      let i = 0;
      const lowerGuess = guess.toLowerCase();
      const lowerAnswer = answer.toLowerCase();
      // Colorblind-friendly palette: blue for correct, orange for incorrect
      const correctColor = colorblindMode ? "#0072B2" : "green";
      const wrongColor = colorblindMode ? "#E69F00" : "red";
      while (i < guess.length) {
        let found = "";
        // Try to find the longest matching substring starting at i
        for (let len = guess.length - i; len > 0; len--) {
          const substr = lowerGuess.substr(i, len);
          if (substr.length > 0 && lowerAnswer.includes(substr)) {
            found = guess.substr(i, len);
            break;
          }
        }
        if (found) {
          result += `<span style="color:${correctColor};font-weight:bold;">${found}</span>`;
          i += found.length;
        } else {
          result += `<span style="color:${wrongColor};">${guess[i]}</span>`;
          i++;
        }
      }
      return result;
    };

    colorblindBtn.addEventListener("click", () => {
      colorblindMode = !colorblindMode;
      colorblindBtn.textContent = colorblindMode
        ? "Standard Colors"
        : "Colorblind Mode";
      updateGuessesDisplay();
    });

    const updateGuessesDisplay = () => {
      const answer = this.game.getAnswer();
      // Use the same normalization as in Game.ts
      function normalize(str: string): string {
        return str
          .toLowerCase()
          .replace(/[.,*\-–—_!?:;"'`~()\[\]{}|\\/]/g, " ")
          .split(/\s+/)
          .filter(
            (word) =>
              word &&
              ![
                "cover",
                "by",
                "ost",
                "anuc",
                "the",
                "a",
                "and",
                "for",
                "on",
                "in",
                "of",
                "to",
                "with",
                "at",
                "from",
                "as",
                "is",
                "has",
                "been",
                "due",
                "you",
                "my",
                "me",
                "we",
                "are",
                "how",
                "did",
                "can",
                "like",
                "up",
                "little",
                "years",
                "attack",
                "titan",
                "removed",
                "copyright",
                "issues",
                "anucatittawan",
                "อนัค",
                "อนัค",
                "จงรัก",
                "ใจรัก",
                "บุพเพสันนิวาส",
              ].includes(word)
          )
          .join(" ");
      }
      const normAnswer = normalize(answer);
      guessesDiv!.innerHTML = guesses
        .map((g) => {
          const normGuess = normalize(g);
          let indicator = "";
          if (normGuess.length < normAnswer.length) {
            indicator = ' <span style="color:gray;">(shorter)</span>';
          } else if (normGuess.length > normAnswer.length) {
            indicator = ' <span style="color:gray;">(longer)</span>';
          }
          return `<div>${highlightGuess(g, answer)}${indicator}</div>`;
        })
        .join("");
    };

    function resetGame() {
      guesses = [];
      attempts = 0;
      gameOver = false;
      result.textContent = "";
      updateGuessesDisplay();
      guessInput.value = "";
      guessInput.disabled = false;
      submitBtn.disabled = false;
    }

    startBtn.addEventListener("click", () => {
      const videoId = this.game.start();
      iframe.src = `https://www.youtube.com/embed/${videoId}?&autoplay=1&mute=0`;
      iframe.style.display = "block";
      cover.style.display = "flex";
      cover.textContent = "It's Anuc time!";
      resetGame();
    });

    // Show video button: reveals the iframe for manual playback
    showBtn.addEventListener("click", () => {
      iframe.style.display = "block"; // unhide iframe
      cover.style.display = "none"; // hide cover
    });

    /* On form submit */

    const guessForm = document.getElementById("guess-form") as HTMLFormElement;
    guessForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (gameOver) return;

      const guess = guessInput.value;
      guesses.push(guess);
      attempts++;
      updateGuessesDisplay();

      if (this.game.checkGuess(guess)) {
        result.textContent = "✅ Correct!";
        gameOver = true;
        guessInput.disabled = true;
        submitBtn.disabled = true;
      } else if (attempts >= maxAttempts) {
        result.textContent = `❌ Out of tries! The answer was: ${this.game.getAnswer()}`;
        gameOver = true;
        guessInput.disabled = true;
        submitBtn.disabled = true;
      } else {
        result.textContent = `❌ Wrong! Attempts left: ${
          maxAttempts - attempts
        }`;
      }
      guessInput.value = "";
    });

    /*
    // Submit guess button
    submitBtn.addEventListener("click", () => {
      if (gameOver) return;
      const guess = guessInput.value;
      guesses.push(guess);
      attempts++;
      updateGuessesDisplay();
      if (this.game.checkGuess(guess)) {
        result.textContent = "✅ Correct!";
        gameOver = true;
        guessInput.disabled = true;
        submitBtn.disabled = true;
      } else if (attempts >= maxAttempts) {
        result.textContent = `❌ Out of tries! The answer was: ${this.game.getAnswer()}`;
        gameOver = true;
        guessInput.disabled = true;
        submitBtn.disabled = true;
      } else {
        result.textContent = `❌ Wrong! Attempts left: ${
          maxAttempts - attempts
        }`;
      }
      guessInput.value = "";
    });
    */
  }
}
