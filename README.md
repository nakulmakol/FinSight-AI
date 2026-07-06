# 💹 FinSight AI

<p align="center">

### AI-Powered Financial Intelligence Platform

Portfolio Analytics • Multi-Agent AI • Retrieval-Augmented Generation (RAG) • Real-Time NSE Market Data • Investment Insights

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688.svg)]()
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)]()
[![LangChain](https://img.shields.io/badge/LangChain-RAG-success.svg)]()
[![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorDB-orange.svg)]()
[![Groq](https://img.shields.io/badge/Groq-LLM-purple.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

</p>

---

## 📌 Overview

**FinSight AI** is a modern AI-powered financial intelligence platform that combines **real-time market analytics**, **portfolio management**, **Retrieval-Augmented Generation (RAG)**, **multi-agent reasoning**, and **LLM-powered investment analysis** into a unified dashboard.

Unlike traditional finance dashboards, FinSight AI doesn't just display portfolio data—it explains **why** market events matter, analyzes your investments using AI, and provides context-aware financial insights.

---

# 🚀 Live Demo

### 🌐 Frontend

https://YOUR-VERCEL-URL.vercel.app

### ⚡ Backend API

https://finsight-ai-production-4f97.up.railway.app

---

# ✨ Features

## 📈 Portfolio Management

- Live Portfolio Dashboard
- Portfolio Valuation
- Profit & Loss Calculation
- Sector Allocation
- Portfolio Distribution Charts
- Risk Metrics

---

## 🤖 AI Financial Copilot

- Conversational AI Assistant
- Portfolio-aware Responses
- Investment Recommendations
- Financial Question Answering
- Explainable AI Responses

---

## 📰 Market Intelligence

- Real-Time NSE Stock Prices
- Market Overview
- Financial News
- News Sentiment Analysis
- Live Market Updates

---

## 🧠 Retrieval-Augmented Generation (RAG)

- RBI Circulars
- SEBI Guidelines
- Vector Search
- Semantic Search
- Context-Aware Responses

---

## ⚙ Multi-Agent AI

- Portfolio Agent
- News Agent
- Risk Analysis Agent
- RAG Agent
- Orchestrator Agent

---

## 📊 Analytics

- Portfolio Growth
- Allocation Charts
- P/L Visualization
- Performance Metrics

---

# 🖥 Screenshots

## Dashboard

<img width="2866" height="1554" alt="image" src="https://github.com/user-attachments/assets/39c2680a-8dfb-4d5b-8ae7-8e8e60808a8f" />


---

## Portfolio

<img width="2862" height="1550" alt="image" src="https://github.com/user-attachments/assets/2838dfab-fe61-4674-a031-59f3d2751396" />

---

## AI Copilot

<img width="2864" height="1542" alt="image" src="https://github.com/user-attachments/assets/2eccc8b0-bee2-47de-a310-afa89e5c8dc9" />


---

## Analytics

<img width="2860" height="1546" alt="image" src="https://github.com/user-attachments/assets/65823f73-be9e-41ae-8a08-2e80fd821ea6" />


---

## News

<img width="2862" height="1546" alt="image" src="https://github.com/user-attachments/assets/fbf0545b-23ea-43e2-9758-e2aea296fe90" />


---

## Settings

<img width="2400" height="1528" alt="image" src="https://github.com/user-attachments/assets/a07f38c8-cbf3-4fc6-bb33-8d5ec7eae8c9" />


---

# 🏗 Architecture

```text
                          +----------------------+
                          |   React + Vite UI    |
                          +----------+-----------+
                                     |
                               REST API
                                     |
                                     ▼
                      +------------------------------+
                      |      FastAPI Backend         |
                      +------------------------------+
                          │        │         │
          ┌───────────────┘        │         └───────────────┐
          ▼                        ▼                         ▼
 Portfolio Service        Market Service          AI Orchestrator
          │                        │                         │
          ▼                        ▼                         ▼
 SQLite Database          NSE Live Data          LangChain Agents
                                                    │
                                   ┌────────────────┴──────────────┐
                                   ▼                               ▼
                             ChromaDB                     Groq LLM
                             (RAG)                   (Llama 3.3 70B)
```

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- TanStack Query
- Recharts
- Lucide React

---

## Backend

- FastAPI
- SQLAlchemy
- SQLite
- LangChain
- ChromaDB
- HuggingFace Embeddings
- Groq API

---

## AI Stack

- Multi-Agent Architecture
- Retrieval-Augmented Generation
- Semantic Search
- Sentiment Analysis
- Portfolio Context Engine

---

## Deployment

- Railway (Backend)
- Vercel (Frontend)

---

# 📂 Project Structure

```text
FinSight-AI
│
├── backend
│   ├── app
│   │   ├── agents
│   │   ├── orchestrator
│   │   ├── rag
│   │   ├── services
│   │   ├── models
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── data
│   │   └── documents
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# ⚙ Installation

## Clone

```bash
git clone https://github.com/YOUR_USERNAME/FinSight-AI.git
```

```bash
cd FinSight-AI
```

---

## Backend

```bash
cd backend
```

```bash
python -m venv venv
```

```bash
pip install -r requirements.txt
```

Create

```text
.env
```

```env
GROQ_API_KEY=your_key
DATABASE_URL=sqlite:///finsight.db
```

Run

```bash
uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev
```

---

# 🔥 Future Improvements

- User Authentication
- Portfolio Import (CSV)
- Watchlists
- Price Alerts
- AI Portfolio Rebalancing
- Company Comparison
- Earnings Summaries
- PDF Report Generation

---

# 🎯 Why FinSight AI?

Traditional investment dashboards only visualize data.

FinSight AI combines:

- Portfolio Analytics
- AI Reasoning
- Retrieval-Augmented Generation
- Financial News
- Regulatory Knowledge
- Real-Time Market Data

to create an intelligent financial assistant capable of providing explainable investment insights.

---

# 👨‍💻 Author

**Nakul Makol**

AI & Machine Learning Engineer

- GitHub: **https://github.com/nakulmakol**
- LinkedIn: **https://www.linkedin.com/in/nakul-makol-b3abb6310/**

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
