from __future__ import annotations
from typing import List
from ..models import PathwayOption

def build_pathways(cert_stacks: dict, career_goal: str, alignment_pct: int) -> List[PathwayOption]:
    options = []
    for item in cert_stacks.get(career_goal, []):
        options.append(PathwayOption(
            id=item["id"],
            title=item["title"],
            months_range=tuple(item["months_range"]),
            alignment_pct=alignment_pct
        ))
    return options
