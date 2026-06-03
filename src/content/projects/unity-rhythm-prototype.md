---
title: "Unity Rhythm Prototype"
featured: false
draft: true
tags: ["Unity", "C#", "Rhythm", "Audio", "UI"]
role: "Solo"
stack: "Unity, C#, FMOD"
year: "2023"
summary: "A rhythm game prototype in Unity with a beat-map editor, lane-based note highway, and hit detection tied to audio timestamps. Built to explore how tight audio–gameplay synchronisation works at an engine level."
highlights:
  - "Audio-timestamp-driven hit window: notes evaluated against DSP clock, not game time, for sub-frame accuracy"
  - "In-engine beat-map editor with waveform visualisation and BPM snap grid"
  - "Graded hit windows (Perfect / Great / Good / Miss) with combo and score multiplier system"
  - "FMOD integration for low-latency audio playback and real-time beat detection"
  - "Configurable lane count and note skin system for rapid visual iteration"
coverImage: "/images/project-placeholder.svg"
screenshots: []
links:
  github: ""
order: 3
---

## Overview

Rhythm games look simple but hide surprisingly tricky engineering: the window between "feels great" and "feels broken" is about 30 ms. I built this prototype specifically to understand how to nail that feel, starting from scratch in Unity.

## What I Built

**Hit detection**: Notes are evaluated against the audio DSP clock (`AudioSettings.dspTime`) rather than `Time.deltaTime`. This avoids the accumulated drift that comes from frame-rate variation, keeping the perceived hit window consistent even on lower-end hardware.

**Beat-map editor**: A custom Unity EditorWindow that loads an audio clip, renders an approximate waveform, and lets the designer place notes by clicking on a BPM-snapped grid. Beat-maps are serialised to JSON and loaded at runtime.

**Scoring**: Each hit is rated on a sliding window around the target timestamp. Consecutive Perfect/Great hits build a combo multiplier. Missing resets the combo. The scoring function is data-driven — window sizes and multipliers live in a ScriptableObject for easy tuning.

## Key Design Decisions

Using DSP time for evaluation (instead of Unity's `Time.time`) was the single most impactful technical decision. Early builds used game time and felt inconsistent. Switching to DSP time immediately made the prototype feel responsive and predictable.

## What I'd Do Next

- Add procedural note generation from audio FFT analysis
- Build a proper chart format with variable BPM and time signatures
- Add multiplayer competitive mode (same chart, separate lanes, visible score comparison)
