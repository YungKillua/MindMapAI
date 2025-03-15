from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import uvicorn
from sqlalchemy.orm import Session
import json
from models import MindMap
<<<<<<< HEAD
from schemas import MindMapCreate, MindMapDataUpdate
=======
from schemas import MindMapCreate
>>>>>>> 67c7627d4618095c715b3c11bb060156e0a5fefe
from database import SessionLocal, engine
from utils import generate_mindmap
import crud
from auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Erlaube alle Ursprünge (besser spezifisch machen)
    allow_credentials=True,
    allow_methods=["*"],  # Erlaube alle HTTP-Methoden
    allow_headers=["*"],  # Erlaube alle Header
)

app.include_router(auth_router, prefix="/auth")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Datenbanktabellen erstellen
MindMap.metadata.create_all(bind=engine)

# Dependency für Datenbank-Sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    
#Token Verification
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")  # "sub" ist in der Regel die Benutzer-ID im JWT
        if user_id is None:
            raise JWTError
        return user_id
    except JWTError:
        return None

        
# 🎨 Endpunkt: Neue Mindmap speichern
@app.post("/mindmaps/")
def save_mindmap(mindmap: MindMapCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user_id = verify_token(token)  # Verifiziere den Token und extrahiere die user_id
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    mindmap = crud.create_mindmap(db, mindmap.title, mindmap.data, user_id)
    return mindmap

<<<<<<< HEAD
# Nur Data patchen
@app.patch("/mindmaps/{mindmap_id}/data")
def update_mindmap_data(mindmap_id: int, update: MindMapDataUpdate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    mindmap = crud.get_mindmap_by_id(db, mindmap_id)
    
    if not mindmap:
        raise HTTPException(status_code=404, detail="Mindmap not found")
    
    if mindmap.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this mindmap")
    
    updated_mindmap = crud.update_mindmap_data(db, mindmap_id, update.data)
    return updated_mindmap


=======
>>>>>>> 67c7627d4618095c715b3c11bb060156e0a5fefe
# Endpunkt: Loeschen einer Mindmap
@app.delete("/mindmaps/{mindmap_id}")
def delete_mindmap(
    mindmap_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid Token")
    
    mindmap = crud.get_mindmap_by_id(db, mindmap_id)
    if not mindmap:
        raise HTTPException(status_code=404, detail="Mindmap not found")
    if mindmap.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this Mindmap")
    
    crud.delete_mindmap(db, mindmap_id)
    
    return {"message": "Mindmap deleted successfully"}
    

# 🔍 Endpunkt: Alle Mindmaps eines Users abrufen
@app.get("/mindmaps/")
def fetch_mindmaps(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user_id = verify_token(token)  # Verifiziere den Token und extrahiere die user_id
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    mindmaps = crud.get_mindmaps_by_user(db, user_id)  # Hole die Mindmaps des Users
    return mindmaps

@app.post("/generate-mindmap/")
def generate_mindmap_endpoint(topic: str):
    # GPT generiert die Mindmap-Daten
    mindmap_json = generate_mindmap(topic)
    return json.loads(mindmap_json)

@app.get("/test_db")
def test_db(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"message": "Verbindung erfolgreich!"}
    except Exception as e:
        return {"error": str(e)}