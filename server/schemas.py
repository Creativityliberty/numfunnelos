from __future__ import annotations
from typing import Any, Optional
from pydantic import BaseModel, Field, EmailStr

class Signup(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=10, max_length=128)
    workspace_name: str = Field(min_length=2, max_length=120)

class Login(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdateIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    avatar_url: Optional[str] = Field(default=None, max_length=500)

class PasswordChangeIn(BaseModel):
    current_password: str
    new_password: str = Field(min_length=10, max_length=128)

class WorkspaceIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)

class FunnelIn(BaseModel):
    name: str = Field(min_length=3, max_length=120)
    template: str = 'app7'

class PatchFunnel(BaseModel):
    name: str | None = Field(None, min_length=3, max_length=120)
    draft: dict[str, Any] | None = None

class LeadIn(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    email: EmailStr | None = None
    phone: str | None = Field(None, max_length=30)
    marketing_consent: bool = False
    measurement_consent: bool = False
    utm_source: str | None = Field(None, max_length=120)
    utm_medium: str | None = Field(None, max_length=120)
    utm_campaign: str | None = Field(None, max_length=120)
    honeypot: str = ''

class InterestIn(BaseModel):
    token: str
    idea_stage: str = Field(min_length=2, max_length=50)
    category: str | None = Field(None, max_length=100)
    message: str | None = Field(None, max_length=2500)

class BookingIn(BaseModel):
    token: str
    slot: str

class ContactPatch(BaseModel):
    status: str

class NewDraft(BaseModel):
    to: EmailStr
    subject: str = Field(min_length=2, max_length=255)
    body: str = Field(min_length=2, max_length=10000)

class AutomationIn(BaseModel):
    name: str = Field(min_length=3, max_length=120)
    trigger: str = 'lead_created'
    action: str = 'welcome_draft'
    enabled: bool = True

class ForgotIn(BaseModel):
    email: EmailStr

class ResetIn(BaseModel):
    token: str = Field(min_length=25, max_length=300)
    password: str = Field(min_length=10, max_length=128)

class AgentTokenIn(BaseModel):
    label: str = Field(min_length=2, max_length=100)
    scopes: list[str] = Field(default_factory=lambda: ["funnels:read", "funnels:write"])
    valid_days: int = Field(default=30, ge=1, le=90)

class SendDraftIn(BaseModel):
    subject: str | None = None
    body: str | None = None

class IntegrationIn(BaseModel):
    enabled: bool = False
    inbox_id: str | None = None
    api_key: str | None = None
    webhook_secret: str | None = None
    pixel_id: str | None = None
    booking_url: str | None = None
    cal_event_type_id: int | None = Field(None, gt=0)
    notification_to: EmailStr | None = None
