from __future__ import annotations
from typing import List, Set
from ..models import ResourceItem

def build_resources(required_certs: List[str], costs: dict) -> List[ResourceItem]:
    cert_costs = costs.get("cert_costs_usd", {})
    lab_rng = costs.get("lab_monthly_usd_range", [10, 14])

    out: List[ResourceItem] = []
    seen: Set[str] = set()

    for c in required_certs:
        if c in seen:
            continue
        seen.add(c)
        cost = cert_costs.get(c)
        tag = "CA-eligible" if c in ["A+", "Network+", "Security+"] else None
        out.append(ResourceItem(name=c, cost_usd=int(cost) if cost else None, tag=tag))

    out.append(ResourceItem(name="Hands-on lab environment (TryHackMe/HackTheBox/Wireshark)", cost_usd=None, tag=f"Self-study (${lab_rng[0]}–${lab_rng[1]}/mo)"))
    return out
