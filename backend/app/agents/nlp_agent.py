from app.models.schemas import AgentTrace, SentimentInsight
from app.nlp.news import analyze_sentiment, extract_ticker, fetch_news_headlines, run_nlp_pipeline


class NLPAgent:
    role = "NLP Agent"
    goal = "Extract entities and analyze news sentiment"

    async def run(self, query: str) -> tuple[SentimentInsight, str | None, AgentTrace]:
        ticker = extract_ticker(query)
        nlp_meta = run_nlp_pipeline(query, ticker)
        headlines = await fetch_news_headlines(ticker=ticker)
        sentiment_data = analyze_sentiment(headlines)
        insight = SentimentInsight(**sentiment_data)
        entity_text = ", ".join(nlp_meta["entities"]) if nlp_meta["entities"] else "general market"
        summary = (
            f"Detected entities: {entity_text}. "
            f"Analyzed {insight.headline_count} headlines — sentiment {insight.overall_label} "
            f"({insight.overall_score})."
        )
        return insight, ticker, AgentTrace(agent=self.role, status="completed", summary=summary)
