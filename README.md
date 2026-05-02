# Team Task Manager

A full-stack web app for managing projects and tasks with role-based access control.

## Live URL
https://modest-empathy-production-f83a.up.railway.app

## GitHub
https://github.com/kasaudhanshivani/task-manager

## Features
- JWT Authentication (Signup/Login)
- Role-based access (Admin/Member)
- Project creation and management
- Task creation, assignment and status tracking
- Dashboard with task stats (Total, Completed, In Progress, Overdue)

## Tech Stack
- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, bcryptjs
- Deployment: Railway

## Setup
### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

## API Endpoints
- POST /api/auth/signup
- POST /api/auth/login
- GET/POST /api/projects
- GET/POST/PUT/DELETE /api/tasks
- GET /api/users
