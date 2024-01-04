const cells = Array.from(document.getElementsByClassName("cell"));
const playerSymbols = ["X", "O"];
const playerStatus = [0, 0];
const winConditions = [
  0b111000000, 0b000111000, 0b000000111, 0b100100100, 0b010010010, 0b001001001,
  0b100010001, 0b001010100,
];

let currentPlayer = 0;

cells.forEach((cell, position) => {
  cell.addEventListener("click", () => {
    if (cell.innerText === "") {
      cell.innerText = playerSymbols[currentPlayer];
      playerStatus[currentPlayer] |= 1 << position;

      if (checkWin(currentPlayer)) {
        // use setTimeout to delay alert until after current player symbol displays on the board
        setTimeout(() => {
          alert(`${playerSymbols[currentPlayer]} Wins!`);
          clearBoard();
        }, 0);

        [playerStatus[0], playerStatus[1]] = [0, 0];
      } else {
        currentPlayer = getNextPlayer(currentPlayer);
      }
    }
  });
});

function checkWin(player) {
  return winConditions.some(
    (condition) => (playerStatus[player] & condition) === condition
  );
}

function getNextPlayer(currentPlayer) {
  return currentPlayer === 0 ? 1 : 0;
}

function clearBoard() {
  cells.forEach((cell) => (cell.innerText = ""));
}
