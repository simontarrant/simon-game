class Game {

    level = 0;
    static hiScore;
    colSequence = [];
    currCol = 0;
    static SQUARES = ["red", "blue", "green", "yellow"];
    

    constructor() {
        if (!this.hiScore) {
            this.hiScore = 0;
        }
        this.addButtonListeners();
    }

    addButtonListeners() {
        Game.SQUARES.forEach((square) => {
            const squareElem = document.getElementById(square);
            squareElem.addEventListener("click", (event) => {
                this.validateMove(event.target);
            });
        });
    }

    // GAME LOGIC METHODS
    reset() {
        this.level = 0;
        this.colSequence = [];
    }

    nextLevel() {
        this.level++;
        this.currCol = 0;
        this.hiScore = Math.max(this.level, this.hiScore);
        this.colSequence.push(this.getRandInt());
        this.disableGameScreen();
        this.displayLevel();
    }

    disableGameScreen() {
        const gameArea = document.querySelector(".game");
        gameArea.classList.add("disabled");
    }

    getRandInt() {
        return Math.floor(Math.random() * Game.SQUARES.length);
    }

    // VALIDATING USER INPUT
    validateMove(eventTarget) {
        if (eventTarget.id !== Game.SQUARES[this.colSequence[this.currCol]]) {
            this.levelFailed();
            return;
        }
        this.currCol++;
        if (this.currCol === this.colSequence.length) {
            this.levelPassed();
        }
    }

    levelFailed() {
        console.log("level failed");
        this.reset();
        const startBtn = document.querySelector(".game-help__start");
        startBtn.querySelector("p").innerText = "Play Again?";
        this.animateLevel("fail");
    }

    levelPassed() {
        console.log("level passed");
        this.animateLevel("success");
        this.nextLevel();
    }

    animateLevel(successOrFail) {

        const gameClass = "game--" + successOrFail;
        const gameClassNormal = "game--normal";
        this.toggleGame(gameClass, gameClassNormal);
        setTimeout(() => {
            this.toggleGame(gameClass, gameClassNormal);
        }, 300);

        Game.SQUARES.forEach((square) => {
            const squareClass = "game__square--" + successOrFail;
            this.toggleSquare(square, squareClass);
            setTimeout(() => {
                this.toggleSquare(square, squareClass);
            }, 300);
        });
    }

    toggleSquare(square, squareClass) {
        const squareElem = document.getElementById(square);
        squareElem.classList.toggle(squareClass);
    }

    toggleGame(gameClass, gameClassNormal) {
        const gameElem = document.querySelector(".game");
        gameElem.classList.toggle(gameClass);
        gameElem.classList.toggle(gameClassNormal);
    }

    // METHODS FOR ANIMATING EACH LEVEL
    displayLevel() {
        this.updateScores();
        let timeOutTime = Math.max(300, 1000 - 50 * this.level);
        this.highlightSquares(0, timeOutTime);
    }

    // Sequentially highlight all squares in current level's color sequence
    // Recursively calls inside a set timeout so highlights do not occur at same time
    // idx: idx of current colour in colSequence
    // timeOutTime: duration of square highlight
    highlightSquares(idx, timeOutTime) {
        // Base case, end of color list, enable screen again after delay
        if (idx === this.colSequence.length) {
            setTimeout(() => {
                const gameArea = document.querySelector(".game");
                gameArea.classList.remove("disabled");
            }, 500);
            return;
        }

        // Recursive case: highlight current color, and recurse with next index
        setTimeout(() => {
            let square = Game.SQUARES[this.colSequence[idx]];

            this.highlightSquare(square);

            // Unhighlight after a delay, before next colour highlights
            setTimeout(() => {
                this.unhighlightSquare(square);
            }, timeOutTime * 4 / 5);

            this.highlightSquares(idx + 1, timeOutTime);

        }, timeOutTime);
    }

    // Add activate (highlight) class to a square
    highlightSquare(square) {
        const squareElem = document.getElementById(square);
        squareElem.classList.add("game__" + square + "--activate");
    }

    // Remove activate (highlight) class from a square
    unhighlightSquare(square) {
        const squareElem = document.getElementById(square);
        squareElem.classList.remove("game__" + square + "--activate");
    }

    // Update current and high scores
    updateScores() {
        const currScoreElem = document.querySelector(".curr-score");
        const hiScoreElem = document.querySelector(".hi-score");
        currScoreElem.innerText = this.level;
        hiScoreElem.innerText = this.hiScore;
    } 
}

/***************** Start of program **********************/

let game;
const startBtn = document.querySelector(".game-help__start");

// Listen for clicks on start/reset/play again button to start game
startBtn.addEventListener("click", () => {
    if (!game) game = new Game();

    startBtn.querySelector("p").innerText = "restart";

    game.reset();
    game.nextLevel();
});


