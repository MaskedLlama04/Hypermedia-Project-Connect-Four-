// Main AI move logic
function aiMove() {
    if (gameOver) return;

    const depth = 4; // AI search depth
    let bestScore = -Infinity;
    let bestCol = null;

    // Try every column
    for (let col = 0; col < COLS; col++) {
        const row = findAvailableRow(col);
        if (row === -1) continue; // column full

        board[row][col] = 2; // simulate AI move
        let score = minimax(depth - 1, false, -Infinity, Infinity);
        board[row][col] = 0; // undo simulation

        if (score > bestScore) {
            bestScore = score;
            bestCol = col;
        }
    }

    if (bestCol !== null) {
        onColumnClick(bestCol); // play chosen move
    }
}

function minimax(depth, isMaximizing, alpha, beta) {
    const result = checkWinnerForAI();
    if (result !== 0) return result; // terminal state

    if (depth === 0 || boardFull()) {
        return evaluateBoardAI(); // heuristic evaluation
    }

    // AI turn (maximize score)
    if (isMaximizing) {
        let bestValue = -Infinity;

        for (let col = 0; col < COLS; col++) {
            const row = findAvailableRow(col);
            if (row === -1) continue;

            board[row][col] = 2;
            let value = minimax(depth - 1, false, alpha, beta);
            board[row][col] = 0;

            bestValue = Math.max(bestValue, value);
            alpha = Math.max(alpha, bestValue);

            if (beta <= alpha) break; // pruning
        }

        return bestValue;

    } else {
        // Human turn (minimize AI score)
        let bestValue = Infinity;

        for (let col = 0; col < COLS; col++) {
            const row = findAvailableRow(col);
            if (row === -1) continue;

            board[row][col] = 1;
            let value = minimax(depth - 1, true, alpha, beta);
            board[row][col] = 0;

            bestValue = Math.min(bestValue, value);
            beta = Math.min(beta, bestValue);

            if (beta <= alpha) break;
        }

        return bestValue;
    }
}

function checkWinnerForAI() {
    // Convert winner into a large positive or negative score
    let winner = checkWinnerReturnPlayer();
    if (winner === 2) return 999999;
    if (winner === 1) return -999999;
    return 0;
}

function evaluateBoardAI() {
    // Basic heuristic: compare AI potential vs player potential
    return countScore(2) - countScore(1);
}

function boardFull() {
    for (let c = 0; c < COLS; c++) {
        if (board[0][c] === 0) return false;
    }
    return true;
}

function countScore(player) {
    let score = 0;
    const directions = [[0,1],[1,0],[1,1],[1,-1]]; // horizontal, vertical, diagonals

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== player) continue;

            for (let [dr, dc] of directions) {
                let count = 0;

                // Check up to 4 in a row
                for (let i = 0; i < 4; i++) {
                    const rr = r + dr * i;
                    const cc = c + dc * i;
                    if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) break;
                    if (board[rr][cc] === player) count++;
                }

                // Simple scoring weights
                if (count === 2) score += 10;
                if (count === 3) score += 200;
                if (count === 4) score += 20000;
            }
        }
    }
    return score;
}

function checkWinnerReturnPlayer() {
    // Checks board for a 4-in-a-row
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === 0) continue;
            const p = board[r][c];

            if (checkDir(r, c, 0, 1, p)) return p;
            if (checkDir(r, c, 1, 0, p)) return p;
            if (checkDir(r, c, 1, 1, p)) return p;
            if (checkDir(r, c, 1, -1, p)) return p;
        }
    }
    return 0;
}

function checkDir(r, c, dr, dc, p) {
    // Verifies 4 consecutive pieces in a direction
    for (let i = 0; i < 4; i++) {
        const rr = r + dr * i;
        const cc = c + dc * i;
        if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) return false;
        if (board[rr][cc] !== p) return false;
    }
    return true;
}
