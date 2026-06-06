import joblib 

XGB_crowd_model = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\xgb_crowd_level.pkl') 
XGB_token_issued_model = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\xgb_tokens_issued.pkl')
XGB_wait_time_model = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\xgb_wait_time_minutes.pkl')

print("XGB Crowd Level Model Loaded Successfully")
print("XGB Tokens Issued Model Loaded Successfully")
print("XGB Wait Time Model Loaded Successfully")

LGB_crowd_model = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\lgb_crowd_level.pkl')
LGB_token_issued_model = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\lgb_tokens_issued.pkl')
LGB_wait_time_model = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\lgb_wait_time_minutes.pkl')

print("LGB Crowd Level Model Loaded Successfully")
print("LGB Tokens Issued Model Loaded Successfully")
print("LGB Wait Time Model Loaded Successfully")

river_crowd_model = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\river_crowd_level.pkl')
river_token_issued_model = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\river_tokens_issued.pkl')
river_wait_time_model = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\river_wait_time_minutes.pkl')

print("River Crowd Level Model Loaded Successfully")
print("River Tokens Issued Model Loaded Successfully")
print("River Wait Time Model Loaded Successfully")


meta_crowd_model = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\meta_crowd_level.pkl')
meta_token_issued_model = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\meta_tokens_issued.pkl')
meta_wait_time_model = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\meta_wait_time_minutes.pkl')

print("Meta Crowd Level Model Loaded Successfully")
print("Meta Tokens Issued Model Loaded Successfully")
print("Meta Wait Time Model Loaded Successfully")

city_encoder = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\encoder_city.pkl')
type_encoder = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\encoder_office_type.pkl')
department_encoder = joblib.load(r'D:\SmartQueue_AI\SmartQueue\ml_service\app\src\ml_models\encoder_department.pkl')

print("City Encoder Loaded Successfully")
print("Type Encoder Loaded Successfully")
print("Department Encoder Loaded Successfully")

