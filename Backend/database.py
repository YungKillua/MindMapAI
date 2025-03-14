from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


DATABASE_URL = "postgresql://postgres:1312@localhost/mindmapdb"

from sqlalchemy.sql import text

engine = create_engine(DATABASE_URL, pool_pre_ping=True)  # Ping aktivieren
with engine.connect() as connection:
    connection.execute(text("SELECT 1"))  # SQL korrekt als Text deklarieren

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()