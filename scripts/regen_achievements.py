"""Regenerate data/achievements.json (and public/data mirror) from existing JSONs.

Use after manually editing data/events.json or data/games.json to add events/games
without re-running the CSV importer. Preserves players.json and other inputs.
"""
from __future__ import annotations

import json
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from import_totals_csv import build_achievements  # noqa: E402

DATA = ROOT / "data"
PUBLIC = ROOT / "public" / "data"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def dump(path: Path, obj) -> None:
    path.write_text(json.dumps(obj, indent=2) + "\n", encoding="utf-8")


def reconstruct_places(events):
    places = defaultdict(lambda: defaultdict(list))
    for ev in events:
        for g in ev.get("games", []):
            gid = str(g.get("gameId", ""))
            for r in g.get("results", []):
                pid = str(r.get("playerId", ""))
                pos = r.get("position")
                if pid and gid and isinstance(pos, int):
                    places[pid][gid].append(pos)
    return places


def main() -> None:
    players = load(DATA / "players.json")
    events = load(DATA / "events.json")
    games = load(DATA / "games.json")
    advanced = load(DATA / "advanced_stats.json")
    moon_shots = {pid: int(stats.get("moon_shots", 0)) for pid, stats in advanced.items()}
    ach = build_achievements(players, events, games, advanced, moon_shots, reconstruct_places(events))
    dump(DATA / "achievements.json", ach)
    if (PUBLIC / "achievements.json").exists():
        dump(PUBLIC / "achievements.json", ach)
    print(f"Wrote {len(ach)} achievements.")


if __name__ == "__main__":
    main()
