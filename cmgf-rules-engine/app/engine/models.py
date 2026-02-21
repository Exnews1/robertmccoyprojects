from __future__ import annotations
from typing import Any, Dict, List, Literal, Optional, Tuple
from pydantic import BaseModel, Field

AlignmentColor = Literal["green", "yellow", "red"]
RiskLevel = Literal["low", "medium", "high"]

class LearnerProfile(BaseModel):
    mos_group: str
    career_goal: str

    has_it_experience: bool = False
    has_degree: bool = False
    certs_held: List[str] = Field(default_factory=list)
    months_remaining_service: Optional[int] = None

class TraceEvent(BaseModel):
    step: Literal["A", "B", "C"]
    label: str
    status: Literal["start", "complete"]
    payload: Dict[str, Any] = Field(default_factory=dict)

class WarningItem(BaseModel):
    code: str
    message: str
    severity: RiskLevel

class Indicator(BaseModel):
    name: str
    level: RiskLevel
    rationale: str

class PathwayOption(BaseModel):
    id: str
    title: str
    months_range: Tuple[int, int]
    alignment_pct: int

class ResourceItem(BaseModel):
    name: str
    cost_usd: Optional[int] = None
    tag: Optional[str] = None

class SimulationResult(BaseModel):
    mos_group: str
    career_goal: str
    alignment: AlignmentColor
    alignment_pct: int
    tier: int

    estimated_months: Tuple[int, int]

    warnings: List[WarningItem] = Field(default_factory=list)
    policy_flags: List[str] = Field(default_factory=list)
    pathway_options: List[PathwayOption] = Field(default_factory=list)
    resources_required: List[ResourceItem] = Field(default_factory=list)
    indicators: List[Indicator] = Field(default_factory=list)

    special_considerations: List[str] = Field(default_factory=list)

    trace: List[TraceEvent] = Field(default_factory=list)
