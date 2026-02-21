from __future__ import annotations
from typing import List
from ..models import WarningItem, RiskLevel

def foundation_gap_found(profile, foundations: List[str]) -> bool:
    if profile.has_it_experience:
        return False
    if any(c in profile.certs_held for c in ["Network+", "Security+", "A+"]):
        return False
    return True

def compute_barrier_warnings(profile, tier: int, foundations: List[str]) -> List[WarningItem]:
    warnings: List[WarningItem] = []
    if tier >= 2:
        warnings.append(WarningItem(
            code="TIER2_BARRIER",
            message=f"{profile.career_goal} is a Tier {tier} transition occupation — requires foundational domains ({', '.join(foundations)}).",
            severity="high"
        ))
        if foundation_gap_found(profile, foundations):
            warnings.append(WarningItem(
                code="FOUNDATION_GAP",
                message="Foundational domain gap detected — success rates drop without networking/OS basics and hands-on practice.",
                severity="high"
            ))
    return warnings
