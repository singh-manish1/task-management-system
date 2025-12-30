# Task Management System

A modern, full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

## Features

- User Authentication (Register/Login)
- Create, Read, Update, Delete Tasks
- Task Priority Management (Low, Medium, High)
- Task Status Tracking (Pending, Completed)
- User Assignment
- Priority-based Dashboard with Color Coding
- Pagination and Filtering
- User Management (Add/Remove Users)
- Modern UI with Animations (Framer Motion)
- Responsive Design

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- React Router DOM
- React Hot Toast
- Lucide React Icons

**Backend:**
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for Password Hashing

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd task-management-system/backend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured with your MongoDB URI

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5555`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd task-management-system/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. Register a new account or login
2. Create tasks with title, description, due date, and priority
3. View tasks organized by priority on the dashboard
4. Assign tasks to users
5. Update task status (pending/completed)
6. Move tasks between priority lists
7. Edit or delete tasks
8. Manage users (add/remove)

## Color Coding

- **Low Priority**: Green
- **Medium Priority**: Orange
- **High Priority**: Red

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Tasks
- GET `/api/tasks` - Get user's tasks (paginated)
- GET `/api/tasks/all` - Get all tasks (paginated)
- GET `/api/tasks/:id` - Get single task
- POST `/api/tasks` - Create task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

### Users
- GET `/api/users` - Get all users
- DELETE `/api/users/:id` - Delete user
