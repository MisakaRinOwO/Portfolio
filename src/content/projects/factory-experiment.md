---
title: "Factory Experiment - UE5 C++ Factory Simulation Prototype"
featured: true
draft: true
tags: ["UE5", "C++", "Factory Sim", "Gameplay Systems", "Data Assets", "UMG"]
role: "Solo"
stack: "Unreal Engine 5.6, C++, Blueprint, UMG, Enhanced Input, HISM"
year: "2026"
summary: "A solo UE5 C++ factory-simulation prototype focused on chunked grid storage, fixed-step production logic, data-driven buildings and recipes, conveyor resource movement, storage UI, and debug tooling."
highlights:
  - "Built a UE5 C++ factory-simulation prototype that reuses earlier top-down control and grid-struct experience while focusing on production flow, runtime data ownership, and factory-system debugging."
  - "Built a chunked square-grid world model with sparse chunk allocation, dense per-chunk cell arrays, negative coordinate support, and separate read/write query paths so hover/debug reads do not create world state."
  - "Kept factory runtime state data-oriented: cells store lightweight occupancy references, conveyors are structs keyed by grid coordinate, machines and storages keep separate runtime arrays, and Blueprint child actors handle visuals/authoring."
  - "Implemented a fixed-step simulation loop in AFactoryManager for miners, conveyors, machines, storages, and resource movement instead of per-frame production logic."
  - "Created a data-asset pipeline for buildable definitions, runtime ports, recipes, resource maps, resource meshes, stack sizes, and toolbar/building info UI integration."
  - "Implemented the first production chain: Resource Map -> Miner -> Conveyor / adjacent input -> Smelter recipe -> Conveyor / Storage -> Storage slots."
  - "Separated demo-facing UI from developer debug tooling: toolbar, guide, tooltip, machine/storage info panels for presentation; debug toggles for cell, chunk, conveyor, extractor, machine, and storage state."
coverImage: "/images/projects/factory-experiment/FE-Cover.png"
heroVideoPlaceholder: "PLACEHOLDER: Add a short demo video showing the full loop: select Miner/Conveyor/Smelter/Storage, place them on the grid, watch ore move through conveyors, inspect smelter progress, then open storage UI."
screenshots: []
links:
  github: "https://github.com/MisakaRinOwO/UE5-Factory-Experiment"
  demo: "https://drive.google.com/file/d/1SetG34JeX46xBbpk4vSBNy7_8QWnEbJu/view?usp=sharing"
order: 4
keyFeatures:
  - "Chunked Grid Runtime"
  - "Fixed-Step Factory Simulation"
  - "Data-Asset Buildings & Recipes"
  - "Conveyor Resource Movement"
  - "Machine + Storage UI Queries"
  - "Debug Tooling"
focus: "Gameplay Programming - Runtime Architecture - Simulation Systems - Technical Design"
focusCards:
  - title: "Chunked Grid Runtime"
    description: "Sparse world chunks with dense 32x32 cell arrays, negative world coordinates, and separate read-only/write-path cell queries."
  - title: "Factory Simulation"
    description: "Miner extraction, conveyor transfer, smelter processing, storage transfer, and smooth resource visual interpolation."
  - title: "Data-Asset Authoring"
    description: "Buildable, port, recipe, resource-map, resource-visual, stack-size, and toolbar-icon data paths."
  - title: "Building Runtime UI"
    description: "Machine and storage info panels that re-query AFactoryManager by BuildingId for live runtime data."
  - title: "Debug Tooling"
    description: "Hover/grid/chunk debug UI and runtime debug text for conveyors, extractors, machines, and storage."
---

## Gameplay Loop

The current playable loop is:

1. Choose a building from the bottom toolbar: Miner, Conveyor, Smelter, or Storage.
2. Move the camera around the factory floor, zoom in/out, and place buildings onto the grid.
3. Put a Miner on an ore patch, then connect its output path toward the rest of the line.
4. Once connected, ore starts flowing automatically along conveyors or into nearby compatible buildings.
5. Route ore into a Smelter, wait for it to process iron ore into iron ingots, then send the output onward.
6. Connect the output path to Storage and watch finished resources accumulate in storage slots.
7. Click buildings to inspect their current contents, recipe progress, and storage state.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-Cover.png" aria-label="Open Factory Experiment production chain screenshot in large view">
<img src="/images/projects/factory-experiment/FE-Cover.png" alt="Factory Experiment gameplay screenshot showing Miner, Conveyor, Smelter, Storage, ore patches, and bottom building toolbar" class="content-media" loading="lazy" />
</button>
<figcaption>Current MVP chain: Miner, Conveyor, Smelter, Storage, ore patches, and the bottom building toolbar visible in one clean gameplay view.</figcaption>
</figure>

<div class="media-placeholder" data-label="PLACEHOLDER: Demo GIF or MP4 - full Miner -> Conveyor -> Smelter -> Storage loop"></div>

## Design Goals

Factory Experiment is a UE5 C++ systems prototype for a top-down factory simulation. It is inspired by flat factory/simulation games such as *shapez* and *Oxygen Not Included*, but the goal is narrower: demonstrate a scalable gameplay-runtime foundation rather than clone a complete game.

The project was designed to show:

- Chunked square-grid world storage that can expand beyond a small authored level.
- Manual building and conveyor placement on a 4-direction grid.
- Content authored through buildable, recipe, resource, port, and storage definitions.
- C++ simulation state separated from Blueprint-authored visuals and UI.
- Instanced conveyor/resource rendering instead of Actor-per-conveyor or Actor-per-item.
- A centralized fixed-step simulation loop.
- Debug and building-info UI that make invisible runtime state inspectable.

## Core Systems

### Grid, Placement, and Buildable Authoring

`AFactoryManager` is the central runtime class. It owns placement, chunk storage, conveyor state, machine state, storage state, HISM visuals, resource visuals, hover state, simulation timing, UI queries, and debug drawing.

Current runtime ownership:

```text
Chunks:                  TMap<FGridCoord, FFactoryChunk>
Building actors:          TArray<AFactoryBuilding*>
Placed building lookup:   TMap<FGridCoord, FFactoryPlacedBuildingInstance>
Conveyors:                TMap<FGridCoord, FFactoryConveyorSegment>
Machines:                 TArray<FFactoryMachineRuntimeData>
Storages:                 TArray<FFactoryStorageRuntimeData>
Conveyor visuals:         HISM components cached by buildable DataAsset
Resource visuals:         HISM components cached by resource type
```

The implementation layer is split like this:

```text
Enhanced Input / UMG / Blueprint actors
-> AFactoryManager gameplay runtime
-> Chunked grid, conveyor, machine, storage, recipe, and resource data
```

Blueprint owns authored building actors, widgets, selection toolbar layout, guide/tooltip presentation, and building info panels. C++ owns simulation rules and runtime data.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-ArchitectureDiagram.svg" aria-label="Open Factory Experiment architecture diagram in large view">
<img src="/images/projects/factory-experiment/FE-ArchitectureDiagram.svg" alt="Factory Experiment architecture diagram showing DataAsset authoring, input and UI, AFactoryManager runtime, chunked grid data, conveyor machine storage runtime, fixed-step simulation, visuals, and debug inspection flow" class="content-media" loading="lazy" />
</button>
<figcaption>Runtime architecture: DataAsset-authored content feeds AFactoryManager, which owns grid placement, production state, fixed-step simulation, visual handles, and UI/debug query paths.</figcaption>
</figure>

The world is stored as sparse chunks with dense arrays inside each chunk:

```cpp
TMap<FGridCoord, FFactoryChunk> Chunks;
```

Each `FFactoryChunk` contains a fixed 32x32 `TArray<FFactoryGridCell>`. The chunk size is compile-time fixed for the MVP.

Cells stay lightweight:

```cpp
USTRUCT(BlueprintType)
struct FFactoryGridCell
{
    GENERATED_BODY()

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
    EFactoryCellOccupancy Occupancy = EFactoryCellOccupancy::Empty;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
    EFactoryDirection Direction = EFactoryDirection::None;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
    int32 BuildingId = -1;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
    FGridCoord ConveyorCoord;
};
```

World coordinates support negative values. `WorldCoordToChunkCoord()` uses floor-style division, and `WorldCoordToLocalCoord()` corrects negative modulo values back into chunk-local coordinates.

Grid query policy:

- `GetCell(Coord)` is read-only and does not create chunks.
- `GetOrCreateCell(Coord)` creates chunks and is used by placement/removal.

`CreateInitialChunks()` creates four chunks around the manager origin for hover/debug coverage, but simulation iterates active conveyors, machines, storages, and resources rather than scanning every cell in created chunks.

`UFactoryBuildingDataAsset` defines buildable content for the current MVP. Conveyors, extractors, machines, and storages use one selected-buildable path, with `BuildableType` driving category-specific behavior.

Current buildables:

| Building | Size | Runtime Role |
|---|---:|---|
| Miner | 1x1 | Extracts resource-map ore |
| Conveyor | 1x1 | Moves one resource at a time |
| Smelter | 1x1 | Processes recipe input/output storage |
| Storage | 1x1 | Stores resources in stack-limited slots |

Placement supports rotated footprints and rotated runtime ports. DataAsset-authored local ports are converted into world-space `FFactoryPlacedBuildingPort` values during placement:

```cpp
const FGridCoord RotatedLocalCoord =
    RotateLocalCoord(Port.LocalCoord, BuildingData->FootprintSize, Direction);

WorldPort.WorldCoord = FGridCoord(
    OriginCoord.X + RotatedLocalCoord.X,
    OriginCoord.Y + RotatedLocalCoord.Y
);
WorldPort.Direction = RotateDirection(Port.Direction, Direction);
```

The selected-building preview uses a dedicated `PlacementPreviewComponent`, follows the hovered cell, and rotates with build direction. Placement validation runs on click and blocks occupied cells or invalid footprint targets without a separate invalid-state visual pass yet.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-ChunkDebugOverlay.png" aria-label="Open chunk debug overlay screenshot in large view">
<img src="/images/projects/factory-experiment/FE-ChunkDebugOverlay.png" alt="Factory grid debug overlay showing hovered cell, chunk coordinates, resource/building state text, chunk boundary lines, and highlighted hovered grid cell" class="content-media" loading="lazy" />
</button>
<figcaption>Grid and chunk debug overlay: hovered cell and chunk coordinates, resource/building state, chunk boundary lines, and hovered-cell highlight.</figcaption>
</figure>

### Production Runtime Model

The main production systems follow the same pattern:

```text
DataAsset definition
-> placed instance / grid identity
-> runtime data structure
-> Blueprint actor or HISM visual presentation
```

For buildings, the DataAsset provides type id, buildable type, footprint, preview mesh, actor class, ports, recipe/storage/extractor settings, and visual references. Placement creates a `FFactoryPlacedBuildingInstance`, registers a `BuildingId`, stores the occupied grid cells, and creates runtime world ports. Blueprint actors provide the visible building shell.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-SmelterDataAsset.png" aria-label="Open Smelter DataAsset screenshot in large view">
<img src="/images/projects/factory-experiment/FE-SmelterDataAsset.png" alt="Smelter DataAsset screenshot showing buildable type, size, actor class, preview mesh, ports, recipe reference, and storage settings" class="content-media" loading="lazy" />
</button>
<figcaption>Smelter DataAsset: authoring data defines type, footprint, actor/preview visuals, ports, recipe reference, and storage settings.</figcaption>
</figure>

For conveyors, the DataAsset defines the buildable and conveyor mesh, placement creates a coord-keyed runtime segment, and HISM renders the belt without spawning one Actor per segment:

```cpp
USTRUCT(BlueprintType)
struct FFactoryConveyorSegment
{
    GENERATED_BODY()

    FGridCoord Coord;
    EFactoryDirection Direction = EFactoryDirection::None;
    int32 VisualInstanceIndex = INDEX_NONE;
    bool bHasNextCoord = false;
    FGridCoord NextCoord;
    EFactoryResourceType CurrentResourceType = EFactoryResourceType::None;
    int32 ResourceVisualInstanceIndex = INDEX_NONE;
    FGridCoord ResourceVisualFromCoord;
    FGridCoord ResourceVisualToCoord;
    float ResourceVisualMoveElapsed = 0.0f;
};
```

Conveyor gameplay identity is the grid coordinate. HISM instance indices are only visual handles.

For machines and extractors, `FFactoryMachineRuntimeData` stores the runtime production state:

- Building id and origin coord.
- Runtime world ports.
- Recipe reference and recipe id.
- Craft progress and working/blocked state.
- `InputStorageByPort`.
- `OutputStorageByPort`.
- Shared `InternalStorage`.
- Extractor fields: extracted resource, extraction progress, extraction rate.
- Round-robin output index.

For storage buildings, `FFactoryStorageRuntimeData` stays separate:

- Building id and origin coord.
- Runtime world ports.
- Available slot count.
- `TArray<FFactoryStorageSlot>`.
- Round-robin output index.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-FactoryManagerMachineRuntimeData.png" aria-label="Open FactoryManager machine runtime data screenshot in large view">
<img src="/images/projects/factory-experiment/FE-FactoryManagerMachineRuntimeData.png" alt="FactoryManager runtime machine data screenshot showing placed machine state, recipe progress, input storage, output storage, and internal storage fields" class="content-media" loading="lazy" />
</button>
<figcaption>Machine runtime data: placed machines keep live recipe progress, input/output storage, internal storage, ports, and building identity in manager-owned runtime state.</figcaption>
</figure>

Ports are authored locally on the buildable DataAsset, then converted into runtime world ports when the building is placed. Each port has a world coord, facing direction, input/output type, and accepted resource filters. Conveyors and buildings use those same runtime ports to decide whether a resource can move from one coord into the next target.

Internal storage and flush flow:

- Miners extract from the ore patch under their footprint into shared `InternalStorage`.
- Miner output flushes from internal storage to connected conveyors or compatible adjacent building inputs.
- Processor machines consume resources from `InputStorageByPort`.
- Completed recipes write output resources to `OutputStorageByPort`.
- Machine output flushes to connected conveyors, compatible machine inputs, or storage inputs.
- Storage accepts resources into stack-limited slots and can flush output through its authored output ports.

Current production behavior:

- Single-cell 4-direction placement.
- Runtime world ports generated from DataAsset port presets.
- Output connection refresh around placement/removal.
- Loaded-conveyor connection refresh before fixed-step movement.
- One resource type buffered per conveyor segment for the MVP.
- Moving resource HISM visuals interpolated every frame between fixed-step positions.
- Moving resource visuals hidden, not removed, when a loaded conveyor is deleted.
- First recipe chain: `Miner -> Conveyor / adjacent input -> Smelter -> Conveyor / Storage`.

<div class="media-placeholder" data-label="PLACEHOLDER: GIF - conveyor resource movement with smooth visual interpolation"></div>

<div class="va-grid-carousel" data-va-carousel data-auto-ms="0" aria-label="Building info panel gallery">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous building info image"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>

<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-MachineInfoPanel.png" aria-label="Open machine info panel screenshot in large view">
<img src="/images/projects/factory-experiment/FE-MachineInfoPanel.png" alt="Smelter machine info panel showing Iron Ingot recipe, input IronOre count, progress bar, and output IronIngot count" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Machine info panel: Smelter recipe state, input storage, craft progress, and output storage are queried from runtime data.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-StorageInfoPanel.png" aria-label="Open storage info panel screenshot in large view">
<img src="/images/projects/factory-experiment/FE-StorageInfoPanel.png" alt="Storage info panel showing slot-based storage with Iron Ingot count and empty slots" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Storage info panel: slot-based storage displays resource type and count from `FFactoryStorageRuntimeData`.</figcaption>
</figure>
</div>

<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next building info image"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>

<div class="va-grid-carousel-dots" role="tablist" aria-label="Building info image pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
</div>
</div>

### Fixed-Step Production Flow

Production logic is driven by `AFactoryManager` on a central timer:

```cpp
GetWorldTimerManager().SetTimer(
    SimulationTimerHandle,
    this,
    &AFactoryManager::SimulationStep,
    SimulationStepInterval,
    true
);
```

The current interval is `0.2s`.

Current simulation responsibilities:

- `UpdateConveyors`
- `UpdateMachines`
- `UpdateStorages`
- Miner extraction through `ExtractionRatePerSecond`
- Conveyor delivery into machine/storage input ports
- Smelter recipe progress and output storage
- Storage output flushing

Per-frame `Tick` handles hover raycast, placement preview, resource visual interpolation, and debug drawing.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-BuildingDebugText.png" aria-label="Open runtime debug text screenshot in large view">
<img src="/images/projects/factory-experiment/FE-BuildingDebugText.png" alt="Runtime debug text showing storage slots, conveyor resource labels, smelter recipe progress, and miner extractor internal storage" class="content-media" loading="lazy" />
</button>
<figcaption>Runtime debug text: storage slots, moving conveyor resources, smelter recipe progress, and miner internal storage are visible directly over the factory line.</figcaption>
</figure>

### UI and Debug Workflow

The project has two UI paths:

- Demo-facing UI: `W_BuildingSelection`, `W_BuildingSelectionItem`, `W_Guide`, `W_Tooltip`, `W_MachineBuildingInfo`, `W_StorageBuildingInfo`.
- Developer/debug UI: `W_DeveloperMode`, grid/chunk debug drawing, conveyor/machine/storage debug text.

Machine and storage info widgets store `AFactoryManager` plus `BuildingId`, then re-query runtime data through Blueprint-callable manager APIs. `PC_Factory` keeps the active panel through the shared `UFactoryBuildingInfoWidget` parent type.

Current debug data:

- Hovered cell, chunk, local coord, and resource type.
- Current selected buildable and build direction.
- Hovered building type id and occupancy.
- Conveyor current resource.
- Extractor resource, extraction progress/rate, and internal storage.
- Machine recipe id and craft progress.
- Storage slot contents.

Current controls:

- `WASD`: move the top-down camera.
- Mouse wheel: zoom the camera.
- `1-4`: select buildings from the toolbar.
- `Tab`: cancel building selection.
- Left mouse: place a selected building, or select/inspect building info when no building is selected.
- Right mouse: remove a buildable or clear the current selection.
- `R`: rotate build direction clockwise.
- `Num1`: toggle grid debug visual.
- `Num2`: toggle hovering-grid debug visual.
- `Num3`: toggle chunk debug visual.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/factory-experiment/FE-FullDebugMode.png" aria-label="Open full debug mode screenshot in large view">
<img src="/images/projects/factory-experiment/FE-FullDebugMode.png" alt="Full debug mode screenshot showing hovered cell and chunk data, building state, runtime debug labels, chunk boundary lines, and bottom building selection toolbar" class="content-media" loading="lazy" />
</button>
<figcaption>Full debug mode: hovered cell/chunk/building data, runtime labels, chunk boundaries, and the bottom building toolbar are visible together for technical inspection.</figcaption>
</figure>

## Why This Design

**Square grid and 4-direction conveyors**  
The target factory layout is closer to *shapez*-style flat routing than tactical movement. A square 4-direction grid keeps placement, ports, conveyor connection, and debug visualization readable for the first production-chain MVP.

**Chunked sparse world**  
A single dense world array does not scale well, while a pure cell `TMap` adds overhead per cell. Sparse chunks with dense local arrays keep unused world space unallocated while preserving fast local indexing.

**Read-only vs write-path cell queries**  
Hover, debug, and future path preview should not mutate the world. Splitting `GetCell` from `GetOrCreateCell` keeps observation separate from placement/modification.

**Lightweight cells**  
Cells answer "what is here?" They do not own machine inventory, recipe state, item movement, or Actor logic. Heavy runtime data lives in manager-owned maps/arrays.

**Data-backed conveyors**  
Actor-per-conveyor would not scale for factory layouts. Conveyor identity is naturally its coord, and HISM can render the visual layer efficiently.

**HISM index as visual-only state**  
HISM removal can compact indices. Keeping gameplay identity on coord/resource data prevented conveyor/resource bugs from becoming rendering-index bugs.

**Fixed-step simulation**  
Factory production state does not need per-frame updates. A central timer makes resource transfer, extraction, crafting, and storage easier to reason about and easier to debug.

**Separate storage runtime**  
Storage is not a processor. Keeping `FFactoryStorageRuntimeData` separate avoids overloading machine runtime data with storage-only slot semantics, while still reusing normal port compatibility rules.

**Deferred extractor/machine unification**  
Miners could later become machines with terrain/resource input sources, sharing the processor lifecycle. That refactor is deferred because the current miner path is verified and the MVP still needs demo capture, conveyor variants, and production-chain expansion.

## Iteration and Problem Solving

| Problem | Adjustment | Result |
|---|---|---|
| Hover/debug reads could accidentally create world data | Split `GetCell` and `GetOrCreateCell` query policy | Debug and hover stay read-only while placement creates chunks intentionally |
| HISM resource visuals became unstable when loaded conveyors were deleted | Hid moving resource visual instances instead of removing them | Deleting conveyors carrying resources no longer depends on compacted HISM indices |
| Final storage input could remain disconnected after fast setup | Refreshed loaded conveyors before fixed-step movement | Miner -> Conveyor -> Storage setups recover without replacing storage |
| Machine and storage widgets needed live runtime data | Queried manager runtime data by coord/building id | Widgets refresh authoritative state instead of stale Blueprint struct copies |
| Demo view was too debug-heavy | Split toolbar/info/guide UI from developer/debug UI | The project can be recorded cleanly while debug data stays one toggle away |

## Current Scope

Implemented:

- UE5 C++ project, GameMode, PlayerController, FactoryPawn, Enhanced Input, and toolbar selection.
- Chunked grid with 32x32 dense chunks, negative coordinate support, placement preview, and removal.
- DataAsset-driven Miner, Conveyor, Smelter, Storage, resource map, resource data, and recipe.
- HISM conveyor visuals and HISM resource visuals.
- Fixed-step miner extraction, conveyor movement, smelter recipe processing, and storage transfer.
- Machine and storage building info panels backed by C++ query APIs.
- Dedicated building selection toolbar widgets, guide/tooltip UI, and mesh-captured building icons.
- Debug drawing and developer UI for grid, chunks, conveyors, machines, extractors, and storage.

Not implemented yet:

- Packaged release page and versioned build history.
- Conveyor turns/splitters/mergers beyond the current single-cell directional conveyor model.
- Conveyor speed/progress as real throughput rather than one transfer attempt per fixed step.
- Moving-resource visual pooling/free-list for hidden HISM instances after deletion stress.
- Path-assisted conveyor placement.
- Extractor/machine runtime unification through a terrain/resource input concept.
- Save/load.
- Larger production chains beyond the first iron chain.
- Performance profiling at large scale.

## What I Would Do Next

- Record a concise gameplay demo showing the current MVP chain end to end.
- Add versioned release notes and packaged-build history.
- Add conveyor turns, splitters, and mergers to test whether the current port and transfer model generalizes.
- Add a second recipe chain to validate multi-resource routing and storage pressure.
- Add path-assisted conveyor drawing with bounded A* over world grid coordinates.
- Add conveyor speed/progress accumulators after the demo chain is stable.
- Revisit miner/extractor unification as a named refactor.
- Serialize chunk/building/conveyor/machine/storage state for save/load.
- Run a scale test across many chunks and many active conveyors, then profile the fixed-step update cost.
