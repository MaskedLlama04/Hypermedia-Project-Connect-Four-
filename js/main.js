// === main.js ===

document.addEventListener('DOMContentLoaded', init);
// === SOUND EFFECT ===
const popSound = new Audio("assets/popsound.mp3");
popSound.volume = 0.6; 
const victorySound = new Audio("assets/victory.mp3");
victorySound.volume = 0.8;
const blockSound = new Audio("assets/block.mp3");
blockSound.volume = 0.7;

function getSelectedGameMode() {
  return document.querySelector("input[name='gamemode']:checked").value;
}

function init() {
  boardArea = document.getElementById('boardArea');
  messageEl = document.getElementById('message');

  document.getElementById('startBtn').addEventListener('click', applySettings);
  document.getElementById('newRoundBtn').addEventListener('click', newRound);
  document.getElementById('resetBtn').addEventListener('click', resetScores);
  document.getElementById('undoBtn').addEventListener('click', undoMove);

  refreshPlayerUI();
  resetBoardModel();
  renderBoardUI();
  updateMessage(`${players[currentPlayer].name} starts. Click a column.`);
}

function applySettings() {
  const n1 = document.getElementById('p1Name').value.trim() || 'Player 1';
  const n2 = document.getElementById('p2Name').value.trim() || 'Player 2';
  const c1 = document.getElementById('p1Color').value;
  const c2 = document.getElementById('p2Color').value;

  players[1].name = n1;
  players[2].name = n2;
  players[1].color = c1;
  players[2].color = c2;

  if (c1 === c2) players[2].color = shadeColor(c2, 20);

  refreshPlayerUI();
  newRound();
}

function onColumnClick(col) {
  if (gameOver) return updateMessage('Game over. Start a new round.');

  const res = dropPiece(col, currentPlayer);
  if (!res.success) return updateMessage('Column full.');

  const { row, col: c } = res;
  const slot = document.getElementById(`slot-${row}-${c}`);
  const disc = el('div', 'disc');
  disc.style.background = players[currentPlayer].color;
  slot.innerHTML = '';
  slot.appendChild(disc);
  setTimeout(() => disc.classList.add('show'), 10);
  popSound.currentTime = 0; //this playf the pop sound
  popSound.play();


  if (checkWinAt(row, c, currentPlayer)) {
    gameOver = true;
    players[currentPlayer].score++;
    updateScoresUI();
    highlightWinningFour(row, c, currentPlayer);
    // this is basicaly to let the players know the round is over too
    victorySound.currentTime = 0;
    victorySound.play();
    return updateMessage(`${players[currentPlayer].name} wins! 🎉`);
  }

  if (isBoardFull()) {
    gameOver = true;
    return updateMessage("It's a draw!");
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateMessage(`${players[currentPlayer].name}'s turn`);
  // If it's PvAI and it's AI's turn → AI plays
  if (getSelectedGameMode() === "pvai" && currentPlayer === 2) {
      setTimeout(aiMove, 350);   // here we put some delay because if not it would look really fast
  }
  // RANDOM MODE extra auto-fill
  if (getSelectedGameMode() === "random") {
      setTimeout(randomModeStep, 300); // also some delay so it looks better
  }


}

function newRound() {
  resetBoardModel();
  renderBoardUI();
  boardArea.classList.remove('winner');
  updateMessage(`${players[currentPlayer].name} starts.`);
}

function resetScores() {
  players[1].score = players[2].score = 0;
  updateScoresUI();
  newRound();
}

function undoMove() {
  const last = undoLastMove();
  if (!last) return updateMessage('No move to undo.');
  renderBoardUI();
  updateMessage(`${players[currentPlayer].name} to play (after undo).`);
}
