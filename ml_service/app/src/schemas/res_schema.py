from pydantic import BaseModel
from datetime import datetime

class PredictionResponse(BaseModel):
    success: bool
    office_id: str
    office_type: str
    datetime: datetime
    office_open: bool
    crowd_level: float
    tokens_issued: int
    wait_time_minutes: float
    rush_label: str