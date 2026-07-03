from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.db_models import Holding, User
from app.models.schemas import HoldingOut, PortfolioSummary
from app.services.market import refresh_holding_price


# ==========================================================
# Seed Demo User
# ==========================================================

async def seed_demo_user(session: AsyncSession):

    settings = get_settings()
    user_id = settings.default_user_id

    existing = await session.get(User, user_id)

    if existing:
        return

    user = User(
        id=user_id,
        name="Nakul Makol",
        email="nakul.demo@finsight.ai",
        risk_tolerance="moderate",
    )

    session.add(user)

    demo_holdings = [
    ("TCS", "Tata Consultancy Services", "IT", 15, 3850),
    ("HDFCBANK", "HDFC Bank", "Banking", 20, 1580),
    ("RELIANCE", "Reliance Industries", "Energy", 10, 2450),
    ("SBIN", "State Bank of India", "Banking", 40, 620),
]

    for symbol, company, sector, qty, avg in demo_holdings:

        live = refresh_holding_price(symbol)

        session.add(
            Holding(
                user_id=user_id,
                symbol=symbol,
                company_name=company,
                sector=sector,
                quantity=qty,
                avg_price=avg,
                current_price=live if live > 0 else avg,
            )
        )

    await session.commit()


# ==========================================================
# Portfolio (READ ONLY)
# ==========================================================

async def get_portfolio_summary(
    session: AsyncSession,
    user_id: str,
) -> PortfolioSummary:

    user = await session.get(User, user_id)

    if not user:
        raise ValueError(f"User '{user_id}' not found")

    result = await session.execute(
        select(Holding).where(Holding.user_id == user_id)
    )

    holdings = result.scalars().all()

    holding_rows = []

    total_value = 0.0
    total_invested = 0.0

    sector_map = {}

    for h in holdings:

        current_price = (
            h.current_price
            if h.current_price > 0
            else h.avg_price
        )

        invested = h.avg_price * h.quantity
        value = current_price * h.quantity

        pnl = value - invested

        pnl_pct = (
            (pnl / invested) * 100
            if invested > 0
            else 0
        )

        total_value += value
        total_invested += invested

        sector_map[h.sector] = (
            sector_map.get(h.sector, 0)
            + value
        )

        holding_rows.append(
            HoldingOut(
                symbol=h.symbol,
                company_name=h.company_name,
                sector=h.sector,
                quantity=h.quantity,
                avg_price=round(h.avg_price, 2),
                current_price=round(current_price, 2),
                market_value=round(value, 2),
                pnl=round(pnl, 2),
                pnl_pct=round(pnl_pct, 2),
            )
        )

    sector_allocation = {
        sector: round(value / total_value * 100, 2)
        if total_value
        else 0
        for sector, value in sector_map.items()
    }

    total_pnl = total_value - total_invested

    total_pnl_pct = (
        (total_pnl / total_invested) * 100
        if total_invested
        else 0
    )

    return PortfolioSummary(
        user_id=user.id,
        user_name=user.name,
        risk_tolerance=user.risk_tolerance,
        total_value=round(total_value, 2),
        total_invested=round(total_invested, 2),
        total_pnl=round(total_pnl, 2),
        total_pnl_pct=round(total_pnl_pct, 2),
        sector_allocation=sector_allocation,
        holdings=holding_rows,
    )


# ==========================================================
# Refresh prices
# ==========================================================

async def refresh_portfolio_prices(
    session: AsyncSession,
    user_id: str,
):

    result = await session.execute(
        select(Holding).where(Holding.user_id == user_id)
    )

    holdings = result.scalars().all()

    updated = 0

    for holding in holdings:

        live = refresh_holding_price(holding.symbol)

        if live > 0:

            if abs(live - holding.current_price) > 0.01:

                holding.current_price = live
                updated += 1

    await session.commit()

    return {
        "status": "success",
        "updated": updated,
        "total": len(holdings),
    }