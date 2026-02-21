from __future__ import annotations
from typing import Any, Dict, List
from .models import TraceEvent

def ev(step: str, label: str, status: str, payload: Dict[str, Any] | None = None) -> TraceEvent:
    return TraceEvent(step=step, label=label, status=status, payload=payload or {})

def trace_A_start() -> TraceEvent:
    return ev("A", "Service Member Interface", "start")

def trace_A_complete(payload: Dict[str, Any]) -> TraceEvent:
    return ev("A", "Service Member Interface", "complete", payload)

def trace_B_start() -> TraceEvent:
    return ev("B", "AI Mediation & Constraint Binding", "start")

def trace_B_complete(payload: Dict[str, Any]) -> TraceEvent:
    return ev("B", "AI Mediation & Constraint Binding", "complete", payload)

def trace_C_start() -> TraceEvent:
    return ev("C", "Advisor Review", "start")

def trace_C_complete(payload: Dict[str, Any]) -> TraceEvent:
    return ev("C", "Advisor Review", "complete", payload)
