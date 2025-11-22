# Hypermedia-Project-Connect-Four-
##  Overview

This project is a complete implementation of the classic **Connect Four** game using only **HTML, CSS, and JavaScript**, organized into multiple files for clarity and maintainability. The goal of the assignment was to create a fully functioning, visually appealing, responsive web application without using external libraries or frameworks. This project was made by Pol Cañadas & Bernat Pujolriu.

The application allows two players to compete locally on the same device, dropping tokens into a 7×6 grid until one achieves four connected discs in any direction (horizontal, vertical, or diagonal). The user interface is fully custom styled, responsive across devices, and includes interactive sound effects. We even would like to mention that we created a GitHub repository to work together: https://github.com/MaskedLlama04/Hypermedia-Project-Connect-Four-

##  Project Structure

Firstly, we must say that we wanted to do it more "professionally" we could say. So, instead of just putting all the files of the project together, we actually tried to divide it in three parts. The main html and CSS files, then we have a folder for any kind of assets (in this case, the audio files), and then a folder dedicated to the js files that we ended up using. The structure basically ends up like this.
```
connect4/
│
├── index.html          # Main webpage
├── styles.css          # All styling rules
│
├── assets/             # Media files (sound effects)
│   ├── popsound.mp3
│   └── victory.mp3
|   └── block.mp3
│
└── js/                 # Separated JavaScript modules
    ├── main.js         # Initialization + event handling
    ├── board.js        # Game logic & state management
    ├── ui.js           # Rendering, animations, UI updates
    └── utils.js        # Helper functions
    └── ai.js           # The AI game mode management
    └── random.js       # Random Chaos game mode handler
```

The entire project has been modularized so each component has a clear responsibility, making it easier to read.

---

##  User Interface

### ✔️ Custom Action Buttons

The “Start / Apply”, “New Round”, and “Reset Scores” buttons were redesigned with gradient colors, hover animations, and improved spacing. The **Start Round** button is placed at the center and styled as the main call-to-action.

**IMPORTANT NOTE**: When starting/wanting to play, we always recommend to use the **"Start/Apply"** button. This will confirm both player's name, their selected colour, and most importantly the selected gamemode. By that we mean that if you are mid-game, and want to change the first player's colour to black, and also change from the player vs player mode to the player vs AI, you need to select firstly the new colour, then the gamemode below and finally press this button. A new round will start (keeping the old scores of course) with an empty board and the chosen changes. In other words, any kind of change must be done with this button.

**SECOND IMPORTANT NOTE**: Also we must tell that **"New Round"** button keeps all the current settings and only makes the board empty and ready to play again. And the **"Reset Scores"** basically does the same thing, but putting both scores to 0.

**LAST IMPORTANT NOTE WE PROMISE**: For playing, the users will have to click on the "▼" icon on top of each one of the columns. The piece will go to the lowest available position from that chosen column. We also would love to mention that if the board is full, an alert is going to appear telling the user to start a new round.

### ✔️ Enhanced Undo Button

The "Undo last" button was transformed into a visual element using a purple gradient, glowing effects, and smooth animations to stand out more clearly inside the top control bar. Its use is basically to go back the previous movement and see what happened.

### ✔️ GameMode Selector

A **“Select GameMode”** section was added below the left information panel.
We have included three main options:

* **PVP (Player vs Player)** — pre-selected by default. The classic gameplay mode. Two human players alternate turns, competing to connect four discs in any direction.

* **PvAI (Player vs AI)** - a new gamemode where the player competes against a smart AI opponent.
The AI uses:
Minimax-inspired evaluation (we saw the algorythm on the "IA" course of the university and tried to replicate it here). Its not the smartest intelligence, but it was a fun thing to try given that both of us work on IA development jobs. For that we had to do things like column scanning, threat detection, weighted scoring for 2-in-a-row and 3-in-a-row patterns (basically playing with "rewards"), and making sure the blockers stop the AI from counting sequences.
The AI always plays valid moves and attempts to block or create strong formations.

* **Random Chaos (Player vs Player w/Random)** - A unique mode where after each player complete their turns, the board automatically adds a new disc called blocker.
The blockers will appear only in valid and reachable board positions (drop from the top like normal discs). They are easy to find because they are visually distinct (rainbow gradient animated disc). They do not belong to either player and can break win sequences. Of course, they cannot win, be undone, or be controlled by players
This mode introduces unpredictability and forces players to rethink their strategies as the “board fights back.”

### ✔️ Responsive Design

We have tried to make the entire interface work across:

* Phones
* Tablets
* Desktop screens

This includes:

* Stacked or horizontal layouts depending on screen width
* Font resizing
* Full-width buttons on mobile
* Tap-friendly spacing

---

##  Sound Effects

Three sound effects have been integrated:

###  Token Placement (“pop” sound)

Each time a player drops a token, a **popsound.mp3** plays.
This provides tactile-like feedback and improves user experience.

###  Win Celebration (“victory” sound)

When a player connects four tokens and wins the game, a **victory.mp3** sound plays.

###  Block Placement (“block” sound)

When playing in the Random Chaos mode, after each player turn a block will appear on the board, the **block.mp3** sound is going to play.

All these sounds are loaded from the **assets/** folder and activaded on the JavaScripts files.

---

##  Game Logic

All core logic resides inside **board.js**:

###  Board Representation

The board is stored as a 2D array (6 rows × 7 columns), with values:

* `0` → empty
* `1` → player 1
* `2` → player 2
* `3` → blocker (for the Random Chaos mode)

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

If the board fills with no winner, the game declares a draw with an alert.

---

##  Rendering & UI Updates

All rendering logic resides in **ui.js**. After any change, the board redraws cell-by-cell using DOM elements.

###  Animated Token Placement

Discs animate with a quick scaling effect to appear more dynamic.

###  Scoreboard Updates

Scores for Pol (Player 1) and Bernat (Player 2) update automatically after each round.

---

##  Player Settings

The default player names have been updated to:

* Player 1 → **Pol**
* Player 2 → **Bernat**

Users can modify names and colors using inputs in the left panel.
The "Start / Apply" button applies changes instantly and resets the board (it also makes switches between gamemodes).

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
* Several JavaScript functions for each part of the game
* A (attractive?) UI
* Responsive design
* Interactive sound effects
* Expandable game architecture

The game is fully functional, visually polished, and ready to play. At the end, given we both work in AI related jobs,  we also tried to make it a little better with the AI gamemode, and the third randomized mode was really fun to try and prepare it too. At the end, we really had some fun with this project.

---

