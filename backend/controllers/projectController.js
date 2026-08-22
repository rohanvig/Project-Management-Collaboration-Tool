import Project from '../models/Project.js';
import User from '../models/User.js';

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id] 
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all projects for logged in user 
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    }).populate('owner', 'name email').populate('members', 'name email');
    
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Invite user to a project
export const inviteMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Member-only access check
    if (!project.members.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only project members can invite' });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    if (project.members.includes(userToInvite._id)) {
      return res.status(400).json({ success: false, message: 'User is already a member' });
    }

    project.members.push(userToInvite._id);
    await project.save();

    res.json({ success: true, message: 'User invited successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
