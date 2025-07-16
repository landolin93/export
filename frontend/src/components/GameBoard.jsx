import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const GameBoard = ({ board, onCellClick, currentPlayer, gamePhase, disabled = false }) => {
  const renderCell = (row, col) => {
    const cell = board[row][col];
    let cellContent = '';
    let cellClass = 'w-16 h-16 border-2 border-gray-300 flex items-center justify-center text-2xl font-bold transition-all duration-300 hover:bg-gray-100 cursor-pointer';
    
    if (cell === 'star') {
      cellContent = '⭐';
      cellClass += ' bg-yellow-100 hover:bg-yellow-200';
    } else if (cell === 'circle') {
      cellContent = '⭕';
      cellClass += ' bg-blue-100 hover:bg-blue-200';
    } else {
      cellClass += ' bg-white hover:bg-gray-50';
    }
    
    // Disable clicking if not Player 1's turn or not in placement phase or disabled
    const isClickable = currentPlayer === 1 && gamePhase === 'placement' && cell === 'empty' && !disabled;
    
    if (!isClickable) {
      cellClass = cellClass.replace('cursor-pointer', 'cursor-not-allowed');
      if (disabled) {
        cellClass += ' opacity-50';
      }
    }
    
    return (
      <div
        key={`${row}-${col}`}
        className={cellClass}
        onClick={() => isClickable && onCellClick(row, col)}
      >
        {cellContent}
      </div>
    );
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="grid grid-cols-6 gap-1 w-fit mx-auto">
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => renderCell(row, col))
        )}
      </div>
    </Card>
  );
};

export default GameBoard;