FEATURE_COLS = [
    "hour",
    "day_of_week",
    "month",
    "day",
    "week_of_month",
    "year",

    "hour_sin",
    "hour_cos",
    "dow_sin",
    "dow_cos",

    "month_sin",
    "month_cos",
    "day_sin",
    "day_cos",

    "is_holiday",
    "is_saturday",
    "is_sunday",
    "is_month_start",
    "is_month_end",
    "is_navratri",
    "is_day_after_holiday",
    "is_election_period",

    "fy_pressure",

    "city_enc",
    "office_type_enc",
    "department_enc",

    "season_enc",

    "hour_x_dow",
    "hour_x_month",
    "dept_x_dow",
    "dept_x_hour",
    "month_end_x_dept",
    "fy_x_month",
    "city_x_dept",

    "crowd_lag_1d",
    "crowd_lag_7d",
    "crowd_lag_14d",
    "crowd_roll_mean_4w",
    "crowd_roll_mean_8w",
    "crowd_roll_std_4w",
    "crowd_same_hour_yesterday",
    "crowd_same_hour_last_week",
    "crowd_same_hour_last_month",
]

TARGET_COLS = ["crowd_level", "tokens_issued", "wait_time_minutes"]

SEASON_MAP = {"winter": 0, "summer": 1, "monsoon": 2, "post_monsoon": 3}