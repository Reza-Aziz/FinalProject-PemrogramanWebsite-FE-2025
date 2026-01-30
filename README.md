# Find The Match - Memory Puzzle Game

**Vercel Deployment:** https://find-the-match-one.vercel.app/

## Overview

"Find The Match" is an engaging memory puzzle game where players test their cognitive skills by finding matching pairs of items. Built with modern web technologies, it features a unified single-page experience that allows users to seamlessly create, manage, and play games.

## Tech Stack

- **Framework:** React.js (v18)
- **Language:** JavaScript (ES6+)
- **Styling:** Tailwind CSS (v3)
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Effects:** Canvas Confetti
- **Deployment:** Vercel (SPA Configuration)

## Features

### 1. Unified Main Menu

- **Single Page Experience:** Users can access both the game library and the creation tools from a single hub.
- **Toggle Navigation:** A smooth toggle switch allows instant transition between "Play Game" and "Create Game" modes without page reloads.

### 2. Game Creation

- **Custom Puzzles:** Users can design their own games by creating custom question-answer pairs.
- **Rich Media:** Supports optional thumbnail uploads for valid image types (PNG/JPEG, max 2MB).
- **Dynamic Validation:** Real-time form validation ensures all games meet quality standards before creation.

### 3. Gameplay

- **Interactive Interface:** A vibrant, responsive UI with animations and sound effects.
- **Live Feedback:** Immediate visual feedback for correct and incorrect matches.
- **Score System:** Tracks player performance with lives and score calculation.
- **Game Over Screen:** Provides summary statistics and options to replay or return to the menu.

### 4. Game Management

- **Local Storage:** All created games are persisted locally in the user's browser.
- **Deletion:** Users can easily remove games from their library with a confirmation safeguard.

## Project Structure

```
src/
├── components/         # Shared UI components (Button, Card, Input, etc.)
├── FindTheMatch/       # Core Game Module
│   ├── components/     # Game-specific components (CreateGameForm, GameHeader, etc.)
│   ├── services/       # Business logic and storage persistence
│   ├── MainMenu.jsx    # Main entry point and dashboard
│   ├── PlayFindTheMatch.jsx # Gameplay engine
│   └── ...
├── App.js              # Application routing and layout
└── ...
```

## How to Run Locally

### Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd FinalProject-PemrogramanWebsite-FE-2025
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm run start
    ```

4.  **Access the application:**
    Open your browser and navigate to `http://localhost:3000`.

---

_Developed for Final Project EAS Semester 3 - Web Programming._
