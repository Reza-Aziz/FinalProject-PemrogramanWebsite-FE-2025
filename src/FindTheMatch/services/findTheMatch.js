const STORAGE_KEY = "find_the_match_games";

export const findTheMatchService = {
  // Get all games
  getAllGames: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading games", error);
      return [];
    }
  },

  // Get single game
  getPublicGame: (id) => {
    return new Promise((resolve, reject) => {
        // Simulate async to match old API signature
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

  // Save (Create or Update)
  saveGame: (gameData) => {
    return new Promise((resolve, reject) => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            let games = data ? JSON.parse(data) : [];
            
            const existingIndex = games.findIndex(g => g.id === gameData.id);
            if (existingIndex >= 0) {
                // Update
                games[existingIndex] = { ...games[existingIndex], ...gameData };
            } else {
                // Create
                games.push(gameData);
            }
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
            resolve(gameData);
        } catch (error) {
            reject(error); // e.g. QuotaExceeded
        }
    });
  },

  // Helpers
  getGameItems: (game) => {
     return game.game_json?.items || [];
  },

  getInitialLives: (game) => {
      // Logic from old code: game?.game_json?.initial_lives ?? 3
      return game?.game_json?.initial_lives ?? 3;
  },

  checkAnswer: (gameId, questionText, answerText, otherAnswers, currentLives) => {
      return new Promise((resolve) => {
           // In local version, we assume client has the data, so we check logic here.
           // However, for security "simulation", we could re-fetch.
           // But simply: compare text.
           // Needs the game object to verify? The caller handles logic partially?
           // Actually, the caller (PlayFindTheMatch) imports this service.
           
           // We need to fetch the game again to be sure? Or just trust the matching?
           // The caller `PlayFindTheMatch.jsx` does:
           // const result = await findTheMatchService.checkAnswer(...)
           
           // We need to implement the check logic.
           // First, get the game.
           const data = localStorage.getItem(STORAGE_KEY);
           const games = data ? JSON.parse(data) : [];
           const game = games.find(g => g.id === gameId);
           
           if (!game) {
               resolve({ is_correct: false });
               return;
           }
           
           const items = game.game_json.items || [];
           const pair = items.find(i => i.question === questionText);
           
           const isCorrect = pair && pair.answer === answerText;
           
           resolve({ is_correct: isCorrect });
      });
  }
};
