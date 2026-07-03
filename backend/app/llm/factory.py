from langchain_core.language_models.chat_models import BaseChatModel

from app.config import get_settings


def get_llm() -> BaseChatModel:
    settings = get_settings()
    provider = settings.llm_provider.lower()

    if provider == "auto":
        if settings.groq_api_key:
            provider = "groq"
        elif settings.google_api_key:
            provider = "gemini"
        else:
            raise ValueError(
                "No LLM API key configured. Add GROQ_API_KEY or GOOGLE_API_KEY to backend/.env"
            )

    if provider == "groq":
        if not settings.groq_api_key:
            raise ValueError("GROQ_API_KEY is missing. Get a free key at https://console.groq.com/keys")
        from langchain_groq import ChatGroq

        return ChatGroq(
            model=settings.groq_model,
            api_key=settings.groq_api_key,
            temperature=0.2,
        )

    if provider == "gemini":
        if not settings.google_api_key:
            raise ValueError(
                "GOOGLE_API_KEY is missing. Get a free key at https://aistudio.google.com/apikey"
            )
        from langchain_google_genai import ChatGoogleGenerativeAI

        return ChatGoogleGenerativeAI(
            model=settings.gemini_model,
            google_api_key=settings.google_api_key,
            temperature=0.2,
        )

    raise ValueError(f"Unsupported LLM provider: {provider}")


def get_active_provider_name() -> str:
    settings = get_settings()
    provider = settings.llm_provider.lower()
    if provider == "auto":
        if settings.groq_api_key:
            return "groq"
        if settings.google_api_key:
            return "gemini"
        return "none"
    return provider
