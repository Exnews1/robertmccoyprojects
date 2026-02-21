from __future__ import annotations
from typing import List, Tuple
from ..models import AlignmentColor, Indicator, RiskLevel

BASE_TIME = {
    "green": (3, 6),
    "yellow": (6, 12),
    "red": (12, 24)
}

def add_months(rng: Tuple[int,int], add_min: int, add_max: int) -> Tuple[int,int]:
    return (rng[0] + add_min, rng[1] + add_max)

def sub_months(rng: Tuple[int,int], sub_min: int, sub_max: int) -> Tuple[int,int]:
    return (max(0, rng[0] - sub_min), max(1, rng[1] - sub_max))

def estimate_time(alignment: AlignmentColor, tier: int, has_degree: bool, has_it_experience: bool) -> Tuple[int,int]:
    rng = BASE_TIME[alignment]
    if tier >= 2:
        rng = add_months(rng, 2, 6)
    if has_it_experience:
        rng = sub_months(rng, 2, 4)
    if has_degree:
        rng = sub_months(rng, 1, 3)
    return rng

def risk_level_from_score(score: int) -> RiskLevel:
    if score >= 6:
        return "high"
    if score >= 3:
        return "medium"
    return "low"

def compute_indicators(profile, alignment: AlignmentColor, tier: int, months_range: Tuple[int,int]) -> List[Indicator]:
    indicators: List[Indicator] = []

    domain_score = 0 if alignment == "green" else (2 if alignment == "yellow" else 4)
    indicators.append(Indicator(
        name="Domain Alignment",
        level=risk_level_from_score(domain_score),
        rationale=f"Alignment is {alignment} based on MOS→Career matrix."
    ))

    timeline_score = 0
    if profile.months_remaining_service is not None and months_range[0] > profile.months_remaining_service:
        timeline_score += 6
    elif months_range[1] >= 18:
        timeline_score += 4
    elif months_range[1] >= 12:
        timeline_score += 3
    indicators.append(Indicator(
        name="Timeline Feasibility",
        level=risk_level_from_score(timeline_score),
        rationale="Estimated months compared to remaining service window (if provided) and typical pathway duration."
    ))

    stress_score = 0
    if tier >= 2: stress_score += 3
    if alignment == "red": stress_score += 3
    indicators.append(Indicator(
        name="Transition Stress",
        level=risk_level_from_score(stress_score),
        rationale="Tier and alignment shift used as proxy for intensity and complexity."
    ))

    family_score = 0
    if months_range[1] >= 12: family_score += 3
    if months_range[1] >= 18: family_score += 2
    indicators.append(Indicator(
        name="Family Impact",
        level=risk_level_from_score(family_score),
        rationale="Duration used as proxy for schedule pressure and stability risk."
    ))

    return indicators
