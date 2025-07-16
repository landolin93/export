import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

const GameRules = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            {isOpen ? 'Hide Rules' : 'Show Rules'} 📜
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-3 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-800">How to Play:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Player 1:</strong> Places one ⭐ star per turn on empty squares</li>
              <li><strong>Player 2:</strong> Selects a direction from the star tracker</li>
              <li>When a direction is chosen, all squares in that direction from each star become ⭕ circles</li>
              <li>Lines stop at board edges</li>
              <li>Game lasts 8 rounds (all directions used)</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-800">Win Conditions:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Player 1 wins:</strong> If any empty squares remain after 8 rounds</li>
              <li><strong>Player 2 wins:</strong> If the board is completely filled</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-800">Strategy Tips:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Player 1: Try to place stars to preserve empty squares</li>
              <li>Player 2: Choose directions that fill the most squares</li>
              <li>Think ahead - each direction can only be used once!</li>
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default GameRules;