from fastapi import APIRouter
from schemas.req_schema import PredictionRequest
from controller import prediction_controller
from schemas.res_schema import PredictionResponse

prediction_router = APIRouter()

@prediction_router.post( "/predict", response_model=PredictionResponse )
async def get_predict( request: PredictionRequest ) -> PredictionResponse:
    return prediction_controller.predict(request)


@prediction_router.post( "/predict/day", response_model=PredictionResponse )
async def get_predict_day( request: PredictionRequest ) -> PredictionResponse:
    return prediction_controller.predict_day(request)