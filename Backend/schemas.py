from pydantic import BaseModel
from typing import List, Optional

class MindMapCreate(BaseModel):
    title: str
<<<<<<< HEAD
    data: dict
    
class MindMapDataUpdate(BaseModel):
    data: dict  # Das JSON-Format der Mindmap-Daten
=======
    data: dict
>>>>>>> 67c7627d4618095c715b3c11bb060156e0a5fefe
