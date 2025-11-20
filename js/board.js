// === board.js ===

const ROWS = 6;
const COLS = 7;

// Board values:
// 0 = empty
// 1 = player 1
// 2 = player 2
// 3 = blocker (Random Chaos mode)

let board = [];
let currentPlayer = 1;
let players = {
  1: { name: 'Player1', color: '#ff3d00', score: 0 },
  2: { name: 'Player2', color: '#ffd600', score: 0 }
};
let gameOver = false;
let moveHistory = [];

// ================================
// RESET BOARD
// ================================
function resetBoardModel() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  gameOver = false;
  moveHistory = [];
  currentPlayer = 1;
}

// ================================
// DROP PIECE (players only)
// ================================
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

// ================================
// UNDO
// ================================
function undoLastMove() {
  if (moveHistory.length === 0) return null;
  const last = moveHistory.pop();
  board[last.row][last.col] = 0;
  currentPlayer = last.player;
  return last;
}

// ================================
// CHECK WIN AROUND A CELL
// (blockers DO break sequences)
// ================================
function checkWinAt(r, c, p) {
  if (p === 3) return false; // blockers never win

  const dirs = [
    [0, 1],  // horizontal
    [1, 0],  // vertical
    [1, 1],  // diagonal down-right
    [1, -1]  // diagonal down-left
  ];

  return dirs.some(([dr, dc]) =>
    countDir(r, c, dr, dc, p) + countDir(r, c, -dr, -dc, p) - 1 >= 4
  );
}

// ================================
// COUNT IN ONE DIRECTION
// (stops if hitting blocker = 3)
// ================================
function countDir(r, c, dr, dc, p) {
  let count = 0;
  let rr = r,
    cc = c;

  while (
    rr >= 0 &&
    rr < ROWS &&
    cc >= 0 &&
    cc < COLS &&
    board[rr][cc] === p
  ) {
    count++;
    rr += dr;
    cc += dc;
  }
  return count;
}

// ================================
// BOARD FULL?
// ================================
function isBoardFull() {
  return board.every(row => row.every(cell => cell !== 0));
}

// ================================
// FIND FIRST AVAILABLE ROW IN COL
// ================================
function findAvailableRow(col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) return r;
  }
  return -1;
}

// ======================================================================
// AI Evaluation Helpers – used for PvAI mode
// We made it so blockers (3) dont  count as player pieces and break lines
// ======================================================================
function evaluateBoard(player) {
  let score = 0;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== player) continue;

      // skip if piece is next to a blocker in starting position
      score += evalDir(r, c, 0, 1, player);
      score += evalDir(r, c, 1, 0, player);
      score += evalDir(r, c, 1, 1, player);
      score += evalDir(r, c, 1, -1, player);
    }
  }
  return score;
}

function evalDir(r, c, dr, dc, p) {
  let count = 0;

  for (let i = 0; i < 4; i++) {
    const rr = r + dr * i;
    const cc = c + dc * i;

    if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) return 0;

    if (board[rr][cc] === 3) return 0; // blockers break lines

    if (board[rr][cc] !== p) return 0;

    count++;
  }

  if (count === 2) return 10;
  if (count === 3) return 100;
  if (count === 4) return 9999;

  return 0;
}
