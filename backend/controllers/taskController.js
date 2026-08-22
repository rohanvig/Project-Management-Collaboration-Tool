import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, boardId, assignedTo } = req.body;
    
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      boardId,
      assignedTo,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Handles fetching, filtering, and searching
export const getTasks = async (req, res) => {
  try {
    const { boardId, status, priority, assignedTo, search } = req.query;
    let query = {};
    
    if (boardId) query.boardId = boardId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    
    // Text search (simple regex for title)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
      
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Handles status changes / drag-and-drop
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
