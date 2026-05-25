---
title: "Void Architect — Modular Ship Combat Prototype (UE5)"
featured: true
tags: []
role: "Solo"
stack: "Unreal Engine 5, Blueprints, UMG, Python"
focus: "Gameplay Systems · Combat Simulation · Balance Iteration"
year: "2026"
summary: "A gameplay systems prototype featuring an equilateral-triangle placement grid for modular ship building, and deterministic tick-based combat with a per-tick replay UI — designed for explainable outcomes and fast balance iteration."
highlights:
  - "Built an equilateral-triangle grid placement system with adjacency/edge rules and collision validation to support irregular ship layouts (more expressive than square grids)."
  - "Implemented a module-driven loadout & stat aggregation pipeline (HP/Shield/DPS/Weight/Agility + CPU/Power constraints), making trade-offs immediately visible in the shop UI."
  - "Resolved combat using a virtual-second deterministic simulation loop (tracking vs agility, reload/cooldowns, shield→HP overflow), optimized for repeatability and balancing."
  - "Added battle summary + per-tick replay (timeline slider + event log + HP/Shield curves) so players and developers can inspect why an outcome happened."
  - "Wrote two Python scripts used during balancing: one parses legacy UE print logs into CSV for analysis; another aggregates multiple runs for quick regression-style comparisons."
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
  - "Balance Tooling"
  - "Deterministic Outcomes"
focusCards:
  - title: "Deterministic Combat"
    description: "Virtual-second combat simulation designed for reproducible balancing and explainable outcomes."
  - title: "Spatial Ship Building"
    description: "Equilateral-triangle placement grid enabling non-orthogonal layouts and adjacency-driven constraints."
  - title: "Build Trade-offs"
    description: "CPU, power, weight, agility, and sustain interact to create distinct build paths with real consequences."
  - title: "Replayable Outcomes"
    description: "Per-tick replay UI visualizes combat events, HP/shield changes, and why encounters were won or lost."
  - title: "Counterplay Validation"
    description: "Four-build player space and opposing wave lines test matchup pressure and adaptation."
  - title: "Balance Tooling"
    description: "Python-assisted log parsing and simulation aggregation accelerated iteration and regression testing."
---

## Gameplay Loop

Each run follows four steps:

**1 — Read Encounter Pressure**
A wave line (SiegeLine or PicketLine) is randomly assigned. The hint panel (top-left) shows which build path is safer against the incoming composition.

<div class="media-placeholder" data-label="Placeholder — Hint Panel / Wave Assignment UI"></div>

**2 — Build Under Constraints**
Purchase and place modules (Armor / Shield / Laser / Missile) on the triangle grid, within CPU, power, and weight limits. Live stat deltas show trade-offs before committing.

<div class="media-placeholder" data-label="Placeholder — Ship Building GIF / Stat Preview UI"></div>

**3 — Resolve Deterministic Combat**
Combat resolves via deterministic virtual-second simulation — tracking vs. agility, reload/cooldown counters, shield → HP overflow. Same inputs always produce the same output.

<div class="media-placeholder" data-label="Placeholder — Combat Replay / Simulation Events"></div>

**4 — Analyze & Adapt**
Replay UI explains why the encounter succeeded or failed. HP/Shield curves, event log, and timeline slider allow fast build iteration.

<div class="media-placeholder" data-label="Placeholder — Replay Timeline Slider / HP-Shield Chart"></div>

---

## Design Goals

Why each system was designed this way:

**Why Deterministic Simulation?**
Real-time physics would make outcomes non-reproducible. A virtual-second tick loop ensures identical inputs always produce identical results — balancing fast, bugs traceable, outcomes explainable.

**Why Triangle Grids?**
Square grids make all layouts feel equivalent. An equilateral-triangle grid forces orientation decisions and adjacency constraints, turning geometry itself into a gameplay challenge.

**Why HP Persistence + Shield Reset?**
HP carries between encounters within a wave, creating pressure to avoid damage. Shields reset between waves, giving players a meaningful resource refresh without eliminating cumulative consequence.

**Why Replay UI?**
Logs are developer tools — replays are player feedback. Building a visual replay out of the same event record served both purposes without duplicating infrastructure.

---

## Core Systems

### Equilateral Triangle Grid Placement

Placement legality is enforced through explicit edge-adjacency rules and collision validation on an equilateral-triangle cell grid.

- Cells exist in two orientations (up/down), requiring directional adjacency checks beyond simple row/column logic.
- Three footprint sizes supported architecturally: small (1 triangle), medium (rhombus, 2), large (hexagon, 6). Current content uses small only.
- Orientation and edge connectivity surface as player constraints — geometry is the design space.

<div class="media-placeholder" data-label="Placeholder — Grid Overlay / Placement GIF / Rotation Examples"></div>

### Modular Loadout & Stat Aggregation

Data-driven module definitions drive a stat pipeline aggregating placed modules into a single ship profile.

- Stats: HP, Shield, DPS, Weight, Agility — CPU and Power as hard caps.
- Weight → Agility is the central trade-off: heavier ships absorb more but are easier to hit.
- Shop UI shows live stat deltas on hover before committing.

<div class="media-placeholder" data-label="Placeholder — Stat Preview UI / Build Comparison"></div>

### Deterministic Combat Simulation

Combat resolves in a virtual-second tick loop (~100 iterations per encounter), divorced from real-time rendering.

- Hit resolution: tracking value vs. agility → hit probability per tick.
- Damage routing: shield absorbs first; overflow damages HP directly.
- Cooldown and reload tracked as integer counters — no floating-point state.
- Identical inputs always produce identical outputs, enabling reproducible regression testing.

<div class="media-placeholder" data-label="Placeholder — Replay Timeline / Combat Log / Hit-Chance Example"></div>

### Replay & Debugging UI

Each encounter generates a structured event record consumed by two UI layers.

- **Battle summary**: duration, hit rates, damage dealt/taken, outcome.
- **Detail replay**: timeline slider scrubs tick-by-tick HP/Shield bars + event log.
- Once built, the replay UI replaced most manual log review — the same record that explains outcomes to the player also speeds up debugging.

<div class="media-placeholder" data-label="Placeholder — Replay GIF / Event Log / HP-Shield Curve"></div>

---

## Balancing & Counterplay

### Four-Build Space

Player builds map to a 2×2 space defined by two axes:

| | **Laser** | **Missile** |
|---|---|---|
| **Armor** | High sustain, consistent DPS | High sustain, burst damage |
| **Shield** | Fast regen, consistent DPS | Fast regen, burst damage |

Counter matchups are recognizable. Non-counter builds remain winnable with correct play.

### Enemy Archetypes

Each archetype tests a different axis of the four-build space:

| Archetype | Threat Profile |
|---|---|
| Tank | High HP, low agility — rewards consistent DPS builds |
| Brawler | Balanced HP/Shield — forces sustain vs. burst decisions |
| Skirmisher | High agility, low HP — punishes low-tracking builds |
| Sniper | High burst damage — rewards shield investment |

<div class="media-placeholder" data-label="Placeholder — Archetype Cards / Diagram"></div>

### Wave-Line Design

- **SiegeLine**: sustained pressure, favors armor/missile builds.
- **PicketLine**: evasive pressure, favors shield/laser builds.
- HP persists across encounters within a wave. Shields reset between waves, giving measured recovery without eliminating cumulative consequence.
- Non-counter builds remain viable — validated through TTK analysis and repeated simulation runs.

<div class="media-placeholder" data-label="Placeholder — Wave Composition Diagram / Matchup Matrix"></div>

---

## Iteration & Problem Solving

| Problem | Adjustment | Result |
|---|---|---|
| Module swap unintentionally reset current HP — invalidating progression pressure | Separated current HP tracking from stat recalculation logic | HP persistence worked correctly without coupling to loadout state |
| Burst-damage builds made average DPS models unreliable | Replaced average estimate with per-tick shield-overflow tracking | Sim output matched expected combat arc |
| Shield-Missile builds dominated Armor-Laser in all matchups | Adjusted tracking/agility curves and shield regen timing | Non-counter matchups became winnable; counter matchups stayed readable |
| Manual log review was slow and error-prone during build comparison | Wrote aggregation script; later replaced with in-game replay UI | Balance iteration time reduced significantly |

---

## Tooling & Pipeline

**Python Scripts (two, written during development):**

- Script 1 parses legacy UE print logs → CSV for spreadsheet/TTK analysis. Written before the in-game replay UI existed.
- Script 2 aggregates multiple simulation runs by build + wave line, enabling side-by-side regression comparison.
- Both scripts are retired — included as examples of tooling that evolved with the workflow rather than outliving its purpose.

**Replay-Driven Workflow:**
Once built, the in-game replay UI replaced most manual log inspection. The structured event record powers both player feedback and developer debugging from a single source.

---

## Key Design Decisions

- **Deterministic over realtime** — reproducibility and balanceability outweighed visual spectacle.
- **Explainability over spectacle** — every outcome is inspectable; the game teaches through replay, not tutorials.
- **Constrained scope** — no realtime projectile physics, no complex AI, no open-ended editor. Scope discipline kept the prototype focused and the codebase auditable.
- **Geometry as constraint** — the triangle grid makes placement decisions non-trivial without requiring complex rules.

---

## Future Improvements

- Migrate per-tick combat sim from Blueprint to C++ for unit testability outside the engine.
- Export structured run reports (JSON/CSV) from in-game replay records for automated regression checks.
- Design and validate medium (rhombus) and large (hexagon) module footprints — grid system already supports them.

