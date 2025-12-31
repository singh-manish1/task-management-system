const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Task = require('./models/Task');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Existing data cleared');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: hashedPassword,
        role: 'user'
      }
    ]);

    console.log('Users created');

    const tasks = [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the new feature',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'high',
        status: 'pending',
        assignedTo: users[1]._id,
        createdBy: users[0]._id
      },
      {
        title: 'Review pull requests',
        description: 'Review and merge pending pull requests',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        status: 'pending',
        assignedTo: users[0]._id,
        createdBy: users[0]._id
      },
      {
        title: 'Update dependencies',
        description: 'Update all npm packages to latest versions',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        priority: 'low',
        status: 'completed',
        assignedTo: users[2]._id,
        createdBy: users[1]._id
      },
      {
        title: 'Fix authentication bug',
        description: 'Resolve the issue with token expiration',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: 'high',
        status: 'pending',
        assignedTo: users[1]._id,
        createdBy: users[0]._id
      },
      {
        title: 'Design new landing page',
        description: 'Create mockups for the new landing page',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        status: 'pending',
        assignedTo: users[2]._id,
        createdBy: users[1]._id
      }
    ];

    await Task.insertMany(tasks);
    console.log('Tasks created');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
