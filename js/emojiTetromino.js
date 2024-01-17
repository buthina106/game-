/**
 * @param {number} x width of the grid (uses grid in creation of css)
 */
class EmojiTetromino {
    constructor(x, y, game, emoji) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.emoji = emoji;
    }

     
    draw() { /* Renders the emoji on the game board at its current position. */
        const cell = this.game.getCell(this.x, this.y);
        if (cell) {
            cell.textContent = this.emoji;
            cell.classList.add("occupied");
        }
    }

     
    erase() { /*Removes the emoji from its current position on the game board. */
        const cell = this.game.getCell(this.x, this.y);
        if (cell) {
            cell.textContent = '';
            cell.classList.remove("occupied");
        }
    }r


    /** canrMove()
     * Checks if the tetromino can move to a specified position relative to its current position.
     * 
     * @param {number} dx - The x-axis delta for the movement.
     * @param {number} dy - The y-axis delta for the movement.
     * @returns {boolean} True if the movement is possible, false otherwise.
     */
    canMove(dx, dy) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        return !(newX < 0 || newX >= this.game.boardWidth || newY < 0 || newY >= this.game.boardHeight) && !this.game.getCell(newX, newY).classList.contains("occupied");
    }

   
    moveDown() {   // Moves the tetromino down by one cell if possible.
        if (this.canMove(0, 1)) {
            this.erase();
            this.y++;
            this.draw();
            return true;
        } else {
            this.draw();
            return false;
        }
    }

    moveLeft() {
        if (this.canMove(-1, 0)) {
            this.erase();
            this.x--;
            this.draw();
        }
    }

    moveRight() {
        if (this.canMove(1, 0)) {
            this.erase();
            this.x++;
            this.draw();
        }
    }
}