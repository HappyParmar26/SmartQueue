from pydantic import BaseModel
from datetime import datetime

class PredictionRequest(BaseModel):
    office_id: str
    office_type: str
    department: str
    city: str
    datetime: datetime
    open_hour: int
    close_hour: int

class HolidayReloadRequest(BaseModel):
    dates: list[str]
