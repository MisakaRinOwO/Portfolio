---
title: "Godot Engine — Editor Case Study & C++ Contributions"
featured: false
draft: false
tags: ["Godot", "C++", "Reverse Engineering", "Open Source", "3D Editor"]
role: "Team Contributor (3) / Feature Scoping · Design · Implementation"
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

Two earlier test-coverage PRs — [#106574](https://github.com/godotengine/godot/pull/106574) (Sprite2D unit tests) and [#106575](https://github.com/godotengine/godot/pull/106575) (AnimationBlendTree tests) — were also merged into `master`, establishing the contributor foothold before moving to editor-layer work.

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

## Contribution A

**Problem**
- `is_handle_highlighted(id, p_secondary)` effectively failed to produce proper hover differentiation for CSGShapes3D gizmos.
- In practice, handles looked too similar during interaction, reducing precision and readability in editor workflows.

**Root Cause**
- The existing color-mask modulation path was brittle and visually inconsistent for the intended hover-feedback behavior.

**Implementation**
- Replaced the problematic mask behavior with deterministic opacity states:
  - idle: `0.75`
  - hovered: `1.0`
- Kept the diff intentionally small to improve reviewability and reduce unintended side effects — targeted bug isolation with minimal regression surface in an unfamiliar subsystem.

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

## Contribution B

**Problem**
- The ruler reported aggregate Euclidean distance only — no axis decomposition, no spatial reference lines.
- In perspective views this made it hard to reason about component-wise displacement during level and tool editing.

**Root Cause**
- Axis-aware measurement was simply out of scope in the original ruler implementation; the engine had no concept of projecting the measured distance onto individual axes.

**Implementation**
- Added axis-projected helper lines and contextual labels while measuring in 3D.
- Added guardrails to keep overlays readable:
  - suppress near-zero labels (`< 0.0001`)
  - suppress extra XZ overlays when constrained to 2D-plane usage

The guardrails reflect a deliberate UX tradeoff: add information density where it helps spatial reasoning, suppress noise where it doesn't.

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

## Review and Validation

**[PR #107101](https://github.com/godotengine/godot/pull/107101) — CSG Handle Highlighting:**
- All 20 CI checks passed.
- [@Calinou](https://github.com/Calinou) (core team) tested the fix locally and suggested reversing the opacity logic — non-hovered handles at `0.75`, hovered at `1.0` — to match Godot's convention of increasing opacity on hover rather than decreasing it.
- [@fire](https://github.com/fire) (core team) responded: *"I think this is ok 👍. It's not a big change."*
- [@Repiteo](https://github.com/Repiteo) added the `cherrypick:4.5` label in Sep 2025, targeting the fix for the 4.5 release branch.

**[PR #107296](https://github.com/godotengine/godot/pull/107296) — 3D Ruler Enhancement:**
- All 20 CI checks passed.
- [@jokosablenk](https://github.com/jokosablenk) commented with a reference to the related ruler PR [#106785](https://github.com/godotengine/godot/pull/106785) for additional context.
- [@AThousandShips](https://github.com/AThousandShips) added `enhancement`, `topic:editor`, and `topic:3d` labels. Milestone set to 4.x.
- Awaiting formal code review before merge.

<div class="media-grid media-grid-2">
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107101conversation.png" alt="Maintainer discussion thread on PR #107101" class="content-media" loading="lazy" />
    <figcaption>Review thread for <a href="https://github.com/godotengine/godot/pull/107101" target="_blank" rel="noopener noreferrer">PR #107101</a>: Calinou tested locally and requested an opacity logic reversal; change incorporated.</figcaption>
  </figure>
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107101CIpassed.png" alt="20/20 CI checks passed for PR #107101" class="content-media" loading="lazy" />
    <figcaption>20/20 CI checks passed for <a href="https://github.com/godotengine/godot/pull/107101" target="_blank" rel="noopener noreferrer">PR #107101</a>.</figcaption>
  </figure>
  <figure>
    <img src="/images/projects/godot-case-study/pr-related/107296CIpassed.png" alt="20/20 CI checks passed for PR #107296" class="content-media" loading="lazy" />
    <figcaption>20/20 CI checks passed for <a href="https://github.com/godotengine/godot/pull/107296" target="_blank" rel="noopener noreferrer">PR #107296</a>.</figcaption>
  </figure>
</div>

Both PRs survived CI and received triage from multiple core team members — demonstrating production-style collaboration: responding to maintainer feedback, aligning with codebase conventions, and coordinating across an active contributor pipeline.

## Takeaway

Navigating a 1M+ line C++ codebase cold is essentially the same problem as debugging an unfamiliar gameplay system mid-production: you cannot read everything, so you have to model the system, form a falsifiable hypothesis, and trace only what matters. That discipline is what made both PRs tractable.

The more interesting signal for me wasn't the code diff itself — it was realizing that the skills a gameplay engineer uses to reason about runtime behavior (state machines, event dispatch, rendering feedback loops) transfer directly to editor tooling. The domain changes; the mental model doesn't.

Both PRs are still open. Open source moves at its own pace, and milestone targeting and cherry-pick labels are signs the work is in the pipeline — not signs it stalled. What I walked away with is the confidence that I can contribute meaningfully to any large C++ codebase given enough time to model it first.
