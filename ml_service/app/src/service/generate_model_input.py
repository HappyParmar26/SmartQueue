import pandas as pd

from SmartQueue.ml_service.app.src.config.feature_config import FEATURE_COLS
from .model_feature_gen_helper import (
    add_calendar_features, 
    add_fy_pressure,
    add_lag_features, 
    cyclic_encoding, 
    encode_features,
    get_raw_time , 
    add_season_features,
    add_interaction_features
)

def generate_Model_input( request ):

    data = {
        "office_id": [request.office_id],
        "office_type": [request.office_type],
        "datetime": [request.datetime],
        "open_hour": [request.open_hour],
        "close_hour": [request.close_hour],
        "is_holiday": [request.is_holiday]
    }

    df = pd.DataFrame(data) 

    df = get_raw_time(df)
    df = cyclic_encoding(df)
    df = add_calendar_features(df)
    df = add_fy_pressure(df)    
    df = encode_features(df)
    df = add_season_features(df)
    df = add_interaction_features(df)
    df = add_lag_features(df)

    # Debug: print the generated features
    print("Model input generated successfully:")
    print(df.head())

    # Debug: check if something went wrong and some feature cols are missing
    missing = set(FEATURE_COLS) - set(df.columns)
    print("Missing:", missing)

    model_input = df[FEATURE_COLS]
    return model_input 