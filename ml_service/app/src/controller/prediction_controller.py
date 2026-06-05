from copy import deepcopy
from datetime import timedelta
from app.src.service.model_feature_gen_helper import HOLIDAYS
from app.src.service.prediction_service import get_hour_prediction
from fastapi import HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from datetime import datetime
from app.src.schemas.res_schema import HourlyPrediction, PredictionResponse , DayPredictionResponse , WeekPredictionResponse
from app.src.schemas.req_schema import PredictionRequest
from app.src.service.prediction_service import generate_Model_input, get_hour_prediction


async def predict( request ) -> PredictionResponse:
    
    try:

        model_input = generate_Model_input(request)
        predictions = get_hour_prediction(model_input)

        return PredictionResponse(
            success=True,
            office_id=request.office_id,
            office_type=request.office_type,
            department=request.department,
            city=request.city,
            datetime=request.datetime,
            office_open=True,  # we'll handle this later
            crowd_level=predictions["crowd_level"],
            tokens_issued=predictions["tokens_issued"],
            wait_time_minutes=predictions["wait_time_minutes"],
            rush_label=predictions["rush_label"]
        )
        
    except Exception as e:
        return JSONResponse(
            success=False,
            message="ISE: SOMEHING WENT WRONG: " + str(e)
        )
   


def get_day_prediction(request) -> DayPredictionResponse:

    try:

        hourly_predictions = []

        best_hour = None
        best_crowd = float("inf")

        for hour in range( request.open_hour , request.close_hour + 1):

            hourly_request = deepcopy(request)

            #change the hour 
            hourly_request.datetime = (
                hourly_request.datetime.replace(
                    hour=hour,
                    minute=0,
                    second=0,
                    microsecond=0
                )
            )
        
            model_input = generate_Model_input( hourly_request)

            prediction = get_hour_prediction( model_input)

            hourly_predictions.append(
                HourlyPrediction(
                    hour=hour,
                    time_label=f"{hour:02d}:00",
                    crowd_level=prediction["crowd_level"],
                    tokens_issued=prediction["tokens_issued"],
                    wait_time_minutes=prediction["wait_time_minutes"],
                    rush_label=prediction["rush_label"]
                )
            )

            if prediction["crowd_level"] < best_crowd:
                best_crowd = prediction["crowd_level"]
                best_hour = hour

        return DayPredictionResponse(
            office_id=request.office_id,
            office_type=request.office_type,
            department=request.department,
            city=request.city,
            date=request.datetime.strftime("%Y-%m-%d"),
            is_holiday=HOLIDAYS.__contains__(request.datetime.date()),
            best_hour=best_hour,
            best_time=f"{best_hour:02d}:00",
            best_crowd=round(best_crowd, 1),
            hourly=hourly_predictions
        )
    
    except Exception as e:
        return JSONResponse(
            success=False,
            message="ISE: SOMETHING WENT WRONG: " + str(e)
        )



def get_week_prediction(request):

    try :

        daily_predictions = []

        for day_offset in range(7):

            daily_request = deepcopy(request)

            daily_request.datetime = (
                daily_request.datetime +
                timedelta(days=day_offset)
            )

            day_prediction = get_day_prediction(
                daily_request
            )

            daily_predictions.append(
                day_prediction
            )

        return WeekPredictionResponse(
            office_id=request.office_id,
            office_type=request.office_type,
            department=request.department,
            city=request.city,
            predictions=daily_predictions
        )
    
    except Exception as e:
        return JSONResponse(
            success=False,
            message="ISE: SOMETHING WENT WRONG: " + str(e)
        )