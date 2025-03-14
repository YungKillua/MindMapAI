from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String)  # Passwörter müssen später gehasht werden!

    mindmaps = relationship("MindMap", back_populates="owner")

class MindMap(Base):
    __tablename__ = "mindmaps"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    data = Column(JSON)  # Hier speichern wir die Mindmap als JSON
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="mindmaps")
