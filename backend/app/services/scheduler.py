import asyncio

from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models.db_models import Holding
from app.services.market import refresh_holding_price


async def update_market_prices():
    """
    Background task:
    Refreshes every holding price every 2 minutes.
    """

    while True:

        try:

            async with AsyncSessionLocal() as session:

                result = await session.execute(
                    select(Holding)
                )

                holdings = result.scalars().all()

                updated = 0

                for holding in holdings:

                    live = refresh_holding_price(
                        holding.symbol
                    )

                    if live > 0:

                        if abs(
                            live - holding.current_price
                        ) > 0.01:

                            holding.current_price = live
                            updated += 1

                await session.commit()

                print(
                    f"[Scheduler] Updated {updated} prices."
                )

        except Exception as e:

            print(
                "[Scheduler Error]",
                e,
            )

        await asyncio.sleep(120)