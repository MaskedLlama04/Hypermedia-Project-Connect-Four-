// === ui.js ===
// This  was made by Pol Cañadas Costa and Bernat Pujolriu
// Handles all the visual rendering and UI updates

let boardArea, messageEl;

// Render the entire board from scratch
function renderBoardUI() {
  boardArea.innerHTML = ''; // clear everything first

  // Create the top row with clickable column indicators (the arrows)
  for (let c = 0; c < COLS; c++) {
    const top = el('div', 'col-indicator');
    top.textContent = '▼';
    top.addEventListener('click', () => onColumnClick(c)); // click to drop piece
    boardArea.appendChild(top);
  }

  // Create all the cells on the board
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = el('div', 'cell');
      const slot = el('div', 'slot');
      slot.id = `slot-${r}-${c}`; // unique ID so we can find it later (saw this on stackoverflow)

      const val = board[r][c]; // check what's in this cell
      if (val === 3) {
        // Blocker disc, its rainbow animated
        const disc = el('div', 'disc show blocker');
        slot.appendChild(disc);
      } else if (val === 1 || val === 2) {
        // Player disc, they use their chosen color
        const disc = el('div', 'disc show');
        disc.style.background = players[val].color;
        slot.appendChild(disc);
      } else {
        // Empty slot, add empty div for consistent structure
        slot.appendChild(document.createElement('div'));
      }

      cell.appendChild(slot);
      boardArea.appendChild(cell);
    }
  }
}

// Update the score display for both players
function updateScoresUI() {
  document.getElementById('p1Score').textContent = players[1].score;
  document.getElementById('p2Score').textContent = players[2].score;
}

// Update player names and color swatches in the UI
function refreshPlayerUI() {
  document.getElementById('p1Label').textContent = players[1].name;
  document.getElementById('p2Label').textContent = players[2].name;
  document.getElementById('p1Sw').style.background = players[1].color;
  document.getElementById('p2Sw').style.background = players[2].color;
}

// Update the game status message
function updateMessage(text) {
  messageEl.textContent = text;
}

// Highlight the winning sequence of 4 discs
function highlightWinningFour(r, c, p) {
  // Check all 4 possible directions
  const dirs = [
    [0, 1],  // horizontal
    [1, 0],  // vertical
    [1, 1],  // diagonal down-right
    [1, -1]  // diagonal down-left
  ];
  
  for (let [dr, dc] of dirs) {
    let coords = [];
    let rr = r,
      cc = c;

    // Go backwards from the winning piece to collect all connected pieces
    while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && board[rr][cc] === p) {
      coords.unshift({ r: rr, c: cc }); // add to front of array
      rr -= dr;
      cc -= dc;
    }
    
    // Now go forwards from the winning piece
    rr = r + dr;
    cc = c + dc;
    while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && board[rr][cc] === p) {
      coords.push({ r: rr, c: cc }); // add to end of array
      rr += dr;
      cc += dc;
    }

    // If we found 4 or more in a row, highlight them
    if (coords.length >= 4) {
      coords.slice(0, 4).forEach(pos => {
        const disc = document.querySelector(`#slot-${pos.r}-${pos.c} .disc`);
        if (disc) disc.classList.add('highlight'); // CSS class adds the glow effect
      });
      boardArea.classList.add('winner'); // add winner styling to the board
      return; // found the winning sequence, we're done
    }
  }
}
