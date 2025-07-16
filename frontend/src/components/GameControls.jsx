import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const GameControls = ({ onUndo, onNewGame, canUndo, gameHistory, currentSettings, disabled = false }) => {
  return (
    <Card className="p-4 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="space-y-3">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Game Controls</h3>
        </div>
        
        {/* Current Settings Display */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Rounds:</span>
            <Badge variant="outline">{currentSettings.numberOfRounds}</Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Win Threshold:</span>
            <Badge variant="outline">≥{currentSettings.emptySquaresToWin} empty</Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">History:</span>
            <Badge variant="outline">{gameHistory.length} moves</Badge>
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="space-y-2">
          <Button
            onClick={onUndo}
            disabled={!canUndo || disabled}
            variant="outline"
            className={`w-full font-semibold transition-all duration-200 ${
              canUndo && !disabled
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            ↶ Undo Last Move
          </Button>
          
          <Button
            onClick={onNewGame}
            disabled={disabled}
            variant="outline"
            className={`w-full font-semibold transform hover:scale-105 transition-all duration-200 ${
              disabled
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600'
            }`}
          >
            🔄 New Game
          </Button>
        </div>
        
        {/* History Info */}
        {gameHistory.length > 0 && (
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            Last action: {gameHistory[gameHistory.length - 1]?.action || 'None'}
          </div>
        )}
      </div>
    </Card>
  );
};

export default GameControls;