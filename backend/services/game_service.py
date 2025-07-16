from typing import Dict, List, Optional, Tuple
from models.game_models import GameState, GameSettings, GameHistoryEntry, GameResponse
from datetime import datetime

class GameService:
    
    # Direction vectors for calculating circle positions
    DIRECTION_VECTORS = {
        'N': (-1, 0),
        'S': (1, 0),
        'E': (0, 1),
        'W': (0, -1),
        'NE': (-1, 1),
        'NW': (-1, -1),
        'SE': (1, 1),
        'SW': (1, -1)
    }
    
    @staticmethod
    def create_empty_board() -> List[List[str]]:
        """Create a 6x6 empty board"""
        return [['empty'] * 6 for _ in range(6)]
    
    @staticmethod
    def create_game_state_snapshot(game_state: GameState) -> Dict:
        """Create a snapshot of current game state for history"""
        return {
            'board': [row[:] for row in game_state.board],
            'currentPlayer': game_state.currentPlayer,
            'gamePhase': game_state.gamePhase,
            'round': game_state.round,
            'availableDirections': game_state.availableDirections[:],
            'winner': game_state.winner,
            'starsPlaced': game_state.starsPlaced,
            'settings': game_state.settings.dict()
        }
    
    @staticmethod
    def place_star(game_state: GameState, row: int, col: int) -> Tuple[bool, str]:
        """Place a star on the board"""
        # Validate move
        if game_state.currentPlayer != 1:
            return False, "Not Player 1's turn"
        
        if game_state.gamePhase != 'placement':
            return False, "Not in placement phase"
        
        if game_state.winner is not None:
            return False, "Game is already finished"
        
        if row < 0 or row >= 6 or col < 0 or col >= 6:
            return False, "Invalid position"
        
        if game_state.board[row][col] != 'empty':
            return False, "Position is not empty"
        
        # Save current state to history
        snapshot = GameService.create_game_state_snapshot(game_state)
        history_entry = GameHistoryEntry(
            **snapshot,
            action=f"Star placed at ({row}, {col})",
            timestamp=datetime.utcnow().timestamp()
        )
        game_state.gameHistory.append(history_entry)
        
        # Place the star
        game_state.board[row][col] = 'star'
        game_state.currentPlayer = 2
        game_state.gamePhase = 'direction'
        game_state.starsPlaced += 1
        game_state.updatedAt = datetime.utcnow()
        
        return True, "Star placed successfully"
    
    @staticmethod
    def apply_direction(game_state: GameState, direction: str) -> Tuple[bool, str]:
        """Apply a direction to create circles from all stars"""
        # Validate move
        if game_state.currentPlayer != 2:
            return False, "Not Player 2's turn"
        
        if game_state.gamePhase != 'direction':
            return False, "Not in direction phase"
        
        if game_state.winner is not None:
            return False, "Game is already finished"
        
        if direction not in game_state.availableDirections:
            return False, "Direction not available"
        
        if direction not in GameService.DIRECTION_VECTORS:
            return False, "Invalid direction"
        
        # Save current state to history
        snapshot = GameService.create_game_state_snapshot(game_state)
        history_entry = GameHistoryEntry(
            **snapshot,
            action=f"Direction selected: {direction}",
            timestamp=datetime.utcnow().timestamp()
        )
        game_state.gameHistory.append(history_entry)
        
        # Apply direction to create circles
        d_row, d_col = GameService.DIRECTION_VECTORS[direction]
        
        # Find all stars and draw lines in the selected direction
        for row in range(6):
            for col in range(6):
                if game_state.board[row][col] == 'star':
                    # Draw line from this star in the selected direction
                    current_row = row + d_row
                    current_col = col + d_col
                    
                    while (0 <= current_row < 6 and 0 <= current_col < 6):
                        if game_state.board[current_row][current_col] == 'empty':
                            game_state.board[current_row][current_col] = 'circle'
                        current_row += d_row
                        current_col += d_col
        
        # Update game state
        game_state.availableDirections.remove(direction)
        game_state.currentPlayer = 1
        game_state.gamePhase = 'placement'
        game_state.round += 1
        game_state.updatedAt = datetime.utcnow()
        
        # Check for winner
        winner = GameService.check_winner(game_state)
        if winner:
            game_state.winner = winner
        
        return True, "Direction applied successfully"
    
    @staticmethod
    def check_winner(game_state: GameState) -> Optional[int]:
        """Check if there's a winner based on game state"""
        # Game ends after specified number of rounds
        if game_state.round > game_state.settings.numberOfRounds:
            empty_count = GameService.count_empty_squares(game_state.board)
            
            # Player 1 wins if empty squares >= threshold
            if empty_count >= game_state.settings.emptySquaresToWin:
                return 1
            else:
                return 2
        
        return None
    
    @staticmethod
    def count_empty_squares(board: List[List[str]]) -> int:
        """Count empty squares on the board"""
        count = 0
        for row in board:
            for cell in row:
                if cell == 'empty':
                    count += 1
        return count
    
    @staticmethod
    def count_stars(board: List[List[str]]) -> int:
        """Count stars on the board"""
        count = 0
        for row in board:
            for cell in row:
                if cell == 'star':
                    count += 1
        return count
    
    @staticmethod
    def undo_move(game_state: GameState) -> Tuple[bool, str]:
        """Undo the last move"""
        if not game_state.gameHistory:
            return False, "No moves to undo"
        
        if game_state.winner is not None:
            return False, "Cannot undo after game is finished"
        
        # Get the last state from history
        last_state = game_state.gameHistory.pop()
        
        # Restore the game state
        game_state.board = [row[:] for row in last_state.board]
        game_state.currentPlayer = last_state.currentPlayer
        game_state.gamePhase = last_state.gamePhase
        game_state.round = last_state.round
        game_state.availableDirections = last_state.availableDirections[:]
        game_state.winner = last_state.winner
        game_state.starsPlaced = last_state.starsPlaced
        game_state.updatedAt = datetime.utcnow()
        
        return True, "Move undone successfully"
    
    @staticmethod
    def create_new_game(settings: Optional[GameSettings] = None) -> GameState:
        """Create a new game with optional settings"""
        if settings is None:
            settings = GameSettings()
        
        return GameState(
            board=GameService.create_empty_board(),
            settings=settings,
            createdAt=datetime.utcnow(),
            updatedAt=datetime.utcnow()
        )