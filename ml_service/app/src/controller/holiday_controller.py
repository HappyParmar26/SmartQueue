from SmartQueue.ml_service.app.src.service.model_feature_gen_helper import HOLIDAYS
from fastapi.responses import JSONResponse
from schemas.req_schema import HolidayReloadRequest


def reload_holidays_handler( body: HolidayReloadRequest ) :
    try :
        HOLIDAYS.clear()

        for date in body.dates:
            HOLIDAYS.add(date)

        return JSONResponse(
            success=True, 
            status="ok",
            loaded=len(HOLIDAYS)
        )
    
    except Exception as e:
         return JSONResponse(
            success=False,
            message="ISE: SOMETHING WENT WRONG: " + str(e)
        )

        