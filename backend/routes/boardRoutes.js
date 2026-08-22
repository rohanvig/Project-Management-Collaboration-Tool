import express from 'express';
import { createBoard, getBoards } from '../controllers/boardController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBoard);
router.get('/:projectId', protect, getBoards);

export default router;
