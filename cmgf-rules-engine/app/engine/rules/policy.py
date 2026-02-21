from __future__ import annotations
from typing import List
from ..models import WarningItem

def compute_policy_flags(profile, required_certs: List[str], policy_caps: dict, costs: dict) -> List[str]:
    flags: List[str] = []
    cert_costs = costs.get("cert_costs_usd", {})
    total = 0
    for c in required_certs:
        total += int(cert_costs.get(c, 0))

    ta_cap = int(policy_caps.get("TA_annual_cap_usd", 0))
    if total > 0 and ta_cap > 0 and total > ta_cap:
        flags.append("TA funding cap may not cover full credential stack (demo cap logic).")

    if "Degree Path" in required_certs:
        flags.append("Degree path may require longer timeline and different benefit routing (GI Bill vs TA).")

    return flags
