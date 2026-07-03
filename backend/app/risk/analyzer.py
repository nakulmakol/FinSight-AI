from app.models.schemas import RiskInsight


def analyze_portfolio_risk(
    holdings: list[dict],
    ticker: str | None,
    sentiment_label: str,
) -> RiskInsight:
    if not holdings:
        return RiskInsight(
            risk_level="moderate",
            concentration_warnings=["No portfolio data available for this user."],
            anomaly_flags=[],
            portfolio_health_score=50.0,
        )

    total_value = sum(h["market_value"] for h in holdings)
    sector_map: dict[str, float] = {}
    for h in holdings:
        sector_map[h["sector"]] = sector_map.get(h["sector"], 0.0) + h["market_value"]

    sector_pct = {k: (v / total_value) * 100 for k, v in sector_map.items()}
    warnings: list[str] = []
    flags: list[str] = []

    for sector, pct in sector_pct.items():
        if pct > 35:
            warnings.append(f"{sector} sector is {pct:.1f}% of portfolio — high concentration.")

    if ticker:
        ticker_base = ticker.replace(".NS", "").replace(".BO", "").upper()
        exposed = [
            h
            for h in holdings
            if h["symbol"].replace(".NS", "").replace(".BO", "").upper() == ticker_base
            or ticker_base in h["company_name"].upper()
        ]
        if exposed:
            exposure_value = sum(h["market_value"] for h in exposed)
            exposure_pct = (exposure_value / total_value) * 100
            warnings.append(
                f"You already hold {exposure_pct:.1f}% exposure to {ticker_base} — adding more increases single-name risk."
            )
        else:
            target_sector = None
            sector_keywords = {
                "IT": ["INFY", "TCS", "WIPRO", "TECHM"],
                "Banking": ["HDFC", "ICICI", "SBIN", "KOTAK"],
            }
            for sector, symbols in sector_keywords.items():
                if any(s in ticker_base for s in symbols):
                    target_sector = sector
                    break
            if target_sector and sector_pct.get(target_sector, 0) > 25:
                warnings.append(
                    f"New {ticker_base} position would add to already elevated {target_sector} allocation."
                )

    if sentiment_label == "negative":
        flags.append("Recent news sentiment is negative — consider waiting for clarity.")

    health = 82.0
    health -= len(warnings) * 8
    health -= len(flags) * 5
    health = max(20.0, min(95.0, health))

    if health >= 70:
        risk_level = "low"
    elif health >= 45:
        risk_level = "moderate"
    else:
        risk_level = "high"

    return RiskInsight(
        risk_level=risk_level,
        concentration_warnings=warnings,
        anomaly_flags=flags,
        portfolio_health_score=round(health, 1),
    )
