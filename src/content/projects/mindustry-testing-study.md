---
title: "Mindustry Systems Study"
featured: false
tags: ["Simulation", "Modding", "Java", "Systems Design"]
role: "Solo"
stack: "Java, Mindustry Modding API"
year: "2023"
summary: "A deep-dive systems analysis and modding study of Mindustry — examining how its factory simulation, resource routing, and unit AI are architected, and building a small content mod to validate those findings."
highlights:
  - "Reverse-engineered Mindustry's block-tick update system and resource belt simulation loop"
  - "Mapped the unit AI state machine: mine → transport → attack, including pathfinding integration"
  - "Built a content mod adding two new factory blocks with custom resource recipes and production chains"
  - "Analysed performance hotspots using Java profiling tools; identified tile update batching as the key scaling mechanism"
  - "Documented findings in a design breakdown comparing Mindustry's approach to similar factory games"
coverImage: "/images/project-placeholder.svg"
screenshots: []
links:
  github: ""
order: 6
---

## Overview

Mindustry is an open-source factory/RTS game written in Java. Its simulation architecture handles hundreds of active factory units and thousands of block ticks per second — I wanted to understand how. This project is a combination of source reading, profiling, and hands-on modding.

## What I Studied

### Block Tick System

Mindustry processes tiles in a batched update loop. Each tile type registers a `unitUpdate` or `update` handler; the game iterates tiles in chunk order each tick. The key insight: tiles only compute if they have pending work (e.g. items to move, power to distribute), dramatically reducing the active-tile count in sparse bases.

### Resource Belt Simulation

Belts don't simulate each item individually. Instead, each belt segment tracks a single "item slot" per distance unit and passes it to the next segment if space is available. This is closer to a pipeline slot model than discrete item physics — it's fast but means items can't stack or back-pressure in the way some factory games allow.

### Unit AI

Units use a simple state machine (idle → task assigned → executing → returning) driven by a central unit controller that polls unit capacity each tick. Pathfinding uses a grid-based flow field pre-computed from objective positions, refreshed when the world changes.

## The Mod

Built two factory blocks to test my mental model:
- **Alloy Press**: takes iron + copper → produces alloy at a tunable ratio
- **Coolant Loop**: consumes water to boost adjacent smelter output by 30%

Both blocks behave correctly with the belt and power systems, confirming the resource routing model I documented.

## Key Learnings

Reading and modding a real production codebase — even a medium-scale open source game — is one of the fastest ways to understand practical systems design. Mindustry's codebase trades flexibility for performance in smart, deliberate ways that informed how I think about game simulation architecture.
