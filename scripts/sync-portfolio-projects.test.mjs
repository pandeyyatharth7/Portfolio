import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

// Point the generated registry at a temporary file before the sync module is
// evaluated, so OUTPUT_PATH (= src/data/projects.generated.json) resolves here
// and the real registry is never touched by these tests.
const REGISTRY_PATH = path.join(os.tmpdir(), `portfolio-sync-test-${process.pid}.json`);
process.env.PORTFOLIO_REGISTRY_PATH = REGISTRY_PATH;

const syncMod = await import('./sync-portfolio-projects.mjs');
const { parsePortfolioMarkdown, buildProjectRecord } = syncMod;
const { normalizeRepositoryUrl } = await import('../src/data/project-registry.ts');

const validMarkdown = `---
title: "Demo Project"
tagline: "A useful demo"
description: "A long enough description for a portfolio card."
status: "shipped"
startDate: "2026-01-02"
featured: true
technologies:
  - TypeScript
  - Python
video: "demo.mp4"
thumbnail: "thumbnail.png"
---

## Overview

Project details here.`;

const repo = {
  id: 123456,
  name: 'demo-project',
  full_name: 'pandeyyatharth7/demo-project',
  html_url: 'https://github.com/pandeyyatharth7/demo-project',
  default_branch: 'main',
  created_at: '2025-12-31T10:00:00Z',
};

test('parses valid required fields, optional dates, tech list, and Markdown body', () => {
  const result = parsePortfolioMarkdown(validMarkdown);
  assert.equal(result.title, 'Demo Project');
  assert.equal(result.status, 'shipped');
  assert.deepEqual(result.technologies, ['TypeScript', 'Python']);
  assert.equal(result.featured, true);
  assert.match(result.bodyMarkdown, /Project details here/);
});

test('requires title and description', () => {
  assert.throws(() => parsePortfolioMarkdown('---\ntitle: "Only title"\n---\nBody'), /Missing required field: description/);
  assert.throws(() => parsePortfolioMarkdown('---\ndescription: "Only description"\n---\nBody'), /Missing required field: title/);
});

test('rejects invalid statuses', () => {
  assert.throws(
    () => parsePortfolioMarkdown(validMarkdown.replace('status: "shipped"', 'status: "concept"')),
    /status must be one of/,
  );
});

test('rejects unsafe root-relative paths and unsupported video extensions', () => {
  assert.throws(
    () => parsePortfolioMarkdown(validMarkdown.replace('video: "demo.mp4"', 'video: "../private/demo.mp4"')),
    /repository root/,
  );
  assert.throws(
    () => parsePortfolioMarkdown(validMarkdown.replace('video: "demo.mp4"', 'video: "demo.mov"')),
    /extensions/,
  );
  assert.throws(
    () => parsePortfolioMarkdown(validMarkdown.replace('thumbnail: "thumbnail.png"', 'thumbnail: "../../etc/passwd"')),
    /repository root/,
  );
});

test('rejects invalid dates and non-HTTPS links', () => {
  assert.throws(() => parsePortfolioMarkdown(validMarkdown.replace('2026-01-02', '2026-02-31')), /valid calendar date/);
  assert.throws(
    () => parsePortfolioMarkdown(validMarkdown.replace('startDate: "2026-01-02"', 'demoUrl: "http://example.com/demo"')),
    /must use HTTPS/,
  );
  assert.throws(
    () => parsePortfolioMarkdown(validMarkdown.replace('thumbnail: "thumbnail.png"', 'thumbnail: "https://"')),
    /HTTPS URL/,
  );
});

test('rejects duplicate technologies and overlong lists', () => {
  assert.throws(
    () => parsePortfolioMarkdown(validMarkdown.replace('- Python', '- TypeScript')),
    /duplicate entries/,
  );
  const overlong = `---
title: "Overlong"
description: "Too many technologies."
status: "shipped"
technologies:
${Array.from({ length: 21 }, (_, i) => `  - Tech${i}`).join('\n')}
---
Body`;
  assert.throws(() => parsePortfolioMarkdown(overlong), /at most 20 entries/);
});

test('builds GitHub raw media URLs and timeline fallback from repo metadata', () => {
  const project = buildProjectRecord(repo, validMarkdown, ['portfolio.md', 'demo.mp4', 'thumbnail.png']);
  assert.equal(project.repositoryId, 123456);
  assert.equal(project.repositoryFullName, 'pandeyyatharth7/demo-project');
  assert.equal(project.timelineDate, '2026-01-02');
  assert.equal(project.timelineDateSource, 'portfolio.md');
  assert.equal(project.videoUrl, 'https://raw.githubusercontent.com/pandeyyatharth7/demo-project/main/demo.mp4');
  assert.equal(project.thumbnailUrl, 'https://raw.githubusercontent.com/pandeyyatharth7/demo-project/main/thumbnail.png');
  assert.equal(project.links.length, 1);
  assert.equal(project.source, 'github-portfolio-md');
});

test('passes external HTTPS video URL through unchanged', () => {
  const source = validMarkdown.replace('video: "demo.mp4"', 'video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"');
  const project = buildProjectRecord(repo, source, ['portfolio.md']);
  assert.equal(project.videoUrl, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.equal(project.thumbnailUrl, undefined);
});

test('defaults status to training and timeline to repository creation date', () => {
  const source = `---\ntitle: "Another Project"\ndescription: "No start date specified."\n---\nDetails.`;
  const project = buildProjectRecord(repo, source, ['portfolio.md']);
  assert.equal(project.status, 'training');
  assert.equal(project.timelineDate, '2025-12-31');
  assert.equal(project.timelineDateSource, 'repository-created-at');
  assert.equal(project.videoUrl, undefined);
  assert.equal(project.thumbnailUrl, undefined);
});

test('discovers a root video when metadata omits it and preserves an existing slug', () => {
  const source = `---\ntitle: "Renamed Display Title"\ndescription: "A project with an automatically detected video."\n---\nDetails.`;
  const project = buildProjectRecord(repo, source, ['portfolio.md', 'demo.webm'], { slug: 'github-original-slug' });
  assert.equal(project.slug, 'github-original-slug');
  assert.equal(project.videoUrl, 'https://raw.githubusercontent.com/pandeyyatharth7/demo-project/main/demo.webm');
});

test('publishes without video when a declared video file is missing from the root', () => {
  const project = buildProjectRecord(repo, validMarkdown, ['portfolio.md', 'thumbnail.png']);
  assert.equal(project.videoUrl, undefined);
  assert.equal(project.thumbnailUrl, 'https://raw.githubusercontent.com/pandeyyatharth7/demo-project/main/thumbnail.png');
});

/* ------------------------------------------------------------------ */
/* main() scan behaviors: mock the GitHub API.                        */
/* ------------------------------------------------------------------ */

const owner = 'pandeyyatharth7';
const portfolioMd = `---
title: "Synced Project"
description: "Discovered via scheduled scan long after the repository was created."
status: "shipped"
technologies:
  - TypeScript
---
Body added late.`;

function base64(text) {
  return Buffer.from(text).toString('base64');
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function installFetchMock(handlers) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    const match = handlers.find((h) => url.includes(h.pattern));
    if (!match) throw new Error(`unmocked GitHub API call: ${url}`);
    // Undici Response bodies are single-use; clone so repeated scans re-read them.
    return match.response.clone();
  };
  return () => {
    globalThis.fetch = originalFetch;
  };
}

async function writeRegistry(projects) {
  await fs.writeFile(REGISTRY_PATH, `${JSON.stringify(projects, null, 2)}\n`, 'utf8');
}

async function readRegistry() {
  return JSON.parse(await fs.readFile(REGISTRY_PATH, 'utf8'));
}

test('detects portfolio.md added any time after repository creation', async () => {
  const handlers = [
    {
      pattern: `/users/${owner}/repos`,
      response: jsonResponse([
        {
          id: 9001,
          name: 'ancient-repo',
          full_name: `${owner}/ancient-repo`,
          html_url: `https://github.com/${owner}/ancient-repo`,
          default_branch: 'main',
          private: false,
          owner: { login: owner },
          created_at: '2024-01-01T00:00:00Z',
        },
      ]),
    },
    {
      pattern: '/repos/pandeyyatharth7/ancient-repo/contents/portfolio.md',
      response: jsonResponse({ type: 'file', content: base64(portfolioMd) }),
    },
    {
      pattern: '/repos/pandeyyatharth7/ancient-repo/contents?ref=main',
      response: jsonResponse([{ type: 'file', name: 'portfolio.md' }]),
    },
  ];

  await writeRegistry([]);
  const restore = installFetchMock(handlers);
  try {
    await syncMod.main();
  } finally {
    restore();
  }

  const registry = await readRegistry();
  assert.equal(registry.length, 1);
  assert.equal(registry[0].repositoryId, 9001);
  // No startDate in frontmatter → falls back to repository creation date.
  assert.equal(registry[0].timelineDate, '2024-01-01');
  assert.equal(registry[0].timelineDateSource, 'repository-created-at');
});

test('removes a repository when portfolio.md is deleted', async () => {
  const previous = [
    {
      source: 'github-portfolio-md',
      repositoryId: 9002,
      repositoryFullName: `${owner}/deleted-marker-repo`,
      name: 'Deleted Marker Repo',
      slug: 'github-deleted-marker-repo',
      timelineDate: '2025-01-01',
      timelineDateSource: 'repository-created-at',
    },
  ];

  const handlers = [
    {
      pattern: `/users/${owner}/repos`,
      response: jsonResponse([
        {
          id: 9002,
          name: 'deleted-marker-repo',
          full_name: `${owner}/deleted-marker-repo`,
          html_url: `https://github.com/${owner}/deleted-marker-repo`,
          default_branch: 'main',
          private: false,
          owner: { login: owner },
          created_at: '2025-01-01T00:00:00Z',
        },
      ]),
    },
    {
      pattern: '/repos/pandeyyatharth7/deleted-marker-repo/contents/portfolio.md',
      response: jsonResponse(null, 404),
    },
  ];

  await writeRegistry(previous);
  const restore = installFetchMock(handlers);
  try {
    await syncMod.main();
  } finally {
    restore();
  }

  const registry = await readRegistry();
  assert.equal(registry.length, 0);
});

test('preserves the last valid record when an individual repository fails', async () => {
  const previous = [
    {
      source: 'github-portfolio-md',
      repositoryId: 9003,
      repositoryFullName: `${owner}/failing-repo`,
      name: 'Failing Repo',
      slug: 'github-failing-repo',
      timelineDate: '2025-01-01',
      timelineDateSource: 'repository-created-at',
    },
  ];

  const handlers = [
    {
      pattern: `/users/${owner}/repos`,
      response: jsonResponse([
        {
          id: 9003,
          name: 'failing-repo',
          full_name: `${owner}/failing-repo`,
          html_url: `https://github.com/${owner}/failing-repo`,
          default_branch: 'main',
          private: false,
          owner: { login: owner },
          created_at: '2025-01-01T00:00:00Z',
        },
        {
          id: 9004,
          name: 'ok-repo',
          full_name: `${owner}/ok-repo`,
          html_url: `https://github.com/${owner}/ok-repo`,
          default_branch: 'main',
          private: false,
          owner: { login: owner },
          created_at: '2025-06-01T00:00:00Z',
        },
      ]),
    },
    {
      pattern: '/repos/pandeyyatharth7/failing-repo/contents/portfolio.md',
      response: new Response('Internal Server Error', { status: 500 }),
    },
    {
      pattern: '/repos/pandeyyatharth7/ok-repo/contents/portfolio.md',
      response: jsonResponse({ type: 'file', content: base64(portfolioMd) }),
    },
    {
      pattern: '/repos/pandeyyatharth7/ok-repo/contents?ref=main',
      response: jsonResponse([{ type: 'file', name: 'portfolio.md' }]),
    },
  ];

  await writeRegistry(previous);
  const restore = installFetchMock(handlers);
  try {
    await syncMod.main();
  } finally {
    restore();
  }

  const registry = await readRegistry();
  assert.equal(registry.length, 2);
  const failing = registry.find((p) => p.repositoryId === 9003);
  const ok = registry.find((p) => p.repositoryId === 9004);
  assert.ok(failing, 'failed repo preserved its last valid record');
  assert.equal(failing.name, 'Failing Repo');
  assert.ok(ok, 'ok repo was refreshed from its portfolio.md');
  assert.equal(ok.name, 'Synced Project');
  assert.equal(ok.timelineDateSource, 'repository-created-at'); // fixture has no startDate
});

test('refuses to replace the registry when every repository scan fails', async () => {
  const previous = [{ name: 'Old Record', slug: 'old-record', repositoryId: 9005 }];
  const handlers = [
    {
      pattern: `/users/${owner}/repos`,
      response: jsonResponse([
        {
          id: 9005,
          name: 'failing-repo',
          full_name: `${owner}/failing-repo`,
          html_url: `https://github.com/${owner}/failing-repo`,
          default_branch: 'main',
          private: false,
          owner: { login: owner },
          created_at: '2025-01-01T00:00:00Z',
        },
      ]),
    },
    {
      pattern: '/repos/pandeyyatharth7/failing-repo/contents/portfolio.md',
      response: new Response('Service Unavailable', { status: 503 }),
    },
  ];

  await writeRegistry(previous);
  const restore = installFetchMock(handlers);
  try {
    await assert.rejects(() => syncMod.main(), /Every repository scan failed/);
  } finally {
    restore();
  }

  const registry = await readRegistry();
  assert.deepEqual(registry, previous); // untouched
});

test('does not change the file when data is identical', async () => {
  const handlers = [
    {
      pattern: `/users/${owner}/repos`,
      response: jsonResponse([
        {
          id: 9006,
          name: 'unchanged-repo',
          full_name: `${owner}/unchanged-repo`,
          html_url: `https://github.com/${owner}/unchanged-repo`,
          default_branch: 'main',
          private: false,
          owner: { login: owner },
          created_at: '2026-01-01T00:00:00Z',
        },
      ]),
    },
    {
      pattern: '/repos/pandeyyatharth7/unchanged-repo/contents/portfolio.md',
      response: jsonResponse({ type: 'file', content: base64(portfolioMd) }),
    },
    {
      pattern: '/repos/pandeyyatharth7/unchanged-repo/contents?ref=main',
      response: jsonResponse([{ type: 'file', name: 'portfolio.md' }]),
    },
  ];

  await writeRegistry([]);
  const restore = installFetchMock(handlers);
  try {
    await syncMod.main();
    const first = await fs.readFile(REGISTRY_PATH, 'utf8');
    await syncMod.main();
    const second = await fs.readFile(REGISTRY_PATH, 'utf8');
    assert.equal(second, first);
  } finally {
    restore();
  }
});

test('skips repositories without a portfolio.md and ignores the portfolio repo itself', async () => {
  const handlers = [
    {
      pattern: `/users/${owner}/repos`,
      response: jsonResponse([
        {
          id: 9007,
          name: 'no-marker-repo',
          full_name: `${owner}/no-marker-repo`,
          html_url: `https://github.com/${owner}/no-marker-repo`,
          default_branch: 'main',
          private: false,
          owner: { login: owner },
          created_at: '2026-01-01T00:00:00Z',
        },
        {
          id: 9008,
          name: 'Portfolio',
          full_name: `${owner}/Portfolio`,
          html_url: `https://github.com/${owner}/Portfolio`,
          default_branch: 'main',
          private: false,
          owner: { login: owner },
          created_at: '2026-01-01T00:00:00Z',
        },
      ]),
    },
    {
      pattern: '/repos/pandeyyatharth7/no-marker-repo/contents/portfolio.md',
      response: jsonResponse(null, 404),
    },
  ];

  await writeRegistry([]);
  const restore = installFetchMock(handlers);
  try {
    await syncMod.main();
  } finally {
    restore();
  }

  const registry = await readRegistry();
  assert.equal(registry.length, 0);
});

test('duplicate prevention: GitHub URL keys match between manual links and generated records', () => {
  assert.equal(
    normalizeRepositoryUrl('https://github.com/pandeyyatharth7/autocodeiq'),
    'pandeyyatharth7/autocodeiq',
  );
  assert.equal(
    normalizeRepositoryUrl('https://github.com/pandeyyatharth7/AutoCodeIQ.git'),
    'pandeyyatharth7/autocodeiq',
  );
  assert.equal(normalizeRepositoryUrl('https://gitlab.com/other/repo'), undefined);
});
