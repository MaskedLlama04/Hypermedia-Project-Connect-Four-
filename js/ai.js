//This was made by Pol Cañadas & Bernat
// We tried to do it with minimax (which we saw in other courses)
//We think it ended up working good enough!

// Main AI moves
function aiMove() {
    if (gameOver) return; //no need to make the AI think if we are done, I mean

    const depth = 4; // how many moves ahead the AI looks
    let bestScore = -Infinity;
    let bestCol = null;
    
    //It will try every possible column
    for (let col = 0; col < COLS; col++) {
        const row = findAvailableRow(col);
        if (row === -1) continue;

        // simulate placing the piece here
        board[row][col] = 2;

        //and then we use minimax to see how good that movement is
        let score = minimax(depth - 1, false, -Infinity, Infinity);

        // undo the simulation
        board[row][col] = 0;

        // Keep track of the best move we've found
        if (score > bestScore) {
            bestScore = score;
            bestCol = col;
        }
    }
    //it will make the best move it found
    if (bestCol !== null) {
        onColumnClick(bestCol);
    }
}

// ================================
// Minimax algorithm
// This looks ahead to find the best move
// ================================
function minimax(depth, isMaximizing, alpha, beta) {
    // Check if someone won
    const result = checkWinnerForAI();
    if (result !== 0) return result;

    // Stop searching if we've looked far enough ahead or board is full
    if (depth === 0 || boardFull()) {
        return evaluateBoardAI();
    }

    if (isMaximizing) {
        // AI's turn, try to maximize score
        let bestValue = -Infinity;

        for (let col = 0; col < COLS; col++) {
            const row = findAvailableRow(col);
            if (row === -1) continue;

            board[row][col] = 2; // simulate AI move
            let score = minimax(depth - 1, false, alpha, beta);
            board[row][col] = 0; // undo it

            bestValue = Math.max(bestValue, score);
            alpha = Math.max(alpha, bestValue);
            //if the move is good enough we can stop
            if (beta <= alpha) break;
        }

        return bestValue;

    } else {
        // Player's turn, it tries to minimize AI's score
        let bestValue = Infinity;

        for (let col = 0; col < COLS; col++) {
            const row = findAvailableRow(col);
            if (row === -1) continue;

            board[row][col] = 1; //this simulates the players move
            let score = minimax(depth - 1, true, alpha, beta);
            board[row][col] = 0; //it undo its

            bestValue = Math.min(bestValue, score);
            beta = Math.min(beta, bestValue);
            //we check again if the movement is good enough
            if (beta <= alpha) break;
        }

        return bestValue;
    }
}

// ================================
// Check who won
// ================================
function checkWinnerForAI() {
    let winner = checkWinnerReturnPlayer();
    if (winner === 2) return 999999;
    if (winner === 1) return -999999; //if the player wins, the AI recieves a bad score
    return 0;
}

// ================================
// Evaluate the board position
// ================================
function evaluateBoardAI() {
    return countScore(2) - countScore(1); //this is to see how good is the current position of AI
}

// ================================
// Check if board is full
// ================================
function boardFull() {
    for (let c = 0; c < COLS; c++) {
        if (board[0][c] === 0) return false;
    }
    return true;
}

// ================================
// Count score for a player
// Higher score = better position
// ================================
function countScore(player) {
    let score = 0;
    const directions = [[0,1],[1,0],[1,1],[1,-1]];
    // Look at every cell on the board
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== player) continue;
            // It chekcs all directions 
            for (let [dr, dc] of directions) {
                let count = 0;
                // Count how many pieces in a row in the direction
                for (let i = 0; i < 4; i++) {
                    const rr = r + dr * i;
                    const cc = c + dc * i;
                    if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) break;
                    if (board[rr][cc] === player) count++;
                }
                // Give points based on how many in a row
                if (count === 2) score += 10;
                if (count === 3) score += 200;
                if (count === 4) score += 20000;
            }
        }
    }
    return score;
}

// ================================
// Check if anyone has won
// Returns the player number (1 or 2) or 0 if no winner
// ================================

function checkWinnerReturnPlayer() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === 0) continue;
            const p = board[r][c];

            //We check all the directions again
            if (checkDir(r, c, 0, 1, p)) return p; //horizontal
            if (checkDir(r, c, 1, 0, p)) return p; //vertical
            if (checkDir(r, c, 1, 1, p)) return p; //diagonal down-right
            if (checkDir(r, c, 1, -1, p)) return p; //diagonal down-left
        }
    }
    return 0;
}

// ================================
// Check if there are 4 in a row in a specific direction
// ================================
function checkDir(r, c, dr, dc, p) {
    for (let i = 0; i < 4; i++) {
        const rr = r + dr * i;
        const cc = c + dc * i;
        if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) return false;
        if (board[rr][cc] !== p) return false;
    }
    return true;
}
