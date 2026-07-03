import asyncio
import re
import time

import feedparser
import httpx
from textblob import TextBlob

CACHE_TIME = 300

_cached_news = {}
_last_update = 0

RSS_FEEDS = [
    "https://www.livemint.com/rss/markets",
    "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
    "https://www.moneycontrol.com/rss/business.xml",
    "https://feeds.feedburner.com/ndtvprofit-latest",
]

TICKER_ALIASES = {
    "infosys": "INFY",
    "infy": "INFY",
    "tcs": "TCS",
    "reliance": "RELIANCE",
    "hdfc": "HDFCBANK",
    "sbi": "SBIN",
    "wipro": "WIPRO",
    "icici": "ICICIBANK",
}


def extract_ticker(query: str):

    q = query.lower()

    for alias, ticker in sorted(
        TICKER_ALIASES.items(),
        key=lambda x: -len(x[0]),
    ):

        if alias in q:
            return ticker

    match = re.search(
        r"\b([A-Z]{2,10})\b",
        query,
    )

    if match:
        return match.group(1)

    return None


async def fetch_feed(client, url):

    try:

        response = await client.get(
            url,
            timeout=8,
            follow_redirects=True,
        )

        parsed = feedparser.parse(response.text)

        return parsed.entries

    except Exception:

        return []


async def fetch_news_headlines(
    ticker=None,
    limit=10,
):

    global _cached_news
    global _last_update

    now = time.time()

    if (
        now - _last_update < CACHE_TIME
        and ticker in _cached_news
    ):

        return _cached_news[ticker]

    async with httpx.AsyncClient() as client:

        tasks = [
            fetch_feed(
                client,
                url,
            )
            for url in RSS_FEEDS
        ]

        results = await asyncio.gather(*tasks)

    headlines = []

    for feed in results:

        for item in feed:

            title = getattr(
                item,
                "title",
                "",
            )

            summary = getattr(
                item,
                "summary",
                "",
            )

            if ticker:

                text = (
                    title
                    + " "
                    + summary
                ).lower()

                if ticker.lower() not in text:

                    continue

            headlines.append(
                {
                    "title": title,
                    "summary": summary[:250],
                }
            )

    headlines = headlines[:limit]

    _cached_news[ticker] = headlines

    _last_update = now

    return headlines


def analyze_sentiment(headlines):

    if not headlines:

        return {
            "overall_label": "neutral",
            "overall_score": 0,
            "headline_count": 0,
            "sample_headlines": [],
        }

    scores = []

    for h in headlines:

        polarity = TextBlob(
            h["title"]
            + " "
            + h["summary"]
        ).sentiment.polarity

        scores.append(
            polarity
        )

    avg = sum(scores) / len(scores)

    if avg > 0.15:

        label = "positive"

    elif avg < -0.15:

        label = "negative"

    else:

        label = "neutral"

    return {
        "overall_label": label,
        "overall_score": round(avg, 2),
        "headline_count": len(headlines),
        "sample_headlines": [
            x["title"]
            for x in headlines[:5]
        ],
    }


def extract_entities(query):

    entities = []

    q = query.lower()

    if "rbi" in q:
        entities.append("RBI")

    if "sebi" in q:
        entities.append("SEBI")

    for alias in TICKER_ALIASES:

        if alias in q:

            entities.append(
                alias.title()
            )

    return entities


def run_nlp_pipeline(
    query,
    ticker,
):

    return {
        "entities": extract_entities(query),
        "ticker": ticker,
    }