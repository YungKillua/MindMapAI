import openai
import json
<<<<<<< HEAD
import os
from dotenv import load_dotenv

load_dotenv()
openai_key = os.getenv("OPENAI_API_KEY")
=======

with open('config.json', 'r') as config:
    config = json.load(config)
    openai_key = config['keys']['openai']
>>>>>>> 67c7627d4618095c715b3c11bb060156e0a5fefe
    
gpt_client = openai.Client(api_key=openai_key)
  

def generate_mindmap(topic: str):
    prompt = f"""
    Erstelle eine Mindmap zum Thema '{topic}'. Gib die Antwort als JSON zurück, das folgende Struktur hat:
    {{
      "title": "Thema",
      "nodes": [
        {{ "label": "Hauptthema"}},
        {{ "label": "Unterthema 1"}},
        {{ "label": "Unterthema 2"}}
      ]
    }}
    """

    response = gpt_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Du bist ein hilfreicher Assistent, der strukturierte JSON-Antworten liefert."},
            {"role": "user", "content": prompt}
        ]
    )
    data = response.choices[0].message.content
    return data
  
