# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static portfolio site for Dirty Napkin, a branding studio. There's no framework, package.json or test suite. Netlify serves the repo root as-is (`_redirects` handles legacy domains).

- Live: https://dirtynapkin.co (also https://dirtynapkin.netlify.app)
- Dev: https://dirtynapkindev.netlify.app

## Build: Prepros (source in `dev/`, compiled output at the root)

[Prepros](https://prepros.io) (a GUI app) compiles everything. `prepros.config` maps each source file to an output file:

- `dev/<page>.kit` → `<page>.html` at the root (CodeKit `.kit` syntax: `<!-- @include "..." -->`, `<!-- @pageTitle = X -->` variables)
- `dev/scss/styles.scss` → `styles.css` at the root (dart-sass, no autoprefixer)

**Edit the sources in `dev/`, never the root `.html` files or `styles.css` directly.** Commit each compiled file along with its source. Prepros regenerates them; if it isn't running, the root output has to be updated to match the source edit.

A new page needs:
1. `dev/<page>.kit` (template in `docs/snippets.md#kit-file-template`)
2. A `files` entry in `prepros.config` with `customOutput: "<page>.html"`
3. A compiled `<page>.html` at the root

Local preview: `python3 -m http.server 8080` from the repo root (this is also the `static` config in `.claude/launch.json`).

## Architecture

**Templates.** `dev/global/` holds the shared partials (`head.kit`, `header_nav.kit`, `footer.kit`, `scripts.kit`). `dev/global/components/` holds reusable pieces (`next-project`, `arrow-btn`, `mobile-menu`, `nav-type`). Each page `.kit` includes them.

**JS.** Compiled pages load the unminified scripts from `dev/js/` via `scripts.kit`, all on every page. Each script checks for its own page or elements before running. jQuery 3.7.1 is used throughout. Root `scripts-min.js` / `jquery-3.7.1-min.js` aren't referenced by any page.

- `puzzle-type-anim.js`: the grid-letter text effect. Opt in with the class `puzzle-type`, plus `puzzle-auto` (plays on load) and/or `puzzle-hover`, and optionally `data-vertical-align`.
- `pg-transition.js`: fades `.transition-block` on load and on navigation.
- `vimeo-lazy.js`: Vimeo embeds use `<div class="vimeo-video" style="--poster:url(...)">` with `<iframe data-src>`. An IntersectionObserver loads them near the viewport and unloads them when they scroll away, to stay under mobile Safari's decoder limit. Never give these iframes a `src`.
- `brand-cards.js`: the `cardsData` array builds the `brands.html` grid.
- `next-project.js`: the `data` array sets the "Next Project" link on pages with `body.project-page`.
- `cleanUrl()` (in `brand-cards.js`) strips `.html` from JS-built links on production hosts only. Links in `.kit` files keep `.html`.

**Adding a project** touches several places that must stay in sync: the new `.kit` page plus its config entry, `cardsData` in `brand-cards.js`, the `next-project.js` chain (its order matches the brands page and loops back to the start), and optionally a `brand-item` on `index.kit`.

**SCSS.** `styles.scss` imports in this order: helpers → base → components → layout → pages. Breakpoints are `$screen-{sm,md,lg,xl,xxl}-min` (430/768/1024/1280/1440), with mixins `@include sm/md/lg/xl/xxl` (mobile-first min-width). Colors are CSS custom properties on `:root` (`--key`, `--cyan`, `--magenta`, `--yellow`, `--green`). Project pages lay out content in `.content` using the column-span classes `width2`/`width3`/`width4`/`width6`. Global utility classes and typography are listed in `docs/global-styles.md`.

**Assets.** They're grouped by page in `assets/` (`home-pg/`, `brands-pg/`, `about-pg/`, `project-pages/<CODE>/`). Project images use a three-letter code and an index that matches the element id (e.g. `WIL7` ↔ `wil7_colors.jpg`). Video posters use the suffix `_fallback.jpg`. Thumbnails use `d`/`m` for desktop/mobile (`wil0d_thumbnail.jpg`). Videos are hosted on Vimeo; `.psd`, `.ai` and `.mov` files are gitignored.

## Conventions (from README)

- Branch from `dev` and PR back into `dev`. Don't commit directly to `main` or `dev`.
- Commit messages start with a [Gitmoji](https://gitmoji.dev/) and stay brief and specific.
- File names: lowercase, no spaces; `.html`/`.kit` use dashes only. Classes, ids, variables and functions use camelCase (older code also uses kebab-case classes).
- Every `<img>` needs an `alt`. Encode special characters (e.g. `&nbsp;`, `&gt;`).
- Icons come from `assets/spritesheet.svg`, not FontAwesome.
- Prefer CSS transitions/animations over JS. Keep load times in mind (responsive image pattern: `docs/snippets.md`).
- When done, validate `styles.css` and any changed `.html` with the W3C HTML/CSS validators.
