---
title: "Grid Systems Experiments"
featured: false
draft: true
tags: ["C++", "Simulation", "Pathfinding", "Procedural"]
role: "Solo"
stack: "C++, SDL2"
year: "2024"
summary: "A series of grid-based simulation experiments exploring pathfinding algorithms, flow fields, and cellular automata — built from scratch in C++ with SDL2 for visualisation."
highlights:
  - "A*, Dijkstra, and JPS pathfinding implementations with live visualisation of open/closed sets"
  - "Flow field generation for crowd-scale pathfinding (single cost computation serves all agents)"
  - "Conway's Game of Life and custom ruleset cellular automata with configurable update rates"
  - "Terrain generation via multi-octave Perlin noise with threshold-based tile classification"
  - "All algorithms benchmarked; results showed JPS ~3× faster than A* on open maps, flow field cheaper at >200 agents"
coverImage: "/images/project-placeholder.svg"
screenshots: []
links:
  github: ""
order: 4
---

## Overview

This is an ongoing collection of low-level systems experiments. The goal is to understand how the algorithms that power games actually work — not just use them through a library, but implement them from scratch and measure the trade-offs.

## What I Built

### Pathfinding Suite

Four algorithms implemented on the same grid interface so they can be swapped and compared directly:

- **BFS**: baseline, explores by distance
- **Dijkstra**: weighted costs, guarantees shortest path
- **A\***: heuristic-guided, fastest for single-agent point-to-point
- **JPS (Jump Point Search)**: A\* acceleration for uniform-cost grids; prunes symmetric paths

Each has a visualiser showing the explored frontier in real time, which made the algorithmic differences intuitive to reason about.

### Flow Fields

For scenarios with many agents (AI crowds, formations), computing A\* per agent is expensive. Flow fields compute cost once from a goal cell and fill every tile with a gradient vector pointing toward the shortest path. Agents read their current tile's vector each frame — O(1) per agent per frame.

### Cellular Automata

Implemented Conway's Game of Life and a custom ruleset using a double-buffer update scheme (no in-place mutation). Added configurable step rate and "pause and step" for studying rule behaviour.

## Key Design Decisions

Building a common grid abstraction that all algorithms share let me run controlled comparisons. The benchmarks were revealing: JPS's prune-and-jump strategy pays off only on open maps; in tight corridors with many walls it's slower than A\* due to jump overhead.

## What I'd Do Next

- Add hierarchical pathfinding (HPA\*) for very large maps
- Integrate the flow field system into a small UE5 plugin
- Experiment with GPU-accelerated cellular automata via compute shaders
