// === utils.js ===

// Slightly brighten a color (used if both players pick the same)
function shadeColor(hex, percent) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Increase each channel by the given percentage
    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

    return '#' + [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

// Quick helper to create an element with optional class
function el(tag, className) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
}
