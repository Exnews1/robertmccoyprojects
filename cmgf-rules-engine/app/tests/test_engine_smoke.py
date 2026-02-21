from app.engine.models import LearnerProfile
from app.engine import run_simulation

def test_smoke_logistics_to_cyber():
    profile = LearnerProfile(
        mos_group="Logistics",
        career_goal="Cybersecurity",
        has_it_experience=False,
        has_degree=False,
        certs_held=[],
        months_remaining_service=10
    )
    result = run_simulation(profile)
    assert result.career_goal == "Cybersecurity"
    assert result.alignment in ("green", "yellow", "red")
    assert len(result.trace) >= 6
    assert any(w.code == "TIER2_BARRIER" for w in result.warnings)

def test_signal_to_cyber_greenish():
    profile = LearnerProfile(
        mos_group="Signal/Comms",
        career_goal="Cybersecurity",
        has_it_experience=True,
        certs_held=["Network+"]
    )
    result = run_simulation(profile)
    assert result.alignment == "green"
