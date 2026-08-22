import express from 'express';
import { createProject, getProjects, inviteMember, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getProjects);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

router.post('/:projectId/invite', protect, inviteMember);

export default router;
