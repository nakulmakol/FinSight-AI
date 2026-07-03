from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    risk_tolerance: Mapped[str] = mapped_column(String(32), default="moderate")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    holdings: Mapped[list["Holding"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Holding(Base):
    __tablename__ = "holdings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    symbol: Mapped[str] = mapped_column(String(20))
    company_name: Mapped[str] = mapped_column(String(120))
    sector: Mapped[str] = mapped_column(String(64))
    quantity: Mapped[float] = mapped_column(Float)
    avg_price: Mapped[float] = mapped_column(Float)
    current_price: Mapped[float] = mapped_column(Float, default=0.0)

    user: Mapped["User"] = relationship(back_populates="holdings")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(64))
    role: Mapped[str] = mapped_column(String(16))
    content: Mapped[str] = mapped_column(Text)
    metadata_json: Mapped[str] = mapped_column(Text, default="{}")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
