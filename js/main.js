// === main.js ===
// Main game controller - handles user input and game flow
//This file was made by Pol Cañadas and Bernat Pujolriu

// Wait for the page to fully load before running anything
document.addEventListener('DOMContentLoaded', init);

// === SOUND EFFECTS ===
const popSound = new Audio("assets/popsound.mp3");
popSound.volume = 0.6; 
const victorySound = new Audio("assets/victory.mp3");
victorySound.volume = 0.8;
const blockSound = new Audio("assets/block.mp3");
blockSound.volume = 0.7;

// Says which gamemode is actually selected
function getSelectedGameMode() {
  return document.querySelector("input[name='gamemode']:checked").value;
}

//This one initializes everything the moment the page loads
function init() {
  // Get references to important DOM elements
  boardArea = document.getElementById('boardArea');
  messageEl = document.getElementById('message');

  // Connect all the buttons to their functions
  document.getElementById('startBtn').addEventListener('click', applySettings);
  document.getElementById('newRoundBtn').addEventListener('click', newRound);
  document.getElementById('resetBtn').addEventListener('click', resetScores);
  document.getElementById('undoBtn').addEventListener('click', undoMove);

  // Set up the initial game state
  refreshPlayerUI();
  resetBoardModel();
  renderBoardUI();
  updateMessage(`${players[currentPlayer].name} starts. Click a column.`);
}

// Apply player name and color settings from the inputs
function applySettings() {
  // Get player names from inputs (or use defaults if empty)
  const n1 = document.getElementById('p1Name').value.trim() || 'Player 1';
  const n2 = document.getElementById('p2Name').value.trim() || 'Player 2';
  const c1 = document.getElementById('p1Color').value;
  const c2 = document.getElementById('p2Color').value;

  // Update player data
  players[1].name = n1;
  players[2].name = n2;
  players[1].color = c1;
  players[2].color = c2;

  // If both players picked the same color, brighten player 2's color
  if (c1 === c2) players[2].color = shadeColor(c2, 20);

  refreshPlayerUI();
  newRound(); //this starts a new round
}

// Main game logic - handles when a player clicks a column
function onColumnClick(col) {
  // Don't allow moves if game is already over
  if (gameOver) return updateMessage('Game over. Start a new round.');

  // Try to drop a piece in the selected column
  const res = dropPiece(col, currentPlayer);
  if (!res.success) return updateMessage('Column full.');

  // Get the position where the piece landed
  const { row, col: c } = res;
  // Create and animate the disc dropping into the slot
  const slot = document.getElementById(`slot-${row}-${c}`);
  const disc = el('div', 'disc');
  disc.style.background = players[currentPlayer].color; //using the chosen colour
  slot.innerHTML = '';
  slot.appendChild(disc);
  setTimeout(() => disc.classList.add('show'), 10);

  // Play the satisfying, incredible and epic pop sound
  popSound.currentTime = 0;
  popSound.play();

  // Check if this move won the game
  if (checkWinAt(row, c, currentPlayer)) {
    gameOver = true;
    players[currentPlayer].score++;
    updateScoresUI();
    highlightWinningFour(row, c, currentPlayer);

    // Play victory sound to celebrate!
    victorySound.currentTime = 0;
    victorySound.play();
    return updateMessage(`${players[currentPlayer].name} wins! 🎉`); //We did not know you could put emojis like that
  }

  //It checks if the board is full (so its a draw)
  if (isBoardFull()) {
    gameOver = true;
    updateMessage("It's a draw!");
    setTimeout(() => {
      alert("It's a draw! The board is completely full.\n\nPlease start a new round to continue playing.");
    }, 100);
    return;
  }

  // This here will switch to the other player
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateMessage(`${players[currentPlayer].name}'s turn`);
  
  // If it's PvAI and it's AI's turn the AI plays
  if (getSelectedGameMode() === "pvai" && currentPlayer === 2) {
    setTimeout(aiMove, 350);
  }
  
  // If its Random Mode: add blocker after each player move
  if (getSelectedGameMode() === "random") {
    setTimeout(randomModeStep, 300);
  }
}

//It makes the board empty again without a winner
function newRound() {
  resetBoardModel();
  renderBoardUI();
  boardArea.classList.remove('winner');
  updateMessage(`${players[currentPlayer].name} starts.`);
}

//Both players scores get to 0 again
function resetScores() {
  players[1].score = players[2].score = 0;
  updateScoresUI();
  newRound();
}

function undoMove() {
  // In Random Chaos mode, we need to undo both the blocker AND the player move
  const mode = getSelectedGameMode();
  
  if (mode === "random") {
    // Undo the last blocker first (if exists)
    if (moveHistory.length > 0 && moveHistory[moveHistory.length - 1].player === 3) {
      const blocker = undoLastMove();
    }
  }
  
  // Then undo the player move
  const last = undoLastMove();
  if (!last) return updateMessage('No move to undo.');
  
  renderBoardUI();
  updateMessage(`${players[currentPlayer].name} to play (after undo).`);
}
