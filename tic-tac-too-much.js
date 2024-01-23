/* TO DO:
    - Add logic to determine when a full game is over and show the setup block again
    - Add logic to determine who wins the overall game by counting who won each board
    - Add logic for turn timer on each board
    - Add logic for symbol input that grays out background and gives setup options
    - Make everything look nicer
*/

const winConditions = [
  0b111000000, 0b000111000, 0b000000111, 0b100100100, 0b010010010, 0b001001001,
  0b100010001, 0b001010100,
];

class Player {
  constructor(symbol) {
    this.symbol = symbol;
  }

  get symbol() {
    return this._symbol;
  }

  set symbol(symbol) {
    this._symbol = symbol;
  }
}

class TicTacToeBoard {
  constructor(isNewHTML, ...playerSymbols) {
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
          cell.innerText = this.playerSymbols[this.currentPlayer];
          this.playerStatuses[this.currentPlayer] |= 1 << position;

          if (this.checkWin()) {
            this.isInProgress = false;
            this.showShroud(this.playerSymbols[this.currentPlayer] + " wins!");

            // // use setTimeout to delay alert until after current player symbol displays on the board
            // setTimeout(() => {
            //   alert(`${this.playerSymbols[this.currentPlayer]} Wins!`);
            this.currentPlayer = 0;
            // this.clearBoard();
            // }, 0);

            [this.playerStatuses[0], this.playerStatuses[1]] = [0, 0];
          } else if (this.checkDraw()) {
            this.isInProgress = false;
            this.showShroud("It's a draw!");

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
    this.playerSymbols = playerSymbols;
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

  showShroud(text) {
    let shroudElement = this.HTMLElement.querySelector(".board-area div");
    shroudElement.style.display = "flex";
    shroudElement.innerText = text;
  }
}

class TicTacToeGame {
  constructor() {
    this.players = [new Player("X"), new Player("O")];
    this.boards = [new TicTacToeBoard(false, "", "")];
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
            this.boards.push(new TicTacToeBoard(true, "", ""));
          }
        } else if (boardCount < this.boards.length && boardCount >= 1) {
          this.boards
            .splice(boardCount, this.boards.length - boardCount)
            .forEach((board) => board.HTMLElement.remove());
        }
      }
    });
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
        board.playerSymbols = [this.players[0].symbol, this.players[1].symbol];
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
}

const game = new TicTacToeGame();
document.getElementById("TEST-BUTTON").addEventListener("click", () => {
  document.querySelector(".board-area div").style.display = "none";
});
// const cells = Array.from(document.getElementsByClassName("cell"));
// const symbolInputGroup = document
//   .getElementsByClassName("symbol-input-group")
//   .item(0);
// const symbolInputs = Array.from(
//   document.getElementsByClassName("symbol-input")
// );
// const playButton = document.getElementById("play-button");

// const playerSymbols = [];
// const playerStatus = [0, 0];
// const winConditions = [
//   0b111000000, 0b000111000, 0b000000111, 0b100100100, 0b010010010, 0b001001001,
//   0b100010001, 0b001010100,
// ];

// let gameInProgress = false;
// let currentPlayer = 0;

// cells.forEach((cell, position) => {
//   cell.addEventListener("click", () => {
//     if (cell.innerText === "" && gameInProgress) {
//       cell.innerText = playerSymbols[currentPlayer];
//       playerStatus[currentPlayer] |= 1 << position;

//       if (checkWin(currentPlayer)) {
//         gameInProgress = false;

//         // use setTimeout to delay alert until after current player symbol displays on the board
//         setTimeout(() => {
//           alert(`${playerSymbols[currentPlayer]} Wins!`);
//           clearBoard();
//         }, 0);

//         showElement(symbolInputGroup);

//         [playerStatus[0], playerStatus[1]] = [0, 0];
//       } else if (checkDraw()) {
//         gameInProgress = false;

//         // use setTimeout to delay alert until after current player symbol displays on the board
//         setTimeout(() => {
//           alert(`It's a draw!`);
//           clearBoard();
//         }, 0);

//         showElement(symbolInputGroup);

//         [playerStatus[0], playerStatus[1]] = [0, 0];
//       } else {
//         currentPlayer = getNextPlayer(currentPlayer);
//       }
//     }
//   });
// });

// playButton.addEventListener("click", () => {
//   // use trim to remove whitespace in symbol names before comparing
//   if (symbolInputs[0].value.trim() === symbolInputs[1].value.trim()) {
//     alert("Players must have different symbols!");
//   } else if (symbolInputs.some((symbol) => symbol.value.trim() === "")) {
//     alert("Player symbol cannot be empty!");
//   } else if (!gameInProgress) {
//     [playerSymbols[0], playerSymbols[1]] = [
//       symbolInputs[0].value,
//       symbolInputs[1].value,
//     ];
//     hideElement(symbolInputGroup);
//     gameInProgress = true;
//   }
// });

// function hideElement(element) {
//   element.style.display = "none";
// }

// function showElement(element, style = "block") {
//   element.style.display = style;
// }
