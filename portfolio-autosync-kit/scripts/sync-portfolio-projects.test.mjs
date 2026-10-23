import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePortfolioMarkdown, buildProjectRecord } from './sync-portfolio-projects.mjs';

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

## Overview\n\nProject details here.`;

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
});

test('rejects unsafe root-relative paths and unsupported video extensions', () => {
  assert.throws(
    () => parsePortfolioMarkdown(validMarkdown.replace('video: "demo.mp4"', 'video: "../private/demo.mp4"')),
    /root-level filename/,
  );
  assert.throws(
    () => parsePortfolioMarkdown(validMarkdown.replace('video: "demo.mp4"', 'video: "demo.mov"')),
    /extensions/,
  );
});

test('rejects invalid dates and non-HTTPS links', () => {
  assert.throws(() => parsePortfolioMarkdown(validMarkdown.replace('2026-01-02', '2026-02-31')), /valid calendar date/);
  assert.throws(() => parsePortfolioMarkdown(`${validMarkdown}\n` .replace('thumbnail: "thumbnail.png"', 'thumbnail: "http://example.com/thumbnail.png"')), /HTTPS URL/);
});

test('builds GitHub raw media URLs and timeline fallback from repo metadata', () => {
  const project = buildProjectRecord(repo, validMarkdown, ['portfolio.md', 'demo.mp4', 'thumbnail.png']);
  assert.equal(project.repositoryId, 123456);
  assert.equal(project.repositoryFullName, 'pandeyyatharth7/demo-project');
  assert.equal(project.timelineDate, '2026-01-02');
  assert.equal(project.videoUrl, 'https://raw.githubusercontent.com/pandeyyatharth7/demo-project/main/demo.mp4');
  assert.equal(project.thumbnailUrl, 'https://raw.githubusercontent.com/pandeyyatharth7/demo-project/main/thumbnail.png');
  assert.equal(project.links.length, 1);
});

test('defaults status to training and timeline to repository creation date', () => {
  const source = `---\ntitle: "Another Project"\ndescription: "No start date specified."\n---\nDetails.`;
  const project = buildProjectRecord(repo, source, ['portfolio.md']);
  assert.equal(project.status, 'training');
  assert.equal(project.timelineDate, '2025-12-31');
  assert.equal(project.timelineDateSource, 'repository-created-at');
  assert.equal(project.videoUrl, undefined);
});

test('discovers a root video when metadata omits it and preserves an existing slug', () => {
  const source = `---\ntitle: "Renamed Display Title"\ndescription: "A project with an automatically detected video."\n---\nDetails.`;
  const project = buildProjectRecord(repo, source, ['portfolio.md', 'demo.webm'], { slug: 'github-original-slug' });
  assert.equal(project.slug, 'github-original-slug');
  assert.equal(project.videoUrl, 'https://raw.githubusercontent.com/pandeyyatharth7/demo-project/main/demo.webm');
});
