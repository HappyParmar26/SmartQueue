import datetime

from scipy import stats

from SmartQueue.ml_service.app.src.service.model_feature_gen_helper import HOLIDAYS
from fastapi import FastAPI
import uvicorn
from routes import prediction_route

app = FastAPI()

@app.get("/")
def root():
    return { "success": True, "message": "ML Service" }

@app.get("/health", tags=["System"])
async def health():
    return {
        "status":         "ok",
        "timestamp":      datetime.now().isoformat(),
        "model":          "XGBoost+LightGBM+Ridge+River",
        "version":        "2.0.0",
    }


app.include_router(
    prediction_route.prediction_router,
    prefix="/api/v1",
    tags=["Prediction"]
)

if __name__ == "__main__":
    uvicorn.run("main.app", host="0.0.0.0", port=8000 , reload=True)
