import Board from '../models/Board.js';

export const createBoard = async (req, res) => {
  try {
    const { name, projectId } = req.body;
    const board = await Board.create({ name, projectId });
    res.status(201).json({ success: true, data: board });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBoards = async (req, res) => {
  try {
    const { projectId } = req.params;
    const boards = await Board.find({ projectId }).sort('order');
    res.json({ success: true, data: boards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
