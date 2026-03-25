import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


def get_database_url() -> str:
    """
    Returns the correct database URL depending on the environment.
    Priority:
    1. DATABASE_URL environment variable
    2. Docker environment
    3. Local development
    """

    # If DATABASE_URL is provided (recommended for production)
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return database_url

    # Detect Docker container
    if os.path.exists("/.dockerenv"):
        host = "postgres"
    else:
        host = "localhost"

    user = "tenantflow"
    password = "K%40rthikgv007"# In production, use a secure method to manage secrets
    db = "tenantflow"
    
    return f"postgresql+psycopg2://{user}:{password}@{host}:5432/{db}"


DATABASE_URL = get_database_url()

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()