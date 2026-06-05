from app.src.service.model_feature_gen_helper import HOLIDAYS
from fastapi import APIRouter
from app.src.schemas.req_schema import HolidayReloadRequest
from app.src.controller.holiday_controller import reload_holidays_handler

holiday_router = APIRouter()

@holiday_router.post("/reload-holidays")
async def reload_holidays( body: HolidayReloadRequest ) :
    return await reload_holidays_handler(body)
   