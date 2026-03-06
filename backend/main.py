from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import random
import time

app = FastAPI()

# Allow React to talk to this Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Disease Database
DISEASES = [
    {
        "name": "Blister Blight",
        "symptoms": "White, velvety blisters visible on young leaves.",
        "treatment": "Apply Copper Oxychloride (0.1%) immediately.",
        "color": "#C0392B", # Red
        "severity_min": 60, "severity_max": 95
    },
    {
        "name": "Red Rust",
        "symptoms": "Orange-red hairy spots on leaves and young stems.",
        "treatment": "Improve drainage. Spray potash 2%.",
        "severity_min": 40, "severity_max": 75,
        "color": "#D35400" # Orange
    },
    {
        "name": "Grey Blight",
        "symptoms": "Brown patches with concentric rings on older leaves.",
        "treatment": "Remove dead wood. Apply Bordeaux mixture.",
        "severity_min": 20, "severity_max": 50,
        "color": "#F39C12" # Yellow
    },
    {
        "name": "Healthy Tea Leaf",
        "symptoms": "Leaf is vibrant green with no spots.",
        "treatment": "Continue standard NPK schedule.",
        "severity_min": 0, "severity_max": 5,
        "color": "#27AE60" # Green
    }
]

@app.post("/analyze")
async def analyze_leaf(file: UploadFile = File(...)):
    time.sleep(2) # Simulate AI thinking
    
    # Pick a random result for the demo
    result = random.choice(DISEASES)
    severity = random.randint(result["severity_min"], result["severity_max"])

    return {
        "diagnosis": result["name"],
        "severity": severity,
        "confidence": random.randint(88, 99),
        "symptoms": result["symptoms"],
        "treatment": result["treatment"],
        "color": result["color"]
    }