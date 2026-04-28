# ChitChat AI

MERN full stack real-time direct messaging application with multi-user chat and modern Tailwind UI.

## Features

- JWT-based authentication with register and login
- One-to-one messaging between multiple registered users
- Real-time updates with Socket.IO user channels
- Message persistence in MongoDB
- Tailwind CSS based responsive chat interface

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, Socket.IO Client
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO
- AI: Groq API

## Run Locally

1. Backend setup
   - Copy `backend/.env.example` to `backend/.env`
   - Fill MongoDB URI, JWT secret, and Groq API key
   - Run `cd backend && npm install && npm run dev`
2. Frontend setup
   - Copy `frontend/.env.example` to `frontend/.env`
   - Run `cd frontend && npm install && npm run dev`
3. Open `http://localhost:5173`

## Deploy

### 1) Deploy Backend on Render

- Create a new **Web Service** on [Render](https://render.com/).
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables:
  - `PORT=5000`
  - `MONGO_URI=<your_mongodb_atlas_uri>`
  - `JWT_SECRET=<strong_secret>`
  - `GROQ_API_KEY=<your_groq_key>`
  - `GROQ_MODEL=llama-3.1-8b-instant`
  - `CLIENT_URL=<your_vercel_frontend_url>`
- After deploy, copy backend URL, for example:
  - `https://chitchat-backend.onrender.com`

### 2) Deploy Frontend on Vercel

- Import project in [Vercel](https://vercel.com/) as a new project.
- Set root directory to `frontend`.
- Add environment variable:
  - `VITE_API_URL=<your_render_backend_url>`
- Deploy and copy frontend URL.

### 3) Final CORS Update

- In Render backend env, set `CLIENT_URL` to your Vercel URL.
- If needed for preview URLs, set multiple comma-separated values:
  - `CLIENT_URL=https://your-main.vercel.app,https://your-preview.vercel.app`
- Redeploy backend once after updating env.

### 4) Verify

- Open frontend URL.
- Register two users.
- Send/accept request.
- Test real-time chat and AI actions.

## Resume Bullet Ideas

- Built a production-ready MERN real-time chat platform with JWT auth, room messaging, and Socket.IO event architecture.
- Integrated Groq API to generate contextual AI replies, improving user engagement with intelligent chat interactions.
- Designed scalable REST APIs with MongoDB persistence and implemented end-to-end client-server state handling in React.
