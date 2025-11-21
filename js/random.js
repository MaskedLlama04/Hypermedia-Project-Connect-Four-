// ===============================
// Random Mode Logic 
// ===============================

// Called automatically after every player move (Random Chaos mode)
function randomModeStep() {
    if (gameOver) return;

    // Find columns that still have space
    const availableCols = [];
    for (let c = 0; c < COLS; c++) {
        if (board[0][c] === 0) availableCols.push(c);
    }

    if (availableCols.length === 0) return;

    // Choose a random valid column
    const col = availableCols[Math.floor(Math.random() * availableCols.length)];

    // Get the first empty row in that column
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
            row = r;
            break;
        }
    }
    if (row === -1) return;

    // Place blocker (treated as player 3)
    board[row][col] = 3;
    moveHistory.push({ row, col, player: 3 }); // log blocker for undo

    // Audio feedback
    blockSound.currentTime = 0;
    blockSound.play();

    // Render blocker disc
    const slot = document.getElementById(`slot-${row}-${col}`);
    const disc = el('div', 'disc blocker');
    slot.innerHTML = '';
    slot.appendChild(disc);

    // Small delay to trigger CSS animation
    setTimeout(() => disc.classList.add('show'), 10);

    // If board becomes full after blocker, it's a draw
    if (isBoardFull()) {
        gameOver = true;
        updateMessage("It's a draw!");
        setTimeout(() => {
            alert("It's a draw! The board is completely full.\n\nPlease start a new round to continue playing.");
        }, 400);
    }
}
