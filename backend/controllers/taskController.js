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

export const getTasks = async (req, res) => {
  try {
    const { boardId, status, priority, assignedTo, dueDate, search, page = 1, limit = 100 } = req.query;
    let query = {};
    
    if (boardId) query.boardId = boardId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (dueDate) query.dueDate = dueDate;
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('activityHistory.userId', 'name')
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Task.countDocuments(query);
      
    res.json({ success: true, data: tasks, pagination: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    
    let historyAction = 'Task updated';
    if (updates.status && updates.status !== task.status) {
      historyAction = `Moved to ${updates.status}`;
    } else if (updates.assignedTo && String(updates.assignedTo) !== String(task.assignedTo)) {
      historyAction = 'Assigned to new user';
    }

    const updatedTask = await Task.findByIdAndUpdate(id, {
      ...updates,
      $push: { activityHistory: { action: historyAction, userId: req.user._id } }
    }, { new: true, runValidators: true })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('activityHistory.userId', 'name');

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
