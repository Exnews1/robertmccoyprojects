import json
import os
from functools import lru_cache
from typing import Any, Dict

def _read_json(path: str) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

@lru_cache(maxsize=1)
def load_all() -> Dict[str, Any]:
    data_dir = os.getenv("DATA_DIR", "app/data")
    return {
        "mos_groups": _read_json(os.path.join(data_dir, "mos_groups.json")),
        "career_goals": _read_json(os.path.join(data_dir, "career_goals.json")),
        "alignment_matrix": _read_json(os.path.join(data_dir, "alignment_matrix.json")),
        "career_tiers": _read_json(os.path.join(data_dir, "career_tiers.json")),
        "career_foundations": _read_json(os.path.join(data_dir, "career_foundations.json")),
        "cert_stacks": _read_json(os.path.join(data_dir, "cert_stacks.json")),
        "policy_caps": _read_json(os.path.join(data_dir, "policy_caps.json")),
        "costs": _read_json(os.path.join(data_dir, "costs.json")),
    }
