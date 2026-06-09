# Peter Xie — Portfolio

Personal portfolio site for **Peter (Ruilin) Xie**, a Gameplay / Systems Engineer specialising in grid systems, modular game architecture, deterministic simulations, and rhythm game judgement mechanics — built in UE5 and Unity.

**Live site:** [misakarinowo.github.io/Portfolio](https://misakarinowo.github.io/Portfolio/)

[![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=061826)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Deployed to GitHub Pages](https://img.shields.io/badge/GitHub_Pages-deployed-181717?logo=github&logoColor=white)](https://misakarinowo.github.io/Portfolio/)

---

## Pages

| Route | Content |
| :--- | :--- |
| `/` | Hero, bio, and quick intro |
| `/projects/` | Index of all project write-ups |
| `/projects/[slug]/` | Individual project detail pages |
| `/resume/` | Résumé / CV |
| `/contact/` | Contact info and links |

## Projects

Project write-ups live in `src/content/projects/` as Markdown files:

| File | Project |
| :--- | :--- |
| `void-architect.md` | Void Architect — Modular Ship Combat Prototype (UE5) |
| `ue5-topdown-rpg-capstone.md` | UE5 Top-Down RPG Capstone |
| `unity-rhythm-prototype.md` | Unity Rhythm Game Prototype |
| `grid-systems-experiments.md` | Grid Systems Experiments |
| `mindustry-testing-study.md` | Mindustry Testing Study |
| `godot-oss-contribution.md` | Godot OSS Contribution |

Each file uses a typed frontmatter schema defined in `src/content.config.ts`.

## Tech Stack

| Area | Tooling |
| :--- | :--- |
| Framework | Astro 6 |
| UI Islands | React 19 |
| Styling | Tailwind CSS 4 |
| Motion | Framer Motion 12 |
| Content | Astro Content Collections |
| Language | TypeScript |
| Deployment | GitHub Pages (static) |

## Local Development

**Prerequisites:** Node.js `>= 22.12.0`, npm

```bash
# Clone
git clone https://github.com/MisakaRinOwO/Portfolio.git
cd Portfolio

# Install
npm install

# Dev server
npm run dev
```

Visit `http://localhost:4321/Portfolio`.

## Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build static site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run Astro type checks |

## Deployment

Deployed to GitHub Pages via `.github/workflows/deploy.yml`. On every push to `main`, the workflow:

1. Installs dependencies (`npm ci`)
2. Builds the site (`npm run build`)
3. Uploads `./dist` and deploys to GitHub Pages

The `astro.config.mjs` is configured with:

```js
site: 'https://misakarinowo.github.io',
base: '/Portfolio',
```

## Project Structure

```
Portfolio/
├── public/
│   ├── brand/               # Logo assets
│   ├── images/projects/     # Project screenshots and diagrams
│   └── resume/              # Résumé PDF
├── src/
│   ├── components/          # React islands (ThemeToggle, BrandLogo, etc.)
│   ├── content/projects/    # Markdown project write-ups
│   ├── data/site.ts         # Nav links, footer meta, contact info
│   ├── layouts/             # Page and entry layouts
│   ├── lib/                 # Content helpers and formatting utilities
│   ├── pages/               # File-based routes
│   ├── styles/global.css    # Tailwind + design tokens
│   └── content.config.ts    # Content collection schemas
├── .github/workflows/
│   └── deploy.yml           # GitHub Pages deployment workflow
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Contact

- **Email:** ruilinx.peter@gmail.com
- **GitHub:** [github.com/MisakaRinOwO](https://github.com/MisakaRinOwO)
- **LinkedIn:** [linkedin.com/in/ruilin-xie-a926aa249](https://www.linkedin.com/in/ruilin-xie-a926aa249/)

---

## Ref

This portfolio started from the [**AEON / SPACE**](https://github.com/lauroguedes/aeon-space-agency) Astro template by [Lauro Guedes](https://github.com/lauroguedes), licensed under the [MIT License](https://opensource.org/licenses/MIT).

The original scaffold provided the Astro + React + Tailwind + Framer Motion project structure and content collection setup. The current content, layout direction, copywriting, and portfolio-specific features are customized for Peter Xie.
