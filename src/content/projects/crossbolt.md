---
title: "CrossBolt — Rhythm Game Prototype"
featured: false
draft: true
tags: ["Unity", "C#", "Rhythm", "Systems", "Tools"]
role: "Gameplay Programmer / Technical Designer (Team)"
stack: "Unity 2022, C#, Unity Input System"
year: "2025"
summary: "A team rhythm game prototype in Unity featuring a dual-orb 6-track note highway, a custom chart pipeline, and an in-engine beat map editor. I led note/grammar design and owned the runtime path from chart parsing to note spawning, including a branch-level judgement complexity optimization."
highlights:
  - "Custom chart pipeline: .txt chart grammar parsed by NoteLevelConverter into runtime timestamp queues with typed validation errors"
  - "Designed a two-layer note schema (NoteType + NoteProperty) to map gameplay intent directly into data and prefab behavior"
  - "Procedural hold body geometry via HoldMesh.cs: body length scales at runtime rather than stretching sprites"
  - "ChartSpawner runtime path: TimestampNoteContainer queue consumption plus NotesByTimeBuckets for bounded hit-lookup cost"
  - "Judgement-path optimization branch: O(N) active-list scan -> O(P) pending-window checks + O(1) hold re-activation lookup"
  - "In-engine beat map editor: BPM-snap grid, note placement, and .txt chart file authoring"
coverImage: "/images/projects/crossbolt/CB-Cover.png"
demoVideo: ""
demoVideoFallback: "/images/projects/crossbolt/CB-AutoplayDemo.mp4"
screenshots: []
links:
  github: ""
order: 3
keyFeatures:
  - "Custom Chart Pipeline"
  - "6-Type Note Architecture"
  - "Procedural Hold Mesh"
  - "Judgement Complexity Optimization"
  - "Beat Map Editor"
  - "Data-Driven Design"
focus: "Gameplay Programming · Technical Design · Player Experience Systems · Runtime Optimization"
focusCards:
  - title: "Led Core Gameplay Design"
    description: "Led the design of note types, note properties, and chart authoring syntax — from player experience intent through data structure definition."
  - title: "Data-Driven Chart Pipeline"
    description: "Custom .txt chart format parsed into typed data structures at runtime — designed for versioning, editability, and separation from engine tooling."
  - title: "Note Type & Property System"
    description: "Six note types and six properties with distinct interaction and scoring behaviors, designed with explicit authoring and performance intent per variant."
  - title: "Player Experience Through Optimization"
    description: "Improved judgement-path scalability and consistency through targeted runtime optimization in dense chart scenarios."
  - title: "In-Engine Tooling"
    description: "Beat map editor built as a Unity EditorWindow for chart authoring, targeting a self-contained design-to-test workflow inside the project."
---

## Gameplay Concept

CrossBolt is a 6-track falling note rhythm game for keyboard — single-player, local, no controller required.

Controls are split across both hands with a fixed key layout:
- **Left hand** (Red orb): `A` move left · `S` tap · `D` move right
- **Right hand** (Blue orb): `J` move left · `K` tap · `L` move right
- **Both thumbs**: `Space` for Flux (center sustained note)
- **Ring fingers** (`A` / `D` / `J` / `L`): also trigger Flick input when a note requires a lateral move

Each orb occupies a lane and moves between lanes on flick input. Hit detection resolves against **current orb position**, not a fixed hand assignment — so if both orbs are on the same lane, either tap input can register the note there. This means chart design can route notes around orb positioning rather than hard-coding left/right hand splits.

Note types span Tap, Flick, Flux, Hold variants, and Chain — each requiring different input timing and duration.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/crossbolt/[PLACEHOLDER_gameplay.gif]" aria-label="Open CrossBolt gameplay in large view">
<img src="/images/projects/crossbolt/[PLACEHOLDER_gameplay.gif]" alt="CrossBolt autoplay run showing dual-orb note highway" class="content-media" loading="lazy" />
</button>
<figcaption>Autoplay run: dual-orb note highway with tap, flick, and hold notes across 6 tracks.</figcaption>
</figure>

## What I Owned

I owned the chart data pipeline, note type architecture, chart spawning path, branch-level judgement optimization, and beat map editor — the systems that define how charts are authored, loaded, represented, and instantiated at runtime.

Contribution evidence in team context: 66 / 197 commits were authored by me, concentrated in chart parsing, note architecture, runtime spawning, and editor tooling paths.

<div class="media-grid media-grid-2 ownership-system-grid">
<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: Note Type Architecture</p>
<p>Data structure design and runtime behavior for all note types, including procedural hold mesh and unified flick prefab system.</p>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: Chart Pipeline & Converter</p>
<p>Custom .txt chart format design and full pipeline from authoring syntax to spawned chart GameObjects and active note queues.</p>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: LevelController — Chart Spawning</p>
<p>Type-aware note spawning logic and <code>NotesByTimeBuckets</code> lookup structure. Built in collaboration with teammate-owned input and orb systems.</p>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: Judgement Path Optimization (Branch)</p>
<p>On <code>Process-Hit-Optimization</code>, I led a branch-level refactor that shifted judgement from O(N) active-list scans to O(P) pending-window checks plus O(1) hold lookups.</p>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: Beat Map Editor</p>
<p>In-engine EditorWindow for BPM-snap chart authoring and .txt export. Currently at exploration stage — basic tap note placement functional.</p>
</div>
</div>

I did not solely own baseline scoring formulas, judgement-window constants, or input action binding (teammate-owned); orb movement and animation; audio integration or music; or visual art and shader design. I did collaborate on judgement/scoring integration points and later led the dedicated judgement complexity optimization branch.

## Core Systems

This section is implementation-first: what I built, how each system behaves at runtime, and how the systems connect into one playable loop.

### Note Type System

This system is implemented as a two-layer schema shared by runtime spawning and judgement: `NoteType` defines interaction category, and `NoteProperty` defines per-note variant behavior.

#### NoteType Layer

`NoteType` is stored on every `Note` and drives prefab routing plus input matching in runtime flow.

- `TAP`: lane-based tap input.
- `FLICK`: directional flick input with `targetTrackNumber`.
- `FLUX`: center-lane global input (`Space`) independent of orb lane position.
- `CHAIN`: hold-body internal judgement nodes.

Runtime mapping is implemented through `ChartSpawner` prefab selection and `LevelController` input/judgement checks using the same enum values.

#### Runtime Carrier: NoteMonoBehaviour

`NoteMonoBehaviour` is the runtime component attached to spawned note objects. It binds parsed `Note` data to scene objects and holds mutable judgement/hold state.

- `CopyNoteData(Note, scrollSpeed)` copies `noteID`, `noteType`, `noteProperty`, `targetTime`, `trackNumber`, `targetTrackNumber`, and `duration` from chart data into runtime state.
- For hold-type properties, it resolves the `Body` transform and precomputes hold height from `duration * scrollSpeed`.
- Runtime judgement flags and state (`isHit`, `isHolding`, `holdElapsed`, `holdingInputSource`) are updated by `LevelController` during hit/release flow.
- For hold visuals, `Update()` drives `HoldMesh.UpdateHold(...)` so hold body geometry updates over time while active.
- `NoteHitHelper` consumes `NoteMonoBehaviour` fields (`noteType`, `trackNumber`, `noteProperty`) to trigger hit/miss feedback and judgement visualization.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/crossbolt/CB- NoteTypeDesign.png" aria-label="Open note type design reference in large view">
<img src="/images/projects/crossbolt/CB- NoteTypeDesign.png" alt="Note type design reference table showing Tap, Flick, Flux, and Chain with input keys, judgment rules, and hold/double-tap support" class="content-media" loading="lazy" />
</button>
<figcaption>NoteType implementation map: input category, runtime behavior, and prefab/judgement routing per type.</figcaption>
</figure>

#### NoteProperty Layer

`NoteProperty` adds note variants on top of `NoteType` without changing core type identity. Current implementation is one property per note (plain enum, non-flag).

- `DEFAULT`: standard behavior.
- `HOLD`: activates hold-body lifecycle.
- `BURST`: property-tagged variant consumed by scoring/judgement path.
- `EXTRA`: property-tagged variant consumed by scoring/judgement path.
- `INVISIBLE`: hides rendered note body/head in specific contexts (for example, chain within hold).
- `SHIFTHOLD`: hold variant with lateral movement behavior.

Hold-body geometry for hold-related properties is generated procedurally by `HoldMesh.cs` based on timestamp/duration and scroll speed.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/crossbolt/CB- NotePropertyDesign.png" aria-label="Open note property design reference in large view">
<img src="/images/projects/crossbolt/CB- NotePropertyDesign.png" alt="Note property design reference table showing Hold, Burst, Extra, Invisible, and ShiftHold with scoring and interaction rules" class="content-media" loading="lazy" />
</button>
<figcaption>NoteProperty implementation map: per-note variant flags and their runtime effects in spawn, render, and judgement flow.</figcaption>
</figure>

### Chart Pipeline & Data Architecture

The chart format is a custom plain-text timestamp file, parsed at runtime by `NoteLevelConverter`. This keeps chart authoring independent of engine tooling — charts can be versioned, diffed, and edited outside Unity.

The format was designed with [majdata](https://github.com/TeamMajdata) as a conceptual reference — the plain-text authoring syntax used by the MaiMai fan-chart community. The goal was the same: a human-readable, tool-independent format that a charter can author by hand before any dedicated editor exists.

The parser produces two representations from the same source file:
- A `Queue<TimestampNoteContainer>` used by the runtime hit detection path, ordered by timestamp.
- A `List<FixNoteLengthWrapper>` designed for editor grid visualization (6 lanes × beat subdivisions × notes per cell), which was architected but not yet integrated into the editor UI.

Validation errors surface as typed exceptions so chart loading failures are identifiable by category rather than generic null checks.

The chart syntax is **compositional by design**: note entries are built by chaining lane, action, hold modifier, and property modifier tokens in a fixed order (e.g. `4f1h[4:2]` = lane 4 flick to lane 1, hold length 4:2). This mirrors the type/property data model directly in the text format — the grammar structure and the runtime data structure are in the same shape. The syntax also supports a **beat-context system**: `(120)` sets the active BPM and `{4}` sets the note division; both persist until the next override, so a charter can change tempo and rhythm mid-chart without annotating every note with an absolute timestamp.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/crossbolt/CB- ChartTXTParserGrammar.png" aria-label="Open chart syntax reference in large view">
<img src="/images/projects/crossbolt/CB- ChartTXTParserGrammar.png" alt="Chart .txt syntax reference table showing BPM, note division, tap, flick, hold, burst, and simultaneous note tokens" class="content-media" loading="lazy" />
</button>
<figcaption>Chart Syntax Reference: composable token grammar for lane, note type, hold modifier, and property — mirroring the runtime NoteType/NoteProperty data model.</figcaption>
</figure>

### LevelController — Chart Spawning Logic

At level load, `ChartSpawner.SpawnChart()` calls `NoteLevelConverter.GetTimestampNoteContainers()` to receive the parsed queue already sorted by timestamp. The spawner then iterates through the queue (`while (noteQueue.Count != 0)`), and for each `TimestampNoteContainer` row, it:
- Calls `GetTimeStamp()` to compute the note's Y-axis position (`timestamp * scrollSpeed + SpawnY`)
- Calls `GetBPM()` to retrieve the active BPM context (used when configuring hold duration calculations)
- Iterates through all 6 tracks by calling `GetNotesOnTrack(track)` for each lane, which returns a list of simultaneous notes on that track at this timestamp
- Selects the appropriate prefab based on `noteType` and `noteProperty` and instantiates it with the computed position and any hold-body parameters
- Populates typed active note lists (activeTapNotes, activeFlickNotes, etc.) that downstream systems query during hit detection

This timestamp-queue design ensures notes are processed in order, making the spawning loop O(n) where n is the total note count, with no additional sorting cost.

Key spawning behaviors:
- Type-aware prefab selection and instantiation with material assignment per note category.
- Hold body spawned with a headless prefab at overlapping positions (epsilon offset prevents visual gap between head and body).
- Hold body geometry is procedural: `HoldMesh.cs` generates mesh vertices at spawn time from start/end timestamps and scroll speed, ensuring body length accuracy regardless of frame rate.
- `NotesByTimeBuckets` groups active notes into time-keyed buckets so each frame's hit check resolves in O(1) rather than scanning the full active list.

#### Judgement Path Optimization (Branch)

Implemented on `Process-Hit-Optimization` branch:
- Replaced full-list per-input filtering with a `pendingNotesList` sliding window over `allNotesQueue` in `[currentTime - Good, currentTime + Good]`.
- `PopulatePendingNotesList()` only processes notes entering/leaving the timing window (amortized O(K), where K is window churn per frame) instead of rescanning all active notes.
- `ProcessHit()` iterates only the pending window (O(P), where P is notes currently in the judgement window, typically small) and removes matched notes immediately.
- Replaced hold re-activation `FirstOrDefault` scans with O(1) track references (`pendingHoldRed`, `pendingHoldBlue`, `pendingHoldFlux`).
- Unified chain/miss handling into the same pending pipeline (`ProcessMiss` + pending-window expiry), reducing duplicated code paths and edge-case drift.

This branch-level optimization was completed and tested as a standalone runtime pipeline change, but not merged back into the final prototype branch before content lock.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/crossbolt/[PLACEHOLDER_chart_spawner.png]" aria-label="Open chart spawner implementation in large view">
<img src="/images/projects/crossbolt/[PLACEHOLDER_chart_spawner.png]" alt="ChartSpawner inspector and note spawning flow" class="content-media" loading="lazy" />
</button>
<figcaption>Chart Spawning System: timestamp-queue iteration, type-aware prefab routing, and active list population at runtime.</figcaption>
</figure>

### Beat Map Editor

The beat map editor is a Unity EditorWindow that lets a chart author place notes on a BPM-snap grid and export to the .txt format the runtime pipeline consumes.

Current state: basic tap note placement is functional; hold and flick types remain an active exploration area. The editor is not yet at a production-use level but establishes the round-trip: author in editor → export .txt → load at runtime.

A minimum-complete waveform visualizer provides an audio reference layer for beat alignment.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/crossbolt/[PLACEHOLDER_editor.png]" aria-label="Open beat map editor screenshot in large view">
<img src="/images/projects/crossbolt/[PLACEHOLDER_editor.png]" alt="In-engine beat map editor showing BPM grid and note placement UI" class="content-media" loading="lazy" />
</button>
<figcaption>Beat Map Editor System: BPM-snapped grid with note placement and .txt export, integrated as a Unity EditorWindow.</figcaption>
</figure>

## Why This Design

After the implementation layer, this section explains the technical-design rationale: why these systems were shaped this way, what trade-offs were accepted, and what constraints drove those choices.

### Key Decisions and Trade-offs

- **Plain-text chart format inspired by [majdata](https://github.com/TeamMajdata)**: the chart syntax takes majdata (the plain-text fan-chart format used by the MaiMai community) as a reference point — human-readable, no engine dependency. This let the pipeline be useful before the in-engine editor reached usable state, since charts could be authored and tested by hand from day one.
- **Beat-context system over per-note timestamps**: BPM and note division are set as persistent context tokens `(BPM)` and `{division}` that apply to all following notes until overridden, rather than requiring each note to carry an absolute timestamp. This keeps the chart file readable and enables mid-chart tempo changes without inflating entry size.
- **Two output representations from one parse pass**: the same `NoteLevelConverter` produces both the runtime queue and the editor array in one pass, avoiding a second parse or keeping two separate loaders in sync.
- **Procedural hold body geometry**: stretching a sprite for variable-length holds creates distortion at high scroll speeds; generating a mesh at spawn time keeps the body geometrically consistent regardless of note duration.
- **Unified flick prefab with dynamic transform**: maintaining 5 separate flick prefabs per target-lane distance created a maintenance surface; a single prefab with computed rotation/scale at spawn reduced prefab count and made visual changes apply uniformly.
- **Deliberate presentation/judgement decoupling (instead of collider-driven judgement)**: I intentionally separated the chart presentation layer (spawned note visuals) from the judgement information layer (time-window and input matching logic), rather than using traditional note-object colliders as the source of truth. The software-engineering intent was lower runtime complexity and more controllable judgement flow. The trade-off was heavier debugging overhead (logic-time vs scene-time mismatches), startup timing offset sensitivity when audio latency compensation was misaligned, and slower rapid-prototyping speed compared with collider-first iteration. This was later mitigated through collaborative startup synchronization work: coroutine-gated audio preloading plus DSP-time scheduled playback so chart fall-time and audio start remained aligned.
- **Orb-position-based hit resolution**: hit detection resolves against the orb's current lane rather than a fixed per-hand track. This was a deliberate gameplay design choice — chart authors can route notes around orb positioning, and both inputs become valid on shared lanes when orbs converge. The rule is enforced in `GetInputTrack`, which always returns the orb's live position rather than a hardcoded track.
- **NotesByTimeBuckets for hit lookup**: as chart density increases, linear scan over an active note list per frame becomes a hotspot; bucketing by timestamp quantizes the search space to a small window around the current DSP time.
- **Player-experience-first judgement optimization (branch)**: in `Process-Hit-Optimization`, judgement moved from active-list scans to a pending-window queue plus O(1) hold references. The design goal was not only lower complexity but more stable timing response and fewer edge-case inconsistencies in dense sections.
- **Scoring modifier design as two axes**: Burst and Extra were designed as opposing ends of a risk/reward spectrum rather than just score multipliers — Burst raises stakes on key beats and climax sections (higher ceiling, larger miss penalty, performance effect aligned to music intensity), while Extra lowers the floor for accessibility or massed visual spectacle (wider window, slight bonus, expressive chart density without punishment). This distinction drove the decision to keep them as separate properties rather than a single difficulty scalar.

### Why This Demonstrates Technical Design Fit

- **Design-to-data translation**: gameplay intent (Burst vs Extra, Flux vs lane-bound notes) is encoded as explicit schema decisions (`NoteType`, `NoteProperty`) rather than hardcoded one-off behaviors.
- **Authoring-to-runtime continuity**: one chart grammar drives both authoring output and runtime spawning input, reducing format drift between tools and gameplay.
- **Performance-aware runtime shaping**: queue-ordered spawn flow and time-bucketed lookup avoid frame-time spikes from full-list scans.
- **Algorithmic iteration beyond shipped branch**: the separate `Process-Hit-Optimization` branch demonstrates deeper runtime work — sliding-window pending queues and O(1) hold re-activation lookups for judgement-path complexity control tied to player-facing timing consistency.
- **Engineering synchronization proof under runtime constraints**: startup offset fixes were handled through coroutine-based load-state gating and DSP-timed playback scheduling (`PlayScheduled`) to coordinate asynchronous audio readiness with gameplay timing expectations.
- **Scope and boundary discipline**: teammate-owned systems are explicitly separated, while unfinished editor integrations are documented as next-step work rather than overstated as shipped.

## Project Context

CrossBolt is the first project where I did gameplay design work in a real team setting, and it shows both the upside and the constraints of that.

The project started without effective project management — no GDD, no clear scope, and early design directions from the team that pointed in different directions. At a certain point I made the call to consolidate: pick the core mechanics I had in mind, get a playable version out first, and use that as the baseline to iterate from. The GDD wasn't written until much later.

On the execution side, my natural tendency was to reach for algorithmic and software-engineering solutions first — which produced solid systems (the chart pipeline, the note data architecture, `NotesByTimeBuckets`) but sometimes at the cost of keeping the broader gameplay loop moving forward. That's a tension I recognised more clearly after going through the MSWE capstone with an explicit PM framework, and it's something I've been actively recalibrating.

What this project demonstrates alongside the systems work: design judgment under ambiguity, willingness to make a scope call when the team lacks one, and honest self-awareness about where over-engineering can get in the way of shipping.

For gameplay programming roles, this project shows end-to-end runtime system ownership and implementation depth. For technical design roles, it shows player-experience-driven system shaping, explicit trade-off reasoning, and schema-level design decisions grounded in real runtime constraints.

## What I'd Do Next

- Complete hold and flick note support in the beat map editor to reach a usable authoring state.
- Integrate the `FixNoteLengthWrapper` array representation into the editor UI to display notes as a beat-aligned grid instead of raw timestamp input.
- Complete end-to-end variable BPM/time-signature workflow coverage (parser, editor authoring UX, and runtime validation).
- Add chart validation tooling (per-note visual preview, timing gap detection) to close the author-test loop.
- Evaluate whether `ChartSpawner` prefab routing should move to a data-asset-driven registry (similar to VA's `DA_` module pattern) to support note skin variants without code changes.
- Port and benchmark the `Process-Hit-Optimization` branch changes into the latest mainline runtime, then validate judgement parity with replay-based regression charts.
