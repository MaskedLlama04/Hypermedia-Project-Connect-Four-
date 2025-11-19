# Hypermedia-Project-Connect-Four-
##  Overview

This project is a complete implementation of the classic **Connect Four** game using only **HTML, CSS, and JavaScript**, organized into multiple files for clarity and maintainability. The goal of the assignment was to create a fully functioning, visually appealing, responsive web application without using external libraries or frameworks.

The application allows two players to compete locally on the same device, dropping tokens into a 7×6 grid until one achieves four connected discs in any direction (horizontal, vertical, or diagonal). The user interface is fully custom styled, responsive across devices, and includes interactive sound effects.

##  Project Structure

```
connect4/
│
├── index.html          # Main webpage
├── styles.css          # All styling rules
│
├── assets/             # Media files (sound effects)
│   ├── popsound.mp3
│   └── victory.mp3
│
└── js/                 # Separated JavaScript modules
    ├── main.js         # Initialization + event handling
    ├── board.js        # Game logic & state management
    ├── ui.js           # Rendering, animations, UI updates
    └── utils.js        # Helper functions
```

The entire project has been modularized so each component has a clear responsibility, making it easier to read and extend.

---

##  User Interface Enhancements

Significant improvements have been made to the UI:

### ✔️ Custom Action Buttons

The “Start / Apply”, “New Round”, and “Reset Scores” buttons were redesigned with modern gradient colors, hover animations, and improved spacing. The **Start Round** button is placed at the center and styled as the main call-to-action.

### ✔️ Enhanced Undo Button

The "Undo last" button was transformed into a visually striking element using a purple gradient, glowing effects, and smooth animations to stand out more clearly inside the top control bar.

### ✔️ GameMode Selector

A new **“Select GameMode”** section was added below the left information panel.
This currently includes:

* **PVP (Player vs Player)** — pre-selected by default.

This creates a foundation to easily add more gamemodes later (PvAI, Hard AI, Timed, etc.).

### ✔️ Responsive Design

The entire interface has been upgraded to work across:

* Phones
* Tablets
* Desktop screens

This includes:

* Dynamic resizing of the board using `vw` units
* Stacked or horizontal layouts depending on screen width
* Font resizing
* Full-width buttons on mobile
* Tap-friendly spacing

---

##  Sound Effects

Two sound effects have been integrated:

###  Token Placement (“pop” sound)

Each time a player drops a token, a **popsound.mp3** plays.
This provides tactile-like feedback and improves user experience.

###  Win Celebration (“victory” sound)

When a player connects four tokens and wins the game, a **victory.mp3** sound plays.

Both sounds are loaded from the **assets/** folder and triggered inside the JavaScript logic.

---

##  Game Logic

All core logic resides inside **board.js**:

###  Board Representation

The board is stored as a 2D array (6 rows × 7 columns), with values:

* `0` → empty
* `1` → player 1
* `2` → player 2

###  Move Handling

A piece always drops to the lowest available cell in the selected column.

###  Win Detection

After each move, the system checks:

* horizontal
* vertical
* diagonal (both directions)

A helper function counts connected discs in each direction.

###  Move History & Undo

The game tracks every move, allowing the user to undo the most recent turn.
The UI updates accordingly.

###  Tie Handling

If the board fills with no winner, the game declares a draw.

---

##  Rendering & UI Updates

All rendering logic resides in **ui.js**:

###  Dynamic Board Rendering

After any change, the board redraws cell-by-cell using DOM elements.

###  Animated Token Placement

Discs animate with a quick scaling effect to appear more dynamic.

###  Win Highlight

The four winning discs are visually emphasized with a special highlighted style.

###  Scoreboard Updates

Scores for Pol (Player 1) and Bernat (Player 2) update automatically after each round.

---

##  Player Settings

The default player names have been updated to:

* Player 1 → **Insert the first name**
* Player 2 → **Insert the second name**

Users can modify names and colors using inputs in the left panel.
The "Start / Apply" button applies changes instantly and resets the board.

---

## Mobile Support

Responsive improvements include:

* One-column layout on small screens
* Full-width buttons
* Scaled tokens based on viewport width
* Readable text even on very small displays

The game remains fully playable on smartphones.

---

## Summary

This Connect Four project showcases:

* Clean file separation
* Strong use of pure JavaScript functions
* A modern, attractive UI
* Responsive design
* Interactive sound effects
* Expandable game architecture
* A well-organized and clear codebase

The game is fully functional, visually polished, and ready for future improvements.

---

