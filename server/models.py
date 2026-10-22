"""NÜM Funnel OS domain persistence. All tenant rows carry workspace_id."""
from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, UniqueConstraint, Integer, Text, JSON, Index
from sqlalchemy.orm import DeclarativeBase


def uid(): return str(uuid4())
def now(): return datetime.now(timezone.utc)

class Base(DeclarativeBase): pass

class User(Base):
    __tablename__='users'
    id=Column(String(36),primary_key=True,default=uid)
    email=Column(String(254),nullable=False,unique=True,index=True)
    name=Column(String(120),nullable=False)
    avatar_url=Column(String(500),nullable=True)
    password_hash=Column(String(255),nullable=False)
    session_version=Column(Integer,nullable=False,default=0)
    created_at=Column(DateTime(timezone=True),default=now)

class OAuthIdentity(Base):
    """Stable external identity. Email alone is NEVER an automatic account-link key."""
    __tablename__="oauth_identities"
    id=Column(String(36),primary_key=True,default=uid)
    user_id=Column(String(36),ForeignKey("users.id"),nullable=False,index=True)
    provider=Column(String(32),nullable=False)
    provider_subject=Column(String(200),nullable=False)
    created_at=Column(DateTime(timezone=True),default=now)
    __table_args__=(UniqueConstraint("provider","provider_subject"),
                    UniqueConstraint("provider","user_id"),)

class OAuthChallenge(Base):
    __tablename__="oauth_challenges"
    id=Column(String(36),primary_key=True,default=uid)
    nonce_hash=Column(String(64),nullable=False,unique=True,index=True)
    verifier_encrypted=Column(Text,nullable=False)
    mode=Column(String(10),nullable=False)
    user_id=Column(String(36),nullable=True)
    expires_unix=Column(Integer,nullable=False)

class AgentAccessToken(Base):
    __tablename__="agent_access_tokens"
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),ForeignKey("workspaces.id"),nullable=False,index=True)
    created_by=Column(String(36),ForeignKey("users.id"),nullable=False)
    token_hash=Column(String(64),nullable=False,unique=True,index=True)
    label=Column(String(100),nullable=False)
    scopes=Column(JSON,nullable=False,default=list)
    expires_unix=Column(Integer,nullable=False)
    revoked=Column(Boolean,nullable=False,default=False)
    created_at=Column(DateTime(timezone=True),default=now)

class PasswordResetToken(Base):
    __tablename__="password_reset_tokens"
    id=Column(String(36),primary_key=True,default=uid)
    user_id=Column(String(36),ForeignKey("users.id"),nullable=False,index=True)
    token_hash=Column(String(64),nullable=False,unique=True,index=True)
    expires_unix=Column(Integer,nullable=False)
    used=Column(Boolean,nullable=False,default=False)
    created_at=Column(DateTime(timezone=True),default=now)

class Workspace(Base):
    __tablename__='workspaces'
    id=Column(String(36),primary_key=True,default=uid)
    name=Column(String(120),nullable=False)
    slug=Column(String(70),unique=True,nullable=False)
    created_at=Column(DateTime(timezone=True),default=now)

class Membership(Base):
    __tablename__='memberships'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),ForeignKey('workspaces.id'),nullable=False,index=True)
    user_id=Column(String(36),ForeignKey('users.id'),nullable=False,index=True)
    role=Column(String(20),nullable=False,default='owner')
    __table_args__=(UniqueConstraint('workspace_id','user_id'),)

class Funnel(Base):
    __tablename__='funnels'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),ForeignKey('workspaces.id'),nullable=False,index=True)
    name=Column(String(150),nullable=False)
    slug=Column(String(110),nullable=False,unique=True,index=True)
    status=Column(String(20),nullable=False,default='draft')
    draft=Column(JSON,nullable=False,default=dict)
    published_version_id=Column(String(36),nullable=True)
    created_at=Column(DateTime(timezone=True),default=now)
    updated_at=Column(DateTime(timezone=True),default=now,onupdate=now)

class FunnelVersion(Base):
    __tablename__='funnel_versions'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),ForeignKey('workspaces.id'),nullable=False,index=True)
    funnel_id=Column(String(36),ForeignKey('funnels.id'),nullable=False,index=True)
    version=Column(Integer,nullable=False)
    snapshot=Column(JSON,nullable=False)
    published_at=Column(DateTime(timezone=True),default=now)
    __table_args__=(UniqueConstraint('funnel_id','version'),)

class Contact(Base):
    __tablename__='contacts'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),ForeignKey('workspaces.id'),nullable=False,index=True)
    email=Column(String(254),nullable=False)
    first_name=Column(String(100),nullable=False)
    status=Column(String(30),nullable=False,default='new')
    funnel_id=Column(String(36),nullable=True)
    lead_token_hash=Column(String(64),nullable=True)
    source=Column(JSON,nullable=False,default=dict)
    created_at=Column(DateTime(timezone=True),default=now)
    __table_args__=(UniqueConstraint('workspace_id','email'),)

class Consent(Base):
    __tablename__='consents'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),nullable=False,index=True)
    contact_id=Column(String(36),ForeignKey('contacts.id'),nullable=False,index=True)
    purpose=Column(String(30),nullable=False)
    granted=Column(Boolean,nullable=False)
    proof=Column(JSON,nullable=False,default=dict)
    recorded_at=Column(DateTime(timezone=True),default=now)

class Submission(Base):
    __tablename__='submissions'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),nullable=False,index=True)
    funnel_id=Column(String(36),nullable=False,index=True)
    version_id=Column(String(36),nullable=False)
    contact_id=Column(String(36),nullable=False,index=True)
    data=Column(JSON,nullable=False,default=dict)
    created_at=Column(DateTime(timezone=True),default=now)

class Application(Base):
    __tablename__='applications'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),nullable=False,index=True)
    funnel_id=Column(String(36),nullable=False,index=True)
    contact_id=Column(String(36),nullable=False,index=True)
    idea_stage=Column(String(50),nullable=False)
    category=Column(String(100),nullable=True)
    message=Column(Text,nullable=True)
    created_at=Column(DateTime(timezone=True),default=now)

class Booking(Base):
    __tablename__='bookings'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),nullable=False,index=True)
    funnel_id=Column(String(36),nullable=False,index=True)
    contact_id=Column(String(36),nullable=False,index=True)
    slot=Column(String(32),nullable=False)
    status=Column(String(20),nullable=False,default='confirmed')
    created_at=Column(DateTime(timezone=True),default=now)
    __table_args__=(UniqueConstraint('workspace_id','slot'),)

class Event(Base):
    __tablename__='events'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),nullable=False,index=True)
    funnel_id=Column(String(36),nullable=True,index=True)
    contact_id=Column(String(36),nullable=True)
    type=Column(String(70),nullable=False,index=True)
    data=Column(JSON,nullable=False,default=dict)
    created_at=Column(DateTime(timezone=True),default=now)

class Integration(Base):
    __tablename__='integrations'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),nullable=False,index=True)
    provider=Column(String(30),nullable=False)
    config=Column(JSON,nullable=False,default=dict)
    secret_encrypted=Column(Text,nullable=True)
    enabled=Column(Boolean,nullable=False,default=False)
    __table_args__=(UniqueConstraint('workspace_id','provider'),)

class EmailDraft(Base):
    __tablename__='email_drafts'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),nullable=False,index=True)
    contact_id=Column(String(36),nullable=True)
    to=Column(String(254),nullable=False)
    subject=Column(String(255),nullable=False)
    body=Column(Text,nullable=False)
    status=Column(String(20),nullable=False,default='draft')
    provider_message_id=Column(String(120),nullable=True)
    created_at=Column(DateTime(timezone=True),default=now)

class Automation(Base):
    __tablename__='automations'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),nullable=False,index=True)
    name=Column(String(120),nullable=False)
    trigger=Column(String(60),nullable=False)
    action=Column(String(60),nullable=False)
    enabled=Column(Boolean,nullable=False,default=True)

class Outbox(Base):
    __tablename__='outbox'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),nullable=False,index=True)
    event_id=Column(String(36),nullable=False)
    provider=Column(String(30),nullable=False)
    status=Column(String(30),nullable=False,default='pending')
    attempts=Column(Integer,nullable=False,default=0)
    payload=Column(JSON,nullable=False,default=dict)
    created_at=Column(DateTime(timezone=True),default=now)
    __table_args__=(UniqueConstraint('event_id','provider'),)

class InboxMessage(Base):
    __tablename__='inbox_messages'
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),nullable=False,index=True)
    provider_event_id=Column(String(160),nullable=False)
    from_address=Column(String(254),nullable=False)
    subject=Column(String(255),nullable=False,default='Sans objet')
    preview=Column(Text,nullable=False,default='')
    received_at=Column(DateTime(timezone=True),default=now)
    __table_args__=(UniqueConstraint('workspace_id','provider_event_id'),)


class WebhookReceipt(Base):
    __tablename__="webhook_receipts"
    id=Column(String(36),primary_key=True,default=uid)
    workspace_id=Column(String(36),nullable=False,index=True)
    provider=Column(String(30),nullable=False)
    provider_event_id=Column(String(160),nullable=False)
    event_type=Column(String(90),nullable=False)
    created_at=Column(DateTime(timezone=True),default=now)
    __table_args__=(UniqueConstraint("workspace_id","provider","provider_event_id"),)


class Asset(Base):
    __tablename__ = "assets"
    id = Column(String(36), primary_key=True, default=uid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False, index=True)
    bucket = Column(String(70), nullable=False)
    object_key = Column(String(300), nullable=False, unique=True)
    filename = Column(String(200), nullable=False)
    mime_type = Column(String(100), nullable=False)
    byte_count = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=now)

class CalBooking(Base):
    __tablename__ = "cal_bookings"
    id = Column(String(36), primary_key=True, default=uid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False, index=True)
    funnel_id = Column(String(36), ForeignKey("funnels.id"), nullable=False, index=True)
    contact_id = Column(String(36), ForeignKey("contacts.id"), nullable=False, index=True)
    provider_uid = Column(String(160), nullable=False)
    slot = Column(String(48), nullable=False)
    status = Column(String(24), nullable=False, default="confirmed")
    event_type_id = Column(Integer, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=now, onupdate=now)
    __table_args__ = (UniqueConstraint("workspace_id", "provider_uid"),)

class AutomationRun(Base):
    __tablename__ = "automation_runs"
    id = Column(String(36), primary_key=True, default=uid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False, index=True)
    automation_id = Column(String(36), ForeignKey("automations.id"), nullable=False)
    event_id = Column(String(36), ForeignKey("events.id"), nullable=False)
    contact_id = Column(String(36), ForeignKey("contacts.id"), nullable=False)
    state = Column(String(24), nullable=False, default="pending")
    attempts = Column(Integer, nullable=False, default=0)
    next_attempt_at = Column(DateTime(timezone=True), default=now)
    created_at = Column(DateTime(timezone=True), default=now)
    __table_args__=(UniqueConstraint("automation_id", "event_id"),)
