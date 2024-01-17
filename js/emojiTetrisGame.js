
  // Class representing the Emoji Tetris game.
  // Manages game logic, board state, score, and player interactions.

class EmojiTetrisGame {
  constructor(playerName, initialScore, level) {
    this.boardWidth = 10;
    this.boardHeight = 20;
    this.gameBoard = document.getElementById("gameBoard");
    this.scoreElement = document.getElementById("score");
    this.nextEmojiElement = document.getElementById("nextEmoji");
    this.lastScoreIcon = document.getElementById("lastScoreIcon");
    this.emojiCounts = { "😍": 0, "😃": 0, "🤔": 0, "🙄": 0, "😜": 0 };
    this.emojies = ["😍", "😃", "🤔", "🙄", "😜"];
    this.moveInterval = level === "easy" ? 300 : 150;
    this.score = initialScore;
    this.interval = null;
    this.nextEmoji = this.randomEmoji();
    this.updateNextEmojiDisplay();
    this.playerName = playerName;
    this.matchCount = 0;
    this.targetMatchCount = 10;
    this.targetScore = 100;
    this.createGameBoard();
    this.tetromino = this.randomEmojiTetromino();
    this.tetromino.draw();
    this.setupControls();
    this.startGameLoop();
  }

  // [rest of the createGameBoard method]
  createGameBoard() {
    for (let row = 0; row < this.boardHeight; row++) {
      for (let col = 0; col < this.boardWidth; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        this.gameBoard.appendChild(cell);
      }
    }
  }

  randomEmojiTetromino() {
    const x = Math.floor(Math.random() * this.boardWidth);
    const y = 0;
    const tetromino = new EmojiTetromino(x, y, this, this.nextEmoji);
    this.nextEmoji = this.randomEmoji();
    this.updateNextEmojiDisplay();
    return tetromino;
  }

  /**
   * Selects a random emoji from the available emojis.
   * @returns {string} A random emoji character.
   */

  randomEmoji() {
    return this.emojies[Math.floor(Math.random() * this.emojies.length)];
  }

  updateNextEmojiDisplay() {
    this.nextEmojiElement.textContent = this.nextEmoji;
  }


  /**
   * Updates the player's score and checks for the win condition.
   * @param {number} points - Points to add to the current score.
   */

  updateScore(points) {
    this.score += points;
    this.scoreElement.textContent = this.score;
    this.updateLastScoreIcon();
    if (this.score >= this.targetScore) {
      this.endGame("Congratulations! You've reached 100 points!", true);
    }
  }

  /**
   * Updates the display of the last score icon.
   */
  updateLastScoreIcon() {
    if (this.lastScoreIcon) {
      this.lastScoreIcon.innerHTML = `<img src="path/to/icon.png" alt="Last Score Icon"> ${this.playerName}: ${this.score}`;
    }
  }


  /**
   * Updates the count of matched emojis and checks for the win condition.
   * @param {string} emoji - The emoji to update the count for.
   */
  updateEmojiCounts(emoji) {
    this.emojiCounts[emoji]++;
    for (let i = 1; i <= this.emojies.length; i++) {
      document.getElementById(`emojiCount${i}`).textContent = `${
        this.emojies[i - 1]
      }: ${this.emojiCounts[this.emojies[i - 1]]}`;
    }

    if (this.emojiCounts[emoji] === this.targetMatchCount) {
      this.matchCount++;
      if (this.matchCount === this.emojies.length) {
        if (this.remainingTime > 0) {
          this.endGame(
            `Congratulations, ${this.playerName}! You've matched each emoji ${this.targetMatchCount} times.`,
            true
          );
        }
      }
    }
  }

  /**
   * Starts the main game loop with a set interval.
   */
  startGameLoop() {
    this.interval = setInterval(() => this.gameLoop(), this.moveInterval);
    this.startTime = Date.now();
    this.remainingTime = 120; // 2 minutes in seconds
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
  }

  updateTimer() {
    this.remainingTime--;
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    document.getElementById("timer").textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (this.remainingTime <= 0) {
      this.endGame("Time's up!", false);
    } else if (this.isGameOver()) {
      this.endGame("Reached the top!", false);
    }
  }


  /**
   * Ends the game and displays an appropriate message based on win or loss.
   * @param {string} message - The message to display at the end of the game.
   * @param {boolean} isWin - Flag to indicate if the game ended in a win.
   */
  endGame(message, isWin) {
    clearInterval(this.interval);
    clearInterval(this.timerInterval);
    let username = localStorage.getItem("playerName");
    let finalScore = localStorage.setItem(`${username}_lastScore`, this.score);

    if (isWin) {
      Swal.fire({
        title: "Congratulations!",
        text: `Congratulations, ${this.playerName}! Your score is ${this.score} points.`,
        icon: "success",
        confirmButtonText: "Play Again",
      }).then(() => this.restartGame());
    } else {
      Swal.fire({
        title: "Game Over!",
        text: message,
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Play Again",
        cancelButtonText: "Return to Home Page",
      }).then((result) => {
        if (result.isConfirmed) {
          this.restartGame();
        } else {
          console.log("Redirecting to the index page...");
          window.location.href = "./index.html"; // Redirect to the index page
        }
      });
    }
  }


  /**
   * Checks if the game is over (if any column is filled to the top).
   * @returns {boolean} True if the game is over, false otherwise.
   */
  isGameOver() {
    for (let col = 0; col < this.boardWidth; col++) {
      if (this.getCell(col, 0).classList.contains("occupied")) {
        return true;
      }
    }
    return false;
  }

  /**
   * Main game loop that moves the tetromino down and checks game state.
   */
  gameLoop() {
    if (!this.tetromino.moveDown()) {
      if (this.isGameOver()) {
        this.endGame("Reached the top!", false);
        return;
      }
      this.checkLines();
      this.tetromino = this.randomEmojiTetromino();
    }
  }

  /**
   * Checks for and clears complete lines of emojis.
   */
  checkLines() {
    for (let row = 0; row < this.boardHeight; row++) {
      for (let col = 0; col < this.boardWidth; col++) {
        this.checkLine(row, col, 0, 1); // Horizontal
        this.checkLine(row, col, 1, 0); // Vertical
      }
    }
  }


  /**
   * Checks for a complete line of emojis in a given direction.
   * @param {number} startRow - The starting row for the check.
   * @param {number} startCol - The starting column for the check.
   * @param {number} dx - The x-axis delta for checking the line.
   * @param {number} dy - The y-axis delta for checking the line.
   */
  checkLine(startRow, startCol, dx, dy) {
    let matchCount = 0;
    const emoji = this.getCell(startCol, startRow).textContent;
    if (emoji === "") return;

    for (let i = 0; i < 4; i++) {
      const x = startCol + dx * i;
      const y = startRow + dy * i;
      if (x >= this.boardWidth || y >= this.boardHeight) break;
      if (this.getCell(x, y).textContent === emoji) {
        matchCount++;
      } else {
        break;
      }
    }

    if (matchCount === 4) {
      for (let i = 0; i < 4; i++) {
        const x = startCol + dx * i;
        const y = startRow + dy * i;
        const cell = this.getCell(x, y);
        cell.textContent = "";
        cell.classList.remove("occupied");
      }
      this.updateScore(10);
      this.updateEmojiCounts(emoji); // Update emoji counts
      this.moveEmojisDown(startRow);
    }
  }


  /**
   * Moves emojis down after a line has been cleared.
   * @param {number} startRow - The row from where emojis need to be moved down.
   */
  moveEmojisDown(startRow) {
    for (let row = startRow - 1; row >= 0; row--) {
      for (let col = 0; col < this.boardWidth; col++) {
        const cell = this.getCell(col, row);
        const belowCell = this.getCell(col, row + 1);
        if (
          cell.classList.contains("occupied") &&
          !belowCell.classList.contains("occupied")
        ) {
          belowCell.textContent = cell.textContent;
          belowCell.classList.add("occupied");
          cell.textContent = "";
          cell.classList.remove("occupied");
        }
      }
    }
  }


  /**
   * Retrieves the cell DOM element at a given coordinate on the game board.
   * @param {number} x - The x-coordinate of the cell.
   * @param {number} y - The y-coordinate of the cell.
   * @returns {Element} The DOM element of the cell.
   */
  getCell(x, y) {
    return this.gameBoard.childNodes[y * this.boardWidth + x];
  }

  setupControls() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        this.tetromino.moveLeft();
      } else if (event.key === "ArrowRight") {
        this.tetromino.moveRight();
      } else if (event.key === " ") {
        while (this.tetromino.moveDown()) {}
      }
    });
  }
  
  startGameLoop() {
    this.interval = setInterval(() => this.gameLoop(), this.moveInterval);
    this.startTime = Date.now();
    this.remainingTime = 120; // 2minutes//
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
  }

  /**
   * Restarts the game by reloading the page.
   */
  restartGame() {
    location.reload();
  }
}
