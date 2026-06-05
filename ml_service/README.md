SmartQueue AI v2 — ML Service (Simple Docs)
=========================================

Quick summary
-------------
- Run the service with `uvicorn app:app --reload --port 8000` inside `ml_service/app`.
- The Node server sends office/city/department info — nothing is hardcoded here.
-- Main routes: `/predict`, `/predict/day`, `/observe`, `/reload-holidays`, `/health`.

Run (local)
-----------
1. Create venv and install:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Start server:

```powershell
cd ml_service/app
uvicorn app:app --reload --port 8000
```

Helpful file notes
------------------
- Models and encoders expected in `ml_service/app/models/saved/`:
  - `encoder_city.pkl`, `encoder_office_type.pkl`, `encoder_department.pkl`
  - (optional) `feature_importances.json`, `model_meta.json` if present
- The FastAPI app is `ml_service/app/app.py` (main entrypoint).

Routes and examples
-------------------

1) GET /predict
   - Purpose: single-hour prediction
   - Query params (required): `office_id`, `office_type`, `department`, `city`, `datetime` (ISO like `2024-10-14T10:00`), `open_hour`, `close_hour`
   - Response JSON:
     - `crowd_level` (float 0-100)
     - `tokens_issued` (int)
     - `wait_time_minutes` (float)
     - `rush_label` (string)

   Curl example:

```bash
curl 'http://localhost:8000/predict?office_id=RTO_Ahmedabad_Central&office_type=RTO&department=Driving_Licence&city=Ahmedabad&datetime=2024-10-14T10:00&open_hour=9&close_hour=18'
```

   Node fetch example:

```js
const url = new URL('http://localhost:8000/predict');
url.search = new URLSearchParams({
  office_id: 'RTO_Ahmedabad_Central',
  office_type: 'RTO',
  department: 'Driving_Licence',
  city: 'Ahmedabad',
  datetime: '2024-10-14T10:00',
  open_hour: '9',
  close_hour: '18'
});
const res = await fetch(url);
const json = await res.json();
console.log(json);
```

2) GET /predict/day
   - Purpose: hourly forecasts for a date
   - Query params: `office_id`, `office_type`, `department`, `city`, `date` (YYYY-MM-DD), `open_hour`, `close_hour`
   - Response: `DayForecastOut` object with `hourly` list and `best_hour` (recommended least-crowded hour)

3) GET /predict/week
   - Purpose: weekly forecast for the selected office
   - What it does:
     - returns predictions for 7 days
     - helps the Node backend show a weekly crowd plan
     - gives the best day or best time slot if the model supports it
   - Query params:
     - `office_id` (string)
     - `office_type` (string)
     - `department` (string)
     - `city` (string)
     - `week_start` (YYYY-MM-DD)
     - `open_hour` (int)
     - `close_hour` (int)
   - Response structure:
     - `office_id` (string)
     - `department` (string)
     - `city` (string)
     - `week_start` (string)
     - `week_end` (string)
     - `days` (array of daily forecast objects)

   Example response:

```json
{
  "office_id": "RTO_Ahmedabad_Central",
  "department": "Driving_Licence",
  "city": "Ahmedabad",
  "week_start": "2024-10-14",
  "week_end": "2024-10-20",
  "days": [
    {
      "date": "2024-10-14",
      "is_holiday": false,
      "best_hour": 11,
      "best_time": "11:00",
      "best_crowd": 12.3
    },
    {
      "date": "2024-10-15",
      "is_holiday": false,
      "best_hour": 10,
      "best_time": "10:00",
      "best_crowd": 15.8
    }
  ]
}
```

4) POST /reload-holidays
   - Purpose: Node server sends full holiday list (call at startup and on admin change)
   - Body JSON:
     - `dates`: array of strings in `YYYY-MM-DD` format
   - Example request:

```js
await fetch('http://localhost:8000/reload-holidays', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ dates: ['2024-01-26','2024-08-15'] })
});
```

   Example response:

```json
{ "status": "ok", "loaded": 2, "message": "2 holidays loaded into memory." }
```

5) GET /health
   - Purpose: quick model health + online-learning stats
   - Response example:

```json
{
  "status": "ok",
  "timestamp": "2024-10-14T12:00:00",
  "model": "XGBoost+LightGBM+Ridge+River",
  "version": "2.0.0",
  "holidays_loaded": 12,
  "learning_stats": { "observations": 123, "last_update": "2024-10-14T11:55:00" }
}
```


GET /predict (Body)
- Request Body:
  - `office_id` (string)
  - `office_type` (string)
  - `department` (string)
  - `city` (string)
  - `datetime` (ISO `YYYY-MM-DDTHH:MM`)
  - `open_hour` (int)
  - `close_hour` (int)

- Successful response (200) JSON:

```json
{
  "crowd_level": 45.3,
  "tokens_issued": 12,
  "wait_time_minutes": 8.7,
  "rush_label": "Normal"
}
```

GET /predict/day (Body)
- Request Body:
  - `office_id`, `office_type`, `department`, `city`
  - `date` (YYYY-MM-DD), `open_hour`, `close_hour`

- Successful response (200) JSON structure (DayForecastOut):

```json
{
  "office_id": "RTO_Ahmedabad_Central",
  "department": "Driving_Licence",
  "city": "Ahmedabad",
  "date": "2024-10-14",
  "is_holiday": false,
  "best_hour": 11,
  "best_time": "11:00",
  "best_crowd": 12.3,
  "hourly": [
    { "hour": 9, "time_label": "09:00", "crowd_level": 20.1, "tokens_issued": 4, "wait_time_minutes": 5.0, "rush_label": "Low" },
    { "hour": 10, "time_label": "10:00", "crowd_level": 30.5, "tokens_issued": 8, "wait_time_minutes": 7.2, "rush_label": "Normal" }
  ]
}
```

Notes for Node.js backend developer
----------------------------------
- At startup, call `/reload-holidays` with the full holiday list so the ML service knows holidays.
- Always pass `office_type`, `department`, `city` exactly as used when the encoders were trained. If a new label appears, the service maps it to a safe fallback (no crash).
- The ML service expects the encoder and model files in `ml_service/app/models/saved/`.
- If you want to run the FastAPI app on a different machine or port, update the fetch URLs accordingly.

Troubleshooting
---------------
- 500 errors: check model files exist in `models/saved/` and the names match.
- Date parsing errors: use ISO `YYYY-MM-DDTHH:MM` for `datetime` and `YYYY-MM-DD` for `date`.

That's it — simple and copy/paste-friendly examples so your Node.js backend can call the ML service.
