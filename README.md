# TinyLink (Take-home starter)

This repo contains a TinyLink starter implementation:
- Backend: Node + Express + Mongoose
- Frontend: Vite + React + Tailwind (basic shadcn-like helpers)

## Quick start

### Backend
1. cd backend
2. npm install
3. copy .env.example to .env and set MONGO_URI, PORT if needed
4. npm run dev

### Frontend
1. cd frontend
2. npm install
3. copy .env.example to .env and set VITE_API_BASE (e.g. http://localhost:4000)
4. npm run dev

The frontend expects the backend at VITE_API_BASE; backend exposes `/api/links` endpoints and `/:code` redirect and `/healthz`.
