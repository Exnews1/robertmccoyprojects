from __future__ import annotations
from typing import List, Set
from ..models import ResourceItem

CA_ELIGIBLE_CERTS = {
    "A+", "Network+", "Security+", "CAPM (optional)", "CPIM (optional)",
    "PMP (later)", "CISSP", "CEH", "CCNA"
}

TA_ELIGIBLE_ITEMS = {
    "Degree Path", "Ops Experience"
}

def build_resources(required_certs: List[str], costs: dict, policy_caps: dict = None) -> List[ResourceItem]:
    cert_costs = costs.get("cert_costs_usd", {})
    lab_rng = costs.get("lab_monthly_usd_range", [10, 14])

    ca = {}
    if policy_caps:
        ca = policy_caps.get("credentialing_assistance", {})
    ca_max_per_cert = int(ca.get("max_cost_per_cert_usd", 2000))

    out: List[ResourceItem] = []
    seen: Set[str] = set()

    for c in required_certs:
        if c in seen:
            continue
        seen.add(c)
        cost = cert_costs.get(c)
        cost_val = int(cost) if cost else None

        if c in CA_ELIGIBLE_CERTS:
            if cost_val and cost_val > ca_max_per_cert:
                tag = f"CA-eligible (exceeds ${ca_max_per_cert} cap — partial self-funded)"
            else:
                tag = "CA-eligible"
        elif c in TA_ELIGIBLE_ITEMS:
            tag = "TA-eligible"
        else:
            tag = "Self-funded"

        out.append(ResourceItem(name=c, cost_usd=cost_val, tag=tag))

    out.append(ResourceItem(
        name="Hands-on lab environment (TryHackMe/HackTheBox/Wireshark)",
        cost_usd=None,
        tag=f"Self-funded (${lab_rng[0]}–${lab_rng[1]}/mo)"
    ))
    return out
