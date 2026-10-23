# OpenCode prompt: integrate portfolio auto-sync end-to-end

Work in my existing local checkout of `pandeyyatharth7/Portfolio`. Implement the GitHub portfolio auto-sync system described in `docs/IMPLEMENTATION-GUIDE.md` from this kit, integrating it with the current code rather than rewriting the visual design.

## Required behavior
- Scan only public repositories owned by `pandeyyatharth7` and ignore the portfolio repository itself.
- A root-level `portfolio.md` on the repository's default branch is the only opt-in. Without that file, do not publish the repository.
- Run on a 6-hour GitHub Actions schedule and via `workflow_dispatch`; detect a marker added any time after repository creation.
- Parse YAML frontmatter and the Markdown body; validate required title/description, status, dates, URLs, tech list, and optional asset paths.
- Update `src/data/projects.generated.json` deterministically, without editing the manually maintained `src/data/content.ts` array.
- Commit only the generated registry directly to the portfolio repository when the contents change.
- Handle optional HTTPS demo links, external YouTube/Vimeo URLs, root-level MP4/WebM videos, optional thumbnails, and automatic discovery of the documented filenames.
- Preserve the last valid record when an individual repository cannot be refreshed or its Markdown edit is invalid; remove an entry only when a successful scan confirms `portfolio.md` is gone or the public repository no longer exists/is no longer public.
- Avoid duplicate cards when a generated repository is already represented by a manual project's GitHub link.
- Use the same merged `allProjects` data for project cards, case-study route lookup/previous-next navigation, and the project timeline.
- Preserve all current manual project content, project cards, case-study layouts, dark theme, visual tokens, animations, and reduced-motion behavior.

## Files to integrate
Use the supplied workflow, sync script, generated JSON, registry adapter, `DemoMedia.tsx`, `ProjectMarkdown.tsx`, and `portfolio.md` template. Do not overwrite the existing `content.ts`, `Projects.tsx`, `CaseStudy.tsx`, or `AnimatedChart.tsx` wholesale; make minimal, reviewed edits.

1. Install `gray-matter` as a dev dependency and `react-markdown` plus `remark-gfm` as runtime dependencies. Add the sync/test npm scripts without deleting existing scripts. Enable `resolveJsonModule` in `tsconfig.app.json`.
2. Extend `Project` with the optional fields listed in `docs/PROJECT-TYPE-ADDITIONS.ts.txt`.
3. Update `Projects.tsx` to render `allProjects` from `src/data/project-registry.ts`.
4. Update `CaseStudy.tsx` to look up/navigate among `allProjects`. Show `DemoMedia` when `videoUrl` is present. For `source === 'github-portfolio-md'`, render `ProjectMarkdown` and hide manual-only problem/architecture/approach/results blocks. Preserve those blocks for current manual entries. Keep GitHub and demo links usable.
5. Refactor `AnimatedChart.tsx` away from hard-coded project milestones, fixed `todayMonthIndex`, fixed y-axis count, and fixed axis tick dates. Derive milestones from `timelineProjects` and the current date. Move the chart's existing dates into the corresponding four manual project objects so the existing timeline remains unchanged before new projects are added: AutoCodeIQ 2024-08-01; Nexus Inventory OS 2024-11-15; Enterprise Risk Management System 2025-03-01; OpenReframe 2025-07-15. Add an accessible chronological list below the chart with project links so labels do not overlap as the portfolio grows.
6. Keep date semantics honest: prefer `startDate` from frontmatter; use repository creation date only as an explicitly approximate fallback. Do not present commit dates as project start dates or invent metrics.
7. Confirm the workflow has `contents: write` only for the portfolio repo and uses `PORTFOLIO_SCAN_TOKEN` solely for read-only scanning. Do not create, request, or hard-code tokens in code. The secret setup belongs in the guide.
8. Ensure no raw HTML is enabled for Markdown, no autoplay, iframe embeds only for recognized HTTPS YouTube/Vimeo hosts, and all other external links use `rel="noopener noreferrer"`.

## Verification
- Run `npm run test:portfolio-sync`, `npm run build`, and `npm run lint`; fix problems caused by this change.
- Add/update tests for valid metadata, missing required fields, invalid dates/statuses, unsafe asset paths, missing optional videos, late `portfolio.md` discovery assumptions, marker deletion, per-repo failures preserving records, and duplicate prevention.
- Verify generated case-study route paths resolve and links/players are omitted cleanly when no optional demo exists.
- Ensure the sync command never replaces the registry after a total scan failure, does not change the file when data is identical, and does not create a commit when there are no changes.
- At the end, summarize files changed, commands/tests run, any failures, and the exact one-time GitHub secret/deployment setup still needed. Do not commit or push unless I explicitly ask.
