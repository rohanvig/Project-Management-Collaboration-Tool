import express from 'express';
import { addComment, getCommentsByTask } from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addComment);
router.get('/:taskId', protect, getCommentsByTask);

export default router;
