import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const StarTracker = ({ availableDirections, onDirectionSelect, currentPlayer, gamePhase, disabled = false }) => {
  const directions = [
    { key: 'N', label: 'North ↑', icon: '↑' },
    { key: 'S', label: 'South ↓', icon: '↓' },
    { key: 'E', label: 'East →', icon: '→' },
    { key: 'W', label: 'West ←', icon: '←' },
    { key: 'NE', label: 'Northeast ↗', icon: '↗' },
    { key: 'NW', label: 'Northwest ↖', icon: '↖' },
    { key: 'SE', label: 'Southeast ↘', icon: '↘' },
    { key: 'SW', label: 'Southwest ↙', icon: '↙' }
  ];

  const isActive = currentPlayer === 2 && gamePhase === 'direction' && !disabled;

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <h3 className="text-xl font-bold mb-4 text-center text-purple-800">Star Tracker</h3>
      <div className="grid grid-cols-2 gap-3">
        {directions.map(direction => {
          const isAvailable = availableDirections.includes(direction.key);
          const isUsed = !isAvailable;
          
          return (
            <Button
              key={direction.key}
              variant={isUsed ? "secondary" : "default"}
              className={`h-12 text-lg font-semibold transition-all duration-300 ${
                isUsed 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : isActive 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105' 
                    : 'bg-purple-400 text-white cursor-not-allowed'
              } ${disabled ? 'opacity-50' : ''}`}
              onClick={() => isActive && isAvailable && onDirectionSelect(direction.key)}
              disabled={isUsed || !isActive || disabled}
            >
              <span className="mr-2">{direction.icon}</span>
              {direction.key}
            </Button>
          );
        })}
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        {availableDirections.length} directions remaining
      </div>
    </Card>
  );
};

export default StarTracker;