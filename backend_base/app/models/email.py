from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, Float, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Email(Base):
    __tablename__ = "emails"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    owner_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    subject: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    body: Mapped[str] = mapped_column(Text, nullable=False, default="")
    sender: Mapped[str] = mapped_column(String(255), nullable=False, default="desconocido")
    source_account: Mapped[str] = mapped_column(String(255), nullable=False, default="local-demo")
    predicted_category: Mapped[str] = mapped_column(String(50), nullable=False, default="otros")
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    received_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    owner = relationship("User")
