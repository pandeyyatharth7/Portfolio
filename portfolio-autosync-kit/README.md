# Portfolio auto-sync starter kit

A scheduled GitHub Actions registry sync for `pandeyyatharth7/Portfolio`. It needs a repo-scoped `PORTFOLIO_COMMIT_TOKEN` secret for a publishing commit that can trigger downstream build/deploy workflows. Public repository reads work without a scan token for small portfolios; an optional read-only scan token can help if API rate limits become an issue.

- Add a root-level `portfolio.md` to any public repository you want listed.
- The workflow checks every 6 hours and can be triggered manually.
- It generates `src/data/projects.generated.json`; it never edits `src/data/content.ts`.
- Optional demo links, MP4/WebM videos, and thumbnails are supported.
- Per-repo errors preserve the prior valid project; a confirmed marker deletion removes it.

**Start here:** read [`docs/IMPLEMENTATION-GUIDE.md`](docs/IMPLEMENTATION-GUIDE.md). The guide includes the required React integration for the existing project cards, case-study page, and timeline.

Important: this bundle has not been committed to your GitHub repository. Copy the files into the local portfolio checkout, install the dependency, apply the React integration guide, test the build, then push to GitHub.
