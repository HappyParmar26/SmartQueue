from SmartQueue.ml_service.app.src.service.prediction_service import get_hour_prediction
from fastapi import HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from datetime import datetime
from schemas.res_schema import PredictionResponse
from services.prediction_service import generate_Model_input, get_Predicton


async def predict( request ) -> PredictionResponse:
    
    model_input = generate_Model_input(request)
    predictions = get_hour_prediction(model_input)

    return PredictionResponse(
        success=True,
        office_id=request.office_id,
        office_type=request.office_type,
        datetime=request.datetime,
        office_open=True,  # we'll handle this later
        crowd_level=predictions["crowd_level"],
        tokens_issued=predictions["tokens_issued"],
        wait_time_minutes=predictions["wait_time_minutes"],
        rush_label=predictions["rush_label"]
    )

