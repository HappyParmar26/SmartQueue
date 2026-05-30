from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return { "success": True, "message": "ML Service health Check" }