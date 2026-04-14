from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.ml.classifier import MODEL_VERSION, classify_email
from app.models.user import User
from app.schemas.email import EmailClassifyIn, EmailClassifyResponse, EmailOut
from app.services.email_service import create_classified_email, get_user_email_by_id, list_user_emails

router = APIRouter(prefix="/emails", tags=["Emails"])


@router.post("/classify", response_model=EmailClassifyResponse, status_code=status.HTTP_201_CREATED)
def classify_and_save_email(
    payload: EmailClassifyIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EmailClassifyResponse:
    category, confidence = classify_email(payload.subject, payload.body)
    email = create_classified_email(
        db,
        owner=current_user,
        subject=payload.subject,
        body=payload.body,
        sender=payload.sender,
        source_account=payload.source_account,
        predicted_category=category,
        confidence=confidence,
    )
    return EmailClassifyResponse(email=email, model_version=MODEL_VERSION)


@router.get("/mine", response_model=list[EmailOut])
def read_my_emails(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[EmailOut]:
    return list_user_emails(db, owner=current_user)


@router.get("/{email_id}", response_model=EmailOut)
def read_my_email_detail(
    email_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EmailOut:
    email = get_user_email_by_id(db, owner=current_user, email_id=email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Correo no encontrado")
    return email
