# Upstream Attribution — VoltAgent/awesome-design-md

Source: https://github.com/VoltAgent/awesome-design-md
Upstream commit: 8147538b4226ae41e2487a9179e3bcc1f68e8554
License: MIT
Imported at: 2026-09-08

## License

MIT License — Copyright (c) 2026 VoltAgent

The full license text is in LICENSE (this directory) and is preserved verbatim from upstream.

## What was imported

All DESIGN.md files under `design-md/` at the above commit SHA.
Raw files are stored verbatim in `public/vendor/awesome-design-md/<slug>/DESIGN.md`.

## DRH usage

- Raw DESIGN.md files are served as static assets (`/vendor/awesome-design-md/<slug>/DESIGN.md`)
- Metadata (parsed from YAML frontmatter) is embedded in `src/data/awesomeDesignMd.ts`
- DRH-generated preview, compact, and agent artifacts are marked `origin: derived`
- No brand logos, proprietary fonts, or external images are reproduced

## Update procedure

```bash
npm run sync:awesome-design-md
```

This re-fetches the upstream directory listing and DESIGN.md files via GitHub API,
regenerates `src/data/awesomeDesignMd.ts`, and updates this file's commit SHA.
