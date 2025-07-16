import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { mockGameLogic } from '../utils/mockData';

const GameStatus = ({ currentPlayer, gamePhase, round, winner, starsPlaced, board, settings }) => {
  const emptySquares = mockGameLogic.countEmptySquares(board);
  
  const getPhaseDescription = () => {
    if (winner) return 'Game Over';
    if (gamePhase === 'placement') return 'Place a star';
    if (gamePhase === 'direction') return 'Select a direction';
    return 'Game starting...';
  };

  const getPlayerColor = (player) => {
    return player === 1 ? 'bg-yellow-500' : 'bg-purple-500';
  };

  const getWinConditionStatus = () => {
    if (winner) return null;
    
    const needed = settings.emptySquaresToWin;
    const current = emptySquares;
    
    if (current >= needed) {
      return { status: 'winning', color: 'text-green-600' };
    } else {
      return { status: 'losing', color: 'text-red-600' };
    }
  };

  const winStatus = getWinConditionStatus();

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Round {round}/{settings.numberOfRounds}
          </h2>
          {winner ? (
            <div className="space-y-2">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                🏆 Player {winner} Wins!
              </Badge>
              <p className="text-sm text-gray-600">
                {winner === 1 
                  ? `${emptySquares} empty squares ≥ ${settings.emptySquaresToWin} needed!` 
                  : `${emptySquares} empty squares < ${settings.emptySquaresToWin} needed!`}
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
            <div className="text-2xl font-bold text-purple-600">{settings.numberOfRounds - (round - 1)}</div>
          </div>
        </div>

        {/* Win Condition Status */}
        <div className="bg-white p-3 rounded-lg border">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Win Condition</div>
            <div className="space-y-1">
              <div className={`text-xl font-bold ${winStatus?.color || 'text-gray-800'}`}>
                {emptySquares} / {settings.emptySquaresToWin} empty squares
              </div>
              <div className="text-xs text-gray-600">
                Player 1 needs ≥{settings.emptySquaresToWin} to win
              </div>
              {winStatus && !winner && (
                <div className={`text-xs font-semibold ${winStatus.color}`}>
                  Player 1 currently {winStatus.status}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameStatus;