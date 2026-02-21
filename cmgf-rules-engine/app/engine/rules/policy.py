from __future__ import annotations
from typing import List
from ..models import WarningItem

def compute_policy_flags(profile, required_certs: List[str], policy_caps: dict, costs: dict) -> List[str]:
    flags: List[str] = []
    cert_costs = costs.get("cert_costs_usd", {})

    ta = policy_caps.get("tuition_assistance", {})
    ca = policy_caps.get("credentialing_assistance", {})
    timeline = policy_caps.get("timeline_flags", {})

    ta_annual_cap = int(ta.get("annual_cap_usd", 4000))
    ca_lifetime_cap = int(ca.get("lifetime_cap_usd", 4000))
    ca_max_per_cert = int(ca.get("max_cost_per_cert_usd", 2000))
    ca_annual_max = int(ca.get("annual_max_credentials", 1))
    ca_decade_max = int(ca.get("decade_max_credentials", 3))
    ca_time_required = int(ca.get("requires_service_time_remaining_months", 6))
    ta_time_required = int(ta.get("requires_service_time_remaining_months", 6))
    limited_threshold = int(timeline.get("limited_time_threshold_months", 12))
    high_risk_threshold = int(timeline.get("high_risk_threshold_months", 6))

    total_cert_cost = 0
    ca_eligible_count = 0
    certs_exceeding_cap = []

    for c in required_certs:
        cost = int(cert_costs.get(c, 0))
        total_cert_cost += cost
        if cost > 0:
            ca_eligible_count += 1
            if cost > ca_max_per_cert:
                certs_exceeding_cap.append(f"{c} (${cost})")

    if ca_eligible_count > ca_annual_max:
        flags.append(
            f"Credential pathway requires {ca_eligible_count} certifications, but Army COOL limits funding to {ca_annual_max} credential per year "
            f"and {ca_decade_max} per 10-year period. Sequencing and self-funding may be required."
        )

    if total_cert_cost > ca_lifetime_cap:
        flags.append(
            f"Total estimated credential cost (${total_cert_cost}) exceeds Army COOL lifetime cap (${ca_lifetime_cap}). "
            f"Service member may need to supplement with personal funds or alternative benefits."
        )

    if certs_exceeding_cap:
        flags.append(
            f"The following credentials exceed the per-certification CA cap of ${ca_max_per_cert}: {', '.join(certs_exceeding_cap)}. "
            f"Partial funding or alternative benefit routing may be needed."
        )

    months_remaining = profile.months_remaining_service
    if months_remaining is not None:
        if months_remaining < high_risk_threshold:
            flags.append(
                f"With {months_remaining} months remaining, service member is below the {high_risk_threshold}-month threshold required for TA/CA eligibility. "
                f"Benefit usage may not be available — transition planning should account for self-funding."
            )
        elif months_remaining < ca_time_required:
            flags.append(
                f"With {months_remaining} months remaining, service member may not meet the minimum service time requirement "
                f"({ca_time_required} months) for Credentialing Assistance. TA eligibility may also be affected."
            )
        elif months_remaining < limited_threshold:
            flags.append(
                f"Service member has {months_remaining} months remaining — approaching the limited-time threshold. "
                f"Credential sequencing should prioritize benefits usage before separation."
            )

    if total_cert_cost > ta_annual_cap:
        flags.append(
            f"Total pathway cost (${total_cert_cost}) exceeds the annual TA cap of ${ta_annual_cap}. "
            f"Multi-year benefit planning or mixed TA/CA funding strategy recommended."
        )

    if "Degree Path" in required_certs:
        flags.append(
            "Degree pathway may require longer timeline and different benefit routing (GI Bill vs TA). "
            "TA annual cap of $4,000 limits coursework pace."
        )

    return flags
