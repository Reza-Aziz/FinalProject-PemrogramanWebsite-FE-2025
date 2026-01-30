# Find The Match Game

A memory game where you find two cards that match based on a question and answer pair.

## Tech Stack

- **React** (Create React App + Craco)
- **JavaScript** (ES6+)
- **Tailwind CSS** (Styling)
- **Shadcn UI** (Components)
- **LocalStorage** (Data persistence)

## Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

## Running the App

To start the development server:

```bash
npm start
```

This runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building for Production

To build the app for production to the `build` folder:

```bash
npm run build
```

## Features

- **Create Game**: Create a new matching game with a title, localized image, and life count.
- **Play Game**: Play created games. Match questions with their correct answers.
- **Edit Game**: Modify existing games.
- **Offline Capable**: All data is stored in your browser's LocalStorage.
