// Main AI move
function aiMove() {
    if (gameOver) return;

    const depth = 4; // difficulty
    let bestScore = -Infinity;
    let bestCol = null;

    for (let col = 0; col < COLS; col++) {
        const row = findAvailableRow(col);
        if (row === -1) continue;

        // simulate
        board[row][col] = 2;

        let score = minimax(depth - 1, false, -Infinity, Infinity);

        // undo
        board[row][col] = 0;

        if (score > bestScore) {
            bestScore = score;
            bestCol = col;
        }
    }

    if (bestCol !== null) {
        onColumnClick(bestCol);
    }
}

function minimax(depth, isMaximizing, alpha, beta) {
    const result = checkWinnerForAI();
    if (result !== 0) return result;

    if (depth === 0 || boardFull()) {
        return evaluateBoardAI();
    }

    if (isMaximizing) {
        let bestValue = -Infinity;

        for (let col = 0; col < COLS; col++) {
            const row = findAvailableRow(col);
            if (row === -1) continue;

            board[row][col] = 2;
            let score = minimax(depth - 1, false, alpha, beta);
            board[row][col] = 0;

            bestValue = Math.max(bestValue, score);
            alpha = Math.max(alpha, bestValue);

            if (beta <= alpha) break;
        }

        return bestValue;

    } else {
        let bestValue = Infinity;

        for (let col = 0; col < COLS; col++) {
            const row = findAvailableRow(col);
            if (row === -1) continue;

            board[row][col] = 1;
            let score = minimax(depth - 1, true, alpha, beta);
            board[row][col] = 0;

            bestValue = Math.min(bestValue, score);
            beta = Math.min(beta, bestValue);

            if (beta <= alpha) break;
        }

        return bestValue;
    }
}

function checkWinnerForAI() {
    let winner = checkWinnerReturnPlayer();
    if (winner === 2) return 999999;
    if (winner === 1) return -999999;
    return 0;
}

function evaluateBoardAI() {
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
    const directions = [[0,1],[1,0],[1,1],[1,-1]];

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== player) continue;

            for (let [dr, dc] of directions) {
                let count = 0;

                for (let i = 0; i < 4; i++) {
                    const rr = r + dr * i;
                    const cc = c + dc * i;
                    if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) break;
                    if (board[rr][cc] === player) count++;
                }

                if (count === 2) score += 10;
                if (count === 3) score += 200;
                if (count === 4) score += 20000;
            }
        }
    }
    return score;
}

function checkWinnerReturnPlayer() {
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
    for (let i = 0; i < 4; i++) {
        const rr = r + dr * i;
        const cc = c + dc * i;
        if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) return false;
        if (board[rr][cc] !== p) return false;
    }
    return true;
}
