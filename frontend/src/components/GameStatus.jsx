import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const GameStatus = ({ currentPlayer, gamePhase, round, winner, starsPlaced }) => {
  const getPhaseDescription = () => {
    if (winner) return 'Game Over';
    if (gamePhase === 'placement') return 'Place a star';
    if (gamePhase === 'direction') return 'Select a direction';
    return 'Game starting...';
  };

  const getPlayerColor = (player) => {
    return player === 1 ? 'bg-yellow-500' : 'bg-purple-500';
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Round {round}/8
          </h2>
          {winner ? (
            <div className="space-y-2">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                🏆 Player {winner} Wins!
              </Badge>
              <p className="text-sm text-gray-600">
                {winner === 1 ? 'Empty squares remain!' : 'Board completely filled!'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Badge 
                className={`text-lg px-4 py-2 ${getPlayerColor(currentPlayer)} text-white`}
              >
                Player {currentPlayer}'s Turn
              </Badge>
              <p className="text-sm text-gray-600">
                {getPhaseDescription()}
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-sm text-gray-500">Stars Placed</div>
            <div className="text-2xl font-bold text-yellow-600">{starsPlaced}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-500">Directions Used</div>
            <div className="text-2xl font-bold text-purple-600">{8 - (round - 1)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameStatus;