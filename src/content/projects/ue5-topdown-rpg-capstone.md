---
title: "UE5 Top-Down RPG Capstone"
featured: false
tags: ["UE5", "C++", "Blueprint", "RPG", "Combat"]
role: "Solo"
stack: "Unreal Engine 5, C++, Blueprint, GAS"
year: "2023"
summary: "A top-down action RPG capstone built in UE5. Implements a full combat loop with the Gameplay Ability System, an inventory system, and enemy AI built on Behavior Trees — all tied together in C++."
highlights:
  - "Gameplay Ability System (GAS) integration: all abilities, cooldowns, and attribute changes flow through GAS"
  - "C++ base classes for characters, abilities, and effects — Blueprint subclasses for rapid tuning"
  - "Behavior Tree enemies with perception (sight/sound), patrol, and combat states"
  - "Modular inventory system with drag-and-drop UMG UI and equipment stat calculation"
  - "Save/load system persisting player stats, inventory, and world state using Unreal's SaveGame API"
coverImage: "/images/project-placeholder.svg"
screenshots: []
links:
  github: ""
order: 2
---

## Overview

This was my capstone project for a game development program, built solo over three months. The brief was open-ended — I chose to build an action RPG prototype that would let me go deep on Unreal's Gameplay Ability System, which I knew was industry-standard but had not used before.

## What I Built

The project covers the full RPG combat loop: exploration → encounter → combat → loot → progression.

**Combat**: Attacks, dodges, and abilities all go through GAS. Each ability is a `UGameplayAbility` subclass in C++, with parameters exposed to Blueprint for tuning without recompile. Gameplay Effects handle damage, buffs, and debuffs, giving a clean separation between ability logic and stat modification.

**AI**: Enemies use Behavior Trees with three states: patrol (following a spline), alert (investigating last-known position), and combat (strafing, attacking, retreating when low HP). Perception is handled by Unreal's AI Perception component.

**Inventory**: Items are UObjects backed by a DataTable. The inventory component lives on the character and replicates state to the UMG widget through a delegate broadcast pattern.

## Key Design Decisions

Starting in C++ for base classes, not Blueprint, was a deliberate choice. It forced me to understand how UE5's object hierarchy and GAS actually work rather than hiding complexity behind Blueprint nodes. The cost was velocity; the payoff was that debugging was tractable and the architecture stayed clean.

## What I'd Do Next

- Add multiplayer support — GAS is designed for it, but replication setup takes significant work
- Replace flat DataTable items with a proper item inheritance hierarchy
- Build a proper procedural dungeon generator to complement the systems
