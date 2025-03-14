from pydantic import BaseModel
from typing import List, Optional

class MindMapCreate(BaseModel):
    title: str
    data: dict