from temp.model_loader import (
    XGB_crowd_model, LGB_crowd_model, river_crowdmodel, meta_crowd_model,
    XGB_token_issued_model, LGB_token_issued_model, river_token_issuedmodel, meta_token_issued_model,
    XGB_wait_time_model, LGB_wait_time_model, river_wait_time_model, meta_wait_time_model,
)
from util.helper import get_rush_label


ALPHA = 0.75


def get_hour_prediction(model_input):
    
    x_dict = model_input.iloc[0].to_dict()

    crowd = predict_crowd(model_input, x_dict)
    tokens = predict_tokens(model_input, x_dict)
    wait = predict_wait(model_input, x_dict)
    rush = get_rush_label(crowd) 

    return {
        "crowd_level": crowd,
        "tokens_issued": tokens,
        "wait_time_minutes": wait,
        "rush_label": rush
    }


def predict_crowd(X, x_dict):

    xgb_pred = XGB_crowd_model.predict(X)[0]
    lgb_pred = LGB_crowd_model.predict(X)[0]
    base_pred = meta_crowd_model.predict(
        [[xgb_pred, lgb_pred]]
    )[0]

    river_pred = river_crowdmodel.predict_one(x_dict)

    if river_pred is None:
        river_pred = base_pred

    final_pred = (
        ALPHA * base_pred
        + (1 - ALPHA) * river_pred
    )

    return round(
        max(0, min(100, final_pred)),
        1
    )


def predict_tokens(X, x_dict):

    xgb_pred = XGB_token_issued_model.predict(X)[0]

    lgb_pred = LGB_token_issued_model.predict(X)[0]

    base_pred = meta_token_issued_model.predict(
        [[xgb_pred, lgb_pred]]
    )[0]

    river_pred = river_token_issuedmodel.predict_one(x_dict)

    if river_pred is None:
        river_pred = base_pred

    final_pred = (
        ALPHA * base_pred
        + (1 - ALPHA) * river_pred
    )

    return max(
        0,
        round(final_pred)
    )

def predict_wait(X, x_dict):

    xgb_pred = XGB_wait_time_model.predict(X)[0]

    lgb_pred = LGB_wait_time_model.predict(X)[0]

    base_pred = meta_wait_time_model.predict(
        [[xgb_pred, lgb_pred]]
    )[0]

    river_pred = river_wait_time_model.predict_one(x_dict)

    if river_pred is None:
        river_pred = base_pred

    final_pred = (
        ALPHA * base_pred
        + (1 - ALPHA) * river_pred
    )

    return round(
        max(0, final_pred),
        1
    )