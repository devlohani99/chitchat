# ChitChat

A full-stack real-time direct messaging platform built on the MERN stack, with friend requests, Socket.IO-powered live updates, and Groq-powered AI assistance features.

---

## Overview

ChitChat provides one-to-one messaging between connected users. It includes a branded landing page, JWT-based authentication, a friend-request workflow, live typing indicators, and an AI layer for smart replies, conversation summaries, and tone-controlled draft rewriting.

---

## Features

### Authentication

- Registration and login with JWT
- Password hashing via bcrypt
- Protected API routes with auth middleware
- Persistent login state via local storage

### Friend System

- Search users by email
- Send, accept, and reject friend requests
- Messaging restricted to accepted friends only

### Real-Time Messaging

- One-to-one conversation history per friend pair
- Real-time message delivery via Socket.IO
- Live typing indicators
- Message persistence in MongoDB with timestamps

### AI Features (Groq)

- Smart reply suggestions based on recent conversation context
- Conversation summary generation
- Draft rewriting with selectable tone:
  - Friendly
  - Professional
  - Casual
  - Persuasive

### UI

- Tailwind CSS responsive layout
- Hero-style homepage
- Auth modal flow (Login / Register)
- Dashboard chat layout with navigation rail, friends panel, requests panel, AI toolbar, suggestion cards, message search, and composer

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Axios, Socket.IO Client |
| Backend | Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT, bcrypt |
| AI | Groq API |

---

## Project Structure

```
chitchat/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
  frontend/
    src/
      styles/
```

---

## Environment Variables

Create these files manually before running the project.

### `backend/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000
```

> If `GROQ_API_KEY` is missing or invalid, AI features will return no useful output.

---

## Local Development

**1. Backend**

```bash
cd backend
npm install
npm run dev
```

**2. Frontend**

```bash
cd frontend
npm install
npm run dev
```

**3. Open the app**

```
http://localhost:5173
```

---

## API Reference

### Auth

| Method | Endpoint |
|---|---|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |

### Users and Friend Requests

| Method | Endpoint |
|---|---|
| GET | `/api/users/me` |
| GET | `/api/users/search?email=...` |
| POST | `/api/users/request` |
| POST | `/api/users/request/respond` |

### Chat

| Method | Endpoint |
|---|---|
| GET | `/api/chat/:userId` |
| POST | `/api/chat` |

### AI

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chat/:userId/smart-replies` | Suggest replies from conversation context |
| GET | `/api/chat/:userId/summary` | Summarize the conversation |
| POST | `/api/chat/:userId/rewrite` | Rewrite a draft with the selected tone |

### Health

| Method | Endpoint |
|---|---|
| GET | `/api/health` |

---

## How AI Features Work

1. User opens a friend conversation.
2. Frontend calls a backend AI route.
3. Backend validates friendship and builds a contextual prompt from recent messages.
4. Backend sends the prompt to the Groq API.
5. The AI result is returned and rendered as suggestion chips, a summary panel, or rewritten draft text.

---

## Deployment

### Backend on Render

1. Create a new Web Service on [Render](https://render.com).
2. Set the root directory to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all variables from `backend/.env`.
6. Set `CLIENT_URL` to your Vercel frontend URL.
7. Deploy and copy the backend URL.

### Frontend on Vercel

1. Import the repository in [Vercel](https://vercel.com).
2. Set the root directory to `frontend`.
3. Add environment variable: `VITE_API_URL=https://your-render-backend-url`
4. Deploy and copy the frontend URL.

### CORS for Multiple Frontend URLs

If Vercel generates preview URLs, pass comma-separated origins:

```env
CLIENT_URL=https://your-main.vercel.app,https://your-preview.vercel.app
```

Redeploy the backend after updating this variable.

---

## Post-Deployment Checklist

- Register two separate users
- Send a friend request from User A to User B
- Accept the request from User B
- Send messages in both directions
- Verify the typing indicator fires correctly
- Test AI replies, summary, and draft rewrite

---

## AI Demo Flow

Use this sequence for live demos or interview walkthroughs:

1. Open a friend chat that has existing messages.
2. Click **AI replies** and select one of the generated suggestions.
3. Click **AI summary** and explain how context compression works.
4. Type a draft message, choose a tone from the dropdown, and click **Rewrite draft**.
5. Send the rewritten message to demonstrate end-to-end AI integration.