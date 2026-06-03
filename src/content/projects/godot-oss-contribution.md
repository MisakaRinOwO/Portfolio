---
title: "Godot Engine — Editor Case Study & C++ Contributions"
featured: false
draft: true
tags: ["Godot", "C++", "Reverse Engineering", "Open Source", "3D Editor"]
role: "Contributor / Reverse Engineering"
stack: "Godot 4, C++, Editor Tooling"
focus: "Gameplay Engineer Positioning · Large Codebase Navigation · Editor/System Design"
year: "2025"
summary: "A reverse-engineering-driven case study on Godot's editor pipeline that led to two C++ pull requests: a CSG handle-highlighting bug fix and a 3D ruler usability enhancement."
highlights:
  - "Applied a hypothesis -> UML -> code-tracing workflow from SWE 265P to navigate Godot's editor/rendering subsystems before writing any patch."
  - "PR #107101 (CSGShapes3D): fixed broken hover-feedback logic by replacing a faulty color-mask path with a deterministic opacity model (0.75 idle / 1.0 hover)."
  - "PR #107296 (3D Ruler): added axis-projected helper lines + contextual labels to improve spatial readability in 3D measurement workflows."
  - "Implemented edge-case guards for readability (near-zero label suppression and 2D-plane overlay suppression)."
  - "Both PRs passed CI and received review from core maintainers, demonstrating production-style collaboration rather than isolated coursework output."
coverImage: "/brand/godot_icon_color.svg"
screenshots: []
links:
  github: "https://github.com/godotengine/godot/pulls?q=is%3Apr+author%3AMisakaRinOwO"
order: 5
keyFeatures:
  - "Large Codebase Navigation"
  - "C++ Editor Bug Fixing"
  - "Tool UX in 3D Workflows"
  - "Design-to-Implementation Traceability"
focusCards:
  - title: "Reverse Engineering Workflow"
    description: "Used architecture diagrams and class tracing to reduce search space before modifying engine code."
  - title: "Production C++ Patching"
    description: "Shipped minimal, reviewable diffs in Godot's C++ editor pipeline under maintainer feedback."
  - title: "Editor Usability Design"
    description: "Balanced UX clarity and rendering cleanliness with explicit edge-case handling."
  - title: "Gameplay Engineer Relevance"
    description: "Demonstrates the same systems thinking needed for gameplay runtime, tooling, and debugging at scale."
---

## TL;DR

This page is intentionally framed as an engineering case study, not only a class deliverable. The core claim is simple: I can enter a large C++ codebase, model the system quickly, and ship reviewable editor/tooling changes that improve real workflows.

I focused on Godot's 3D editor layer and submitted two PRs:
- **[PR #107101](https://github.com/godotengine/godot/pull/107101)**: CSG handle hover-feedback bug fix
- **[PR #107296](https://github.com/godotengine/godot/pull/107296)**: 3D ruler mode usability enhancement

<div class="media-grid media-grid-2">
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107101before.png" alt="PR #107101 before: weak CSG handle hover feedback" class="content-media compact-compare" loading="lazy" />
    <figcaption><a href="https://github.com/godotengine/godot/pull/107101" target="_blank" rel="noopener noreferrer">PR #107101</a> before: weak CSG handle hover feedback.</figcaption>
  </figure>
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107101after.png" alt="PR #107101 after: clearer CSG handle hover feedback" class="content-media compact-compare" loading="lazy" />
    <figcaption><a href="https://github.com/godotengine/godot/pull/107101" target="_blank" rel="noopener noreferrer">PR #107101</a> after: clearer CSG handle hover feedback.</figcaption>
  </figure>
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107296before.png" alt="PR #107296 before: ruler without clear spatial helper lines" class="content-media" loading="lazy" />
    <figcaption><a href="https://github.com/godotengine/godot/pull/107296" target="_blank" rel="noopener noreferrer">PR #107296</a> before: weak spatial context while measuring.</figcaption>
  </figure>
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107296after.png" alt="PR #107296 after: ruler with helper lines and labels" class="content-media" loading="lazy" />
    <figcaption><a href="https://github.com/godotengine/godot/pull/107296" target="_blank" rel="noopener noreferrer">PR #107296</a> after: helper lines and labels improve readability.</figcaption>
  </figure>
</div>

## Why It Matters

Gameplay engineer work is not just writing mechanics in isolation. It regularly involves:
- Navigating unfamiliar engine/runtime code
- Building or fixing in-editor/debug tooling
- Making targeted C++ changes with low regression risk

This case study demonstrates that workflow in a real open-source engine with maintainer review.

## Workflow

I used a lightweight but disciplined process from SWE 265P:
1. Form a hypothesis from observed editor behavior.
2. Use UML/system views to narrow likely subsystems.
3. Trace concrete classes/functions in C++.
4. Implement the smallest diff that fixes behavior.
5. Validate via CI + review feedback.

<figure>
  <img src="/images/projects/godot-case-study/full-pages/265P_Project_Part03-p01.png" alt="Five-step reverse engineering workflow overview from SWE 265P project artifact" class="content-media" loading="lazy" />
  <figcaption>Workflow overview artifact: hypothesis -> system mapping -> code tracing -> minimal patch -> validation.</figcaption>
</figure>

## Contribution A ([PR #107101](https://github.com/godotengine/godot/pull/107101))

**Problem**
- `is_handle_highlighted(id, p_secondary)` effectively failed to produce proper hover differentiation for CSGShapes3D gizmos.
- In practice, handles looked too similar during interaction, reducing precision and readability in editor workflows.

**Root Cause**
- The existing color-mask modulation path was brittle and visually inconsistent for the intended hover-feedback behavior.

**Implementation**
- Replaced the problematic mask behavior with deterministic opacity states:
  - idle: `0.75`
  - hovered: `1.0`
- Kept the diff intentionally small to improve reviewability and reduce unintended side effects.

<div class="media-grid media-grid-3">
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107101CSGshape.png" alt="CSGShapes3D handle context in editor" class="content-media" loading="lazy" />
    <figcaption>CSGShapes3D editor context where handle highlighting matters.</figcaption>
  </figure>
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107101before.png" alt="PR #107101 before: handles lacked clear highlight feedback" class="content-media compact-compare" loading="lazy" />
    <figcaption>Before: hovered handles lacked clear visual differentiation.</figcaption>
  </figure>
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107101after.png" alt="PR #107101 after: handles use clear opacity-based hover feedback" class="content-media compact-compare" loading="lazy" />
    <figcaption>After: deterministic opacity improves hover clarity.</figcaption>
  </figure>
</div>

**Engineering Signal**
- Demonstrates targeted C++ bug isolation and minimal-risk patch design in an unfamiliar engine subsystem.

## Contribution B ([PR #107296](https://github.com/godotengine/godot/pull/107296))

**Problem**
- The ruler provided scalar distance but weak spatial context in perspective views.
- This made it harder to reason about component-wise displacement during level/tool editing.

**Implementation**
- Added axis-projected helper lines and contextual labels while measuring in 3D.
- Added guardrails to keep overlays readable:
  - suppress near-zero labels (`< 0.0001`)
  - suppress extra XZ overlays when constrained to 2D-plane usage

<div class="media-grid media-grid-2">
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107296before.png" alt="PR #107296 before: limited spatial context during measurement" class="content-media" loading="lazy" />
    <figcaption>Before: measurement view lacked clear spatial context cues.</figcaption>
  </figure>
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107296after.png" alt="PR #107296 after: added helper lines and label context" class="content-media" loading="lazy" />
    <figcaption>After: helper lines and labels improve 3D measurement readability.</figcaption>
  </figure>
</div>

**Engineering Signal**
- Demonstrates design judgment in editor UX: increase information density where useful, reduce noise where distracting.

## Review and Validation

- [PR #107101](https://github.com/godotengine/godot/pull/107101) and [PR #107296](https://github.com/godotengine/godot/pull/107296) passed CI.
- [PR #107101](https://github.com/godotengine/godot/pull/107101) and [PR #107296](https://github.com/godotengine/godot/pull/107296) received feedback from core maintainers.
- The process required balancing technical correctness, readability, and maintainability under external review.

<div class="media-grid media-grid-2">
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107101conversation.png" alt="Maintainer discussion on PR #107101 for CSG handle highlighting changes" class="content-media" loading="lazy" />
    <figcaption>Maintainer discussion on <a href="https://github.com/godotengine/godot/pull/107101" target="_blank" rel="noopener noreferrer">PR #107101</a> (CSG highlighting), showing review-driven iteration.</figcaption>
  </figure>
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107101CIpassed.png" alt="CI checks passed for PR #107101" class="content-media" loading="lazy" />
    <figcaption>CI pass evidence for <a href="https://github.com/godotengine/godot/pull/107101" target="_blank" rel="noopener noreferrer">PR #107101</a> before merge consideration.</figcaption>
  </figure>
</div>

That collaboration loop is a key reason this belongs in a portfolio: it reflects production-style engineering constraints, not just local experimentation.

## Other Attempts

I opened additional exploratory contributions that did not progress to merge. I keep them out of the headline list, but they remain valuable evidence of workflow maturity:
- I can scope work, test assumptions, and identify when a direction is not yet maintainer-ready.
- I treat unsuccessful attempts as signal for better system understanding, not as throwaway effort.

## Takeaway

This project supports my gameplay engineer positioning with evidence in three dimensions:
- **C++ implementation** in a production-grade engine
- **Large codebase comprehension** through reverse-engineering artifacts and targeted tracing
- **Design capability** by translating UX/tooling pain points into maintainable, reviewable changes
