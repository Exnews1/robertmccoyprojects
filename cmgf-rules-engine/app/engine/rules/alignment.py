from __future__ import annotations
from typing import Tuple
from ..models import AlignmentColor

ALIGNMENT_PCT = {
    "green": 88,
    "yellow": 74,
    "red": 58
}

def get_alignment(alignment_matrix: dict, mos_group: str, career_goal: str) -> Tuple[AlignmentColor, int]:
    color = alignment_matrix.get(mos_group, {}).get(career_goal, "yellow")
    pct = ALIGNMENT_PCT.get(color, 74)
    return color, pct
