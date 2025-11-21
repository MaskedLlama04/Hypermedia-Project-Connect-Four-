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

    // Place blocker (value 3)
    board[row][col] = 3;

    // Add to move history so we know it's a blocker
    moveHistory.push({ row, col, player: 3 });

    // Play blocker sound
    blockSound.currentTime = 0;
    blockSound.play();

    // Create and animate the blocker disc in the UI
    const slot = document.getElementById(`slot-${row}-${col}`);
    const disc = el('div', 'disc blocker');
    slot.innerHTML = '';
    slot.appendChild(disc);
    
    // Trigger animation
    setTimeout(() => disc.classList.add('show'), 10);
}
