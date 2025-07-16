import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameBoard from "./components/GameBoard";
import StarTracker from "./components/StarTracker";
import GameStatus from "./components/GameStatus";
import GameRules from "./components/GameRules";
import { Button } from "./components/ui/button";
import { mockGameState, mockGameLogic, createEmptyBoard } from "./utils/mockData";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";

const StarDirectionGame = () => {
  const [gameState, setGameState] = useState(mockGameState);
  const { toast } = useToast();

  const handleCellClick = (row, col) => {
    if (gameState.currentPlayer !== 1 || gameState.gamePhase !== 'placement' || gameState.winner) {
      return;
    }

    const newBoard = mockGameLogic.placeStar(gameState.board, row, col);
    if (newBoard !== gameState.board) {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        currentPlayer: 2,
        gamePhase: 'direction',
        starsPlaced: prev.starsPlaced + 1
      }));
      
      toast({
        title: "Star Placed! ⭐",
        description: "Player 2's turn to select a direction",
      });
    }
  };

  const handleDirectionSelect = (direction) => {
    if (gameState.currentPlayer !== 2 || gameState.gamePhase !== 'direction' || gameState.winner) {
      return;
    }

    const newBoard = mockGameLogic.applyDirection(gameState.board, direction);
    const newAvailableDirections = gameState.availableDirections.filter(d => d !== direction);
    const newRound = gameState.round + 1;
    const winner = mockGameLogic.checkWinner(newBoard, newRound);

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: 1,
      gamePhase: 'placement',
      round: newRound,
      availableDirections: newAvailableDirections,
      winner: winner
    }));

    toast({
      title: `Direction Selected! ${direction}`,
      description: winner ? `Player ${winner} wins!` : "Player 1's turn to place a star",
    });
  };

  const resetGame = () => {
    setGameState({
      board: createEmptyBoard(),
      currentPlayer: 1,
      gamePhase: 'placement',
      round: 1,
      availableDirections: ['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'],
      winner: null,
      starsPlaced: 0,
      gameHistory: []
    });
    
    toast({
      title: "Game Reset! 🎮",
      description: "New game started. Player 1 goes first!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            ⭐ Star Direction Game ⭐
          </h1>
          <p className="text-lg text-gray-600">
            Strategic placement meets directional transformation
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <GameBoard
              board={gameState.board}
              onCellClick={handleCellClick}
              currentPlayer={gameState.currentPlayer}
              gamePhase={gameState.gamePhase}
            />
          </div>
          
          <div className="space-y-4">
            <GameStatus
              currentPlayer={gameState.currentPlayer}
              gamePhase={gameState.gamePhase}
              round={gameState.round}
              winner={gameState.winner}
              starsPlaced={gameState.starsPlaced}
            />
            
            <StarTracker
              availableDirections={gameState.availableDirections}
              onDirectionSelect={handleDirectionSelect}
              currentPlayer={gameState.currentPlayer}
              gamePhase={gameState.gamePhase}
            />
            
            <Button
              onClick={resetGame}
              variant="outline"
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 font-semibold"
            >
              🔄 New Game
            </Button>
          </div>
        </div>

        <GameRules />
      </div>
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StarDirectionGame />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
