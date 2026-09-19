"""
Smart Pharmacy AI Service (FastAPI)
 
Endpoints so far:
  - GET  /ai/health
  - POST /ai/analyze-prescription  -> OCR an image (used for both prescriptions
                                       and medicine identification photos)
  - POST /ai/forecast-demand       -> demand forecasting estimate
 
The chatbot intent endpoint is handled entirely on the Node side (see
backend/controllers/aiController.js) — it never needed a Python endpoint.
 
This service NEVER invents medicine stock, approves prescriptions, or
diagnoses conditions. It only extracts information / produces estimates;
Node.js + MongoDB remain the source of truth for all inventory and
approval decisions. Forecasts are always labelled as estimates, never
presented as guaranteed numbers.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
 
from ocr.pipeline import extract_text
from forecasting.demand_model import forecast_demand
 
app = FastAPI(title="Smart Pharmacy AI Service")
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
 
 
class ImagePath(BaseModel):
    imagePath: str
 
 
class ForecastRequest(BaseModel):
    medicineId: str
    historicalQuantities: list = []
    currentStock: int = 0
 
 
@app.get("/ai/health")
def health():
    return {"success": True, "status": "AI service running"}
 
 
@app.post("/ai/analyze-prescription")
def analyze_prescription(payload: ImagePath):
    result = extract_text(payload.imagePath)
 
    if result.get("error"):
        raise HTTPException(status_code=500, detail=result["error"])
 
    if result.get("confidence", 0) < 40:
        return {
            "text": result.get("text", ""),
            "confidence": result.get("confidence", 0),
            "message": "Unable to identify reliably. Please upload a clearer image or consult a pharmacist.",
        }
 
    return result
 
 
@app.post("/ai/forecast-demand")
def forecast(payload: ForecastRequest):
    return forecast_demand(payload.historicalQuantities, payload.currentStock)
