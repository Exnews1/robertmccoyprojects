from .models import LearnerProfile, SimulationResult
from .loader import load_all
from .trace import (
    trace_A_start, trace_A_complete,
    trace_B_start, trace_B_complete,
    trace_C_start, trace_C_complete
)

from .rules.alignment import get_alignment
from .rules.barriers import compute_barrier_warnings
from .rules.time_risk import estimate_time, compute_indicators
from .rules.pathways import build_pathways
from .rules.policy import compute_policy_flags
from .rules.resources import build_resources

def run_simulation(profile: LearnerProfile) -> SimulationResult:
    data = load_all()

    alignment, alignment_pct = get_alignment(data["alignment_matrix"], profile.mos_group, profile.career_goal)
    tier = int(data["career_tiers"].get(profile.career_goal, 1))
    foundations = data["career_foundations"].get(profile.career_goal, [])

    trace = []
    trace.append(trace_A_start())
    trace.append(trace_A_complete({
        "mos_group": profile.mos_group,
        "career_goal": profile.career_goal,
        "certs_held": profile.certs_held,
        "months_remaining_service": profile.months_remaining_service
    }))

    trace.append(trace_B_start())

    warnings = compute_barrier_warnings(profile, tier, foundations)
    est_months = estimate_time(alignment, tier, profile.has_degree, profile.has_it_experience)
    indicators = compute_indicators(profile, alignment, tier, est_months)

    pathway_options = build_pathways(data["cert_stacks"], profile.career_goal, alignment_pct)

    required_certs = []
    if data["cert_stacks"].get(profile.career_goal):
        required_certs = data["cert_stacks"][profile.career_goal][0].get("requires", [])

    policy_flags = compute_policy_flags(profile, required_certs, data["policy_caps"], data["costs"])
    resources = build_resources(required_certs, data["costs"])

    trace.append(trace_B_complete({
        "alignment": alignment,
        "tier": tier,
        "foundations": foundations,
        "estimated_months": est_months
    }))

    trace.append(trace_C_start())

    special_considerations = []
    if tier >= 2:
        special_considerations.append(f"{profile.career_goal} is typically Tier {tier}; treat as a transition occupation rather than true entry-level.")
        if alignment in ("yellow", "red"):
            special_considerations.append("Recommended credential sequencing matters; skipping foundational certs increases failure rates and weakens hiring signals.")
        special_considerations.append("Experience substitution is allowed: home labs, CTFs, and portfolio artifacts can partially substitute for job history.")

    trace.append(trace_C_complete({
        "warnings_count": len(warnings),
        "policy_flags_count": len(policy_flags),
        "pathway_options_count": len(pathway_options)
    }))

    return SimulationResult(
        mos_group=profile.mos_group,
        career_goal=profile.career_goal,
        alignment=alignment,
        alignment_pct=alignment_pct,
        tier=tier,
        estimated_months=est_months,
        warnings=warnings,
        policy_flags=policy_flags,
        pathway_options=pathway_options,
        resources_required=resources,
        indicators=indicators,
        special_considerations=special_considerations,
        trace=trace
    )
