// === main.js ===

document.addEventListener('DOMContentLoaded', init);

// Basic sound effects
const popSound = new Audio("assets/popsound.mp3");
popSound.volume = 0.6; 
const victorySound = new Audio("assets/victory.mp3");
victorySound.volume = 0.8;
const blockSound = new Audio("assets/block.mp3");
blockSound.volume = 0.7;

// Get currently selected game mode (PvP, PvAI, Random)
function getSelectedGameMode() {
  return document.querySelector("input[name='gamemode']:checked").value;
}

function init() {
  boardArea = document.getElementById('boardArea');
  messageEl = document.getElementById('message');

  // Connect main UI buttons
  document.getElementById('startBtn').addEventListener('click', applySettings);
  document.getElementById('newRoundBtn').addEventListener('click', newRound);
  document.getElementById('resetBtn').addEventListener('click', resetScores);
  document.getElementById('undoBtn').addEventListener('click', undoMove);

  refreshPlayerUI();
  
  // Initialize board for first game
  resetBoardModel();
  renderBoardUI();
  updateMessage(`${players[currentPlayer].name} starts. Click a column.`);
}

function applySettings() {
  // Load names and colors from the UI
  const n1 = document.getElementById('p1Name').value.trim() || 'Player 1';
  const n2 = document.getElementById('p2Name').value.trim() || 'Player 2';
  const c1 = document.getElementById('p1Color').value;
  const c2 = document.getElementById('p2Color').value;

  players[1].name = n1;
  players[2].name = n2;
  players[1].color = c1;
  players[2].color = c2;

  // Avoid identical player colors
  if (c1 === c2) players[2].color = shadeColor(c2, 20);

  refreshPlayerUI();
  newRound(); // Apply changes immediately
}

function onColumnClick(col) {
  if (gameOver) return updateMessage('Game over. Start a new round.');

  const res = dropPiece(col, currentPlayer);
  if (!res.success) return updateMessage('Column full.');

  const { row, col: c } = res;

  // Animate disc falling
  const slot = document.getElementById(`slot-${row}-${c}`);
  const disc = el('div', 'disc');
  disc.style.background = players[currentPlayer].color;
  slot.innerHTML = '';
  slot.appendChild(disc);
  setTimeout(() => disc.classList.add('show'), 10);

  popSound.currentTime = 0;
  popSound.play();

  // Win check
  if (checkWinAt(row, c, currentPlayer)) {
    gameOver = true;
    players[currentPlayer].score++;
    updateScoresUI();
    highlightWinningFour(row, c, currentPlayer);

    victorySound.currentTime = 0;
    victorySound.play();
    
    return updateMessage(`${players[currentPlayer].name} wins! 🎉`);
  }

  // Draw condition
  if (isBoardFull()) {
    gameOver = true;
    updateMessage("It's a draw!");
    setTimeout(() => {
      alert("It's a draw! Board is full.\nStart a new round.");
    }, 100);
    return;
  }

  // Change turn
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateMessage(`${players[currentPlayer].name}'s turn`);
  
  // AI move (only in PvAI and only for player 2)
  if (getSelectedGameMode() === "pvai" && currentPlayer === 2) {
    setTimeout(aiMove, 350);
  }
  
  // Random Chaos mode: auto-place blocker after each move
  if (getSelectedGameMode() === "random") {
    setTimeout(randomModeStep, 300);
  }
}

function newRound() {
  resetBoardModel();
  renderBoardUI();
  boardArea.classList.remove('winner');
  updateMessage(`${players[currentPlayer].name} starts.`);
}

function resetScores() {
  // Clear global scoreboard
  players[1].score = players[2].score = 0;
  updateScoresUI();
  newRound();
}

function undoMove() {
  const mode = getSelectedGameMode();
  
  // Random Chaos: undo blocker first
  if (mode === "random") {
    if (moveHistory.length > 0 && moveHistory[moveHistory.length - 1].player === 3) {
      undoLastMove();
    }
  }
  
  // Undo latest player move
  const last = undoLastMove();
  if (!last) return updateMessage('No move to undo.');
  
  renderBoardUI();
  updateMessage(`${players[currentPlayer].name} to play (after undo).`);
}
