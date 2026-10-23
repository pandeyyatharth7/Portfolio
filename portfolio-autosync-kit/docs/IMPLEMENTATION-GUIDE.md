# GitHub portfolio auto-sync implementation

This kit is designed for `pandeyyatharth7/Portfolio` (React + TypeScript + Vite). It is an integration kit, not a direct commit to your GitHub repository. The sync workflow and parser are included; a few small changes to your existing React files are required as described below.

## Behavior

- Scans repositories owned by `pandeyyatharth7` that are public.
- Only a root-level `portfolio.md` on the repo's default branch opts a repo in. No marker means no project.
- Runs every 6 hours, offset to minute 17 UTC, and can also be run manually via **Actions → Sync portfolio projects → Run workflow**.
- Reads YAML frontmatter plus the remaining Markdown body.
- Creates/updates `src/data/projects.generated.json`; the workflow commits only that generated file when it changes.
- Rechecks all public repos each run, so adding `portfolio.md` 10 days after repo creation is detected on the next successful scan.
- Changes to a valid `portfolio.md` update the card/case-study/timeline data on the next scan.
- Confirmed deletion of `portfolio.md` removes its generated entry. A whole-list/API failure aborts before writing; a per-repo failure preserves that repo's last valid record. Invalid new metadata is skipped and invalid edits preserve the prior published entry.
- Optional `demoUrl`, `video`, and `thumbnail` are supported. `video` may be an HTTPS URL or a root-level `.mp4`/`.webm` file. If omitted, the scanner checks `demo.mp4`, `demo.webm`, `preview.mp4`, and `preview.webm` in the repo root. Thumbnail fallback checks `portfolio-cover.png`, `thumbnail.png`, `cover.png`, and `screenshot.png`.
- A generated local video or thumbnail is served from `raw.githubusercontent.com`; large videos should live on a dedicated video host instead of Git.

## 1. Copy the files

Copy these from the kit into your portfolio repository:

- `.github/workflows/sync-portfolio-projects.yml`
- `scripts/sync-portfolio-projects.mjs`
- `src/data/projects.generated.json`
- `src/data/project-registry.ts`
- `src/components/common/DemoMedia.tsx`
- `src/components/common/ProjectMarkdown.tsx`
- `templates/portfolio.md` (copy into each opted-in project repo as root `portfolio.md`)

## 2. Add the parser dependency and npm scripts

Run in the portfolio repo:

```bash
npm install --save-dev gray-matter
```

Add these scripts inside `package.json`'s existing `scripts` object:

```json
{
  "sync:portfolio": "node scripts/sync-portfolio-projects.mjs",
  "test:portfolio-sync": "node --test scripts/sync-portfolio-projects.test.mjs"
}
```

Keep your existing `dev`, `build`, `lint`, and `preview` scripts. Commit `package.json` and `package-lock.json` together. In `tsconfig.app.json`, add `\"resolveJsonModule\": true` to `compilerOptions` so TypeScript accepts the generated JSON import.

## 3. Configure the commit token and optional scan token

### Required: `PORTFOLIO_COMMIT_TOKEN`

Create a GitHub fine-grained personal access token and add it as a **repository Actions secret** named `PORTFOLIO_COMMIT_TOKEN` in `pandeyyatharth7/Portfolio`.

Recommended permissions:

- Repository access: **Only select repositories → Portfolio**
- Metadata: **Read-only**
- Contents: **Read and write**

This token is used only by checkout/git push in the portfolio repository. It cannot write to your project repositories. It is intentional: GitHub says commits pushed with the repository `GITHUB_TOKEN` do not trigger GitHub Pages builds, and GITHUB_TOKEN-created pushes do not start other push-triggered workflow runs. Using a PAT limited to the portfolio repository allows the generated registry commit to trigger a configured deployment/build pipeline. See [GitHub's GITHUB_TOKEN guidance](https://docs.github.com/en/actions/concepts/security/github_token). 

### Optional: `PORTFOLIO_SCAN_TOKEN`

**Start without this token.** Public repository reads work without authentication and this avoids giving the automation access to private repo contents. The unauthenticated API limit is lower, so for a large number of repositories you may add a separate fine-grained PAT as `PORTFOLIO_SCAN_TOKEN` with Metadata: Read-only and Contents: Read-only. For newly created repositories to be discovered without updating the token's repo selection, this PAT needs access to **All repositories**. Be aware that this token can read private repository contents too; the script filters private repositories before requesting marker files, but the token permission itself is broader than public-only. Never give the scan token write permissions.

Keep the two tokens separate: `PORTFOLIO_COMMIT_TOKEN` writes only to the portfolio repository; `PORTFOLIO_SCAN_TOKEN` (if used) only reads repositories during the scan. The sync workflow deliberately runs only on schedule/manual dispatch, so its own PAT push does not recursively trigger another sync run.

## 4. Integrate generated projects without replacing manual projects

Your existing `src/data/content.ts` exports the curated `projects` array. Do not let automation rewrite it. The included `src/data/project-registry.ts` already merges generated entries with the manual list and deduplicates by GitHub repository URL. Copy it into the portfolio repo; do not replace `content.ts`.

Then change the import in `src/components/sections/Projects.tsx` from:

```ts
import { projects } from '../../data/content';
```

to:

```ts
import { allProjects } from '../../data/project-registry';
```

And change `projects.map(...)` to `allProjects.map(...)`.

In `src/components/pages/CaseStudy.tsx`, change its import similarly and replace all `projects.find`, `projects.findIndex`, and previous/next navigation array references with `allProjects`. Otherwise, cards can display but auto-added case-study URLs will render the current 404 page.

The duplicate filter means a manually maintained project with a GitHub URL (such as your existing OpenReframe or AutoCodeIQ entries) remains hand-maintained and does not show up twice. New opt-in repos become generated cards. To migrate an existing project fully to Markdown-driven management later, remove its manual entry from `content.ts` after verifying its `portfolio.md` entry.

## 5. Extend the existing Project type

In `src/types/index.ts`, add these optional fields to the current `Project` interface:

```ts
  repositoryId?: number;
  repositoryFullName?: string;
  repositoryUrl?: string;
  category?: string;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
  timelineDate?: string;
  timelineDateSource?: 'portfolio.md' | 'repository-created-at';
  demoUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  bodyMarkdown?: string;
  source?: 'github-portfolio-md';
```

Keep all current fields and status values. `private` remains a supported display status, even though discovery only reads public repositories.

## 6. Case-study video and Markdown body

Your current case-study page uses custom `problem`, `approach`, `results`, and architecture sections for manual projects. Preserve those for existing hand-maintained projects. Copy the supplied `DemoMedia.tsx` and `ProjectMarkdown.tsx` components into `src/components/common/`. In `CaseStudy.tsx`, import them and add this path after the page header:

```tsx
<DemoMedia project={project} />
{project.source === 'github-portfolio-md' && (
  <ProjectMarkdown content={project.bodyMarkdown ?? ''} />
)}
```

Wrap the existing Problem, Architecture, Approach, and Results sections in `project.source !== 'github-portfolio-md'` conditionals so generated projects don't render empty legacy sections. Render the existing technology list and links for both kinds.

Install Markdown dependencies in the portfolio repository:

```bash
npm install react-markdown remark-gfm
```

`react-markdown` does not render raw HTML by default. Keep it that way; do not enable raw HTML for repository-authored Markdown. Render external video URLs via a dedicated component: use `<video controls playsInline preload="metadata">` for direct MP4/WebM files and a restricted iframe embed for recognized YouTube/Vimeo URLs. Always set a descriptive `title` on iframes; only permit HTTPS URLs, and don't interpolate arbitrary HTML from Markdown.

The existing `TerminalCard` can remain visually unchanged at first. Since generated records set `url` to the demo URL when one exists, otherwise to the GitHub repository, the existing `view →` action still has a useful destination. The detail view has the full GitHub link and optional Live Demo link.

## 7. Make the timeline truly data-driven

Your `AnimatedChart.tsx` currently hard-codes four project dates, `todayMonthIndex = 24`, the y-axis maximum of four, and fixed x-axis labels. It must be refactored to receive `allProjects` or derive its milestone list from `allProjects`.

For the existing manual entries, move their current timeline dates into the project records in `src/data/content.ts` so their dates remain unchanged:

- AutoCodeIQ: `2024-08-01`
- Nexus Inventory OS: `2024-11-15`
- Enterprise Risk Management System: `2025-03-01`
- OpenReframe: `2025-07-15`

Set the new optional `timelineDate` field to those dates. For generated projects, the sync script uses `startDate` from `portfolio.md`, falling back to the repository creation date. Display fallback dates as approximate (not as proof of when development started).

Build the chart's milestones, max-count/y-scale, current month endpoint, x-axis ticks, and labels from the derived data and the current date. The project list shown in the timeline should be sorted chronologically; the cards can preserve their existing manual order. Keep the current colors, motion, and reduced-motion support.

## 8. Add media player styling

For a native video element, use the existing `terminal-card` and `terminal-card-body` classes, with `className="w-full rounded border border-border-subtle bg-black"`, `controls`, `playsInline`, `preload="metadata"`, and optional `poster={project.thumbnailUrl}`. Don't autoplay. When no video URL exists, render no player.

For YouTube links, map standard `youtube.com/watch?v=...`, `youtu.be/...`, and `youtube.com/shorts/...` URLs to `https://www.youtube-nocookie.com/embed/VIDEO_ID`. For Vimeo, map verified `vimeo.com/{numericId}` URLs to `https://player.vimeo.com/video/{numericId}`. Treat all other valid HTTPS URLs as direct media files only when the file extension is `.mp4` or `.webm`; otherwise show a regular outbound "Watch demo" link instead of a broken video player.

## 9. Verify before relying on it

1. `npm ci`
2. `npm run sync:portfolio`
3. `npm run build`
4. Review `src/data/projects.generated.json` and check each project has a root `portfolio.md`.
5. Open a generated `/model_zoo/<slug>` route and check optional media and body Markdown.
6. Open **Actions → Sync portfolio projects → Run workflow** to test the GitHub runner and commit permission.
7. Confirm the deployed host rebuilds when the registry commit is pushed. If the host is not connected to the GitHub repository, configure deployment in the same workflow or connect the host to the repo.
8. Test marker deletion and invalid metadata on a throwaway public repository before relying on it for real projects.

## Known timing behavior

This is scheduled reconciliation, not an immediate webhook. A new `portfolio.md` is normally reflected within roughly six hours, subject to GitHub Actions schedule delays. If you later require immediate refresh on every project-repository push, add a GitHub App/webhook or a small sync workflow to each source repo; a workflow located only in the portfolio repo cannot receive push events from every other repository.
