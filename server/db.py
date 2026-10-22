import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

URL=os.getenv('DATABASE_URL','sqlite:///./numfunnel.db')
engine=create_engine(URL,connect_args={'check_same_thread':False} if URL.startswith('sqlite') else {},pool_pre_ping=True)
SessionLocal=sessionmaker(bind=engine,autocommit=False,autoflush=False,expire_on_commit=False)

def create_tables():
    # Additive v1.3 upgrade for preexisting installations. No destructive migration.
    # A managed migration tool is still required before public production deployment.
    with engine.begin() as conn:
        if engine.dialect.name == "postgresql":
            conn.exec_driver_sql(
                'ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 0'
            )
        elif engine.dialect.name == "sqlite":
            from sqlalchemy import inspect
            if inspect(conn).has_table("users") and not any(
                col["name"] == "session_version" for col in inspect(conn).get_columns("users")
            ):
                conn.exec_driver_sql(
                    "ALTER TABLE users ADD COLUMN session_version INTEGER NOT NULL DEFAULT 0"
                )
    Base.metadata.create_all(engine)

def get_db():
    with SessionLocal() as db: yield db
