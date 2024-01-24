/* TO DO:
    - Add logic to show winner and a "play again" button
    - Add logic for turn timer on each board
    - Add logic for symbol input that grays out background and gives setup options
    - Make everything look nicer
*/

const winConditions = [
  0b111000000, 0b000111000, 0b000000111, 0b100100100, 0b010010010, 0b001001001,
  0b100010001, 0b001010100,
];

class Player {
  constructor(symbol, color) {
    this.symbol = symbol;
    this.color = color;
  }

  get symbol() {
    return this._symbol;
  }

  set symbol(sym) {
    this._symbol = sym;
  }

  get color() {
    return this._color;
  }

  set color(col) {
    this._color = col;
  }
}

class TicTacToeBoard {
  constructor(isNewHTML, parentGame) {
    // only create new HTML elements if this is a new board
    if (isNewHTML) {
      this.HTMLElement = document.querySelector(".board-area").cloneNode(true);
      this.generateHTML();
    } else {
      this.HTMLElement = document.querySelector(".board-area");
    }

    this.cells = Array.from(this.HTMLElement.querySelectorAll("td"));
    this.cells.forEach((cell, position) => {
      cell.addEventListener("click", () => {
        if (cell.innerText === "" && this.isInProgress) {
          cell.innerText = this.parentGame.players[this.currentPlayer].symbol;
          this.playerStatuses[this.currentPlayer] |= 1 << position;

          if (this.checkWin()) {
            this.isInProgress = false;
            this.showShroud(
              this.parentGame.players[this.currentPlayer].symbol + " wins!",
              this.parentGame.players[this.currentPlayer].color
            );

            this.parentGame.addWin(this.currentPlayer);
            this.parentGame.checkOverallWin();

            // // use setTimeout to delay alert until after current player symbol displays on the board
            // setTimeout(() => {
            //   alert(`${this.playerSymbols[this.currentPlayer]} Wins!`);
            this.currentPlayer = 0;
            // this.clearBoard();
            // }, 0);

            [this.playerStatuses[0], this.playerStatuses[1]] = [0, 0];
          } else if (this.checkDraw()) {
            this.isInProgress = false;
            this.showShroud("It's a draw!", "rgba(200, 200, 200, 0.9)");

            this.parentGame.addDraw(this.currentPlayer);
            this.parentGame.checkOverallWin();

            // // use setTimeout to delay alert until after current player symbol displays on the board
            // setTimeout(() => {
            //   alert(`It's a draw!`);
            this.currentPlayer = 0;
            //   this.clearBoard();
            // }, 0);

            this.currentPlayer = 0;

            [this.playerStatuses[0], this.playerStatuses[1]] = [0, 0];
          } else {
            this.currentPlayer = this.getNextPlayer();
          }
        }
      });
    });

    this.playerStatuses = [0, 0];
    this.parentGame = parentGame;
    this.isInProgress = false;
    this.currentPlayer = 0;
  }

  checkWin() {
    return winConditions.some(
      (condition) =>
        (this.playerStatuses[this.currentPlayer] & condition) === condition
    );
  }

  checkDraw() {
    return (this.playerStatuses[0] | this.playerStatuses[1]) === 0b111111111;
  }

  getNextPlayer() {
    return this.currentPlayer === 0 ? 1 : 0;
  }

  clearBoard() {
    this.cells.forEach((cell) => (cell.innerText = ""));
  }

  generateHTML() {
    document
      .querySelector(".game-area .board-area:last-of-type")
      .after(this.HTMLElement);
  }

  hideShroud() {
    this.HTMLElement.querySelector(".board-area div").style.display = "none";
  }

  showShroud(text, color) {
    let shroudElement = this.HTMLElement.querySelector(".board-area div");
    shroudElement.style.display = "flex";
    shroudElement.style.backgroundColor = color;
    shroudElement.innerText = text;
  }
}

class TicTacToeGame {
  constructor() {
    this.players = [
      new Player("X", "rgba(77, 148, 255, 0.9)"),
      new Player("O", "rgba(255, 172, 47, 0.9)"),
    ];
    this.boards = [new TicTacToeBoard(false, this)];
    this.maxBoardCount = 20;

    this.setupBlock = document.querySelector("#setup-block");

    this.playButton = document.getElementById("play-button");
    this.playButton.addEventListener("click", () => {
      this.startGame();
    });

    this.symbolInputs = [
      document.getElementById("player-one-symbol-input"),
      document.getElementById("player-two-symbol-input"),
    ];

    this.turnTimerInput = document.getElementById("turn-timer-input");

    this.boardCountInput = document.getElementById("board-count-input");
    this.boardCountInput.addEventListener("input", () => {
      let boardCount = +this.boardCountInput.value;
      if (!isNaN(boardCount)) {
        if (boardCount > this.maxBoardCount) boardCount = this.maxBoardCount;
        else if (boardCount < 1) boardCount = 1;

        if (boardCount > this.boards.length) {
          for (let i = this.boards.length; i < boardCount; i++) {
            this.boards.push(new TicTacToeBoard(true, this));
          }
        } else if (boardCount < this.boards.length && boardCount >= 1) {
          this.boards
            .splice(boardCount, this.boards.length - boardCount)
            .forEach((board) => board.HTMLElement.remove());
        }
      }
    });

    this.wins = [0, 0];
    this.draws = 0;
  }

  hideSetup() {
    this.setupBlock.style.display = "none";
  }

  showSetup() {
    this.setupBlock.style.display = "flex";
  }

  startGame() {
    if (!this.checkDuplicateSymbols()) {
      this.players[0].symbol = this.symbolInputs[0].value;
      this.players[1].symbol = this.symbolInputs[1].value;

      this.boards.forEach((board) => {
        board.isInProgress = true;
        board.clearBoard();
        board.hideShroud();
      });

      this.hideSetup();
    }
  }

  checkDuplicateSymbols() {
    if (
      this.symbolInputs[0].value.trim() === this.symbolInputs[1].value.trim()
    ) {
      alert("Players must have different symbols!");
      return true;
    } else if (this.symbolInputs.some((symbol) => symbol.value.trim() === "")) {
      alert("Player symbol cannot be empty!");
      return true;
    }

    return false;
  }

  addWin(playerIndex) {
    this.wins[playerIndex]++;
  }

  addDraw() {
    this.draws++;
  }

  checkOverallWin() {
    let availableWins = this.boards.length - this.draws;
    if (this.wins[0] > availableWins / 2) {
      console.log("Player 1 wins!");
    } else if (this.wins[1] > availableWins / 2) {
      console.log("Player 2 wins!");
    }
  }
}

const game = new TicTacToeGame();
