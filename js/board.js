// === board.js ===

const ROWS = 6;
const COLS = 7;

let board = [];
let currentPlayer = 1;
let players = {
  1: { name: 'Alice', color: '#ff3d00', score: 0 },
  2: { name: 'Bob', color: '#ffd600', score: 0 }
};
let gameOver = false;
let moveHistory = [];

// Resets the logical board
function resetBoardModel() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  gameOver = false;
  moveHistory = [];
  currentPlayer = 1;
}

// Drops a piece in a column
function dropPiece(col, player) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) {
      board[r][col] = player;
      moveHistory.push({ row: r, col, player });
      return { success: true, row: r, col };
    }
  }
  return { success: false };
}

// Undo last move
function undoLastMove() {
  if (moveHistory.length === 0) return null;
  const last = moveHistory.pop();
  board[last.row][last.col] = 0;
  currentPlayer = last.player;
  return last;
}

// Check win from position
function checkWinAt(r, c, p) {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];
  return dirs.some(([dr, dc]) =>
    countInDirection(r, c, dr, dc, p) + countInDirection(r, c, -dr, -dc, p) - 1 >= 4
  );
}

// Count consecutive pieces
function countInDirection(r, c, dr, dc, p) {
  let count = 0;
  let rr = r,
    cc = c;
  while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && board[rr][cc] === p) {
    count++;
    rr += dr;
    cc += dc;
  }
  return count;
}

// Check if full
function isBoardFull() {
  return board.every(row => row.every(cell => cell !== 0));
}
