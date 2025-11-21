// === board.js ===

// Basic board dimensions
const ROWS = 6;
const COLS = 7;

// Board values: 0 = empty, 1 = P1, 2 = P2, 3 = blocker
let board = [];
let currentPlayer = 1;
let players = {
  1: { name: 'Player1', color: '#ff3d00', score: 0 },
  2: { name: 'Player2', color: '#ffd600', score: 0 }
};
let gameOver = false;
let moveHistory = [];

// Create a fresh empty board and reset game state
function resetBoardModel() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  gameOver = false;
  moveHistory = [];
  currentPlayer = 1; // Player 1 always starts
}

// Drop a piece for a given player in the lowest available row
function dropPiece(col, player) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) {
      board[r][col] = player;
      moveHistory.push({ row: r, col, player }); // Save move for undo
      return { success: true, row: r, col };
    }
  }
  return { success: false }; // Column full
}

// Undo the last move made (useful for AI search)
function undoLastMove() {
  if (moveHistory.length === 0) return null;
  const last = moveHistory.pop();
  board[last.row][last.col] = 0;
  currentPlayer = last.player;
  return last;
}

// Check if the piece placed at (r, c) creates a 4-in-a-row
function checkWinAt(r, c, p) {
  if (p === 3) return false; // Blockers can't win

  const dirs = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal
    [1, -1]   // reverse diagonal
  ];

  // Check lines in both forward and backward directions
  return dirs.some(([dr, dc]) =>
    countDir(r, c, dr, dc, p) + countDir(r, c, -dr, -dc, p) - 1 >= 4
  );
}

// Count consecutive pieces of the same player in a direction
function countDir(r, c, dr, dc, p) {
  let count = 0;
  let rr = r, cc = c;

  while (
    rr >= 0 && rr < ROWS &&
    cc >= 0 && cc < COLS &&
    board[rr][cc] === p
  ) {
    count++;
    rr += dr;
    cc += dc;
  }
  return count;
}

// Check if no empty spaces remain
function isBoardFull() {
  return board.every(row => row.every(cell => cell !== 0));
}

// Find the next free row in a column (used by AI)
function findAvailableRow(col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) return r;
  }
  return -1;
}

// Simple heuristic board evaluation for AI
function evaluateBoard(player) {
  let score = 0;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== player) continue;

      // Evaluate lines starting at this cell
      score += evalDir(r, c, 0, 1, player);
      score += evalDir(r, c, 1, 0, player);
      score += evalDir(r, c, 1, 1, player);
      score += evalDir(r, c, 1, -1, player);
    }
  }
  return score;
}

// Score a potential 4-length segment starting from a cell
function evalDir(r, c, dr, dc, p) {
  let count = 0;

  for (let i = 0; i < 4; i++) {
    const rr = r + dr * i;
    const cc = c + dc * i;

    if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) return 0; // out of bounds
    if (board[rr][cc] === 3) return 0; // blocker inside segment
    if (board[rr][cc] !== p) return 0; // mismatch

    count++;
  }

  // Weight stronger sequences higher
  if (count === 2) return 10;
  if (count === 3) return 100;
  if (count === 4) return 9999;

  return 0;
}
