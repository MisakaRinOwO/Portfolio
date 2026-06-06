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

<div class="media-placeholder" data-label="Placeholder — Replay GIF (Summary + Detail with timeline scrollbar, per-tick HP/Shield and player/enemy actions)"></div>

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

<div class="media-placeholder" data-label="Placeholder — Stat Preview UI / Build Comparison"></div>

### Tick-Based Combat Simulation

Combat resolves in a virtual-second tick loop (~100 iterations per encounter), divorced from real-time rendering.

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

<div class="media-placeholder" data-label="Placeholder — Sim-only evidence (tick state snapshot / hit-resolution walkthrough / shield-overflow example)"></div>

### Replay & Debugging UI

Each encounter generates a structured event record consumed by two UI layers.

- **Battle summary**: duration, hit rates, damage dealt/taken, outcome.
- **Detail replay**: timeline slider scrubs tick-by-tick current HP/Shield + event log.
- Once implemented, the replay UI became the primary balancing tool, replacing manual log inspection for day-to-day iteration.

<div class="media-placeholder" data-label="Placeholder — Replay GIF (tick slider + current HP/Shield + action log) and summary screenshot"></div>

---

## Balancing & Counterplay

### Four-Build Space

Player builds map to a 2×2 space defined by two axes:

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
<th>Armor<br><span class="th-sub">heavier · lower agility · higher HP<br>CPU 1 / Power 1</span></th>
<td>High HP, consistent DPS</td>
<td>High HP, burst damage</td>
</tr>
<tr>
<th>Shield<br><span class="th-sub">lighter · higher agility · regenerating buffer<br>CPU 25 / Power 25</span></th>
<td>Regenerating buffer, consistent DPS</td>
<td>Regenerating buffer, burst damage</td>
</tr>
</tbody>
</table>
</div>

Agility is derived from `thrust / weight`, so Shield modules serve a dual role: a regenerating damage buffer *and* a weight reduction that raises agility — making Shield builds naturally resistant to low-tracking weapons like Laser. Armor trades that agility for raw HP depth, making it vulnerable to high-tracking weapons regardless of weapon type. The cost of Shield's advantages is reflected in its resource footprint: each Shield module costs CPU 25 / Power 25, versus CPU 1 / Power 1 for Armor.

Counter relationships are intentionally recognizable, while non-counter build paths remain viable through adaptation and progression choices.

The following formulas define the balance framework — counter relationships are derived from how each stat interacts mathematically, not tuned by feel:

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20CounterAndBalanceApproach.png" aria-label="Open balance approach diagram in large view">
<img src="/images/projects/void-architect/VA-%20CounterAndBalanceApproach.png" alt="Balance approach: HitChance, Effective DPS, Effective Sustain formulas and winning condition" class="content-media" loading="lazy" />
</button>
<figcaption>Balance formulas: HitChance, Effective DPS, and Effective Sustain define counter relationships mathematically. The winning condition compares combined offensive and defensive totals per combatant.</figcaption>
</figure>

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20IndividualTraitCounterTable.png" aria-label="Open individual trait counter table in large view">
<img src="/images/projects/void-architect/VA-%20IndividualTraitCounterTable.png" alt="Individual module trait counter relationships — finest granularity of the counter system" class="content-media" loading="lazy" />
</button>
<figcaption>Individual trait counter table: each module trait mapped to its hard counter and soft counter — the finest granularity of the counter system.</figcaption>
</figure>

### Enemy Archetypes

Each archetype tests a different axis of the four-build space:

| Archetype | Threat Profile |
|---|---|
| Tank | High sustain, low agility — pressures prolonged damage efficiency |
| Brawler | Balanced sustain and pressure — tests attrition and build endurance |
| Skirmisher | High agility, low durability — punishes poor tracking efficiency |
| Sniper | High burst pressure — punishes low survivability and poor mitigation timing |

<div class="va-grid-carousel" data-va-carousel data-auto-ms="5000" aria-label="Enemy archetype counter diagrams">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous diagram"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>

<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20EnemyTraitsCounterTable.png" aria-label="Open enemy traits counter table in large view">
<img src="/images/projects/void-architect/VA-%20EnemyTraitsCounterTable.png" alt="Enemy archetype traits and counter relationships against player build types" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Enemy archetypes mapped to player build counters — each archetype tests a specific axis of the offensive/defensive space.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/void-architect/VA-%20CounterChartByPlaystyle.png" aria-label="Open 2x2 counter chart in large view">
<img src="/images/projects/void-architect/VA-%20CounterChartByPlaystyle.png" alt="2x2 quadrant diagram positioning all four enemy archetypes on offensive and defensive axes with counter arrows" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>2×2 positioning: X-axis (Burst/Tracking vs DPS), Y-axis (Agility vs Armor). Counter arrows show the intended read-and-adapt loop.</figcaption>
</figure>
</div>

<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next diagram"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>

<div class="va-grid-carousel-dots" role="tablist" aria-label="Enemy archetype diagram pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
</div>
</div>

### Wave Preset Design

**SiegeLine** — sustained pressure through extended engagements, pressuring shield-reliant builds:
- Wave 1: Tank ×1, Brawler ×1
- Wave 2: Brawler ×2
- Wave 3: Brawler ×2, Sniper ×1

**PicketLine** — high-agility enemies with laser weapons, punishing low-agility and low-sustained-DPS builds (Armor increases weight → reduces agility → higher enemy hit rate; Missile's high tracking and burst damage are effective against fast targets, but its slow reload means low sustained DPS — insufficient to finish high-agility enemies before taking too much cumulative damage):
- Wave 1: Skirmisher ×1, Tank ×2
- Wave 2: Tank ×2, Skirmisher ×4
- Wave 3: Tank ×1, Brawler ×1, Skirmisher ×3

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

---

## Iteration & Problem Solving

| Problem | Adjustment | Result |
|---|---|---|
| Module swap unintentionally reset current HP — invalidating progression pressure | Separated current HP tracking from stat recalculation logic | Reduced unintended HP resets during loadout updates; persistence model still requires further cleanup |
| Burst-damage builds made average DPS models unreliable | Replaced average estimate with per-tick shield-overflow tracking | Sim output matched expected combat arc |
| Shield-Missile builds dominated Armor-Laser in all matchups | Adjusted tracking/agility curves and shield regen timing | Non-counter matchups became winnable; counter matchups stayed readable |
| Manual log review was slow and error-prone during build comparison | Wrote aggregation script; later replaced with in-game replay UI | Balance iteration time reduced significantly |

---

## Tooling & Pipeline

**Script 1 — Log Parser (`parse_va_logs.py`):**
Parses raw UE Blueprint print logs into structured JSONL and CSV. Written before the in-game replay UI existed, when the only way to inspect outcomes was manual log review.

- Strips UE prefixes and extracts delimited simulation result blocks from stdout
- Captures per-encounter fields: wave preset event (started / finished / result), enemy archetype, loadout tag, combat time, winner, agility values, shots hit/fired, hit rate, damage split by shield vs HP, time-to-break-shield for both sides
- Handles a log typo where enemy damage was printed under a "Player Damage Dealt" key — detected by checking for a duplicate key within the same block
- Outputs JSONL (nested `wave_preset_event` + `simulation_result`) and a flat CSV for spreadsheet analysis

**Script 2 — Run Aggregator:**
Groups CSV output by `player_loadout_tag` × `wave_preset`, computing aggregate stats across multiple runs for side-by-side regression comparison. Used to validate counter relationships before the in-game replay UI existed.

**Replay-Driven Workflow:**
The replay UI consolidated inspection into a single in-engine tool, retiring both scripts from day-to-day use. Both are preserved as examples of tooling that evolved with the workflow rather than outliving its purpose.

---

## Key Design Decisions

- **Tick-driven over realtime** — discrete simulation steps made outcomes inspectable per tick, which directly enabled the replay system and regression-style balancing that this prototype depends on.
- **Explainability over spectacle** — every outcome is inspectable; the game teaches through replay, not tutorials.
- **Constrained scope** — no realtime projectile physics, no complex AI, no open-ended editor. Scope discipline kept the prototype focused and the codebase auditable.
- **Geometry as constraint** — the triangle grid makes placement decisions non-trivial without requiring complex rules.
- **Data-driven module architecture** — module definitions (stats, category, size, cost) live in UE Data Assets (`DA_S_LaserModule`, `DA_M_LaserModule`, etc.) under `Blueprint/ShipModule/DataAsset/`, separated from Blueprint logic via `Enum/` and `Struct/` layers. New module types can be added without touching simulation code.

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

