from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from app.nlp.news import fetch_news_headlines, analyze_sentiment
from app.config import BASE_DIR, get_settings
from app.database import get_db, init_db
from app.llm.factory import get_active_provider_name
from app.models.schemas import ChatRequest, ChatResponse, HealthResponse, PortfolioSummary
from app.orchestrator.chain import orchestrator
from app.rag.vectorstore import bootstrap_documents, vector_store
from app.services.market import get_market_overview
from app.services.scheduler import update_market_prices
import asyncio
from app.services.portfolio import (
    get_portfolio_summary,
    refresh_portfolio_prices,
    seed_demo_user,
)


@asynccontextmanager
async def lifespan(app: FastAPI):

    await init_db()

    async for session in get_db():
        await seed_demo_user(session)
        break

    bootstrap_documents()

    # Start background market updater
    scheduler_task = asyncio.create_task(
        update_market_prices()
    )

    print("Market scheduler started.")

    yield

    scheduler_task.cancel()


app = FastAPI(
    title="FinSight AI API",
    description="Multi-agent financial co-pilot backend",
    version="1.0.0",
    lifespan=lifespan,
)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        llm_provider=get_active_provider_name(),
        vector_documents=vector_store.document_count(),
        message="FinSight AI backend is running",
    )


@app.get("/api/portfolio", response_model=PortfolioSummary)
async def portfolio(user_id: str | None = None, session: AsyncSession = Depends(get_db)):
    uid = user_id or settings.default_user_id
    try:
        return await get_portfolio_summary(session, uid)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

@app.post("/api/refresh-market")
async def refresh_market(
    user_id: str | None = None,
    session: AsyncSession = Depends(get_db),
):
    uid = user_id or settings.default_user_id

    return await refresh_portfolio_prices(
        session,
        uid,
    )

@app.get("/api/market")
async def market():
    return {"quotes": get_market_overview()}


@app.get("/api/news")
async def news(
    ticker: str | None = None,
    limit: int = 10,
):
    headlines = await fetch_news_headlines(
        ticker=ticker,
        limit=limit,
    )

    sentiment = analyze_sentiment(headlines)

    return {
        "headlines": headlines,
        "sentiment": sentiment,
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, session: AsyncSession = Depends(get_db)):
    try:
        return await orchestrator.process(
            payload.message,
            session,
            payload.user_id,
            history=getattr(payload, "history", None),
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Orchestration failed: {exc}") from exc


@app.get("/api/mcp/tools")
async def mcp_tools():
    from app.mcp.tools import mcp_server

    return {"tools": mcp_server.list_tools()}
from app.config import DATA_DIR
from app.rag.vectorstore import vector_store

@app.get("/api/debug/vector")
async def debug_vector():
    docs_dir = DATA_DIR / "documents"

    return {
        "data_dir": str(DATA_DIR),
        "docs_dir": str(docs_dir),
        "docs_exists": docs_dir.exists(),
        "files": [p.name for p in docs_dir.glob("*")] if docs_dir.exists() else [],
        "document_count": vector_store.document_count(),
    }
    
from pathlib import Path

@app.get("/api/debug/path")
async def debug_path():
    return {
        "cwd": str(Path.cwd()),
        "main": str(Path(__file__).resolve()),
        "backend_dir": str(BASE_DIR),
        "backend_parent": str(BASE_DIR.parent),
    }