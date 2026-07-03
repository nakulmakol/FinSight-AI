# FinSight AI — Intelligent Financial Co-pilot

Multi-agent financial advisory system with **RAG**, **NLP sentiment**, **risk analysis**, **MCP portfolio tools**, and a **React** dashboard.

## Architecture

```
React UI → FastAPI → LangChain Orchestrator
                         ├── RAG Agent      → Chroma (local, free)
                         ├── NLP Agent      → RSS news + TextBlob sentiment
                         ├── Risk Agent     → Portfolio concentration rules
                         └── Gen AI Agent   → Groq / Gemini (free tier)
                                    ↑
                              MCP Tool Server → SQLite portfolio
```

## Quick start

### 1. Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Edit `backend/.env` and add **at least one free LLM key** (see below).

```powershell
uvicorn app.main:app --reload --port 8000
```

First startup ingests sample RBI/SEBI documents into Chroma and seeds a demo portfolio.

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

### 3. Demo query

> *Should I invest in Infosys this month given RBI's latest rate decision?*

---

## Where to put API keys

**File location:** `backend/.env` (copy from `backend/.env.example`)

| Variable | Required? | Where to get it (FREE) | Used for |
|----------|-----------|------------------------|----------|
| `GROQ_API_KEY` | Recommended | https://console.groq.com/keys | Primary LLM (Llama 3.3 70B) |
| `GOOGLE_API_KEY` | Optional fallback | https://aistudio.google.com/apikey | Gemini 2.0 Flash if Groq unavailable |
| `ALPHA_VANTAGE_API_KEY` | Optional | https://www.alphavantage.co/support/#api-key | Extra market data (not required) |

### Example `.env`

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
GOOGLE_API_KEY=
LLM_PROVIDER=auto
```

- `LLM_PROVIDER=auto` → uses Groq if key present, else Gemini
- `LLM_PROVIDER=groq` → force Groq
- `LLM_PROVIDER=gemini` → force Gemini

### What does NOT need a paid key

| Service | How it works |
|---------|--------------|
| Vector DB | **Chroma** — runs locally, free |
| Embeddings | **sentence-transformers** — downloads once, runs locally |
| Market prices | **yfinance** — no API key |
| News | **RSS feeds** (Mint, ET, NDTV Profit) — no API key |
| Sentiment | **TextBlob** — local, free |
| Portfolio DB | **SQLite** — local, free |

---

## Project structure

```
FinSight AI/
├── backend/
│   ├── .env.example          ← copy to .env and add keys here
│   ├── app/
│   │   ├── main.py           ← FastAPI entry
│   │   ├── orchestrator/     ← LangChain router
│   │   ├── agents/           ← RAG, NLP, Risk, Gen AI
│   │   ├── rag/              ← Chroma vector store
│   │   ├── nlp/              ← News + sentiment
│   │   ├── risk/             ← Portfolio risk rules
│   │   ├── mcp/              ← Portfolio tool bridge
│   │   └── services/         ← Market + portfolio
│   └── requirements.txt
├── frontend/                 ← React + Vite + Tailwind
├── data/documents/           ← Sample RBI/SEBI docs for RAG
└── README.md
```

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Backend + LLM status |
| GET | `/api/portfolio` | Demo user portfolio |
| GET | `/api/market` | Live market quotes (yfinance) |
| POST | `/api/chat` | Full multi-agent pipeline |
| GET | `/api/mcp/tools` | MCP tool listing |

---

## Adding your own documents

Drop `.txt` or `.md` files into `data/documents/`, then delete `backend/chroma_data/` and restart the backend to re-ingest.

---

## Disclaimer

FinSight AI provides **educational guidance only**. It is not registered investment advice. Always do your own research before investing.
