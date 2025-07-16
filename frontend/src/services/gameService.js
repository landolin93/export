import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/game`;

class GameService {
  static async createGame(settings = null) {
    try {
      const response = await axios.post(API, { settings });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create game');
    }
  }

  static async getGame(gameId) {
    try {
      const response = await axios.get(`${API}/${gameId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get game');
    }
  }

  static async placeStar(gameId, row, col) {
    try {
      const response = await axios.post(`${API}/${gameId}/place-star`, { row, col });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to place star');
    }
  }

  static async selectDirection(gameId, direction) {
    try {
      const response = await axios.post(`${API}/${gameId}/select-direction`, { direction });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to select direction');
    }
  }

  static async undoMove(gameId) {
    try {
      const response = await axios.post(`${API}/${gameId}/undo`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to undo move');
    }
  }

  static async listGames(limit = 10, skip = 0) {
    try {
      const response = await axios.get(`${API}?limit=${limit}&skip=${skip}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to list games');
    }
  }

  static async deleteGame(gameId) {
    try {
      const response = await axios.delete(`${API}/${gameId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete game');
    }
  }
}

export default GameService;