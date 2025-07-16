import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameBoard from "./components/GameBoard";
import StarTracker from "./components/StarTracker";
import GameStatus from "./components/GameStatus";
import GameRules from "./components/GameRules";
import GameSettings from "./components/GameSettings";
import GameControls from "./components/GameControls";
import { defaultGameSettings } from "./utils/mockData";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import GameService from "./services/gameService";

const StarDirectionGame = () => {
  const [gameSettings, setGameSettings] = useState(defaultGameSettings);
  const [gameState, setGameState] = useState(null);
  const [currentGameId, setCurrentGameId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initialize with a new game
  useEffect(() => {
    createNewGame();
  }, []);

  const createNewGame = async (settings = gameSettings) => {
    setLoading(true);
    try {
      const response = await GameService.createGame(settings);
      if (response.success) {
        setGameState(response.game);
        setCurrentGameId(response.game.id);
        setGameSettings(settings);
        
        toast({
          title: "Game Created! 🎮",
          description: "New game started. Player 1 goes first!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = async (row, col) => {
    if (!currentGameId || !gameState || gameState.currentPlayer !== 1 || gameState.gamePhase !== 'placement' || gameState.winner) {
      return;
    }

    setLoading(true);
    try {
      const response = await GameService.placeStar(currentGameId, row, col);
      if (response.success) {
        setGameState(response.game);
        
        toast({
          title: "Star Placed! ⭐",
          description: "Player 2's turn to select a direction",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDirectionSelect = async (direction) => {
    if (!currentGameId || !gameState || gameState.currentPlayer !== 2 || gameState.gamePhase !== 'direction' || gameState.winner) {
      return;
    }

    setLoading(true);
    try {
      const response = await GameService.selectDirection(currentGameId, direction);
      if (response.success) {
        setGameState(response.game);
        
        toast({
          title: `Direction Selected! ${direction}`,
          description: response.game.winner 
            ? `Player ${response.game.winner} wins!` 
            : "Player 1's turn to place a star",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async () => {
    if (!currentGameId || !gameState || gameState.gameHistory.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await GameService.undoMove(currentGameId);
      if (response.success) {
        setGameState(response.game);
        
        toast({
          title: "Move Undone! ↶",
          description: "Returned to previous game state",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (newSettings) => {
    setGameSettings(newSettings);
    createNewGame(newSettings);
    
    toast({
      title: "Settings Updated! ⚙️",
      description: "New game started with updated settings",
    });
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎮</div>
          <div className="text-lg">Loading game...</div>
        </div>
      </div>
    );
  }

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
              disabled={loading}
            />
          </div>
          
          <div className="space-y-4">
            <GameStatus
              currentPlayer={gameState.currentPlayer}
              gamePhase={gameState.gamePhase}
              round={gameState.round}
              winner={gameState.winner}
              starsPlaced={gameState.starsPlaced}
              board={gameState.board}
              settings={gameState.settings}
            />
            
            <StarTracker
              availableDirections={gameState.availableDirections}
              onDirectionSelect={handleDirectionSelect}
              currentPlayer={gameState.currentPlayer}
              gamePhase={gameState.gamePhase}
              disabled={loading}
            />
            
            <GameControls
              onUndo={handleUndo}
              onNewGame={() => createNewGame(gameSettings)}
              canUndo={gameState.gameHistory.length > 0}
              gameHistory={gameState.gameHistory}
              currentSettings={gameState.settings}
              disabled={loading}
            />
            
            <GameSettings
              currentSettings={gameSettings}
              onSettingsChange={handleSettingsChange}
              onNewGame={() => createNewGame(gameSettings)}
              disabled={loading}
            />
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
