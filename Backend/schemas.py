from pydantic import BaseModel
from typing import List, Optional

class MindMapCreate(BaseModel):
    title: str
    data: dict
    
class MindMapDataUpdate(BaseModel):
    data: dict  # Das JSON-Format der Mindmap-Daten