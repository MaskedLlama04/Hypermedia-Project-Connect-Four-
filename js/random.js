// ===============================
// Random Mode Logic
// ===============================

// Called by main.js after each *player* turn
function randomModeStep() {
    if (gameOver) return;

    const emptyCells = [];

    // Find all empty board positions
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === 0) {
                emptyCells.push({ r, c });
            }
        }
    }

    if (emptyCells.length === 0) return;

    // Pick a random empty cell
    const index = Math.floor(Math.random() * emptyCells.length);
    const { r, c } = emptyCells[index];

    // Mark it with a special code (3 = blocker)
    board[r][c] = 3;

    // Update UI
    renderBoard();  
}
