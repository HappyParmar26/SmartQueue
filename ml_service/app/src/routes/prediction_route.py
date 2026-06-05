from fastapi import APIRouter
from schemas.req_schema import PredictionRequest
from controller import prediction_controller
from schemas.res_schema import DayPredictionResponse, PredictionResponse , WeekPredictionResponse

prediction_router = APIRouter()

@prediction_router.post( "/predict", response_model=PredictionResponse )
async def get_predict( request: PredictionRequest ) -> PredictionResponse:
    return prediction_controller.predict(request)


@prediction_router.post( "/predict/day", response_model=DayPredictionResponse )
async def predict_day( request: PredictionRequest ) -> DayPredictionResponse:
    return prediction_controller.get_day_prediction(request)


@prediction_router.post( "/predict/week", response_model=WeekPredictionResponse )
async def predict_week( request: PredictionRequest ) -> WeekPredictionResponse:
    return prediction_controller.get_week_prediction(request)