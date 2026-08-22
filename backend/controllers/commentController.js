import Comment from '../models/Comment.js';

export const addComment = async (req, res) => {
  try {
    const { taskId, content } = req.body;
    const comment = await Comment.create({
      taskId,
      userId: req.user._id,
      content
    });
    
    // Populate user details before returning
    await comment.populate('userId', 'name email');

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.find({ taskId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
