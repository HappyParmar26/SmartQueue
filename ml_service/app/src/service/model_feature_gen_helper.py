import numpy as np
from datetime import timedelta
from app.src.temp.model_loader import city_encoder, type_encoder, department_encoder
from app.src.util.helper import is_election_period, is_navratri

HOLIDAYS = set()  # loaded from Node.js

def get_raw_time(df):
    
    dt = df.loc[0, "datetime"]

    df["hour"] = dt.hour
    df["day_of_week"] = dt.weekday()
    df["month"] = dt.month
    df["day"] = dt.day
    df["week_of_month"] = (dt.day - 1) // 7 + 1
    df["year"] = dt.year

    return df


def cyclic_encoding(df):

    dt = df.loc[0, "datetime"]

    hour = dt.hour
    day_of_week = dt.weekday()
    month = dt.month
    day = dt.day

    df["hour_sin"] = np.sin(2 * np.pi * hour / 24)
    df["hour_cos"] = np.cos(2 * np.pi * hour / 24)
    df["dow_sin"] = np.sin(2 * np.pi * day_of_week / 7)
    df["dow_cos"] = np.cos(2 * np.pi * day_of_week / 7)
    df["month_sin"] = np.sin(2 * np.pi * month / 12)
    df["month_cos"] = np.cos(2 * np.pi * month / 12)
    df["day_sin"] = np.sin(2 * np.pi * day / 31)
    df["day_cos"] = np.cos(2 * np.pi * day / 31)

    return df


def add_calendar_features(df):

    dt = df.loc[0, "datetime"]

    day = dt.day
    dow = dt.weekday()
    date_str = dt.strftime("%Y-%m-%d")
    yesterday = (dt - timedelta(days=1)).strftime("%Y-%m-%d")

    df["is_holiday"] = int(date_str in HOLIDAYS)
    df["is_saturday"] = int(dow == 5)
    df["is_sunday"] = int(dow == 6)
    df["is_month_start"] = int(day <= 5)
    df["is_month_end"] = int(day >= 26)
    df["is_navratri"] = is_navratri(dt)
    df["is_election_period"] = is_election_period(dt)
    df["is_day_after_holiday"] = int(yesterday in HOLIDAYS)

    return df


def add_fy_pressure(df):

    dt = df.loc[0, "datetime"]

    month = dt.month
    day = dt.day

    if month == 3 and day >= 20:
        df["fy_pressure"] = 1.60

    elif month == 4 and day <= 10:
        df["fy_pressure"] = 1.38

    elif month == 3:
        df["fy_pressure"] = 1.28

    else:
        df["fy_pressure"] = 1.00

    return df


def encode_features(df):

    df["city_enc"] = city_encoder.transform(df["city"])
    df["office_type_enc"] = type_encoder.transform(df["office_type"])
    df["department_enc"] = department_encoder.transform(df["department"])

    return df

def add_season_feature(df):

    season_map = {
        1: 0, 2: 0, 11: 0, 12: 0,  # winter
        3: 1, 4: 1, 5: 1,          # summer
        6: 2, 7: 2, 8: 2, 9: 2,    # monsoon
        10: 3                      # post_monsoon
    }

    df["season_enc"] = season_map[df.loc[0, "month"]]

    return df


def add_interaction_features(df):

    df["hour_x_dow"] = df["hour"] * df["day_of_week"]

    df["hour_x_month"] = df["hour"] * df["month"]

    df["dept_x_dow"] = (
        df["department_enc"] * df["day_of_week"]
    )

    df["dept_x_hour"] = (
        df["department_enc"] * df["hour"]
    )

    df["month_end_x_dept"] = (
        df["is_month_end"] * df["department_enc"]
    )

    df["fy_x_month"] = (
        df["fy_pressure"] * df["month"]
    )

    df["city_x_dept"] = (
        df["city_enc"] * df["department_enc"]
    )

    return df

def add_lag_features(df):

    df["crowd_lag_1d"] = 50.0
    df["crowd_lag_7d"] = 50.0
    df["crowd_lag_14d"] = 50.0

    df["crowd_roll_mean_4w"] = 50.0
    df["crowd_roll_mean_8w"] = 50.0
    df["crowd_roll_std_4w"] = 8.0

    df["crowd_same_hour_yesterday"] = 50.0
    df["crowd_same_hour_last_week"] = 50.0
    df["crowd_same_hour_last_month"] = 50.0

    return df