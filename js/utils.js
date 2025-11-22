// === utils.js ===
// This file was made by Pol Cañadas Costa and Bernat Pujolriu
// Helper functions used throughout the project

// This is used when both players pick the same color then we brighten player 2's color
function shadeColor(hex, percent) {
    hex = hex.replace('#', ''); // remove the # symbol, looks bad
    
    // Extract RGB values from the hex color
    let r = parseInt(hex.substring(0, 2), 16); // first 2 chars = red
    let g = parseInt(hex.substring(2, 4), 16); // middle 2 chars = green
    let b = parseInt(hex.substring(4, 6), 16); // last 2 chars = blue
  
    // Brighten each color channel by moving it closer to 255 (white)
    // percent = how much brighter (0-100)
    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
  
    // Convert back to hex format and return with #
    return '#' + [r, g, b]
      .map(x => x.toString(16).padStart(2, '0')) // convert to hex, pad with 0 if needed
      .join('');
  }
  
  // Helper to create elements (we found it on a Youtube Tutorial)
  // Instead of writing document.createElement and setting className every time
  function el(tag, className) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }
