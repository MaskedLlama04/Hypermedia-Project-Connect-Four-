// === ui.js ===

let boardArea, messageEl;

function renderBoardUI() {
  boardArea.innerHTML = '';

  // Top clickable indicators
  for (let c = 0; c < COLS; c++) {
    const top = el('div', 'col-indicator');
    top.textContent = '▼';
    top.addEventListener('click', () => onColumnClick(c));
    boardArea.appendChild(top);
  }

  // Cells
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = el('div', 'cell');
      const slot = el('div', 'slot');
      slot.id = `slot-${r}-${c}`;

      const val = board[r][c];
      if (val) {
        const disc = el('div', 'disc show');
        disc.style.background = players[val].color;
        slot.appendChild(disc);
      } else slot.appendChild(document.createElement('div'));

      cell.appendChild(slot);
      boardArea.appendChild(cell);
    }
  }
}

function updateScoresUI() {
  document.getElementById('p1Score').textContent = players[1].score;
  document.getElementById('p2Score').textContent = players[2].score;
}

function refreshPlayerUI() {
  document.getElementById('p1Label').textContent = players[1].name;
  document.getElementById('p2Label').textContent = players[2].name;
  document.getElementById('p1Sw').style.background = players[1].color;
  document.getElementById('p2Sw').style.background = players[2].color;
}

function updateMessage(text) {
  messageEl.textContent = text;
}

// Highlight winning sequence
function highlightWinningFour(r, c, p) {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];
  for (let [dr, dc] of dirs) {
    let coords = [];
    let rr = r,
      cc = c;

    while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && board[rr][cc] === p) {
      coords.unshift({ r: rr, c: cc });
      rr -= dr;
      cc -= dc;
    }
    rr = r + dr;
    cc = c + dc;
    while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && board[rr][cc] === p) {
      coords.push({ r: rr, c: cc });
      rr += dr;
      cc += dc;
    }

    if (coords.length >= 4) {
      coords.slice(0, 4).forEach(pos => {
        const disc = document.querySelector(`#slot-${pos.r}-${pos.c} .disc`);
        if (disc) disc.classList.add('highlight');
      });
      boardArea.classList.add('winner');
      return;
    }
  }
}
