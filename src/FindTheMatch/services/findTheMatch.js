const STORAGE_KEY = "find_the_match_games";

export const findTheMatchService = {
  getAllGames: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading games", error);
      return [];
    }
  },

  getPublicGame: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = localStorage.getItem(STORAGE_KEY);
          const games = data ? JSON.parse(data) : [];
          const game = games.find((g) => g.id === id);
          if (game) {
            resolve(game);
          } else {
            reject(new Error("Game not found"));
          }
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  },

  saveGame: (gameData) => {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        let games = data ? JSON.parse(data) : [];

        const existingIndex = games.findIndex((g) => g.id === gameData.id);
        if (existingIndex >= 0) {
          games[existingIndex] = { ...games[existingIndex], ...gameData };
        } else {
          games.push(gameData);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
        resolve(gameData);
      } catch (error) {
        reject(error); // e.g. QuotaExceeded
      }
    });
  },

  deleteGame: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        let games = data ? JSON.parse(data) : [];

        const newGames = games.filter((g) => g.id !== id);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newGames));
        resolve();
      } catch (error) {
        console.error("Error deleting game", error);
        reject(error);
      }
    });
  },

  getGameItems: (game) => {
    return game.game_json?.items || [];
  },

  getInitialLives: (game) => {
    return game?.game_json?.initial_lives ?? 3;
  },

  checkAnswer: (gameId, questionText, answerText) => {
    return new Promise((resolve) => {
      const data = localStorage.getItem(STORAGE_KEY);
      const games = data ? JSON.parse(data) : [];
      const game = games.find((g) => g.id === gameId);

      if (!game) {
        resolve({ is_correct: false });
        return;
      }

      const items = game.game_json.items || [];
      const pair = items.find((i) => i.question === questionText);

      const isCorrect = pair && pair.answer === answerText;

      resolve({ is_correct: isCorrect });
    });
  },
};
