---
title: "Grid Systems Experiment — UE5 C++ Gameplay System Prototypes"
featured: false
draft: false
tags: ["UE5", "C++", "Pathfinding", "Gameplay Systems", "Blueprint", "Grid System"]
role: "Solo"
stack: "Unreal Engine 5, C++, Enhanced Input, Blueprint"
focus: "Gameplay Programming · System Architecture · Technical Design"
year: "2026"
summary: "A solo UE5 C++ case study showing reusable gameplay-system architecture through tactical movement, weighted terrain, and tower-defense validation scenarios."
highlights:
  - "Built a reusable UE5 C++ grid framework (AGridManager) from scratch: TArray-based data model, world/grid coordinate conversion, cost-aware A*, movement-budget state, occupancy tracking, and unweighted Dijkstra skill/effect range helpers reused across three gameplay scenarios."
  - "Tactical Movement scenario: Unit Data Asset-driven selection and movement budget; step-by-step path-following with Animation Blueprint; interaction lock during movement; ability preview and movement preview kept in separate state blocks."
  - "Ability range pipeline: UpdateAbilityPreview(Origin, Target, AttackRange, EffectRange) uses unweighted Dijkstra range queries for attack range and effect footprint; effect display is suppressed when the hovered target is outside attack range."
  - "Cost-aware A* with 4/8-direction support — 4-direction uses Manhattan heuristic, 8-direction uses Chebyshev; soft corner-cutting allows diagonal movement unless both adjacent orthogonal cells are blocked."
  - "Movement-budget preview flow: reachable cells gate hover path preview, while the displayed route is resolved by the same cost-aware A* pathfinding used across the project."
  - "Tower Defense scenario: pathfinding as a placement rule — A* reruns on every obstacle edit and invalid placements are atomically rolled back before the grid state is confirmed."
coverImage: "/images/projects/grid-systems-experiments/GE-cover.png"
screenshots: []
links:
  github: "https://github.com/MisakaRinOwO/UE5-Grid-Experiment"
order: 5
keyFeatures:
  - "Reusable C++ Grid Core"
  - "A* Movement + Dijkstra Skill Range"
  - "Tactical Movement & Ability Preview"
  - "Weighted Terrain Movement"
  - "Tower Defense Path Rerouting"
focusCards:
  - title: "Reusable C++ Grid Core"
    description: "One AGridManager supports three scenarios. Grid data, coordinate conversion, A*, occupancy, movement preview state, and unweighted Dijkstra ability helpers live in C++; scenario rules stay in PlayerController Blueprints."
  - title: "Cost-Aware Pathfinding"
    description: "A* accumulates per-cell MoveCost. 8-direction mode uses a Chebyshev heuristic and soft corner-cutting; Tower Defense switches to 4-direction mode with Manhattan distance for stricter lane validation."
  - title: "Tactical Movement & Ability Preview"
    description: "Full grid core exercised in one level: Data Asset-driven units and skills, terrain-cost editing, occupancy, step-by-step movement, and independently stateful Dijkstra skill/effect range preview."
  - title: "Weighted Terrain Movement"
    description: "Runtime terrain cost editing with a cycling MoveCostList, slider-controlled movement budget, and hover shortest path preview resolved by cost-aware A*."
  - title: "Tower Defense Path Rerouting"
    description: "4-directional A* used as a placement constraint — obstacle edits trigger an immediate FindPath check; placements that block the full route are atomically rolled back by the PlayerController."
---

## Architecture

This is a solo UE5 C++ project. I wrote `AGridManager` from scratch — the structs, the A\* implementation, movement-budget state, the occupancy model, and the unweighted Dijkstra ability preview pipeline. Every scenario's Blueprint PlayerController and its custom Blueprint functions were also built by me.

The important signal is the separation of responsibilities: a reusable native C++ gameplay core, Blueprint scenario orchestration, data-driven unit/skill configuration, and validation rules that can be inspected through focused demos rather than one-off prototype scripts.

The project contains three separate UE5 levels. Each level has:
- A dedicated **GameMode** — lightweight, responsible only for binding on level load, no gameplay logic.
- A dedicated **PlayerController** — implements all scenario-specific input handling, mode logic, and rule enforcement on top of the shared C++ GridManager.

The three PCs share a common Blueprint function pattern but implement entirely different gameplay rules.

The project is structured in three layers, kept deliberately separate:

```
Enhanced Input / Pawn
→ PlayerController  (scenario rule layer — Blueprint)
→ AGridManager      (C++ core — data, pathfinding, queries, visualization)
```

`AGridManager` has no scenario-specific code. The same C++ core serves three different gameplay scenarios without subclassing or modification.

---

## Core: AGridManager

`AGridManager` is the reusable C++ Actor at the center of the project. It owns all grid data, pathfinding, movement budget state, occupancy, and unweighted skill/effect range calculation. Scenario-specific rules never live here — only in the PlayerController above.

### Data-Driven Grid Model

The grid is stored as two `USTRUCT` types and a flat array — not spawned Actors.

`FGridCoord` holds logical grid coordinates (X, Y). `FGridCell` holds per-cell state:

```cpp
USTRUCT(BlueprintType)
struct FGridCell
{
    FGridCoord Coord;
    bool bBlocked = false;
    float MoveCost = 1.0f;
    int32 MoveCostListIndex = 0;
    bool bIsOccupied = false;
    TObjectPtr<ACharacter> OccupyingCharacter = nullptr;
};
```

Cells are stored in a `TArray<FGridCell>` indexed by `Y * GridWidth + X` — contiguous memory, no per-cell Actor overhead. World-space rendering is derived on demand: `GridToWorld()` converts a logical coord to a cell center for debug drawing; `WorldToGrid()` converts a raytrace hit location into a coord for player interaction. Neither stores world positions — the grid is purely logical.

Input reaches the grid through a clear pipeline. Each PlayerController implements its own `Run Raytrace` custom Blueprint function that performs cast only when an input action fires:

```
Run Raytrace (custom BP function in each PC):
GetMousePosition
→ DeprojectScreenToWorld  (WorldPosition + WorldDirection)
→ LineTraceByChannel
→ Branch on hit bool
→ True: WorldToGrid(HitLocation) → return (true, GridCoord)
→ False: return (false, default)
```

This runs on-demand — not every Tick. The PC branches on the returned `bool` before calling any GridManager function; invalid hits are discarded before reaching the grid.

<div class="va-grid-carousel" data-va-carousel data-auto-ms="0" aria-label="PlayerController Blueprint architecture proof gallery">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>
<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/grid-systems-experiments/BP-RunRaytrace.png" aria-label="Open Run Raytrace Blueprint function in large view">
<img src="/images/projects/grid-systems-experiments/BP-RunRaytrace.png" alt="Run Raytrace custom Blueprint function: GetMousePosition, DeprojectScreenToWorld, LineTraceByChannel, WorldToGrid, returns bool and GridCoord" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Run Raytrace — custom BP function in each PC. Screen position → deproject → line trace → WorldToGrid. Returns validity bool + coord.</figcaption>
</figure>
<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/grid-systems-experiments/BP-WeightedPC-BeginPlay.png" aria-label="Open PC BeginPlay Blueprint in large view">
<img src="/images/projects/grid-systems-experiments/BP-WeightedPC-BeginPlay.png" alt="PC BeginPlay: ShowMouseCursor, GetControlledPawn cast to BP_GridPawn, Enhanced Input IMC binding, GetActorOfClass GridManager, set DrawCellCostText" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>PC BeginPlay — show cursor, cast controlled pawn, bind Enhanced Input IMC, get GridManager actor reference and enable flags on demand.</figcaption>
</figure>
</div>
<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>
<div class="va-grid-carousel-dots" role="tablist" aria-label="PC Blueprint architecture pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
</div>
</div>

---

### A* Pathfinding

A\* is implemented entirely in C++. The search state uses `FGridPathNode`, an internal struct not exposed to Blueprint — it holds `GCost`, `HCost`, `ParentIndex`, and open/closed flags, and exists only during a single search call:

```cpp
const float NewGCost =
    PathNodes[CurrentIndex].GCost + Cells[NeighborIndex].MoveCost;
```

Cost is accumulated per destination cell, not per edge — moving into a high-cost cell costs that cell's `MoveCost` regardless of direction.

The heuristic is Chebyshev distance, scaled by `MinMoveCost` from the cost list rather than hardcoded to 1.0:

```cpp
return FMath::Max(DX, DY) * MinMoveCost;
```

**4-direction vs. 8-direction:** the base implementation is 4-directional, used by Tower Defense. Weighted Terrain and Tactical enable 8-direction (`bEnable8Directional = true`), which switches the heuristic to Chebyshev distance and enables diagonal neighbors.

8-direction applies a soft corner-cutting rule in `GetNeighbors()` — a diagonal move is valid if at least one of the two adjacent cardinal cells is walkable:

```cpp
if (IsWalkableCoord(UpRight) && (IsWalkableCoord(Right) || IsWalkableCoord(Up)))
    OutNeighbors.Add(UpRight);
```

---

### Movement Budget & Hover Path Preview

Movement Range mode stores a start cell, a `MovementBudget`, and a `ReachableCells` set used to gate hover preview. The visible route is still resolved by `FindPath()` using the same cost-aware A\* implementation:

```
SetStartCoord(Start)
→ update movement-budget preview state
→ HoverCoord must be in ReachableCells
→ SetGoalCoord(HoverCoord)
→ FindPath()
→ CurrentPathCost = GetPathCost(CurrentPath)
```

The result is stored in `TArray<FGridCoord> ReachableCells`. Hover path preview checks reachability via `IsCoordInReachableCells()` before allowing the A\* preview to display.

The hover preview itself runs in `Tick` only when `bEnableHoverPathPreview` is true, and uses a `PreviousCoord` throttle to skip A\* re-runs when the cursor hasn't moved to a new cell:

```cpp
if (IsPreviousCoord(HoverCoord)) return; // skip if same cell as last frame
```

When terrain or obstacles change, `ResetGridCache()` refreshes the movement preview state if a start is set — so the display stays current without the scenario layer managing it.

---

### Occupancy & Dijkstra Ability Preview

**Occupancy** — `bIsOccupied` and `OccupyingCharacter` are fields on `FGridCell`. `AssignGridCellCharacterAndUpdateOccupancy()` writes changes back to the authoritative `Cells` array and calls `ResetGridCache()` to keep pathfinding state consistent. `SetGoalCoord()` rejects occupied cells as targets — occupancy integrates directly into pathfinding validity, not as a separate check.

**Ability range** — skill preview does not use terrain-weighted pathfinding. `FindCellsInRange()` runs an unweighted Dijkstra-style grid expansion: each neighbor step costs 1, and the expansion stops at the provided range value.

```
Cost[Origin] = 0
While OpenList not empty:
  Current = lowest Cost in OpenList
  For each cardinal neighbor:
    NewCost = Cost[Current] + 1
    If NewCost <= Range -> record cell, enqueue
```

`UpdateAbilityPreview(OriginCoord, TargetCoord, AttackRange, EffectRange)` runs this query in two passes: first fills `AbilityAttackRangeCells` from origin, then fills `AbilityEffectCells` from target — but only if target is inside attack range. Effect cells are suppressed otherwise. This state is fully independent of `StartCoord / GoalCoord / CurrentPath` — ability preview and movement preview share grid space but not state.

---

## Scenario: Tactical Movement

*Place a Mage unit, select it by grid cell, preview movement range and cost-aware paths, move step by step, and validate skill attack and effect ranges.*

<figure>
<video class="content-media" controls playsinline preload="metadata" data-base-src="/images/projects/grid-systems-experiments/GE-TacticalMovement.mp4" style="width:100%">
</video>
<figcaption>Demo shows: selection -> reachable cells -> cost-aware path preview -> path-following movement with jog animation and occupancy update -> skill attack/effect range preview.</figcaption>
</figure>

<br />

This is the only level that exercises all major GridManager systems together: terrain cost, cost-aware pathfinding, movement budget, occupancy, and ability preview.

Units and skills are defined as Data Assets instead of hardcoded values. In the current demo, the placement tool can place multiple Mage units on the grid. The PlayerController reads from the selected Mage unit's Unit DA to set `MovementBudget` on GridManager, then reads from its Skill DA to call `UpdateAbilityPreview()` with the correct ranges.

```
Unit DA:  Name · Movement Budget · Skill Array → [Skill DA]
Skill DA: Name · Attack Range · Effect Range
```

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/grid-systems-experiments/BP-DAMage.png" aria-label="Open Mage Data Asset in large view">
<img src="/images/projects/grid-systems-experiments/BP-DAMage.png" alt="Mage Unit Data Asset showing movement budget and skill preset reference used by Tactical Movement" class="content-media" loading="lazy" />
</button>
<figcaption>Mage Unit DA — current placed-unit preset. Movement budget and skill reference are read by the Tactical PlayerController and passed into GridManager for movement range and ability preview.</figcaption>
</figure>

Example presets:

| Unit | Movement | Skill | Attack Range | Effect Range |
|---|---|---|---|---|
| Scout | 8 | Melee Attack | 1 | 0 |
| Mage | 2 | Fireball | 3 | 1 |
| Ranged | 5 | Surgical Strike | 5 | 0 |

The DA schema is also present for Scout and Ranged, but the in-game placement picker is not implemented yet. Swapping the placed type currently means changing the referenced DA rather than selecting a type at runtime.

The scenario operates in three modes. **Terrain Editor** edits terrain cost and places/removes Mage units on the grid. **Movement Range** selects a placed unit, shows reachable cells from its DA-driven movement budget, and previews the cost-aware A\* path on hover. **Skill Attack** switches GridManager to ability preview mode, calling `UpdateAbilityPreview()` each frame on the hovered cell; attack and effect cells come from unweighted Dijkstra range queries, while `bEnableHoverPathPreview` is suppressed so movement and ability state don't conflict.

Unit movement follows the path step by step over time. Each Tick advances the character toward next cell on path by `DeltaTime * Movespeed`. On arrival at the final cell, `FinishPathMovement()` assigns grid occupancy to the new cell, clears the origin cell, and broadcasts `OnPathMovementFinished`. The PlayerController holds an interaction lock for the duration and releases it on that event. An Animation Blueprint drives idle/jog state from `bIsMovingAlongPath`.

---

## Scenario: Weighted Movement

*Edit terrain movement costs at runtime, adjust the movement budget slider, set a starting cell to show the reachable range, and hover a reachable cell to preview the shortest cost-aware path and its total movement cost.*

<figure>
<video class="content-media" controls playsinline preload="metadata" data-base-src="/images/projects/grid-systems-experiments/GE-WeightedTerrainDemo.mp4" style="width:100%">
</video>
<figcaption>Demo shows: runtime terrain cost editing, slider-driven movement range updates, and hover shortest-path preview with movement cost.</figcaption>
</figure>

<br />

This level isolates terrain cost editing, movement budget tuning, and cost-aware A\* path preview.

Terrain cost is editable at runtime through `CycleGridCost()`. Each click cycles a cell through the `MoveCostList` (default: 1 → 2 → 3 → Blocked), which is an `EditAnywhere` array — cost tiers are configurable without changing code. Clicking a blocked cell resets it to cost index 0. `CycleGridCost()` also handles a safety case: if the stored index falls out of bounds after the list is edited in the editor during play, it resets silently rather than crashing.

A UI slider exposes `MovementBudget` on GridManager. Setting a start cell updates the cyan movement range. `ResetGridCache()` fires automatically on any terrain change, so the range display stays current without the scenario layer managing it. Hovering a reachable cell runs A\* and displays the cost-aware path and total path cost.

The two modes are toggled via a Tab input action. On switch, the PC sets a `Current Mode` enum, writes `bEnableHoverPathPreview` on GridManager, and calls `RemoveStartAndGoalCoord()` to clear state. When `bEnableHoverPathPreview = true`, GridManager's own Tick calls `UpdateHoverPathPreview()` each frame. The PC doesn’t call FindPath on hover — it only toggles a flag; the GM handles the rest.

<div class="va-grid-carousel" data-va-carousel data-auto-ms="0" aria-label="Weighted Terrain PlayerController Blueprint proof gallery">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>
<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/grid-systems-experiments/BP-WeightedPC-LMBInput.png" aria-label="Open Weighted Terrain LMB input Blueprint in large view">
<img src="/images/projects/grid-systems-experiments/BP-WeightedPC-LMBInput.png" alt="Weighted Terrain PC LMB: Switch on Mode, Terrain Editor path calls CycleGridCost via raytrace, Move Range path calls SetStartCoord" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Weighted Terrain PC — LMB branches on current mode: Terrain Editor → CycleGridCost, Movement Range → SetStartCoord.</figcaption>
</figure>
<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/grid-systems-experiments/BP-WeightedPC-ModeSwitch.png" aria-label="Open Weighted Terrain mode switch Blueprint in large view">
<img src="/images/projects/grid-systems-experiments/BP-WeightedPC-ModeSwitch.png" alt="Mode switch Tab: sets mode enum, writes bEnableHoverPathPreview to GridManager, clears start/goal coord, updates UI text" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Mode switch (Tab) — sets enum, writes bEnableHoverPathPreview on GM, clears coord state, updates UI label.</figcaption>
</figure>
</div>
<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>
<div class="va-grid-carousel-dots" role="tablist" aria-label="Weighted Terrain PC Blueprint pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
</div>
</div>

---

## Scenario: Tower Defense

*Set starting and goal cells, toggle obstacle cells to see how they affect the shortest path.*

<figure>
<video class="content-media" controls playsinline preload="metadata" data-base-src="/images/projects/grid-systems-experiments/GE-TowerDefenseDemo.mp4" style="width:100%">
</video>
<figcaption>Demo shows: obstacle edits reroute the path in real time, and fully blocking placements are rejected and rolled back.</figcaption>
</figure>

<br />

Tower Defense runs A\* in 4-directional mode. Per-tick hover preview is off and movement budget is disabled; there is no reachable-range calculation in this scenario, only A\* as a placement gate.

All pathfinding is on-demand, triggered by the PC explicitly after each obstacle edit. The PC stores `PendingToggleObstacle` before calling FindPath so the rollback has the correct coord regardless of any intermediate state. The BP carousel below shows the full input-to-rollback flow.

<div class="va-grid-carousel" data-va-carousel data-auto-ms="0" aria-label="Tower Defense PlayerController Blueprint proof gallery">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>
<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/grid-systems-experiments/BP-TDPC-InputFlow.png" aria-label="Open Tower Defense input flow Blueprint in large view">
<img src="/images/projects/grid-systems-experiments/BP-TDPC-InputFlow.png" alt="Tower Defense PC LMB: raytrace, IsValid/IsValidCoord gates, ToggleObstacle, store PendingToggleObstacle, RunFindPath" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Tower Defense PC — LMB: raytrace → validate → ToggleObstacle → store PendingCoord → RunFindPath.</figcaption>
</figure>
<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/grid-systems-experiments/BP-TDPC-Rollback.png" aria-label="Open Tower Defense rollback Blueprint in large view">
<img src="/images/projects/grid-systems-experiments/BP-TDPC-Rollback.png" alt="Rollback branch: FindPath false triggers ToggleObstacle rollback, dev-only PrintString, RunFindPath reconfirm" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Rollback — FindPath false → ToggleObstacle (rollback) → dev-only print → RunFindPath reconfirm.</figcaption>
</figure>
</div>
<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>
<div class="va-grid-carousel-dots" role="tablist" aria-label="Tower Defense PC Blueprint pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
</div>
</div>

---

## Why This Design

**TArray over actor-per-cell** — spawning one Actor per cell couples spatial logic with the scene graph and makes full-grid iteration expensive (pointer chase per cell). A flat `TArray<FGridCell>` keeps memory contiguous, iteration O(N) and sequential, and world-space rendering derived on demand — no persistent component state per cell.

**Scenario rules in PlayerControllers, not in GridManager** — the first version of the project put obstacle validation, mode logic, and rollback rules inside `AGridManager` itself. This made the Tower Defense rule bleed into the weighted terrain level. Moving scenario logic to dedicated PlayerController Blueprints made `AGridManager` scenario-agnostic and the same binary was reused across three levels without touching the C++ class.

**A\* as a synchronous gate, not an event** — the Tower Defense rule needs to roll back an obstacle placement if pathfinding fails. An event-dispatcher (`OnGridChanged → broadcast → FindPath`) would make the return value unavailable to the caller at decision time. A direct synchronous call gives the PC the `bool` it needs to decide before committing state.

**PreviousCoord throttle on hover preview** — the hover path preview runs in Tick. Without a guard, every frame with the mouse stationary would re-run A\*. `IsPreviousCoord()` skips the search if the cursor hasn't moved to a new cell, keeping per-frame cost at O(1) for the common case.

**8-direction for Weighted Terrain and Tactical** — on small grids, 4-direction paths tend to coincide with the minimum-cell-count route, making terrain cost differences invisible to the observer. 8-direction opens diagonal options that surface cost tradeoffs visually. The soft corner-cutting rule uses OR rather than AND on adjacent orthogonals because the grid models abstract terrain cost, not physical body collision — requiring both cardinal neighbors to be walkable would over-constrain diagonal movement on abstract maps.

**Chebyshev heuristic with MinMoveCost scaling** — a naive Chebyshev heuristic hardcodes the per-step cost as 1.0. On non-uniform terrain, this makes the heuristic inadmissible (it can overestimate the true cost), causing A\* to return suboptimal paths. Scaling by `MinMoveCost` — the smallest value in the terrain cost list — keeps the heuristic a guaranteed lower bound regardless of terrain variation.

**Unweighted Dijkstra for ability range, Chebyshev for pathfinding** — ability areas are expressed as cardinal-tile radii where every skill-range step costs 1, independent from terrain MoveCost. Chebyshev distance would count diagonal reach the same as cardinal reach, producing unintuitive square-like skill areas. The two range concepts are different: A\* answers “which path should movement take?”, while unweighted Dijkstra answers “which cells can this skill affect?”

---

## Engineering Takeaways

This project started as UE5 C++ practice and became a reusable gameplay-systems case study through design decisions, architecture changes, and debugging:

- Set up and maintained a UE5 C++ project structure with header/source separation, Unreal reflection, and Blueprint-facing APIs.
- Implemented core gameplay logic in native C++ while keeping scenario-specific orchestration in Blueprint PlayerControllers.
- Chose a data-driven `TArray` grid over actor-per-cell representation to keep iteration predictable and avoid scene-graph coupling.
- Replaced Tick-based key polling with event-driven Enhanced Input to reduce timing ambiguity in interaction code.
- Refactored scenario rules out of `AGridManager` after early coupling made Tower Defense validation bleed into other levels.
- Debugged path-following movement, animation Blueprint state, interaction locks, occupancy updates, and ability preview suppression.
- Used `DrawDebug*` visualization throughout development to make invisible grid/pathfinding state inspectable.
