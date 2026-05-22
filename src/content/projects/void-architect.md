---
title: "Void Architect — Modular Ship Combat Prototype (UE5)"
featured: true
tags: []
role: "Solo"
stack: "Unreal Engine 5, Blueprints, UMG, Python"
year: "2026"
summary: "A gameplay systems prototype featuring an equilateral-triangle placement grid for modular ship building, and deterministic tick-based combat with a per-tick replay UI — designed for explainable outcomes and fast balance iteration."
highlights:
  - "Built an equilateral-triangle grid placement system with adjacency/edge rules and collision validation to support irregular ship layouts (more expressive than square grids)."
  - "Implemented a module-driven loadout & stat aggregation pipeline (HP/Shield/DPS/Weight/Agility + CPU/Power constraints), making trade-offs immediately visible in the shop UI."
  - "Resolved combat using a virtual-second deterministic simulation loop (tracking vs agility, reload/cooldowns, shield→HP overflow), optimized for repeatability and balancing."
  - "Added battle summary + per-tick replay (timeline slider + event log + HP/Shield curves) so players and developers can inspect why an outcome happened."
  - "Wrote two Python scripts used during balancing: one parses legacy UE print logs into CSV for analysis; another aggregates multiple runs for quick regression-style comparisons across builds/wave lines."
  - "Validated counterplay using two opposing wave lines (SiegeLine / PicketLine) randomly assigned each run, mapped to the four-build space (Armor/Shield × Laser/Missile)."
coverImage: "/images/project-placeholder.svg"
demoVideo: ""
screenshots: []
links:
  video: ""
  github: ""
order: 1
keyFeatures:
  - "Triangular Grid Placement"
  - "Tick Simulation"
  - "Replay UI"
---

## Overview

Void Architect is a gameplay systems prototype where players assemble ships using modules placed on an equilateral triangle grid. Loadout choices alter ship stats under constraints (CPU/Power/Weight), and combat is resolved through a deterministic virtual-second simulator. Each encounter produces a structured record that powers a battle summary and per-tick replay UI.

## Core Loop

1. A wave line (SiegeLine or PicketLine) is randomly assigned at the start.
2. Read the hint panel (top-left) and purchase/place modules (Armor / Shield / Laser / Missile) to counter the assigned line.
3. Resolve encounters via deterministic tick simulation (virtual seconds).
4. Review results via summary + per-tick replay; iterate your build in the shop.

## Systems Implemented

### 1) Equilateral Triangle Grid Placement

Implemented an irregular triangle-cell placement grid (equilateral triangles) for ship/module layout. Placement legality uses explicit edge adjacency rules + collision validation, enabling expressive non-rectangular layouts without relying on a fixed square-grid footprint system.

The grid architecture natively supports multi-cell module footprints and their rotations: a single equilateral triangle (small), a rhombus formed by two adjacent triangles (medium), and a hexagon formed by six triangles (large). Current modules only use the small footprint, but the system is already built to accommodate larger pieces — making it straightforward to introduce medium and large modules as future content without restructuring the grid logic.

Designed the system so the grid itself becomes a gameplay constraint: players must plan around geometry, not just numbers. The triangle grid exposes different adjacency patterns than square grids, making orientation and edge connections meaningful for placement decisions.

### 2) Modular Loadout + Stat Aggregation

Data-driven module definitions for Armor/Shield/Laser/Missile. Dynamic stat aggregation: HP, Shield, DPS, Weight, Agility (+ CPU/Power caps). Weight → Agility creates a core trade-off: heavier builds gain sustain but lose evasiveness, affecting hit efficiency.

### 3) Deterministic Tick-Based Combat Simulation

Combat resolves in virtual-second ticks (O(100) loop per encounter), not real-time physics. Models: tracking vs agility → hit chance; reload/cooldowns; shield→HP overflow. Deterministic resolution enables reproducible balancing and clear cause→effect analysis.

### 4) Battle Summary + Per-tick Replay UI

Battle summary shows duration, hit rates, damage dealt/taken, and HP/Shield changes. Detail replay provides a timeline slider that scrubs tick-by-tick events and state changes (HP/Shield bars + event text). Shop UI includes tooltip + stat-change preview, making build decisions readable before purchasing.

## Balancing & Tooling

**Two opposing wave lines for counterplay validation.** SiegeLine and PicketLine are randomly assigned at the start of each run, designed to test opposite diagonals of the four-build space (Armor/Shield × Laser/Missile). The player reads the hint panel in the top-left corner and adapts their build accordingly. The goal is not strict 55/45 parity — non-counter matchups remain winnable with a clear strategy path, while counters remain recognizable.

**Python scripts used in balancing workflow.** Script 1 parses legacy UE print logs into CSV for quick spreadsheet analysis (used during early balancing). Script 2 aggregates multiple simulation runs (by build/wave line) to compare outcomes and spot regressions faster than manual inspection. These scripts were used during iteration before the in-game replay UI replaced most manual log review.

## Key Design Decisions

**Chose deterministic simulation over real-time combat** to keep the loop reproducible, balanceable, and explainable.

**Turned internal logging into a player-facing replay feature**, bridging gameplay feedback and development tooling.

**Kept scope tight** to ship a complete, demo-ready loop suitable for portfolio and interviews.

## Next Steps

- Migrate the per-tick combat simulation from Blueprint to C++ for better performance, testability, and easier unit testing outside the engine.
- Design and validate medium (rhombus) and large (hexagon) module footprints — the grid system already supports them; the remaining work is content design and balance.
- Export a run report (JSON/CSV) from in-game records for automated regression checks.
- Add small "why you lost" hints derived from replay (accuracy vs agility, shield break timing, etc.).
- More curated wave lines without increasing system scope.
