from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from models.game_models import (
    GameState, CreateGameRequest, PlaceStarRequest, 
    SelectDirectionRequest, GameResponse
)
from services.game_service import GameService
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime

router = APIRouter(prefix="/api/game", tags=["game"])

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
games_collection = db.games

@router.post("/", response_model=GameResponse)
async def create_game(request: CreateGameRequest):
    """Create a new game"""
    try:
        game_state = GameService.create_new_game(request.settings)
        
        # Save to database
        game_dict = game_state.dict()
        await games_collection.insert_one(game_dict)
        
        return GameResponse(
            success=True,
            message="Game created successfully",
            game=game_state
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating game: {str(e)}")

@router.get("/{game_id}", response_model=GameResponse)
async def get_game(game_id: str):
    """Get game by ID"""
    try:
        game_doc = await games_collection.find_one({"id": game_id})
        
        if not game_doc:
            raise HTTPException(status_code=404, detail="Game not found")
        
        game_state = GameState(**game_doc)
        
        return GameResponse(
            success=True,
            message="Game retrieved successfully",
            game=game_state
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving game: {str(e)}")

@router.post("/{game_id}/place-star", response_model=GameResponse)
async def place_star(game_id: str, request: PlaceStarRequest):
    """Place a star on the game board"""
    try:
        # Get game from database
        game_doc = await games_collection.find_one({"id": game_id})
        if not game_doc:
            raise HTTPException(status_code=404, detail="Game not found")
        
        game_state = GameState(**game_doc)
        
        # Place star
        success, message = GameService.place_star(game_state, request.row, request.col)
        
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        # Update in database
        game_dict = game_state.dict()
        await games_collection.replace_one({"id": game_id}, game_dict)
        
        return GameResponse(
            success=True,
            message=message,
            game=game_state
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error placing star: {str(e)}")

@router.post("/{game_id}/select-direction", response_model=GameResponse)
async def select_direction(game_id: str, request: SelectDirectionRequest):
    """Select a direction for the star tracker"""
    try:
        # Get game from database
        game_doc = await games_collection.find_one({"id": game_id})
        if not game_doc:
            raise HTTPException(status_code=404, detail="Game not found")
        
        game_state = GameState(**game_doc)
        
        # Apply direction
        success, message = GameService.apply_direction(game_state, request.direction)
        
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        # Update in database
        game_dict = game_state.dict()
        await games_collection.replace_one({"id": game_id}, game_dict)
        
        return GameResponse(
            success=True,
            message=message,
            game=game_state
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error selecting direction: {str(e)}")

@router.post("/{game_id}/undo", response_model=GameResponse)
async def undo_move(game_id: str):
    """Undo the last move"""
    try:
        # Get game from database
        game_doc = await games_collection.find_one({"id": game_id})
        if not game_doc:
            raise HTTPException(status_code=404, detail="Game not found")
        
        game_state = GameState(**game_doc)
        
        # Undo move
        success, message = GameService.undo_move(game_state)
        
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        # Update in database
        game_dict = game_state.dict()
        await games_collection.replace_one({"id": game_id}, game_dict)
        
        return GameResponse(
            success=True,
            message=message,
            game=game_state
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error undoing move: {str(e)}")

@router.get("/", response_model=List[GameState])
async def list_games(limit: int = 10, skip: int = 0):
    """List all games"""
    try:
        games_cursor = games_collection.find().skip(skip).limit(limit).sort("createdAt", -1)
        games = []
        
        async for game_doc in games_cursor:
            games.append(GameState(**game_doc))
        
        return games
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing games: {str(e)}")

@router.delete("/{game_id}")
async def delete_game(game_id: str):
    """Delete a game"""
    try:
        result = await games_collection.delete_one({"id": game_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Game not found")
        
        return {"success": True, "message": "Game deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting game: {str(e)}")