import yfinance as yf

WATCHLIST = {
    "TCS.NS": "TCS",
    "HDFCBANK.NS": "HDFC Bank",
    "RELIANCE.NS": "Reliance",
    "SBIN.NS": "State Bank of India",
    "INFY.NS": "Infosys",
}


# --------------------------------------------------------
# Fetch Quote
# --------------------------------------------------------

def get_quote(symbol: str):
    try:

        ticker = yf.Ticker(symbol)

        # Last 5 trading days
        history = ticker.history(period="5d", auto_adjust=False)

        if history.empty:
            print(f"[Yahoo] No history found for {symbol}")
            return None

        latest_close = float(history["Close"].iloc[-1])

        if len(history) >= 2:
            previous_close = float(history["Close"].iloc[-2])
        else:
            previous_close = latest_close

        change_pct = (
            ((latest_close - previous_close) / previous_close) * 100
            if previous_close
            else 0
        )

        print(
            f"[Yahoo] {symbol} -> ₹{latest_close:.2f}"
        )

        return {
            "symbol": symbol,
            "name": WATCHLIST.get(symbol, symbol),
            "price": round(latest_close, 2),
            "change_pct": round(change_pct, 2),
        }

    except Exception as e:

        print(f"[Yahoo Error] {symbol}: {e}")

        return None


# --------------------------------------------------------
# Dashboard
# --------------------------------------------------------

def get_market_overview():

    quotes = []

    for symbol in WATCHLIST:

        quote = get_quote(symbol)

        if quote:

            quotes.append(quote)

    return quotes


# --------------------------------------------------------
# Portfolio Scheduler
# --------------------------------------------------------

def refresh_holding_price(symbol: str):

    quote = get_quote(symbol)

    if quote:

        return quote["price"]

    return 0.0