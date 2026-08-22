import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  priority: Joi.string().valid('Low', 'Medium', 'High'),
  status: Joi.string().valid('Todo', 'In Progress', 'Done'),
  dueDate: Joi.date().allow(null),
  boardId: Joi.string().required(),
  assignedTo: Joi.string().allow('', null)
});
