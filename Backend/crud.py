from sqlalchemy.orm import Session
from models import MindMap

def create_mindmap(db: Session, title: str, data: dict, user_id: int):
    mindmap = MindMap(title=title, data=data, owner_id=user_id)
    db.add(mindmap)
    db.commit()
    db.refresh(mindmap)
    return mindmap

def get_mindmaps_by_user(db: Session, user_id: int):
    return db.query(MindMap).filter(MindMap.owner_id == user_id).all()

def get_mindmap_by_id(db: Session, mindmap_id: int):
    return db.query(MindMap).filter(MindMap.id == mindmap_id).first()

def delete_mindmap(db: Session, mindmap_id: int):
    mindmap = db.query(MindMap).filter(MindMap.id == mindmap_id).first()
    if mindmap:
        db.delete(mindmap)
        db.commit()