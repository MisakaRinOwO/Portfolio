---
title: "Project Summon"
featured: true
draft: false
tags: ["UE5", "Blueprint", "C++", "Local Multiplayer", "Action RPG"]
role: "Gameplay Programmer (Team Systems)"
stack: "Unreal Engine 5, Blueprint, C++, UMG, Diversion"
year: "2025"
summary: "A collaborative UE5 capstone where I owned core gameplay implementation and system integration to ship a complete loop (hub -> room combat -> loot -> return) under a fixed 10-week schedule."
highlights:
  - "Loop-first capstone scope: campfire hub -> room encounters -> combat -> loot -> progression return"
  - "Room progression system with spawn orchestration, clear checks, chest reward flow, and unlock gating"
  - "Deterministic cone-based melee hit checks for readable and tunable top-down combat"
  - "Inventory and loot workflow with world labels, pickup/storage/equipment flow, and HUD integration"
  - "Local multiplayer join/selection flow with GameInstance-based cross-level player data sync"
coverImage: "/images/projects/project-summon/PS- Poster.png"
demoVideo: "https://www.youtube.com/embed/gYHEjQshulw"
demoVideoFallback: "/images/projects/project-summon/PS- ProjectSummonWeek11Showcase.mp4"
screenshots: []
links:
  video: "https://www.youtube.com/watch?v=gYHEjQshulw"
  github: ""
order: 2
keyFeatures:
  - "Room Progression Orchestration"
  - "Deterministic Combat Runtime"
  - "Cross-Level Player Data Sync"
  - "Blueprint-C++ Integration"
  - "Scope-Disciplined Sprint Delivery"
focus: "Gameplay Programming · Systems Integration · Team Delivery"
focusCards:
  - title: "Loop-First MVP"
    description: "The project prioritized getting a full playable loop working before deepening any one mechanic."
  - title: "Gameplay Feature Ownership"
    description: "The work centered on implementing concrete gameplay features and making them function together under capstone constraints."
  - title: "System Integration"
    description: "Combat, progression, inventory, multiplayer flow, and player-data continuity were connected into one player journey."
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
<p><strong class="ownership-kicker">Ownership</strong></p>
<ul>
  <li>Implemented controller registration and local-multiplayer continuity through shared player-state data.</li>
  <li>Integrated portal-return updates and cross-level player data sync in the same GameInstance-backed persistence path (currently inventory/progression-focused).</li>
</ul>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: UI and Player Feedback</p>
<p><strong class="ownership-kicker">Ownership</strong></p>
<ul>
  <li>Built title-screen class selection and runtime HUD in UMG.</li>
  <li>Connected gameplay-side state updates to cooldown and HP UI feedback.</li>
</ul>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: Combat, Abilities, and Animation</p>
<p><strong class="ownership-kicker">Ownership</strong></p>
<ul>
  <li>Built lightweight Blueprint ability architecture with montage-aligned execution timing.</li>
  <li>Implemented weapon/ammo split, ranged lock-on and retarget controls, and lock-highlight behavior.</li>
  <li>Handled C++ functional integration with teammate-authored enemy code in the damage path.</li>
</ul>
</div>

<div class="ownership-list ownership-list-primary ownership-system-card">
<p><strong class="ownership-kicker">System</strong>: Loot and Progression Hooks</p>
<p><strong class="ownership-kicker">Ownership</strong></p>
<ul>
  <li>Implemented chest interaction and loot-generation flow tied to room clear state.</li>
  <li>Built BP_RoomManager trigger logic (collider + overlap checks) to drive enemy-clear progression events.</li>
  <li>Wired inventory and equipment updates back into runtime combat readiness.</li>
</ul>
</div>
</div>

I did not own overall class fantasy direction, art direction, or encounter theme; those remained shared team decisions.

## Design Decisions

As an MSE capstone and my first UE5 project, Project Summon forced decisions to be judged against one goal: ship a complete playable MVP in a fixed 10-week schedule while building systems that were reusable, inspectable, and reliable enough for team integration.

### Key Decisions and Trade-offs

- **Loop completion over mechanic depth**: every feature had to contribute to a shippable game flow.
- **Blueprint-first implementation**: I intentionally used Blueprint and built-in engine components as the primary implementation layer so I could build engine fluency while still demonstrating software-engineering judgment through modular, inspectable gameplay systems.
- **Cone-shaped combat ranges over weapon ray tracing**: because the target was a hack-n-smash-leaning top-down RPG, combat and weapon systems were designed for readability, tuning speed, and debugging clarity rather than precision collision timing.
- **Actor-based weapon hitbox instead of a component**: BP_WeaponRangeHitbox_MASTER was attached to the player character as an actor so I could monitor instance data and adjust hitbox distance/angle quickly.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- PlayerCharacterSystemHierarchy.png" aria-label="Open player character hierarchy image in large view">
<img src="/images/projects/project-summon/PS- PlayerCharacterSystemHierarchy.png" alt="Player character hierarchy showing weapon hitbox attachment and weapon loadout structure" class="content-media" loading="lazy" />
</button>
<figcaption>Actor-based hitbox: range-hitbox actor attached to character, keeping instance data directly inspectable during tuning.</figcaption>
</figure>

- **Separate ranged weapon / ammo actors**: ranged hits were driven by ammo collision with enemies rather than reusing the melee range hitbox.
- **State continuity across scenes**: player-data payloads were designed to survive hub-to-level transitions from the start, with current saved fields focused on inventory/progression continuity.
- **Shared parent-child actor architecture across gameplay modules**: the same hierarchy-first composition pattern was applied across character, weapon, ability, and ammo systems so behavior could be specialized without duplicating base runtime logic.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- WeaponSystemHierarchy.png" aria-label="Open weapon system hierarchy image in large view">
<img src="/images/projects/project-summon/PS- WeaponSystemHierarchy.png" alt="Weapon system hierarchy showing melee and ranged branches" class="content-media" loading="lazy" />
</button>
<figcaption>Shared hierarchy pattern: weapon behavior split into melee and ranged branches under a common parent, demonstrating the same specialization approach used across gameplay modules.</figcaption>
</figure>

Taken together, these decisions reflect the same priority: ship a complete playable loop while choosing systems that were easy to inspect, practical to integrate, and useful as evidence of software-engineering judgment in a first UE5 capstone. The trade-off was deliberate: I prioritized tuning speed, integration reliability, delivery confidence, and UE5 implementation fluency over adopting heavier engine-specific systems such as GAS or more advanced hit-detection approaches, which would make more sense to evaluate in a deeper or longer-scope follow-up build.

## Core Systems

### Player Flow and Persistence

- Controller registration and local-multiplayer continuity were implemented through a shared player-state model.
- Class selection handoff and portal return both feed the same GameInstance persistence path used for cross-level player data sync.
- Join flow was built around controller-driven player spawning: when a local controller joins and has no valid pawn, the game spawns a player actor and registers that controller against the new player instance.
- Start-game transition writes each active player's runtime state payload into a per-player persistence struct, keyed by controller identity inside GameInstance.
- After a new level loads, the game rebuilds player pawns from stored entries and reapplies the saved payload (currently inventory/progression-focused); the same persistence update path is reused when all players collide with the return portal.

Result/impact: this preserves cross-level player data continuity between loop transitions and made multiplayer handoff behavior more predictable during interactive testing.

Implementation note: on level transition, player runtime data is serialized into a struct and stored in GameInstance; after level load, the stored struct is reloaded and reapplied to the player state (with current fields centered on inventory/progression).

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- PlayerInfoStructure.png" aria-label="Open player info structure image in large view">
<img src="/images/projects/project-summon/PS- PlayerInfoStructure.png" alt="Player info structure storing controller identity and cross-level player data fields" class="content-media" loading="lazy" />
</button>
<figcaption>Player Data Sync Structure: `S_PlayerInfo` stores per-player data for join registration and cross-level state reapplication.</figcaption>
</figure>

<div class="va-grid-carousel" data-va-carousel data-auto-ms="5000" aria-label="Player flow and persistence evidence gallery">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous player flow evidence image"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>

<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/project-summon/PS_LootAndCrossLvSync.gif" aria-label="Open cross-level data sync gif in large view">
<img src="/images/projects/project-summon/PS_LootAndCrossLvSync.gif" alt="Cross-level inventory/progression synchronization between room and title/next entry" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Player Data Sync System: stored player data is preserved and reapplied across loop transitions.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/project-summon/PS-JoinGameAndStart.gif" aria-label="Open multiplayer join-to-level control gif in large view">
<img src="/images/projects/project-summon/PS-JoinGameAndStart.gif" alt="Local multiplayer join flow continuing into level start with controllable players" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Local Multiplayer Handoff System: title-screen join state carries into level start with active player control.</figcaption>
</figure>
</div>

<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next player flow evidence image"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>

<div class="va-grid-carousel-dots" role="tablist" aria-label="Player flow evidence image pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show image 2" aria-current="false"></button>
</div>
</div>

### UI and Player Feedback

- UMG implementation covers title-screen class selection and runtime HUD state.
- Gameplay-side data hookup keeps cooldown/HP feedback synchronized during combat.
- UI state layout and interaction flow were first aligned in Figma, then translated into UMG widgets to keep implementation and design intent consistent.

Result/impact: HP loss and ability cooldown state are visible to the player immediately on trigger, keeping combat readability high; HUD-state debugging was also faster because the UI reflected gameplay state directly rather than maintaining separate UI-side state.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- PlayerHUDwithAbilityCD.png" aria-label="Open HUD with ability cooldown image in large view">
<img src="/images/projects/project-summon/PS- PlayerHUDwithAbilityCD.png" alt="In-game HUD showing ability cooldown feedback" class="content-media" loading="lazy" />
</button>
<figcaption>Runtime readability: HUD cooldown feedback supports timing decisions during combat.</figcaption>
</figure>

### Combat, Abilities, and Animation

- Built a lightweight Blueprint ability architecture with cooldown-category behavior and montage-driven execution timing.
- Used animation notifies to align effect timing and hit-registration windows with active ability state.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- SkillSystem.png" aria-label="Open skill system architecture image in large view">
<img src="/images/projects/project-summon/PS- SkillSystem.png" alt="Skill system Blueprint architecture with ability flow and cooldown handling" class="content-media" loading="lazy" />
</button>
<figcaption>Ability flow implementation: lightweight Blueprint skill routing and cooldown handling.</figcaption>
</figure>

- Implemented a ranged lock-on system: R3 toggles lock state, retarget input selects the nearest valid enemy, player facing updates toward the locked target, and an actor-follow highlight marks the active lock.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS-%20RangedLockOn.gif" aria-label="Open ranged lock-on behavior gif in large view">
<img src="/images/projects/project-summon/PS-%20RangedLockOn.gif" alt="Ranged lock-on behavior showing toggle, retarget, facing update, and lock highlight" class="content-media" loading="lazy" />
</button>
<figcaption>Ranged Lock-On System: lock toggle, nearest-target retarget, facing update, and active-lock highlight behavior.</figcaption>
</figure>

- Implemented weapon/ammo split with collider-based ranged hit resolution and integrated weapon-range hitbox binding into the player combat path.
- Added C++ functional integration by exposing enemy HP and TakeDamage (`UPROPERTY`/`UFUNCTION`) on teammate-authored actor code, then merging it into the existing hit-detection path for consistent damage resolution.

Result/impact: combat behavior stayed readable under tuning changes, ability/weapon iteration remained stable without frequent branch-specific rewrites, and the C++ integration point kept damage resolution consistent without duplicating hit logic.

### Loot and Progression Hooks

- Built room progression around a BP_RoomManager actor: room overlap scoped active enemies, a 0.25s timer handled the heavier overlap-array refresh, and per-tick clear checks stayed O(1) by evaluating array length only. On clear, the manager used `GetOverlappingActors` to find BP_Spawner actors and ran manager-side spawn functions at their locations (enemy/chest/portal/custom).

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- RoomManagerApplication.png" aria-label="Open RoomManager application image in large view">
<img src="/images/projects/project-summon/PS- RoomManagerApplication.png" alt="RoomManager collider bounds and spawner placement for room progression triggers" class="content-media" loading="lazy" />
</button>
<figcaption>RoomManager application: collider-scoped room area with enemy/chest spawner placement used by clear-condition trigger logic.</figcaption>
</figure>

- Chest-interaction reward flow and loot generation are tied to room-clear state through the same trigger path.
- Progression sequence in the demo: Room 1 clear -> chest spawn + next area unlock; Room 2 clear -> chest spawn, and opening the chest unlocks the next area (releasing a surprise enemy wave); Room 3 clear -> chest spawn + return portal spawn.
- Inventory/equipment updates feed back into runtime combat readiness.

<figure class="va-standalone-figure">
<button type="button" class="va-standalone-zoom" data-lightbox-src="/images/projects/project-summon/PS- InventorySystem.png" aria-label="Open inventory system image in large view">
<img src="/images/projects/project-summon/PS- InventorySystem.png" alt="Inventory system implementation view with item storage and update flow" class="content-media" loading="lazy" />
</button>
<figcaption>Inventory System Architecture: pickup, storage, and equipment data path integrated into the gameplay loop.</figcaption>
</figure>

Result/impact: reward cadence became easier to tune per room, and loot-state updates remained consistent with combat-readiness feedback.

## Integration and Delivery

This project combined gameplay programming with delivery management under a fixed 10-week MVP window.

- Engineering delivery: features had to integrate cleanly with teammate-owned systems, with branch sync and merge handoff managed in Diversion.
- Sprint execution: scope was set on Saturday/Sunday, and each following week focused on one feature/system through implementation, integration, and testing.
- Scope-control policy existed as an early contingency plan (reduce to a 1-2 day deliverable or cut), but this project phase ultimately shipped on time.
- PM contribution: I supported sprint planning/report updates and execution tracking so schedule decisions stayed visible and actionable.
- Artifact-backed process: charter, WBS, schedule, and project plans aligned the team on MVP priorities and early risk control.
- Execution reality: most time went to UE system learning, approach decisions, and debugging; once decisions settled, implementation moved quickly.
- Why we still shipped on time: sprint budgeting split decide/apply effort up front. Decision work lagged, but apply work ran ahead and offset the delay.

<div class="va-grid-carousel" data-va-carousel data-auto-ms="5500" aria-label="Sprint 4 planning artifacts carousel">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous sprint artifact image"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>

<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/project-summon/PS- WBSsprint4-1.png" aria-label="Open Sprint 4 WBS artifact 1 in large view">
<img src="/images/projects/project-summon/PS- WBSsprint4-1.png" alt="Sprint 4 WBS artifact showing work package breakdown" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Sprint Planning Architecture: Sprint 4 WBS for task sequencing and tracking.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/project-summon/PS- WBSsprint4-2.png" aria-label="Open Sprint 4 WBS artifact 2 in large view">
<img src="/images/projects/project-summon/PS- WBSsprint4-2.png" alt="Sprint 4 WBS artifact showing delivery slices" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>Sprint Execution Architecture: delivery slices balancing decision and implementation throughput.</figcaption>
</figure>
</div>

<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next sprint artifact image"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>

<div class="va-grid-carousel-dots" role="tablist" aria-label="Sprint artifact pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show sprint artifact 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show sprint artifact 2" aria-current="false"></button>
</div>
</div>

Result: the project demonstrates both gameplay implementation depth and PM process participation in team production.

## Architecture Snapshot

These C4 views were prepared for a capstone course showcase and are kept here as a compact appendix, with implementation detail anchored in the inventory flow.

<div class="va-grid-carousel" data-va-carousel data-auto-ms="5500" aria-label="C4 architecture snapshot carousel">
<div class="va-grid-carousel-stage">
<button type="button" class="va-grid-carousel-nav" data-carousel-prev aria-label="Previous architecture image"><span class="va-nav-triangle va-nav-triangle-left" aria-hidden="true"></span></button>

<div class="va-grid-carousel-viewport">
<figure class="va-grid-carousel-slide is-active">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/project-summon/PS- C4ModelLevel1-SystemContext.png" aria-label="Open C4 level 1 system context diagram in large view">
<img src="/images/projects/project-summon/PS- C4ModelLevel1-SystemContext.png" alt="C4 level 1 system context diagram" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>C4 L1 System Context: project boundary and external interactions.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/project-summon/PS- C4ModelLevel2-ContainerDiagram.png" aria-label="Open C4 level 2 container diagram in large view">
<img src="/images/projects/project-summon/PS- C4ModelLevel2-ContainerDiagram.png" alt="C4 level 2 container diagram" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>C4 L2 Container Architecture: runtime containers and control/data responsibilities.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/project-summon/PS- C4ModelLevel3-InventorySystemExample.png" aria-label="Open C4 level 3 inventory subsystem diagram in large view">
<img src="/images/projects/project-summon/PS- C4ModelLevel3-InventorySystemExample.png" alt="C4 level 3 inventory subsystem diagram" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>C4 L3 Inventory Subsystem: module structure and dependencies.</figcaption>
</figure>

<figure class="va-grid-carousel-slide">
<button type="button" class="va-grid-carousel-zoom" data-lightbox-src="/images/projects/project-summon/PS- C4ModelLevel4-ItemPickupAndUpdateInventoryLogic.png" aria-label="Open C4 level 4 pickup to inventory flow diagram in large view">
<img src="/images/projects/project-summon/PS- C4ModelLevel4-ItemPickupAndUpdateInventoryLogic.png" alt="C4 level 4 pickup to inventory update flow" class="va-grid-carousel-image" loading="lazy" />
</button>
<figcaption>C4 L4 Inventory Update Flow: pickup event to inventory state mutation path.</figcaption>
</figure>
</div>

<button type="button" class="va-grid-carousel-nav" data-carousel-next aria-label="Next architecture image"><span class="va-nav-triangle va-nav-triangle-right" aria-hidden="true"></span></button>
</div>

<div class="va-grid-carousel-dots" role="tablist" aria-label="Architecture image pages">
<button type="button" class="va-grid-carousel-dot is-active" data-carousel-dot="0" aria-label="Show architecture image 1" aria-current="true"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="1" aria-label="Show architecture image 2" aria-current="false"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="2" aria-label="Show architecture image 3" aria-current="false"></button>
<button type="button" class="va-grid-carousel-dot" data-carousel-dot="3" aria-label="Show architecture image 4" aria-current="false"></button>
</div>
</div>

## Outcomes

What this project demonstrates clearly:

- Gameplay programming under real scope pressure.
- System integration across combat, progression, inventory, multiplayer, and player-data sync.
- Blueprint and C++ interoperability in a team development context.
- Delivery-minded decision making and sprint-level PM execution under milestone pressure.

Project framing from current evidence:

- A UE5 action-RPG capstone built around a complete playable loop rather than a single showcase mechanic.
- A gameplay-programming effort focused on room progression, combat behavior, inventory flow, multiplayer join/player-data sync, and UI feedback.
- A project where the clearest claims are system implementation and integration under fixed delivery constraints.

## What I'd Do Next

- Evaluate GAS if the project scope expanded toward more scalable ability logic, richer state interactions, or a larger combat roster.
- Revisit hit-detection strategy if combat depth became a higher priority, including whether more precise tracing or hybrid approaches would improve feel without hurting readability.
- Keep the current Blueprint-first, inspectable architecture as a valid MVP baseline, then layer more specialized UE systems only where they clearly improve scale, maintainability, or combat expressiveness.
- Track decision-to-implementation lead time per sprint as a lightweight PM metric, then use it to tune future decide/apply budgeting.
