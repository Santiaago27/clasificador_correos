from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class EmailClassifyIn(BaseModel):
    subject: str = Field(default="", max_length=255)
    body: str = Field(default="")
    sender: str = Field(default="desconocido", max_length=255)
    source_account: str = Field(default="local-demo", max_length=255)


class EmailOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    subject: str
    body: str
    sender: str
    source_account: str
    predicted_category: str
    confidence: float
    received_at: datetime


class EmailClassifyResponse(BaseModel):
    email: EmailOut
    model_version: str
