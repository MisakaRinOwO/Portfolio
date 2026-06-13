---
title: "Mindustry Testing Study"
featured: false
draft: true
tags: ["Java", "Software Testing", "JaCoCo", "Open Source"]
role: "Solo"
stack: "Java, JUnit, JaCoCo, Gradle"
year: "2024"
summary: "A software testing study on Mindustry — an open source Java tower defense game. Configured JaCoCo coverage tooling, analyzed existing test coverage gaps, and extended the test suite with functional tests, partition tests, and FSM-derived test cases for the LogicBlock subsystem."
highlights:
  - "Configured JaCoCo plugin for Mindustry's Gradle build to generate HTML/XML coverage reports"
  - "Identified low-coverage targets (LogicBlock: 10%, LogicBuild: 14%) via coverage report analysis"
  - "Added functional test (LogicBlockInit) and partition test (LogicBuildUpdateCode) covering null, valid, invalid, and long string inputs plus link range boundaries"
  - "Modelled logic block link behavior as a finite state machine (Idle → Configuring → Link_Active/Inactive) and derived FSM-based test cases"
  - "Coverage improvement: LogicBlock 10% → 50%, LogicBuild 14% → 57% instruction coverage across two testing iterations"
coverImage: "/images/project-placeholder.svg"
screenshots: []
links:
  github: ""
order: 6
---

## Overview

Mindustry is an open-source tower defense / factory game written in Java (~122k lines before build). This project focuses on software testing methodology: configuring coverage tooling, reading and interpreting coverage reports, and extending test coverage for an underexplored subsystem.

The target subsystem is `LogicBlock` — in-game programmable logic blocks that allow players to write scripts controlling other game objects. Coverage analysis showed near-zero test coverage for this component despite its complexity.

## Tooling Setup

### JaCoCo Coverage Configuration

Mindustry's Gradle build did not include coverage reporting out of the box. I extended `tests/build.gradle` with JaCoCo plugin configuration to:
- Generate HTML and XML coverage reports (`jacocoTestReport`)
- Set a minimum line coverage threshold (50%) per class via `jacocoTestCoverageVerification`
- Wire coverage generation as a post-test finalizer so `./gradlew test` automatically produces a coverage report

```
./gradlew test jacocoTestReport --rerun-tasks
```

This made coverage gaps visible and reproducible for each testing iteration.

## Testing Work

### Baseline Coverage Analysis

Initial JaCoCo report showed `mindustry.world.blocks.logic` was critically under-covered:
- `LogicBlock`: 10% instruction coverage, 0% branch coverage
- `LogicBlock.LogicBuild`: 14% instruction coverage, 8% branch coverage

This identified `LogicBlock` as the high-value target for additional testing.

### Functional Testing — LogicBlockInit

`LogicBlockInit` (ApplicationTest, lines 880–905) verifies that `LogicBlock` initializes with correct default public parameter values. Tests that the block's public state fields match their declared initial values without runtime interference.

### Partition Testing — LogicBuildUpdateCode

`LogicBuildUpdateCode` (ApplicationTest, lines 907–973) applies partition testing to `LogicBuild.updateCode()`, which injects executable script into a logic block via `LAssembler` compilation. Input partitions:
- **Null string** — expected silent handling (method catches and ignores parse errors)
- **Valid code** — expected correct compilation and executor update
- **Invalid code** — expected error suppression with no crash
- **Long string** — boundary behavior under input size
- **Link range**: valid (≤80 blocks) vs invalid (>80 blocks) — tests the link distance constraint

Valuation is based on the `executor` and `code` variables since the method swallows invalid input exceptions.

### FSM Modeling and Test Derivation — LogicBlock Link Behavior

The logic block link UI interaction was not covered by existing tests. I modelled it as a finite state machine:

**States:**
- `Idle`: block exists in world, ready to be selected
- `Configuring`: block clicked, linked blocks shown, awaiting input
- `Link_Active`: link established and active
- `Link_Inactive`: link exists but toggled inactive

**Transitions:**
- Click logic block → `Configuring`
- Click self or invalid position → `Idle`
- Click validated non-linked block → `Link_Active` (system creates link)
- Click linked inactive block → `Link_Active`
- Click linked active block → `Link_Inactive`

`testLogicBlockLinkFSM` (ApplicationTest, lines 975–1019) covers the transition paths defined by this model, providing test cases for previously uncovered UI-interaction paths.

## Coverage Results

| Phase | LogicBlock Instruction | LogicBuild Instruction | LogicBuild Branch |
|---|---|---|---|
| Baseline | 10% | 14% | 8% |
| After functional + partition tests | 32% | 49% | 39% |
| After FSM tests | 50% | 57% | 47% |

Each testing technique contributed distinct coverage gains. Partition testing drove the most improvement in `LogicBuild` by covering `updateCode()` branches. FSM tests added coverage in link-related paths not reachable through pure functional tests.

## Key Learnings

Working on a 120k-line production Java codebase where existing tests are sparse requires reading the code to understand what *should* be tested before writing any tests. Coverage numbers are a proxy — the more useful signal was identifying which *behaviors* (link validation, code injection, state transitions) were untested and why they would be risky without coverage.
