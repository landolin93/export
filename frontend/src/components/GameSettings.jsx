import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Slider } from './ui/slider';

const GameSettings = ({ currentSettings, onSettingsChange, onNewGame }) => {
  const [settings, setSettings] = useState(currentSettings);
  const [isOpen, setIsOpen] = useState(false);

  const handleSettingsUpdate = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applySettings = () => {
    onSettingsChange(settings);
    onNewGame();
    setIsOpen(false);
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      numberOfRounds: 8,
      emptySquaresToWin: 1,
      maxDirections: 8
    };
    setSettings(defaultSettings);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold">
          ⚙️ Game Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">⚙️ Game Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Number of Rounds */}
          <div className="space-y-2">
            <Label htmlFor="rounds" className="text-sm font-semibold">
              Number of Rounds (Stars to Place)
            </Label>
            <div className="space-y-2">
              <Slider
                id="rounds"
                min={4}
                max={12}
                step={1}
                value={[settings.numberOfRounds]}
                onValueChange={(value) => handleSettingsUpdate('numberOfRounds', value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>4</span>
                <span className="font-semibold text-blue-600">{settings.numberOfRounds}</span>
                <span>12</span>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Each round = 1 star placed + 1 direction used
            </p>
          </div>

          {/* Win Condition */}
          <div className="space-y-2">
            <Label htmlFor="winCondition" className="text-sm font-semibold">
              Player 1 Wins if Empty Squares ≥
            </Label>
            <div className="space-y-2">
              <Slider
                id="winCondition"
                min={1}
                max={10}
                step={1}
                value={[settings.emptySquaresToWin]}
                onValueChange={(value) => handleSettingsUpdate('emptySquaresToWin', value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span className="font-semibold text-green-600">{settings.emptySquaresToWin}</span>
                <span>10</span>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Player 2 wins if empty squares &lt; {settings.emptySquaresToWin}
            </p>
          </div>

          {/* Game Balance Preview */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Balance Preview:</h4>
            <div className="space-y-1 text-xs">
              <div>🎯 <strong>{settings.numberOfRounds}</strong> stars will be placed</div>
              <div>🎯 <strong>{settings.numberOfRounds}</strong> directions will be used</div>
              <div>🏆 Player 1 needs <strong>≥{settings.emptySquaresToWin}</strong> empty squares to win</div>
              <div>🏆 Player 2 needs <strong>&lt;{settings.emptySquaresToWin}</strong> empty squares to win</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="flex-1"
            >
              🔄 Reset Defaults
            </Button>
            <Button
              onClick={applySettings}
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
            >
              ✅ Apply & New Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameSettings;