from nselib import capital_market

WATCHLIST = {
    "TCS": "TCS",
    "HDFCBANK": "HDFC Bank",
    "RELIANCE": "Reliance",
    "SBIN": "State Bank of India",
    "INFY": "Infosys",
}
def to_float(value):
    return float(str(value).replace(",", "").strip())

# -------------------------------------------------------
# Fetch one NSE stock
# -------------------------------------------------------

def get_quote(symbol: str):
    try:
        # Allow symbols like TCS.NS or TCS
        symbol = symbol.replace(".NS", "")
        df = capital_market.price_volume_data(
            symbol=symbol,
            period="1D",
        )

        if df.empty:
            print(f"[NSE] No data for {symbol}")
            return None

        latest = df.iloc[0]

        price = to_float(latest["ClosePrice"])
        prev_close = to_float(latest["PrevClose"])

        if prev_close == 0:
            change = 0
        else:
            change = ((price - prev_close) / prev_close) * 100

        print(f"[NSE] {symbol} -> ₹{price}")

        return {
            "symbol": symbol,
            "name": WATCHLIST.get(symbol, symbol),
            "price": round(price, 2),
            "change_pct": round(change, 2),
        }

    except Exception as e:
        print(f"[NSE ERROR] {symbol}: {e}")
        return None


# -------------------------------------------------------
# Dashboard Market Quotes
# -------------------------------------------------------

def get_market_overview():
    quotes = []

    for symbol in WATCHLIST.keys():

        quote = get_quote(symbol)

        if quote:
            quotes.append(quote)

    return quotes


# -------------------------------------------------------
# Portfolio price updater
# -------------------------------------------------------

def refresh_holding_price(symbol: str):

    quote = get_quote(symbol)

    if quote:
        return quote["price"]

    return 0.0