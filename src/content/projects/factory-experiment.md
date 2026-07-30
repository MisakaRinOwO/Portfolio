---
title: "Factory Experiment — Data-Oriented Factory Simulation"
featured: true
draft: false
tags: ["UE5", "C++", "Factory Sim", "Gameplay Systems", "Data Assets", "UMG"]
role: "Solo Gameplay / Systems Programmer"
stack: "Unreal Engine 5.6, C++, Blueprint, UMG, Enhanced Input, HISM"
year: "2026"
summary: "A solo UE5 C++ factory-simulation prototype demonstrating chunked world storage, data-oriented logistics, fixed-step production, and a clean separation between runtime simulation and Blueprint-authored presentation."
highlights:
  - "Built a chunked sparse grid with dense 32x32 cell arrays, negative-coordinate support, and separate observation/write paths for world access."
  - "Implemented coord-keyed conveyor logistics without Actor-per-segment, keeping gameplay identity independent from HISM visual indices."
  - "Separated fixed-step resource transfer and production from per-frame hover, debug rendering, placement preview, and visual interpolation."
  - "Created a Data Asset authoring pipeline for buildings, runtime ports, recipes, resource maps, resource visuals, stack sizes, and storage."
  - "Made runtime state inspectable through machine/storage panels, layered debug overlays, and Blueprint-callable BuildingId queries."
coverImage: "/images/projects/factory-experiment/FE-Cover.png"
demoVideoFallback: "/images/projects/factory-experiment/FE-Demo.mp4"
screenshots: []
links:
  github: "https://github.com/MisakaRinOwO/UE5-Factory-Experiment"
  demo: "https://drive.google.com/file/d/1SetG34JeX46xBbpk4vSBNy7_8QWnEbJu/view?usp=sharing"
order: 1
keyFeatures:
  - "Chunked Grid Runtime"
  - "Data-Oriented Logistics"
  - "Fixed-Step Production"
  - "Data Asset Authoring"
  - "Runtime Inspection"
focus: "Gameplay Programming · Runtime Architecture · Simulation Systems · Technical Design"
focusCards:
  - title: "Scalable World Model"
    description: "Chunked grid storage supports an expandable factory floor."
  - title: "Lightweight Logistics"
    description: "Data-backed conveyors and resources avoid Actor-per-segment simulation."
  - title: "Deterministic Production"
    description: "Extraction, transfer, crafting, and storage advance on a fixed simulation step."
  - title: "Inspectable Systems"
    description: "Live building panels and layered developer diagnostics expose runtime state."
---

## Gameplay Loop

The current playable loop turns one authored ore map into a complete first production chain:

1. Select a Miner, Conveyor, Smelter, or Storage building from the bottom toolbar.
2. Place a Miner on an iron ore patch and route its output across directional conveyor segments.
3. Feed Iron Ore into a Smelter, which processes one ore into one ingot over three seconds.
4. Route the finished ingot into Storage and watch it accumulate in stack-limited slots.
5. Open the machine or storage panel to inspect live input, output, recipe progress, and slot contents.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-GameloopAnimated.gif" aria-label="Open Factory Experiment gameplay loop animation in large view">
<img src="/images/projects/factory-experiment/FE-GameloopAnimated.gif" alt="Factory Experiment gameplay loop showing building selection, placement and rotation, a complete Miner to Smelter to Storage production flow, and live building inspection" class="content-media" loading="lazy" />
</button>
<figcaption>Complete interaction and production loop: select, preview, rotate, and place the factory line; follow Ore through processing and storage; then inspect the live building state.</figcaption>
</figure>

## What I Built

Factory Experiment is a solo UE5 C++ project. I built the chunked grid and placement model, conveyor logistics, miner/machine/storage runtime, fixed-step production flow, instanced conveyor and resource visuals, Blueprint query interfaces, and the supporting debug and building-information workflow.

Building on earlier top-down control and grid-system experiments, this standalone project develops its own chunk storage, factory runtime, logistics, production, storage, and debugging systems.

<div class="media-grid media-grid-2 ownership-system-grid">
<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: Chunked Grid & Placement</p>
<p>World storage, build validation, footprint rotation, occupancy, placement preview, and removal.</p>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: Logistics & Production</p>
<p>Conveyor transfer, extraction, recipe processing, storage, connection rules, and instanced presentation.</p>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: Content Authoring</p>
<p>Data Assets for buildables, ports, recipes, resources, maps, visuals, and category-specific settings.</p>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: UI & Debugging</p>
<p>Building information panels, toolbar integration, spatial overlays, runtime labels, and query interfaces.</p>
</div>
</div>

## Architecture at a Glance

Inspired by flat factory and simulation games such as *shapez* and *Oxygen Not Included*, this project focuses on a scalable, inspectable gameplay-runtime foundation rather than the breadth of a complete factory game. Its central rule is separation: cells describe spatial occupancy, runtime structures own simulation state, and Blueprint/HISM presentation visualizes that state without becoming its authority.

Blueprint owns the top-down pawn presentation, authored building actors, toolbar layout, guide/tooltip widgets, and concrete building information panels. C++ owns spatial queries, placement, runtime ports, logistics, production state, visual handles, debug data, and Blueprint-callable query APIs.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-ArchitectureDiagram.svg" aria-label="Open Factory Experiment architecture diagram in large view">
<img src="/images/projects/factory-experiment/FE-ArchitectureDiagram.svg" alt="Factory Experiment architecture diagram showing Data Asset authoring, input and UI, AFactoryManager runtime, chunked grid data, conveyor machine storage runtime, fixed-step simulation, visuals, and debug inspection flow" class="content-media" loading="lazy" />
</button>
<figcaption>Data Asset-authored content feeds the runtime layer, which owns grid placement, production state, fixed-step simulation, visual handles, and UI/debug query paths.</figcaption>
</figure>

## Core Systems

### Chunked Grid Runtime

Selected source: [`FactoryGridTypes.h`](https://github.com/MisakaRinOwO/UE5-Factory-Experiment/blob/main/Source/FactoryExperiment/Public/Factory/Grid/FactoryGridTypes.h) · [`FactoryManager.cpp`](https://github.com/MisakaRinOwO/UE5-Factory-Experiment/blob/main/Source/FactoryExperiment/Private/Factory/FactoryManager.cpp)

The world uses a sparse `TMap<FGridCoord, FFactoryChunk>`. Each created chunk owns a fixed 32x32 dense cell array, giving unused world space no allocation cost while keeping local indexing contiguous.

Cells stay lightweight. Machine inventory, recipe progress, moving resources, storage slots, and Actor logic live in their own runtime structures rather than inside every cell.

World coordinates support negative values through floor-style chunk division and corrected local modulo. Four chunks around the manager origin are initially created for hover/debug coverage, while additional chunks are created on demand by world writes.

The access policy separates observation from mutation:

- `GetCell(Coord)` is read-only and does not create chunks.
- `GetOrCreateCell(Coord)` is the world-mutation path used when a write operation needs a cell to exist.
- Simulation iterates the conveyor, machine, and storage runtime collections rather than scanning every cell in every created chunk.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-ChunkDebugOverlay.png" aria-label="Open chunk debug overlay screenshot in large view">
<img src="/images/projects/factory-experiment/FE-ChunkDebugOverlay.png" alt="Factory grid debug overlay showing hovered cell, chunk coordinates, resource and building state, chunk boundaries, and the highlighted hovered cell" class="content-media" loading="lazy" />
</button>
<figcaption>Grid and chunk inspection: hovered coordinates, resource/building state, chunk boundaries, and hovered-cell highlight expose the spatial model directly.</figcaption>
</figure>

### Data-Oriented Logistics

Selected source: [`FactoryConveyorTypes.h`](https://github.com/MisakaRinOwO/UE5-Factory-Experiment/blob/main/Source/FactoryExperiment/Public/Factory/Conveyor/FactoryConveyorTypes.h) · [`FactoryMachineTypes.h`](https://github.com/MisakaRinOwO/UE5-Factory-Experiment/blob/main/Source/FactoryExperiment/Public/Factory/Buildings/FactoryMachineTypes.h)

Factory state is divided by responsibility instead of being owned by one Actor type:

<div class="media-grid media-grid-2 ownership-system-grid">
<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">Grid Cell</strong></p>
<p><strong>Identity:</strong> world coordinate<br /><strong>Runtime:</strong> chunk cell array<br /><strong>Presentation:</strong> debug grid</p>
</div>
<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">Building</strong></p>
<p><strong>Identity:</strong> BuildingId and occupied coordinates<br /><strong>Runtime:</strong> placed instance plus machine/storage data<br /><strong>Presentation:</strong> Blueprint Actor</p>
</div>
<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">Conveyor</strong></p>
<p><strong>Identity:</strong> grid coordinate<br /><strong>Runtime:</strong> <code>FFactoryConveyorSegment</code><br /><strong>Presentation:</strong> conveyor HISM</p>
</div>
<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">Moving Resource</strong></p>
<p><strong>Identity:</strong> resource state on a segment<br /><strong>Runtime:</strong> conveyor data<br /><strong>Presentation:</strong> resource HISM</p>
</div>
</div>

Buildings use Blueprint child actors because they benefit from authored meshes, components, and production-state events. Conveyor segments remain data-backed because spawning one Actor per segment would add unnecessary object overhead to the most repeated factory element.

Each conveyor currently buffers one resource for the MVP. Movement uses a snapshot and planning pass before applying transfers, so traversal order does not let two sources claim the same empty target. A segment can deliver into another compatible conveyor or into an adjacent machine/storage input port.

Gameplay identity remains the grid coordinate. HISM instance indices are visual handles only, preventing rendering compaction from redefining logistics identity.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-FactoryManagerMachineRuntimeData.png" aria-label="Open FactoryManager machine runtime data screenshot in large view">
<img src="/images/projects/factory-experiment/FE-FactoryManagerMachineRuntimeData.png" alt="FactoryManager machine runtime data showing live recipe progress, input storage, output storage, internal storage, ports, and building identity" class="content-media" loading="lazy" />
</button>
<figcaption>Manager-owned machine state keeps recipe progress, input/output storage, internal storage, runtime ports, and building identity separate from the visual Actor.</figcaption>
</figure>

### Fixed-Step Production

Selected source: [`FactoryManager.cpp`](https://github.com/MisakaRinOwO/UE5-Factory-Experiment/blob/main/Source/FactoryExperiment/Private/Factory/FactoryManager.cpp)

Logistics and production run on a centralized `0.2s` simulation step:

```text
UpdateConveyors
→ UpdateMachines
→ UpdateStorages
```

That step owns miner extraction, conveyor transfer, machine input delivery, recipe progress, output storage, and storage flushing. Per-frame `Tick` is reserved for mouse hover, placement preview, debug drawing, and smooth interpolation of moving resource meshes between their previous and current fixed-step coordinates.

The ordering is deliberate: conveyors update before machines, so newly emitted machine or miner output remains visible for a full simulation interval rather than moving twice during the same step. The Gameplay Loop animation above shows the resulting resource flow: authoritative state advances on the fixed step while moving-resource visuals interpolate smoothly between coordinates.

### Data Asset Authoring and Runtime Ports

Selected source: [`FactoryBuildingDataAsset.h`](https://github.com/MisakaRinOwO/UE5-Factory-Experiment/blob/main/Source/FactoryExperiment/Public/Factory/Data/FactoryBuildingDataAsset.h) · [`FactoryRecipeDataAsset.h`](https://github.com/MisakaRinOwO/UE5-Factory-Experiment/blob/main/Source/FactoryExperiment/Public/Factory/Recipes/FactoryRecipeDataAsset.h)

Content authoring stays outside the simulation code:

- `UFactoryBuildingDataAsset` defines buildable type, footprint, Actor/preview references, local ports, and category-specific conveyor, extractor, machine, or storage settings.
- `UFactoryRecipeDataAsset` defines recipe identity, input/output resource maps, craft time, and allowed buildings.
- `UFactoryResourceDataAsset` maps resources to moving meshes, vein meshes, and stack sizes.
- `UFactoryResourceMapDataAsset` defines initial primary-resource coordinates.

Local ports are transformed when a building is placed:

```text
Authored Local Port
→ Rotate with Build Direction
→ Runtime World Port
→ Shared Connection Validation
```

The resulting world ports carry coord, direction, input/output type, and accepted-resource filters. Conveyors, processors, extractors, and storage reuse those ports for the same adjacency and compatibility rules instead of implementing separate connection systems.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-SmelterDataAsset.png" aria-label="Open Smelter Data Asset screenshot in large view">
<img src="/images/projects/factory-experiment/FE-SmelterDataAsset.png" alt="Smelter Data Asset showing buildable type, size, Actor class, preview mesh, ports, and recipe reference" class="content-media" loading="lazy" />
</button>
<figcaption>Smelter authoring data defines its category, footprint, visual Actor, preview, runtime ports, and direct recipe reference.</figcaption>
</figure>

### Runtime UI and Debug Inspection

The project separates presentation UI from developer inspection:

- Player-facing UI: building toolbar, guide, tooltip, hover preview, and machine/storage information panels.
- Developer UI: cell/chunk overlays plus conveyor, extractor, machine, and storage runtime text.

Machine and storage widgets keep an `AFactoryManager` reference and `BuildingId`, then re-query authoritative runtime data through Blueprint-callable APIs. They do not keep a stale copied runtime struct as their long-term source of truth. `PC_Factory` stores the one active panel through the shared `UFactoryBuildingInfoWidget` parent type.

#### Building Information

<div class="va-grid-carousel" data-va-carousel data-auto-ms="0" aria-label="Building info panel gallery">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous building info image"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>

<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-MachineInfoPanel.png" aria-label="Open machine info panel screenshot in large view">
<img src="/images/projects/factory-experiment/FE-MachineInfoPanel.png" alt="Smelter machine info panel showing Iron Ingot recipe, input Iron Ore count, progress bar, and output Iron Ingot count" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Machine panel: recipe identity, input storage, craft progress, and output storage are queried from live runtime state.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-StorageInfoPanel.png" aria-label="Open storage info panel screenshot in large view">
<img src="/images/projects/factory-experiment/FE-StorageInfoPanel.png" alt="Storage info panel showing slot-based storage with Iron Ingot count and empty slots" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Storage panel: slot-based storage displays resource type and count from authoritative storage runtime data.</figcaption>
</figure>
</div>

<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next building info image"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>

<div class="va-grid-carousel-dots" role="tablist" aria-label="Building info image pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
</div>
</div>

#### Developer Inspection

<div class="va-grid-carousel" data-va-carousel data-auto-ms="0" aria-label="Factory runtime debug gallery">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous runtime debug image"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>

<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-BuildingDebugText.png" aria-label="Open building runtime debug screenshot in large view">
<img src="/images/projects/factory-experiment/FE-BuildingDebugText.png" alt="Runtime debug text showing storage slots, conveyor resources, smelter recipe progress, and miner internal storage" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Runtime labels expose storage slots, moving resources, smelter progress, and miner extraction/internal storage directly over the production line.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-FullDebugMode.png" aria-label="Open full debug mode screenshot in large view">
<img src="/images/projects/factory-experiment/FE-FullDebugMode.png" alt="Full debug mode showing hovered cell and chunk data, building state, runtime labels, chunk boundaries, and the building toolbar" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Full debug mode combines hover data, runtime labels, chunk boundaries, and build-selection context for technical inspection.</figcaption>
</figure>
</div>

<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next runtime debug image"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>

<div class="va-grid-carousel-dots" role="tablist" aria-label="Factory runtime debug image pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
</div>
</div>

## Iteration & Problem Solving

| Type | Problem | Adjustment | Result |
|---|---|---|---|
| World State | Hover/debug reads could accidentally create world data | Split observation through `GetCell` from mutation through `GetOrCreateCell` | Hover and debug remain read-only while placement creates chunks intentionally |
| Visual Correctness | Removing a loaded resource HISM instance could compact indices used by other segments | Hide moving resource instances instead of removing them during the MVP | Deleting conveyors carrying resources no longer invalidates other visual handles |
| Logistics | A final storage input could keep a stale conveyor output connection after fast setup | Refresh loaded conveyors before fixed-step movement as well as around placement/removal | Conveyor-to-storage setups recover without replacing the storage building |
| UI State | Machine/storage widgets could display stale copied runtime data | Re-query `AFactoryManager` by BuildingId on widget refresh | Panels read authoritative live production and storage state |
| Presentation | The default gameplay view was too debug-heavy for a portfolio demo | Separate toolbar/info/guide UI from developer overlays and runtime labels | Recording can open with a clean gameplay view while technical state remains one toggle away |

## Trade-offs and Boundaries

- **World lifetime:** Sparse chunks avoid allocating untouched space, but created chunks are not reclaimed in the current MVP.
- **Throughput model:** A fixed step makes transfer order deterministic and inspectable, but each conveyor advances at most one cell per step.
- **Runtime specialization:** Storage and processor machines share port rules while retaining separate state and query paths; this keeps their semantics clear at the cost of a broader API surface.
- **Centralized orchestration:** `AFactoryManager` made MVP update order, debugging, and Blueprint integration direct. Continued growth would justify focused grid, logistics, production, and visual subsystems.

## What This Demonstrates

- Data-oriented gameplay architecture in which repeated logistics elements do not require Actor-owned simulation.
- Fixed-step authoritative state paired with per-frame interaction, debugging, and visual interpolation.
- A shared runtime-port model used by conveyors, extractors, processors, and storage.
- Practical failure diagnosis through live UI queries, layered debug views, and explicit C++/Blueprint ownership boundaries.

## Scope and Intentional Limits

The current scope is deliberately narrow so the first chain stays runnable and verifiable:

- Each conveyor segment buffers one resource; multi-item spacing and belt density are not simulated yet.
- Dedicated corner conveyor variants/visuals, splitters, and mergers are not implemented.
- Moving-resource HISM instances hidden after loaded-conveyor deletion are not pooled or reused.
- The standalone 4-direction pathfinder is not connected to path-assisted conveyor placement.
- Miner extraction remains a verified special production path rather than a fully unified terrain-input machine lifecycle.
- Save/load, larger recipe networks, and large multi-chunk performance profiling are outside the current MVP.

These limits distinguish architectural preparation from measured scalability: chunking and instancing reduce obvious object/storage costs, but large-scale performance remains something to profile rather than claim in advance.

## What I'd Do Next

- **Immediate Gameplay Validation:** Add conveyor variants and a second recipe chain to test routing, filters, and storage pressure beyond the first iron line.
- **Runtime Architecture:** Introduce a data-driven throughput model, then split manager responsibilities where the expanded simulation reveals stable subsystem boundaries.
- **Persistence and Scale Validation:** Add save/load for runtime state and profile a large, active multi-chunk factory before making scalability claims or optimizations.
