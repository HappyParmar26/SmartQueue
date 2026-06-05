from fastapi import FastAPI
import uvicorn
from routes import prediction_route

app = FastAPI()

@app.get("/")
def root():
    return { "success": True, "message": "ML Service health Check" }

app.include_router(
    prediction_route.prediction_router,
    prefix="/api/v1",
    tags=["Prediction"]
)

if __name__ == "__main__":
    uvicorn.run("main.app", host="0.0.0.0", port=8000 , reload=True)
