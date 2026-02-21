from fastapi import APIRouter
from ..engine.models import LearnerProfile
from ..engine import run_simulation

router = APIRouter()

@router.get("/health")
def health():
    return {"ok": True}

@router.post("/simulate")
def simulate(profile: LearnerProfile):
    """
    Returns a single payload with trace[] included.
    Your frontend can animate Part A -> B -> C by iterating trace events.
    """
    result = run_simulation(profile)
    return result.model_dump()

@router.post("/simulate/events")
def simulate_events(profile: LearnerProfile):
    """
    Returns trace events only (small payload).
    Useful if your UI already has state and just wants the animation cues.
    """
    result = run_simulation(profile)
    return {"trace": [t.model_dump() for t in result.trace]}
