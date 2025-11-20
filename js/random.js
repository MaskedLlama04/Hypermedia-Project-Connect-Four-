// ===============================
// Random Mode Logic 
// ===============================

// Called by main.js after each *player* turn
function randomModeStep() {
    if (gameOver) return;

    // Collect columns that still have empty space
    const availableCols = [];
    for (let c = 0; c < COLS; c++) {
        if (board[0][c] === 0) {
            availableCols.push(c);
        }
    }

    if (availableCols.length === 0) return;

    // Pick random valid column
    const col = availableCols[Math.floor(Math.random() * availableCols.length)];

    // Find lowest empty row in that column
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
            row = r;
            break;
        }
    }

    if (row === -1) return;

    // Place blocker
    board[row][col] = 3;

    // This one plays the blocker sound
    blockSound.currentTime = 0;  // reset for repeated use
    blockSound.play();

    // Refresh UI
    renderBoard();
}

