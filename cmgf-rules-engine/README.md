# CMGF Rules Engine (Deterministic + Explainable)

## Run locally / on Replit:

1) Install dependencies:
   ```
   pip install -e .
   ```

2) Start server:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## Endpoints:
- GET  /api/health
- POST /api/simulate
- POST /api/simulate/events

## Sample request:
```json
POST /api/simulate
{
  "mos_group": "Logistics",
  "career_goal": "Cybersecurity",
  "has_it_experience": false,
  "has_degree": false,
  "certs_held": [],
  "months_remaining_service": 10
}
```

The response includes `trace[]` events you can use to animate A -> B -> C in the UI.
