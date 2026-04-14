from sqlalchemy.orm import Session

from app.models.email import Email
from app.models.user import User


def create_classified_email(
    db: Session,
    *,
    owner: User,
    subject: str,
    body: str,
    sender: str,
    source_account: str,
    predicted_category: str,
    confidence: float,
) -> Email:
    email = Email(
        owner_user_id=owner.id,
        subject=subject.strip(),
        body=body.strip(),
        sender=sender.strip(),
        source_account=source_account.strip() or "local-demo",
        predicted_category=predicted_category,
        confidence=confidence,
    )
    db.add(email)
    db.commit()
    db.refresh(email)
    return email


def list_user_emails(db: Session, *, owner: User) -> list[Email]:
    return (
        db.query(Email)
        .filter(Email.owner_user_id == owner.id)
        .order_by(Email.received_at.desc())
        .all()
    )


def get_user_email_by_id(db: Session, *, owner: User, email_id: int) -> Email | None:
    return (
        db.query(Email)
        .filter(Email.owner_user_id == owner.id, Email.id == email_id)
        .first()
    )
