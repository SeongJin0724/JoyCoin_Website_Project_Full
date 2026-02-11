from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.db import get_db
from app.models import LegalConsent, User
from app.schemas.consents import ConsentRecordIn

router = APIRouter(prefix="/consents", tags=["consents"])


def _client_ip(request: Request) -> str | None:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    if request.client:
        return request.client.host
    return None


@router.post("/record")
def record_consent(
    request: Request,
    data: ConsentRecordIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if data.event_type == "buy_allocation_request":
        if not (
            data.non_investment_ack
            and data.allocation_verification_ack
            and data.irreversible_transfer_ack
            and data.voluntary_risk_ack
        ):
            raise HTTPException(status_code=400, detail="All buy consent checks must be accepted.")

    consent = LegalConsent(
        user_id=user.id,
        event_type=data.event_type,
        legal_version=data.legal_version,
        locale=data.locale,
        page_path=data.page_path,
        terms_accepted=data.terms_accepted,
        risk_accepted=data.risk_accepted,
        privacy_accepted=data.privacy_accepted,
        token_accepted=data.token_accepted,
        non_investment_ack=data.non_investment_ack,
        allocation_verification_ack=data.allocation_verification_ack,
        irreversible_transfer_ack=data.irreversible_transfer_ack,
        voluntary_risk_ack=data.voluntary_risk_ack,
        ip_address=_client_ip(request),
        user_agent=request.headers.get("user-agent"),
    )
    db.add(consent)
    db.commit()
    return {"message": "Consent recorded", "id": consent.id}
