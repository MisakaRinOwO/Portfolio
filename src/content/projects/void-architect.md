---
title: "Void Architect — Modular Ship Combat Prototype (UE5)"
featured: true
tags: []
role: "Solo"
stack: "Unreal Engine 5, Blueprints, UMG, Python"
focus: "Gameplay Systems · Combat Simulation · Balance Iteration"
year: "2026"
summary: "A gameplay systems prototype featuring an equilateral-triangle placement grid for modular ship building, and a tick-driven combat simulation with per-tick replay UI — designed for explainable outcomes and reproducible balance iteration."
highlights:
  - "Built an equilateral-triangle grid placement system with adjacency/edge rules and collision validation to support irregular ship layouts (more expressive than square grids)."
  - "Implemented a module-driven loadout & stat aggregation pipeline (HP/Shield/DPS/Weight/Agility + CPU/Power constraints), making trade-offs immediately visible in the shop UI."
  - "Resolved combat using a virtual-second tick-driven simulation loop (tracking vs agility, reload/cooldowns, shield→HP overflow), structured for reproducible balancing and traceable outcomes."
  - "Added battle summary + per-tick replay (timeline slider + event log + HP/Shield curves) so players and developers can inspect why an outcome happened."
  - "Wrote two Python scripts used during balancing: one parses legacy UE print logs into CSV for analysis; another aggregates multiple runs for quick regression-style comparisons."
  - "Validated counterplay using two opposing wave presets (SiegeLine / PicketLine) randomly assigned each run, mapped to the four-build space (Armor/Shield × Laser/Missile)."
coverImage: "/images/projects/void-architect/VA-Thumbnail2.png"
demoVideo: "https://www.youtube.com/embed/67x-hivfs2Y"
demoVideoFallback: "/images/projects/void-architect/VoidArchitect_Demo_Release.mp4"

screenshots: []
links:
  video: "https://youtu.be/67x-hivfs2Y"
  demo: "https://drive.google.com/file/d/11oll_UAQ71cBDiUCH8mEpKpCXvlhJABr/view?usp=sharing"
  github: ""
order: 1
keyFeatures:
  - "Triangular Grid Placement"
  - "Tick Simulation"
  - "Replay System & UI"
  - "Balance & Tooling"
focusCards:
  - title: "Tick-Driven Combat Sim"
    description: "Structured virtual-second simulation loop making combat outcomes analyzable and balance iteration reproducible at scale."
  - title: "Spatial Ship Building"
    description: "Equilateral-triangle placement grid enabling non-orthogonal layouts and adjacency-driven constraints."
  - title: "Build Trade-offs"
    description: "CPU, power, weight, agility, and sustain interact to create distinct build paths with real consequences."
  - title: "Explainable Combat Outcomes"
    description: "Per-tick replay UI visualizes combat events, HP/shield changes, and why encounters played out the way they did."
  - title: "Counterplay Validation"
    description: "Four-build player space and opposing wave presets test matchup pressure and adaptation without creating strictly unwinnable routes."
  - title: "Balance Tooling"
    description: "Python-assisted log parsing and simulation aggregation accelerated iteration and regression testing."
---

## Gameplay Loop

Each run follows four steps:

**1 — Read Encounter Pressure**
A wave preset (SiegeLine or PicketLine) is randomly assigned. The hint panel (top-left) shows which build path is safer against the incoming composition.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/GameplayLoop-1.gif" aria-label="Open wave assignment gif in large view">
<img src="/images/projects/void-architect/GameplayLoop-1.gif" alt="Gameplay loop step 1: wave assignment and hint panel" class="content-media" loading="lazy" />
</button>
<figcaption>Wave assignment: the hint panel (top-left) shows the safer build path against the incoming wave preset.</figcaption>
</figure>

**2 — Build Under Constraints**
Purchase and place modules (Armor / Shield / Laser / Missile) on the triangle grid, within CPU, power, and weight limits. Live stat deltas show trade-offs before committing. Players can also right-click a placed module to sell it with no loss.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/GameplayLoop-2.gif" aria-label="Open build phase gif in large view">
<img src="/images/projects/void-architect/GameplayLoop-2.gif" alt="Gameplay loop step 2: ship building with module placement and live stat preview" class="content-media" loading="lazy" />
</button>
<figcaption>Build phase: module placement on the triangle grid with live stat delta preview on hover before committing.</figcaption>
</figure>

**3 — Next Wave**
Click **Next Wave** to resolve combat with the current build.

**4 — Analyze & Adapt**
After the fight, players can open replay and inspect per-tick HP/Shield + player/enemy actions in **Detail** (timeline scrollbar), or press **Continue** to return to shop for the next build iteration.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20ReplayUI.gif" aria-label="Open gameplay loop replay gif in large view">
<img src="/images/projects/void-architect/VA-%20ReplayUI.gif" alt="Gameplay loop step 4: replay UI used for post-fight analysis and next-wave planning" class="content-media" loading="lazy" />
</button>
<figcaption>Analyze & Adapt: replay summary and detail timeline are used as post-fight decision support before the next shop step.</figcaption>
</figure>

---

## Design Goals

Why each system was designed this way:

**Why a Tick-Driven Simulation?**
Real-time physics would make outcomes difficult to inspect and slow to balance. A virtual-second tick loop structures combat state updates into discrete, traceable steps — making outcomes analyzable, balance iteration reproducible, and bugs easier to isolate.

**Why Triangle Grids?**
Square grids make all layouts feel equivalent. An equilateral-triangle grid forces orientation decisions and adjacency constraints, turning geometry itself into a gameplay challenge.

**Why HP Persistence + Shield Reset?**
HP carries between encounters within a wave, creating pressure to avoid damage. Shields reset between waves, giving players a meaningful resource refresh without eliminating cumulative consequence.

**Why Replay UI?**
Logs are developer tools — replays are player feedback. Building a visual replay out of the same event record served both purposes without duplicating infrastructure.

Across all four choices, the underlying intent is the same: make every outcome readable enough that players can adapt based on what they observe, not just guess.

---

## Key Design Decisions

These are the core trade-offs that shaped the prototype's scope and implementation:

- **Tick-driven over realtime** — discrete simulation steps made outcomes inspectable per tick, which directly enabled the replay system and regression-style balancing that this prototype depends on.
- **Explainability over spectacle** — every outcome is inspectable; the game teaches through replay, not tutorials.
- **Constrained scope** — no realtime projectile physics, no complex AI, no open-ended editor. Scope discipline kept the prototype focused and the codebase auditable.
- **Geometry as constraint** — the triangle grid makes placement decisions non-trivial without requiring complex rules.
- **Data-driven module architecture** — module definitions (stats, category, size, cost) live in UE Data Assets (`DA_S_LaserModule`, `DA_M_LaserModule`, etc.) under `Blueprint/ShipModule/DataAsset/`, separated from Blueprint logic via `Enum/` and `Struct/` layers. New module types can be added without touching simulation code.

---

## Core Systems

### Equilateral Triangle Grid Placement

Placement legality is enforced through explicit edge-adjacency rules and collision validation on an equilateral-triangle cell grid.

- Cells exist in two orientations (up/down), requiring directional adjacency checks beyond simple row/column logic.
- Three footprint sizes supported architecturally: small (1 triangle), medium (rhombus, 2), large (hexagon, 6). Current content uses small only.
- Orientation and edge connectivity surface as player constraints — geometry is the design space.

<div class="va-grid-carousel" data-va-carousel data-auto-ms="5000" aria-label="Grid placement system gallery">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous grid image"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>

<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20GridSystemCoordinate.png" aria-label="Open coordinate setup image in large view">
<img src="/images/projects/void-architect/VA-%20GridSystemCoordinate.png" alt="Grid coordinate setup: inventory coordinate, array coordinate, and internal layout mapping" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Coordinate model: inventory-space mapping, array indexing, and internal module layout mapping.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20GridSystemCollider.png" aria-label="Open collider setup image in large view">
<img src="/images/projects/void-architect/VA-%20GridSystemCollider.png" alt="Grid collider setup: grid center and hexagon anchor overlap constraints" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Collider anchors: grid-center and hex-anchor constraints prevent ambiguous overlap and enforce legal placement tests.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20GridSystemPlacement.png" aria-label="Open placement flow image in large view">
<img src="/images/projects/void-architect/VA-%20GridSystemPlacement.png" alt="Simplified placement collision flow for triangle, diamond, and hexagon module checks" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Placement flow: collision result + orientation-aware neighbor checks determine placeable vs blocked states.</figcaption>
</figure>
</div>

<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next grid image"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>

<div class="va-grid-carousel-dots" role="tablist" aria-label="Grid image pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="2" aria-label="Show image 3" aria-current="false"></button>
</div>
</div>

### Modular Loadout & Stat Aggregation

Data-driven module definitions drive a stat pipeline aggregating placed modules into a single ship profile.

- Stats: HP, Shield, DPS, Weight, Agility — CPU and Power as hard caps.
- Weight → Agility is the central trade-off: heavier ships absorb more but are easier to hit.
- Shop UI shows live stat deltas on hover before committing.

<div class="va-grid-carousel" data-va-carousel data-auto-ms="5000" aria-label="Stat preview UI gallery">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous stat preview"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>

<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20StatPreview1.png" aria-label="Open stat preview panel image in large view">
<img src="/images/projects/void-architect/VA-%20StatPreview1.png" alt="Shop module description panel with hovered module details and projected stat impact" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Shop module description panel: hovered module details and projected impact.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20StatPreview2.png" aria-label="Open build comparison image in large view">
<img src="/images/projects/void-architect/VA-%20StatPreview2.png" alt="Shop left-panel ship stat preview updating while hovering module choices" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Shop ship stat preview: current ship stats update on hover.</figcaption>
</figure>
</div>

<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next stat preview"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>

<div class="va-grid-carousel-dots" role="tablist" aria-label="Stat preview pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
</div>
</div>

### Tick-Based Combat Simulation

Combat resolves in a virtual-second tick loop (~100 iterations per encounter), divorced from real-time rendering. Each enemy encounter is handled by `BP_PrototypeSimulator`, which owns the tick loop for a single enemy pairing. `BP_GameplayManager` sequences these by iterating through the enemy list and calling each `BP_PrototypeSimulator` in order, carrying HP state forward across encounters within a wave.

- Hit resolution: tracking value vs. agility → hit probability per tick.
- Damage routing: shield absorbs first; overflow damages HP directly.
- Cooldown and reload tracked as integer counters — no floating-point state.
- The tick-driven architecture makes combat state traceable per step, supporting reproducible balancing and replay reconstruction.

**Wave Preset structure:**
Each wave preset is a sequence of waves; each wave is a sequence of individual enemy encounters resolved one at a time.

- HP persists across all encounters for the entire preset — cumulative pressure carries through every wave.
- Shield resets between waves (not between encounters), giving a measured recovery window without eliminating HP attrition.
- Encounters within a wave resolve sequentially — the next enemy appears only after the previous one is defeated.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/SimulationPipeline.svg" aria-label="Open simulation pipeline diagram in large view">
<img src="/images/projects/void-architect/SimulationPipeline.svg" alt="Simulation pipeline: tick start, player damage check, enemy damage check, then end when player HP is zero or all enemies are defeated" class="content-media" loading="lazy" />
</button>
<figcaption>Simulation pipeline: each virtual-second tick checks player and enemy damage in order, terminating when player HP reaches zero or all enemies are defeated.</figcaption>
</figure>

<div class="va-grid-carousel" data-va-carousel data-auto-ms="5000" aria-label="Simulation log evidence gallery">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous simulation log"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>

<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20CombatSummaryLogEngine.png" aria-label="Open simulation summary log image in large view">
<img src="/images/projects/void-architect/VA-%20CombatSummaryLogEngine.png" alt="Engine output log block showing structured simulation summary fields such as loadout, winner, hitchance, and damage split" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Simulation summary log: structured output fields (loadout, winner, hitchance, damage split) used for encounter-level verification.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20CombatTickLogEngine.png" aria-label="Open simulation tick log image in large view">
<img src="/images/projects/void-architect/VA-%20CombatTickLogEngine.png" alt="Engine output log showing per-second combat tick events, shield-break moments, and weapon reload timing during an encounter" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Simulation tick log: per-second combat events, including shield-break ticks, used to trace damage routing and encounter behavior step by step.</figcaption>
</figure>
</div>

<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next simulation log"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>

<div class="va-grid-carousel-dots" role="tablist" aria-label="Simulation log pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
</div>
</div>

These engine logs are the primary evidence for shield-break timing; the replay GIF below is included mainly to present the in-game replay interface.

### Replay & Debugging UI

Each encounter generates a structured event record consumed by two UI layers.

- **Battle summary**: duration, hit rates, damage dealt/taken, outcome.
- **Detail replay**: timeline slider scrubs tick-by-tick current HP/Shield + event log.
- Once implemented, the replay UI became the primary balancing tool, replacing manual log inspection for day-to-day iteration.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20ReplayUI.gif" aria-label="Open replay UI gif in large view">
<img src="/images/projects/void-architect/VA-%20ReplayUI.gif" alt="Replay UI showing summary metrics and detail timeline with per-tick HP/Shield and action log" class="content-media" loading="lazy" />
</button>
<figcaption>Replay UI: summary metrics and detail timeline for per-tick HP/Shield and action-log inspection.</figcaption>
</figure>

---

## Balancing & Counterplay

### Core Balance Attributes

The balancing pipeline is driven by six core attributes:

- **CPU / Power**: hard budget limits for module selection; Shield convenience is paid through higher cost (CPU 25 / Power 25), while Armor remains cheap (CPU 1 / Power 1).
- **Weight**: main mobility penalty source.
- **Agility**: derived from `thrust / weight`.
- **DPS**: sustained damage output over time, derived from `damage / reload time`.
- **Tracking**: hit reliability against agile targets.
- **Hit Chance**: calculated by `tracking / target agility`.

### Four Modules

| Module | Benefit | Trade-off | Character |
|---|---|---|---|
| Small Laser Module | High sustained DPS | Lower tracking and low single-shot damage | Pressure low-agility targets over time |
| Small Missile Module | High tracking and high burst damage | Long reload (lower sustained DPS) | Picks fast / fragile targets reliably |
| Small Shield Module | Lightweight + regenerating buffer | Higher CPU and Power cost | Mobility sustain module (agility + recovery) |
| Small Armor Module | Large HP bonus + low CPU and Power cost | Heavy (reduces agility) | Attrition anchor: absorbs pressure, accepts mobility loss |

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20IndividualTraitCounterTable.png" aria-label="Open individual trait counter table in large view">
<img src="/images/projects/void-architect/VA-%20IndividualTraitCounterTable.png" alt="Individual module trait counter relationships — finest granularity of the counter system" class="content-media" loading="lazy" />
</button>
<figcaption>Individual trait counter table: module-level relationships at the finest balancing granularity.</figcaption>
</figure>

### Four Build Space

This is the middle granularity between module traits and enemy archetypes.
As modules stack, player loadouts tend toward one of four corners, but they are not hard classes because players can purchase one new module between waves.
In practice, progression creates tendencies while still allowing hybrid paths (for example: Shield + Laser + Missile).

Player builds map to a 2×2 space defined by defense choice (Armor / Shield) and weapon choice (Laser / Missile):

<div class="build-matrix">
<table>
<thead>
<tr>
<th></th>
<th>Laser<br><span class="th-sub">consistent DPS, lower tracking</span></th>
<th>Missile<br><span class="th-sub">high tracking, burst damage, slow reload</span></th>
</tr>
</thead>
<tbody>
<tr>
<th>Armor<br><span class="th-sub">heavier · lower agility · higher HP</span></th>
<td>High HP, consistent DPS</td>
<td>High HP, burst damage</td>
</tr>
<tr>
<th>Shield<br><span class="th-sub">lighter · higher agility · regenerating buffer</span></th>
<td>Regenerating buffer, consistent DPS</td>
<td>Regenerating buffer, burst damage</td>
</tr>
</tbody>
</table>
</div>

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20CounterChartByPlaystyle.png" aria-label="Open build-space counter chart in large view">
<img src="/images/projects/void-architect/VA-%20CounterChartByPlaystyle.png" alt="2x2 quadrant diagram positioning build-space patterns across offense and defense axes" class="content-media" loading="lazy" />
</button>
<figcaption>Build-space counter chart: the four corners describe the player's loadout tendencies, while the boundary cases explain where hybrid builds sit.</figcaption>
</figure>

Build-space differences are therefore the aggregate result of module traits and budget constraints, not fixed classes.

### Four Enemy Archetypes

Combinations of two modules produce four enemy archetypes, each acting as a pressure profile against one side of the four-build space:

| Archetype | Traits | Threat Profile |
|---|---|---|
| Tank | High sustain, low agility, high DPS | Pressure profile that rewards HP efficiency and exposes mobility loss |
| Brawler | High burst, low agility, high raw HP | Pressure profile that tests burst response against heavy contact damage |
| Skirmisher | High agility, low durability | Pressure profile that punishes poor tracking and slow rotation |
| Sniper | High burst, high agility | Pressure profile that checks burst resistance and tracking response |

These pressure profiles are quantified through the balance formulas and validation loop documented in the method section below.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20EnemyTraitsCounterTable.png" aria-label="Open enemy traits counter table in large view">
<img src="/images/projects/void-architect/VA-%20EnemyTraitsCounterTable.png" alt="Enemy archetype traits and counter relationships against player build types" class="content-media" loading="lazy" />
</button>
<figcaption>Enemy archetypes mapped to player build counters — each archetype represents a distinct pressure profile in the offensive/defensive space.</figcaption>
</figure>

### Wave Preset Design

Wave presets combine these archetypes into sequence-based pressure tests for loadout counter validation.

**SiegeLine** — pressure through high raw HP and burst damage, pressuring low DPS and low survivability builds:
- Wave 1: Tank ×1, Brawler ×1
- Wave 2: Brawler ×2
- Wave 3: Brawler ×2, Sniper ×1 — Sniper added to pressure low-survivability builds in the final wave.

**PicketLine** — pressure through high DPS and agility, pressuring low agility and low tracking builds:
- Wave 1: Skirmisher ×1, Tank ×2
- Wave 2: Tank ×2, Skirmisher ×4
- Wave 3: Tank ×1, Brawler ×1, Skirmisher ×3 — Brawler added to pressure low-survivability builds in the final wave.

Counter relationships validated through repeated simulation runs across both wave presets:
- **Absolute counter (>90% win rate)** — the counter build's stat advantage is decisive
- **Countered (~10% win rate)** — Laser matchups retain some variance from hitchance; Missile matchups are harder (~0%) because near-100% hit rate removes the agility advantage entirely
- **Matched (~60% win rate)** — non-counter paths remain viable through adaptation

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20WavePresetTraitsAndCounterByPlayerStyle.png" aria-label="Open wave preset counter map in large view">
<img src="/images/projects/void-architect/VA-%20WavePresetTraitsAndCounterByPlayerStyle.png" alt="Wave preset compositions mapped to player style counters and trait relationships" class="content-media" loading="lazy" />
</button>
<figcaption>Wave preset counter mapping: SiegeLine and PicketLine each favour a specific player style, validated against the four-build space.</figcaption>
</figure>

### Balance Method & Validation Process

Balancing followed a fixed loop: script output -> CSV / JSONL export -> Excel analysis -> archetype adjustment -> wave preset re-test.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20CounterAndBalanceApproach.png" aria-label="Open balance approach diagram in large view">
<img src="/images/projects/void-architect/VA-%20CounterAndBalanceApproach.png" alt="Balance approach: player build-space attributes versus enemy pressure model" class="content-media" loading="lazy" />
</button>
<figcaption>Balance formulas: player build-space attributes mapped against enemy pressure profiles through HitChance, Effective DPS, and Effective Sustain.</figcaption>
</figure>

At the attribute level, formulas measure player build traits against enemy pressure profiles. At the progression level, wave presets verify whether those relationships hold across chained matchups.

In practice, player and enemy archetype sheets compared hit chance, sustain, and burst pressure across runs. When a matchup looked too strong or too weak, script output was re-checked against those sheets. This kept balancing tied to measurable outcomes instead of manual feel.

TTK was read at two levels: per-encounter duel TTK and per-wave cumulative survival pressure. The observed 2-4x inversion between enemy-vs-player and player-vs-enemy TTK was identified through repeated wave-preset runs and is expected, because players fight multiple enemies in sequence within a wave, so cumulative pressure is not symmetric to a single duel.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20TTKanalysis.png" aria-label="Open TTK analysis sheet in large view">
<img src="/images/projects/void-architect/VA-%20TTKanalysis.png" alt="Excel TTK analysis comparing player archetypes versus enemy archetypes across repeated simulation runs" class="content-media" loading="lazy" />
</button>
<figcaption>Excel TTK analysis snapshot: duel-level matchup TTK and wave-level survivability were checked together; 2-4x TTK asymmetry reflects multi-enemy encounter sequencing, not a formula contradiction.</figcaption>
</figure>

Enemy archetypes were not tuned for perfect intra-quadrant symmetry. The priority was clear quadrant separation and readable counter-pressure against player build space, so enemy-vs-player balance took precedence over archetype-to-archetype symmetry.

The key tuning outcomes from this loop are summarized in the iteration table below.

---

## Iteration & Problem Solving

| Type | Problem | Adjustment | Result |
|---|---|---|---|
| System Correctness | Module swap reset current HP and invalidated progression pressure | Separated current HP tracking from stat recalculation logic | Unintended HP resets dropped during loadout updates; persistence still needs cleanup |
| Gameplay Loop | Wave-level outcomes did not align with duel-level expectations in early reads | Split validation into duel TTK and cumulative wave pressure, then verified via repeated wave-preset runs | Counter expectations aligned better with real wave outcomes |
| Balance Model | Burst-damage builds made average-DPS reads unstable | Kept the average DPS model and iterated values through repeated simulation tests until trends converged | Burst matchups produced stable, repeatable balance signals |
| Balance Tuning | Shield-Missile stayed too strong in key wave matchups | Nerfed Sniper values and increased PicketLine enemy count while preserving a winnable Brawler route | Shield-Missile stopped being the safest default while alternate winning paths stayed viable |
| Workflow / Tooling | Manual log review was slow and error-prone for build comparisons | Built an aggregation script, exported CSV / JSONL, and compared results in Excel before switching to replay UI | Iteration speed improved and matchup tuning became repeatable |

The tooling that generated these datasets is documented below.

---

## Tooling & Pipeline

**Script 1 — Log Parser (`parse_va_logs.py`):**
Parses raw UE Blueprint print logs into structured JSONL and CSV. It was written before the in-game replay UI, when manual log review was the only inspection path.

- Strips UE prefixes and extracts delimited simulation result blocks from stdout
- Captures per-encounter fields: wave preset event (started / finished / result), enemy archetype, loadout tag, combat time, winner, agility values, shots hit/fired, hit rate, damage split by shield vs HP, time-to-break-shield for both sides
- Handles a log typo where enemy damage was printed under a "Player Damage Dealt" key — detected by checking for a duplicate key within the same block
- Outputs JSONL (nested `wave_preset_event` + `simulation_result`) and a flat CSV for spreadsheet analysis

**Script 2 — Run Aggregator:**
Groups CSV output by `player_loadout_tag` × `wave_preset` and computes aggregate stats across runs for side-by-side regression checks. It was used to validate counter relationships before the in-game replay UI.

**Replay-Driven Workflow:**
The replay UI consolidated inspection into a single in-engine tool and retired both scripts from day-to-day use. Both scripts are preserved as examples of tooling that evolved with the workflow.

Source code is managed in Diversion rather than GitHub; the repository is not publicly linked here.

---

## Scope & Intentional Cuts

Several systems were designed and documented but excluded from this prototype to keep scope focused and the implementation verifiable. They are included here as a record of design intent and a clear expansion path.

### Sub-Module System (designed, not implemented)

A planned internal customisation layer for weapon modules. Rather than preset tiers, players would arrange sub-components (e.g. crystal, lens, amplifier for Laser; warhead, propulsion, depot for Missile) inside a module's triangle footprint to alter its stats and behaviour. This reflects the design principle of *letting players discover how to play, rather than being told* — emergent builds arise from composition rather than selection.

Cut to keep the prototype focused on the core placement and simulation loop.

<div class="va-grid-carousel" data-va-carousel data-auto-ms="5000" aria-label="Sub-module system design diagrams (designed, not implemented)">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous diagram"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>

<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20CutFeatureLaserInternal.png" aria-label="Open laser sub-module breakdown in large view">
<img src="/images/projects/void-architect/VA-%20CutFeatureLaserInternal.png" alt="Laser module internal sub-component breakdown: Standard, Experimental, and Advanced grade customisation paths" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Laser module: sub-component layout (Crystal, Output, Amp Lens) progressing from Standard → Experimental → Advanced grade. Designed, not implemented.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20CutFeatureMissileInternal.png" aria-label="Open missile sub-module breakdown in large view">
<img src="/images/projects/void-architect/VA-%20CutFeatureMissileInternal.png" alt="Missile module internal sub-component breakdown: Warhead, Propulsion, and Enhancement slot customisation" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Missile module: sub-component slots (Warhead, Propulsion, Depot, Enhancements) with specialisation unlock paths. Designed, not implemented.</figcaption>
</figure>
</div>

<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next diagram"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>

<div class="va-grid-carousel-dots" role="tablist" aria-label="Sub-module diagram pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
</div>
</div>

### Tech Tree / Discoverable Content (designed, not implemented)

A planned progressive unlock system gating module access behind stat thresholds and specialisation milestones — rewarding players who invest deeply in a build direction with access to higher-tier modules and enhancements.

Cut alongside the sub-module system; meaningful unlocks depend on the sub-module layer being in place first.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20CutFeatureTechTree.png" aria-label="Open tech tree design in large view">
<img src="/images/projects/void-architect/VA-%20CutFeatureTechTree.png" alt="Tech tree design: module unlock progression from base weapon and logistic modules through to large ship cores" class="content-media" loading="lazy" />
</button>
<figcaption>Tech tree design: progressive unlock path from base weapon and logistic modules through to large ship cores, gated by stat thresholds and specialisation milestones. Designed, not implemented.</figcaption>
</figure>

### Partially Implemented Stats

**CPU and Power** are implemented in the stat aggregation pipeline and enforced as hard caps in the shop UI, but current module costs are low enough that they do not constrain builds in this prototype. They serve as a designed constraint ready to be tightened as module variety expands.

**Range and Projectile Speed** are defined in module Data Assets (`DA_S_LaserModule`, `DA_M_LaserModule`, etc. under `Blueprint/ShipModule/DataAsset/`) but are not yet consumed by the simulation loop. The data layer is in place; connecting it to hit resolution is a targeted future step.

---

## Future Improvements

- **Connect Range and Projectile Speed to hit resolution** — both fields are already defined in module Data Assets (`DA_S_LaserModule`, etc.) and aggregated into the ship profile; the remaining step is consuming them in the per-tick hit formula to introduce positional and projectile-travel factors.
- **Tighten CPU and Power constraints** — the stat pipeline already enforces hard caps; tuning module costs upward as content expands would make build trade-offs more constrained without any architectural changes.
- **Add medium and large module footprints** — the triangle grid already supports rhombus (2 cells) and hexagon (6 cells) footprints at the placement system level; the next step is authoring Data Assets and validating adjacency rules for those sizes.
- **Migrate per-tick combat sim from Blueprint to C++** — would enable unit testing outside the engine and expose the sim as a standalone tool for batch balance runs.
- **Export structured run reports from in-game replay** — the replay event record already contains all per-tick state; serialising it to JSON/CSV from within the engine would replace the Python log parser entirely and support automated regression checks.

