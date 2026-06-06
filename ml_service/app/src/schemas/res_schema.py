from pydantic import BaseModel
from datetime import datetime

class PredictionResponse(BaseModel):
    success: bool
    office_id: str
    office_type: str
    department:str
    city: str
    datetime: datetime
    office_open: bool
    crowd_level: float
    tokens_issued: int
    wait_time_minutes: float
    rush_label: str


class HourlyPrediction(BaseModel):
    hour: int
    time_label: str
    crowd_level: float
    tokens_issued: int
    wait_time_minutes: float
    rush_label: str


class DayPredictionResponse(BaseModel):
    office_id: str
    office_type: str
    department: str
    city: str
    date: str
    is_holiday: bool

    best_hour: int
    best_time: str
    best_crowd: float

    hourly: list[HourlyPrediction]

class WeekPredictionResponse(BaseModel):
    office_id: str
    office_type: str
    department: str
    city: str

    predictions: list[DayPredictionResponse]