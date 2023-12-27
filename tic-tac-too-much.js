const cells = document.getElementsByClassName("cell");
const playerSymbols = ["X", "O"];
const playerStatus = [0, 0];
const winConditions = [
  0b111000000, 0b000111000, 0b000000111, 0b100100100, 0b010010010, 0b001001001,
  0b100010001, 0b001010100,
];

let currentPlayer = 0;

for (let i = 0; i < cells.length; i++) {
  let cell = cells.item(i);

  cell.addEventListener("click", () => {
    let position = i;
    cell.innerText = playerSymbols[currentPlayer];
    playerStatus[currentPlayer] = playerStatus[currentPlayer] | (1 << position);

    if (checkWin(currentPlayer)) {
      setTimeout(() => {
        alert(`${playerSymbols[currentPlayer]} Wins!`);
        clearBoard();
      }, 0);
      [playerStatus[0], playerStatus[1]] = [0, 0];
    } else {
      currentPlayer = getNextPlayer(currentPlayer);
    }
  });
}

function checkWin(player) {
  for (let condition of winConditions) {
    if ((playerStatus[player] & condition) === condition) return true;
  }
  return false;
}

function getNextPlayer(currentPlayer) {
  if (currentPlayer === 0) return 1;
  return 0;
}

function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

function clearBoard() {
  for (let i = 0; i < cells.length; i++) {
    cells.item(i).innerText = "";
  }
}
