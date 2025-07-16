// Mock data for the Star Direction Game
export const createEmptyBoard = () => {
  return Array.from({ length: 6 }, () => Array(6).fill('empty'));
};

export const defaultGameSettings = {
  numberOfRounds: 8,
  emptySquaresToWin: 1,
  maxDirections: 8
};

export const createInitialGameState = (settings = defaultGameSettings) => ({
  board: createEmptyBoard(),
  currentPlayer: 1,
  gamePhase: 'placement', // 'placement' or 'direction'
  round: 1,
  availableDirections: ['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'],
  winner: null,
  starsPlaced: 0,
  gameHistory: [],
  settings: { ...settings }
});

// Direction vectors for calculating circle positions
export const directionVectors = {
  N: [-1, 0],
  S: [1, 0],
  E: [0, 1],
  W: [0, -1],
  NE: [-1, 1],
  NW: [-1, -1],
  SE: [1, 1],
  SW: [1, -1]
};

// Mock game logic functions
export const mockGameLogic = {
  placeStar: (board, row, col) => {
    if (board[row][col] === 'empty') {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = 'star';
      return newBoard;
    }
    return board;
  },

  applyDirection: (board, direction) => {
    const newBoard = board.map(r => [...r]);
    const [dRow, dCol] = directionVectors[direction];
    
    // Find all stars and draw lines in the selected direction
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (board[row][col] === 'star') {
          // Draw line from this star in the selected direction
          let currentRow = row + dRow;
          let currentCol = col + dCol;
          
          while (currentRow >= 0 && currentRow < 6 && currentCol >= 0 && currentCol < 6) {
            if (newBoard[currentRow][currentCol] === 'empty') {
              newBoard[currentRow][currentCol] = 'circle';
            }
            currentRow += dRow;
            currentCol += dCol;
          }
        }
      }
    }
    
    return newBoard;
  },

  checkWinner: (board, round, settings) => {
    // Game ends after specified number of rounds
    if (round > settings.numberOfRounds) {
      // Count empty squares
      let emptyCount = 0;
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          if (board[row][col] === 'empty') {
            emptyCount++;
          }
        }
      }
      
      // Player 1 wins if empty squares >= threshold
      if (emptyCount >= settings.emptySquaresToWin) {
        return { winner: 1, emptyCount };
      } else {
        return { winner: 2, emptyCount };
      }
    }
    return { winner: null, emptyCount: null };
  },

  countStars: (board) => {
    let count = 0;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (board[row][col] === 'star') {
          count++;
        }
      }
    }
    return count;
  },

  countEmptySquares: (board) => {
    let count = 0;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (board[row][col] === 'empty') {
          count++;
        }
      }
    }
    return count;
  },

  createGameStateSnapshot: (gameState) => {
    return {
      board: gameState.board.map(row => [...row]),
      currentPlayer: gameState.currentPlayer,
      gamePhase: gameState.gamePhase,
      round: gameState.round,
      availableDirections: [...gameState.availableDirections],
      winner: gameState.winner,
      starsPlaced: gameState.starsPlaced,
      settings: { ...gameState.settings }
    };
  }
};