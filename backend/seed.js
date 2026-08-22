import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/User.js';
import Project from './models/Project.js';
import Board from './models/Board.js';
import Task from './models/Task.js';

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for Data Migration/Seeding...');

    // Clear existing data to prevent duplicates during testing
    await User.deleteMany({});
    await Project.deleteMany({});
    await Board.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Create Dummy User
    const user = await User.create({
      name: 'Admin Tester',
      email: 'admin@test.com',
      password: 'password123' // In a real scenario, this would be hashed by the pre-save hook
    });
    console.log('Created User: admin@test.com');

    // 2. Create Dummy Project
    const project = await Project.create({
      name: 'Assignment Project',
      description: 'A test project for the assignment submission',
      owner: user._id,
      members: [user._id]
    });

    // 3. Create Dummy Board
    const board = await Board.create({
      projectId: project._id,
      name: 'Main Kanban Board'
    });

    // 4. Create Dummy Tasks across different columns
    await Task.create([
      { title: 'Setup MongoDB', description: 'Initialize database connection', boardId: board._id, status: 'Done', createdBy: user._id },
      { title: 'Build React Frontend', description: 'Setup Vite and Context API', boardId: board._id, status: 'In Progress', createdBy: user._id },
      { title: 'Write API Documentation', description: 'Create Postman collection', boardId: board._id, status: 'Todo', createdBy: user._id },
      { title: 'Submit Assignment', description: 'Zip files and submit', boardId: board._id, status: 'Todo', createdBy: user._id },
    ]);

    console.log('✅ Data Migration / Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Data Migration failed:', error);
    process.exit(1);
  }
};

seedDatabase();
