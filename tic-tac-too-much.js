const cells = Array.from(document.getElementsByClassName("cell"));
const symbolInputGroup = document
  .getElementsByClassName("symbol-input-group")
  .item(0);
const symbolInputs = Array.from(
  document.getElementsByClassName("symbol-input")
);
const playButton = document.getElementById("play-button");

const playerSymbols = [];
const playerStatus = [0, 0];
const winConditions = [
  0b111000000, 0b000111000, 0b000000111, 0b100100100, 0b010010010, 0b001001001,
  0b100010001, 0b001010100,
];

let gameInProgress = false;
let currentPlayer = 0;

cells.forEach((cell, position) => {
  cell.addEventListener("click", () => {
    if (cell.innerText === "" && gameInProgress) {
      cell.innerText = playerSymbols[currentPlayer];
      playerStatus[currentPlayer] |= 1 << position;

      if (checkWin(currentPlayer)) {
        gameInProgress = false;

        // use setTimeout to delay alert until after current player symbol displays on the board
        setTimeout(() => {
          alert(`${playerSymbols[currentPlayer]} Wins!`);
          clearBoard();
        }, 0);

        showElement(symbolInputGroup);

        [playerStatus[0], playerStatus[1]] = [0, 0];
      } else if (checkDraw()) {
        gameInProgress = false;

        // use setTimeout to delay alert until after current player symbol displays on the board
        setTimeout(() => {
          alert(`It's a draw!`);
          clearBoard();
        }, 0);

        showElement(symbolInputGroup);

        [playerStatus[0], playerStatus[1]] = [0, 0];
      } else {
        currentPlayer = getNextPlayer(currentPlayer);
      }
    }
  });
});

playButton.addEventListener("click", () => {
  // use trim to remove whitespace in symbol names before comparing
  if (symbolInputs[0].value.trim() === symbolInputs[1].value.trim()) {
    alert("Players must have different symbols!");
  } else if (symbolInputs.some((symbol) => symbol.value.trim() === "")) {
    alert("Player symbol cannot be empty!");
  } else if (!gameInProgress) {
    [playerSymbols[0], playerSymbols[1]] = [
      symbolInputs[0].value,
      symbolInputs[1].value,
    ];
    hideElement(symbolInputGroup);
    gameInProgress = true;
  }
});

function checkWin(player) {
  return winConditions.some(
    (condition) => (playerStatus[player] & condition) === condition
  );
}

function checkDraw() {
  return (playerStatus[0] | playerStatus[1]) === 0b111111111;
}

function getNextPlayer(currentPlayer) {
  return currentPlayer === 0 ? 1 : 0;
}

function clearBoard() {
  cells.forEach((cell) => (cell.innerText = ""));
}

function hideElement(element) {
  element.style.display = "none";
}

function showElement(element, style = "block") {
  element.style.display = style;
}
