# AI Flow — MERN Application

A visual AI prompt flow builder using React Flow. Users type a prompt in the Input Node, click **Run Flow**, and the AI response appears in the connected Result Node.

## Tech Stack
- **MongoDB** — stores saved prompt-response pairs
- **Express.js + Node.js** — backend API
- **React + Vite** — frontend
- **React Flow (@xyflow/react)** — visual node canvas
- **OpenRouter API** — AI text generation (free models)

## Features
- Two connected nodes: Input Node and Result Node
- Run Flow button triggers AI response
- Save button persists prompt-response to MongoDB
- View History panel shows all saved conversations

## Setup & Run Locally

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier works)
- OpenRouter API key (free at openrouter.ai)

### Backend
```bash
cd backend
npm install
```

Edit `.env` and fill in your values:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
```

```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ask-ai` | Send prompt, get AI response |
| POST | `/api/save` | Save prompt-response pair |
| GET | `/api/history` | Fetch all saved conversations |
