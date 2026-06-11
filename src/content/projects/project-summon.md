---
title: "Project Summon"
featured: true
draft: false
tags: ["UE5", "Blueprint", "C++", "Local Multiplayer", "Action RPG"]
role: "Gameplay Programmer (Team)"
stack: "Unreal Engine 5, Blueprint, C++, UMG, GameInstance"
year: "2025"
summary: "A collaborative UE5 capstone where I owned core gameplay implementation and system integration to ship a complete loop (hub -> room combat -> loot -> return) under a fixed 10-week schedule."
highlights:
  - "Loop-first capstone scope: campfire hub -> room encounters -> combat -> loot -> progression return"
  - "Room progression system with spawn orchestration, clear checks, chest reward flow, and unlock gating"
  - "Deterministic cone-based melee hit checks for readable and tunable top-down combat"
  - "Inventory and loot workflow with world labels, pickup/storage/equipment flow, and HUD integration"
  - "Local multiplayer join/selection flow with GameInstance-based cross-level persistence"
coverImage: "/images/projects/project-summon/PS- PlayerHUDDesign.png"
demoVideo: "https://www.youtube.com/embed/gYHEjQshulw"
demoVideoFallback: "/images/projects/project-summon/PS- ProjectSummonWeek11Showcase.mp4"
screenshots: []
links:
  video: "https://www.youtube.com/watch?v=gYHEjQshulw"
  github: ""
order: 2
keyFeatures:
  - "Complete Playable Loop"
  - "Room Progression"
  - "Deterministic Combat Checks"
  - "Inventory and Loot"
  - "Local Multiplayer"
  - "Cross-Level Persistence"
focus: "Gameplay Programming · Feature Integration · MVP Delivery"
focusCards:
  - title: "Loop-First MVP"
    description: "The project prioritized getting a full playable loop working before deepening any one mechanic."
  - title: "Gameplay Feature Ownership"
    description: "The work centered on implementing concrete gameplay features and making them function together under capstone constraints."
  - title: "System Integration"
    description: "Combat, progression, inventory, multiplayer flow, and persistence were connected into one player journey."
  - title: "Team Delivery Context"
    description: "The project also demonstrates integration, debugging, and delivery work in a shared team environment."
---

## Gameplay Loop

Each run follows four steps:

**1 - Hub Setup**
Start at the campfire hub and prepare gear/loadout.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS_TitleScreenPlayerJoin.gif" aria-label="Open title-screen player join flow gif in large view">
<img src="/images/projects/project-summon/PS_TitleScreenPlayerJoin.gif" alt="Title-screen player join and class-selection handoff" class="content-media" loading="lazy" />
</button>
<figcaption>Entry flow: local player join and class-selection handoff at title screen.</figcaption>
</figure>

**2 - Encounter Entry**
Enter prototype encounter rooms.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS_PlayersEnterRoom.gif" aria-label="Open encounter entry gif in large view">
<img src="/images/projects/project-summon/PS_PlayersEnterRoom.gif" alt="Players entering encounter room and beginning room flow" class="content-media" loading="lazy" />
</button>
<figcaption>Encounter phase: room pressure begins with enemy spawn and clear-state tracking.</figcaption>
</figure>

**3 - Combat and Loot**
Resolve combat and collect loot.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS_ResolveCombat.gif" aria-label="Open combat and loot resolution gif in large view">
<img src="/images/projects/project-summon/PS_ResolveCombat.gif" alt="Combat resolution and loot interaction in encounter flow" class="content-media" loading="lazy" />
</button>
<figcaption>Combat and reward resolution: encounter pressure, clear condition, and loot handoff in one continuous flow.</figcaption>
</figure>

**4 - Return**
Return to title and start the next cycle.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS_ReturnToTitle.gif" aria-label="Open return-to-title gif in large view">
<img src="/images/projects/project-summon/PS_ReturnToTitle.gif" alt="Return-to-title flow after encounter completion" class="content-media" loading="lazy" />
</button>
<figcaption>Loop return: run completion and transition back to title for the next cycle.</figcaption>
</figure>

## What I Owned

I owned the gameplay-programming implementation that connected player-facing systems into one playable capstone loop.

### Ownership by System

<div class="media-grid media-grid-2 ownership-system-grid">
<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: Player Flow and Persistence</p>
<p><strong class="ownership-kicker">Ownership</strong>: Controller registration, cross-level player sync, class-based weapon spawn handoff, and portal return continuity through shared player-state data.</p>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: UI and Player Feedback</p>
<p><strong class="ownership-kicker">Ownership</strong>: UMG title-screen class selection and runtime HUD implementation, with gameplay-side data hookup for cooldown/HP state synchronization.</p>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: Combat, Abilities, and Animation</p>
<p><strong class="ownership-kicker">Ownership</strong>: Lightweight Blueprint ability architecture, weapon/ammo split with collider-based hit resolution, montage-aligned execution timing, and target-lock usability controls.</p>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: Loot and Progression Hooks</p>
<p><strong class="ownership-kicker">Ownership</strong>: Chest interaction and loot-generation flow tied to room clear state, plus inventory/equipment updates that feed runtime combat readiness.</p>
</div>
</div>

I did not own overall class fantasy direction, art direction, or encounter theme; those remained shared team decisions.

## Design Decisions

As an MSE capstone and my first UE5 project, Project Summon forced decisions to be judged against one goal: ship a complete playable MVP in a fixed 10-week schedule while building systems that were reusable, inspectable, and reliable enough for team integration.

### Key Decisions and Trade-offs

- **Loop completion over mechanic depth**: every feature had to contribute to a shippable game flow.
- **Blueprint-first implementation with C++ integration**: as part of an MSE capstone and my first UE5 project, I intentionally used Blueprint and built-in engine components as the primary implementation layer so I could build engine fluency while still demonstrating software-engineering judgment through modular, inspectable gameplay systems.
- **Cone-shaped combat ranges over weapon ray tracing**: because the target was a hack-n-smash-leaning top-down RPG, combat and weapon systems were designed for readability, tuning speed, and debugging clarity rather than precision collision timing.
- **Actor-based weapon hitbox instead of a component**: BP_WeaponRangeHitbox_MASTER was attached to the player character as an actor so I could monitor instance data and adjust hitbox distance/angle quickly.
- **Separate ranged weapon / ammo actors**: ranged hits were driven by ammo collision with enemies rather than reusing the melee range hitbox.
- **State continuity across scenes**: progression systems were designed with hub-to-level transitions in mind from the start.
- **Shared parent-child actor architecture across gameplay modules**: the same hierarchy-first composition pattern was applied across character, weapon, ability, and ammo systems so behavior could be specialized without duplicating base runtime logic.

Taken together, these decisions reflect the same priority: ship a complete playable loop while choosing systems that were easy to inspect, practical to integrate, and strong at demonstrating software-engineering judgment in a first UE5 capstone. The trade-off was deliberate: I prioritized tuning speed, integration reliability, delivery confidence, and UE5 implementation fluency over adopting heavier engine-specific systems such as GAS or more advanced hit-detection approaches, which would make more sense to evaluate in a deeper or longer-scope follow-up build.

## Core Systems

### Player Flow and Persistence

- Controller registration and local-multiplayer continuity were implemented through a shared player-state model.
- Class selection handoff, cross-level sync, and portal return logic use the same persistence path.

Result/impact: this preserves player data collected between levels and made multiplayer handoff behavior more predictable during interactive testing.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS_LootAndCrossLvSync.gif" aria-label="Open cross-level data sync gif in large view">
<img src="/images/projects/project-summon/PS_LootAndCrossLvSync.gif" alt="Cross-level player progress synchronization between room and title/next entry" class="content-media" loading="lazy" />
</button>
<figcaption>Cross-level data sync evidence: player progress is preserved and reapplied across loop transitions.</figcaption>
</figure>

### UI and Player Feedback

- UMG implementation covers title-screen class selection and runtime HUD state.
- Gameplay-side data hookup keeps cooldown/HP feedback synchronized during combat.

Result/impact: players received immediate, reliable cooldown/HP feedback, and HUD-state debugging became faster because UI reflected gameplay state directly.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- PlayerHUDwithAbilityCD.png" aria-label="Open HUD with ability cooldown image in large view">
<img src="/images/projects/project-summon/PS- PlayerHUDwithAbilityCD.png" alt="In-game HUD showing ability cooldown feedback" class="content-media" loading="lazy" />
</button>
<figcaption>Runtime readability: HUD cooldown feedback supports timing decisions during combat.</figcaption>
</figure>

### Combat, Abilities, and Animation

- Lightweight Blueprint ability architecture with cooldown-category behavior.
- Weapon/ammo split with collider-based ranged hit resolution.
- Weapon-range hitbox and animation binding integrated into the player combat path.
- Ability input is routed through montage-driven execution, where attack/dash feedback and state transition timing stay aligned with cooldown updates.
- Animation notifies were used to keep effect timing and hit-registration windows synchronized with the active ability state.

Result/impact: combat behavior stayed readable under tuning changes, and ability/weapon iteration remained stable without frequent branch-specific rewrites.

<div class="va-grid-carousel" data-va-carousel data-auto-ms="5000" aria-label="Combat systems evidence gallery">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous combat systems image"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>

<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/project-summon/PS- WeaponSystemHierarchy.png" aria-label="Open weapon system hierarchy image in large view">
<img src="/images/projects/project-summon/PS- WeaponSystemHierarchy.png" alt="Weapon system hierarchy showing melee and ranged branches" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Weapon behavior split: melee and ranged branches with explicit hit logic.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/project-summon/PS- SkillSystem.png" aria-label="Open skill system architecture image in large view">
<img src="/images/projects/project-summon/PS- SkillSystem.png" alt="Skill system Blueprint architecture with ability flow and cooldown handling" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Ability flow implementation: lightweight Blueprint skill routing and cooldown handling.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/project-summon/PS- PlayerCharacterSystemHierarchy.png" aria-label="Open player character hierarchy image in large view">
<img src="/images/projects/project-summon/PS- PlayerCharacterSystemHierarchy.png" alt="Player character hierarchy showing weapon hitbox attachment and weapon loadout structure" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Player combat path: range-hitbox attachment and weapon loadout structure in the character hierarchy.</figcaption>
</figure>
</div>

<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next combat systems image"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>

<div class="va-grid-carousel-dots" role="tablist" aria-label="Combat systems image pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="2" aria-label="Show image 3" aria-current="false"></button>
</div>
</div>

> Placeholder: add a short gameplay clip or screenshot showing melee hit detection and ranged ammo collision side by side.

### Loot and Progression Hooks

- Chest-interaction reward flow and loot generation hooks are tied to room clear state.
- Inventory/equipment updates feed back into runtime combat readiness.

Result/impact: reward cadence became easier to tune per room, and loot-state updates remained consistent with combat-readiness feedback.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- InventorySystem.png" aria-label="Open inventory system image in large view">
<img src="/images/projects/project-summon/PS- InventorySystem.png" alt="Inventory system implementation view with item storage and update flow" class="content-media" loading="lazy" />
</button>
<figcaption>Inventory evidence: pickup/storage/equipment data path integrated into the gameplay loop.</figcaption>
</figure>

## Integration and Delivery

The most valuable part of Project Summon was not one isolated feature, but the work of getting multiple systems to function together under capstone constraints.

- Feature work had to survive integration with teammate-authored systems and shared project branches.
- Sprint planning and reporting created pressure to cut scope early and keep only what supported the MVP.
- Debugging, merge recovery, and scene-level hookup work were a substantial part of making the project playable.

That made this project a better demonstration of practical game programming than a mechanics-only prototype.

## Open Design Notes

This project also has some design-facing questions that are worth documenting more clearly later, but should not be over-claimed without better evidence.

### Encounter Pacing and Reward Structure

Room structure used a repeatable pressure-reward cadence: encounter spawn, clear-state confirmation, chest reward, then progression handoff. This sequence made progression readable to players and easier to tune at room granularity, because each step had a distinct trigger and feedback state.

### Multiplayer Readability

Readability in local multiplayer relied on explicit per-player feedback (color/icon identity, cooldown/HP state) and predictable controller-registration handoff between scenes. This reduced input-state ambiguity in active play, though shared-screen readability still depends on encounter density and remains a future polish area.

## Architecture Evidence

To keep implementation auditable, system structure was documented through C4-style views.

### System Context

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- C4ModelLevel1-SystemContext.png" aria-label="Open C4 system context diagram in large view">
<img src="/images/projects/project-summon/PS- C4ModelLevel1-SystemContext.png" alt="C4 level 1 system context diagram" class="content-media" loading="lazy" />
</button>
<figcaption>C4 L1: project context and external interactions.</figcaption>
</figure>

### Container-Level Composition

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- C4ModelLevel2-ContainerDiagram.png" aria-label="Open C4 container diagram in large view">
<img src="/images/projects/project-summon/PS- C4ModelLevel2-ContainerDiagram.png" alt="C4 level 2 container diagram" class="content-media" loading="lazy" />
</button>
<figcaption>C4 L2: main runtime containers and data/control responsibilities.</figcaption>
</figure>

### Inventory Subsystem Detail

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- C4ModelLevel3-InventorySystemExample.png" aria-label="Open C4 inventory subsystem diagram in large view">
<img src="/images/projects/project-summon/PS- C4ModelLevel3-InventorySystemExample.png" alt="C4 level 3 inventory subsystem diagram" class="content-media" loading="lazy" />
</button>
<figcaption>C4 L3: inventory subsystem structure and dependencies.</figcaption>
</figure>

### Item Pickup to Inventory Update Flow

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- C4ModelLevel4-ItemPickupAndUpdateInventoryLogic.png" aria-label="Open C4 pickup to inventory flow diagram in large view">
<img src="/images/projects/project-summon/PS- C4ModelLevel4-ItemPickupAndUpdateInventoryLogic.png" alt="C4 level 4 pickup to inventory update flow" class="content-media" loading="lazy" />
</button>
<figcaption>C4 L4: pickup event to inventory state update execution path.</figcaption>
</figure>

## Outcomes

What this project already demonstrates clearly:

- Gameplay programming under real scope pressure.
- System integration across combat, progression, inventory, multiplayer, and persistence.
- Blueprint and C++ interoperability in a team development context.
- Delivery-minded decision making under milestone pressure.

## What This Page Currently Establishes

From the current text and evidence, the project can be described as:

- A UE5 action-RPG capstone built around a playable loop rather than a single showcase mechanic.
- A gameplay-programming effort focused on room progression, combat behavior, inventory flow, multiplayer join/persistence, and UI feedback.
- A project where the most defensible claims are about system implementation and integration, not about combat class design or build balancing.
- A hack-n-smash-leaning top-down game where readability and tunability mattered more than exact collision precision.
- A shared-team project that still exposes concrete implementation ownership through Blueprint-driven and C++-adjacent systems.

## Evidence Gaps (Placeholders)

The page still needs better evidence for these areas:

- A short trade-off paragraph in the technical-decisions section explaining what the current implementation gained and what it gave up.
- A room-progression visual that clearly shows spawn -> clear -> chest -> unlock flow.
- A combat clip or screenshot that shows melee hit detection and ranged ammo collision in motion.
- An inventory or loot screenshot that shows pickup, storage, or equipment feedback clearly.
- A multiplayer join/selection capture that proves the local-multiplayer flow.

## What I'd Do Next

- Evaluate GAS if the project scope expanded toward more scalable ability logic, richer state interactions, or a larger combat roster.
- Revisit hit-detection strategy if combat depth became a higher priority, including whether more precise tracing or hybrid approaches would improve feel without hurting readability.
- Keep the current Blueprint-first, inspectable architecture as a valid MVP baseline, then layer more specialized UE systems only where they clearly improve scale, maintainability, or combat expressiveness.
