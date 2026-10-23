#!/usr/bin/env node
/**
 * Synchronize public GitHub repositories opted into a portfolio via root-level portfolio.md.
 * Designed for the pandeyyatharth7/Portfolio React + Vite repository.
 *
 * Requires `gray-matter` (npm install --save-dev gray-matter).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const OWNER = (process.env.PORTFOLIO_GITHUB_OWNER || 'pandeyyatharth7').toLowerCase();
const PORTFOLIO_REPOSITORY = (process.env.PORTFOLIO_REPOSITORY || 'Portfolio').toLowerCase();
const API_ROOT = 'https://api.github.com';
const OUTPUT_PATH = path.resolve(
  process.env.PORTFOLIO_REGISTRY_PATH || 'src/data/projects.generated.json',
);
const SCAN_TOKEN = process.env.PORTFOLIO_SCAN_TOKEN;
const MAX_MARKDOWN_BYTES = 64 * 1024;
const MAX_BODY_LENGTH = 30_000;
const ALLOWED_STATUSES = new Set(['shipped', 'live', 'training', 'private']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm']);
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const AUTO_VIDEO_NAMES = ['demo.mp4', 'demo.webm', 'preview.mp4', 'preview.webm'];
const AUTO_THUMBNAIL_NAMES = ['portfolio-cover.png', 'thumbnail.png', 'cover.png', 'screenshot.png'];

function log(message) {
  console.log(`[portfolio-sync] ${message}`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function githubJson(url) {
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'portfolio-project-sync',
    };
    // Fine-grained PAT used only for read-only repo scanning. The workflow's GITHUB_TOKEN
    // is separate and only commits the generated registry into the portfolio repo.
    if (SCAN_TOKEN) headers.Authorization = `Bearer ${SCAN_TOKEN}`;

    let response;
    try {
      response = await fetch(url, { headers });
    } catch (error) {
      lastError = error;
      if (attempt < 3) await delay(500 * (2 ** attempt));
      continue;
    }

    if (response.status === 404) return { notFound: true };
    if (response.ok) return { data: await response.json() };

    const detail = await response.text().catch(() => '');
    const error = new Error(`GitHub API ${response.status} for ${url}: ${detail.slice(0, 300)}`);
    lastError = error;

    const transient = response.status === 429 || response.status >= 500 || response.status === 403;
    if (!transient || attempt === 3) break;
    const retryAfter = Number(response.headers.get('retry-after'));
    const resetAt = Number(response.headers.get('x-ratelimit-reset'));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(retryAfter * 1000, 30_000)
      : resetAt > 0 && response.headers.get('x-ratelimit-remaining') === '0'
        ? Math.min(Math.max(resetAt * 1000 - Date.now(), 1000), 30_000)
        : 500 * (2 ** attempt);
    await delay(waitMs);
  }
  throw lastError || new Error(`GitHub API request failed: ${url}`);
}

async function listOwnedPublicRepos() {
  const repos = [];
  for (let page = 1; ; page += 1) {
    const url = new URL(`${API_ROOT}/users/${encodeURIComponent(OWNER)}/repos`);
    url.searchParams.set('type', 'owner');
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    url.searchParams.set('sort', 'full_name');
    url.searchParams.set('direction', 'asc');
    const result = await githubJson(url.toString());
    if (result.notFound || !Array.isArray(result.data)) {
      throw new Error(`Could not list repositories for GitHub user ${OWNER}.`);
    }
    repos.push(...result.data);
    if (result.data.length < 100) break;
  }
  return repos.filter((repo) =>
    repo.owner?.login?.toLowerCase() === OWNER &&
    repo.private === false &&
    repo.full_name?.toLowerCase() !== `${OWNER}/${PORTFOLIO_REPOSITORY}`
  );
}

function repoApiBase(repo) {
  return `${API_ROOT}/repos/${repo.full_name.split('/').map(encodeURIComponent).join('/')}`;
}

async function getPortfolioMarkdown(repo) {
  const url = `${repoApiBase(repo)}/contents/portfolio.md?ref=${encodeURIComponent(repo.default_branch)}`;
  const result = await githubJson(url);
  if (result.notFound) return null;
  const file = result.data;
  if (!file || file.type !== 'file' || typeof file.content !== 'string') {
    throw new Error(`${repo.full_name}: portfolio.md did not resolve to a readable root-level file.`);
  }
  const markdown = Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf8');
  if (Buffer.byteLength(markdown, 'utf8') > MAX_MARKDOWN_BYTES) {
    throw new Error(`${repo.full_name}: portfolio.md exceeds ${MAX_MARKDOWN_BYTES} bytes.`);
  }
  return markdown;
}

async function getRootEntries(repo) {
  const url = `${repoApiBase(repo)}/contents?ref=${encodeURIComponent(repo.default_branch)}`;
  const result = await githubJson(url);
  if (result.notFound || !Array.isArray(result.data)) {
    throw new Error(`${repo.full_name}: could not read repository root contents.`);
  }
  return result.data.filter((entry) => entry.type === 'file').map((entry) => entry.name);
}

function asTrimmedString(value, field, { required = false, max = 500 } = {}) {
  if (value === undefined || value === null || value === '') {
    if (required) throw new Error(`Missing required field: ${field}`);
    return undefined;
  }
  if (typeof value !== 'string') throw new Error(`${field} must be a string.`);
  const cleaned = value.trim();
  if (!cleaned && required) throw new Error(`${field} cannot be empty.`);
  if (cleaned.length > max) throw new Error(`${field} must be ${max} characters or fewer.`);
  return cleaned || undefined;
}

function validateIsoDate(value, field) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${field} must use YYYY-MM-DD.`);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`${field} is not a valid calendar date.`);
  }
  return value;
}

function validateHttpsUrl(value, field) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') throw new Error(`${field} must be an HTTPS URL.`);
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${field} must be a valid HTTPS URL.`);
  }
  if (parsed.protocol !== 'https:') throw new Error(`${field} must use HTTPS.`);
  if (parsed.username || parsed.password) throw new Error(`${field} cannot include credentials.`);
  return parsed.toString();
}

function validateRootFilename(value, field, extensions) {
  const filename = asTrimmedString(value, field, { max: 160 });
  if (!filename) return undefined;
  if (filename.includes('/') || filename.includes('\\') || filename === '.' || filename === '..' || filename.includes('..')) {
    throw new Error(`${field} must be a filename in the repository root (no folders or '..').`);
  }
  if (!extensions.has(path.extname(filename).toLowerCase())) {
    throw new Error(`${field} must have one of these extensions: ${[...extensions].join(', ')}.`);
  }
  return filename;
}

export function parsePortfolioMarkdown(markdown) {
  let parsed;
  try {
    parsed = matter(markdown);
  } catch (error) {
    throw new Error(`Could not parse YAML frontmatter: ${error instanceof Error ? error.message : String(error)}`);
  }

  const data = parsed.data || {};
  const title = asTrimmedString(data.title, 'title', { required: true, max: 100 });
  const description = asTrimmedString(data.description, 'description', { required: true, max: 1000 });
  const tagline = asTrimmedString(data.tagline, 'tagline', { max: 180 });
  const category = asTrimmedString(data.category, 'category', { max: 60 });
  const status = data.status === undefined ? 'training' : data.status;
  if (typeof status !== 'string' || !ALLOWED_STATUSES.has(status)) {
    throw new Error(`status must be one of: ${[...ALLOWED_STATUSES].join(', ')}.`);
  }

  let technologies = [];
  if (data.technologies !== undefined) {
    if (!Array.isArray(data.technologies)) throw new Error('technologies must be a YAML list of strings.');
    if (data.technologies.length > 20) throw new Error('technologies may contain at most 20 entries.');
    technologies = data.technologies.map((tech, index) =>
      asTrimmedString(tech, `technologies[${index}]`, { required: true, max: 50 })
    );
    if (new Set(technologies.map((x) => x.toLowerCase())).size !== technologies.length) {
      throw new Error('technologies contains duplicate entries.');
    }
  }

  const startDate = validateIsoDate(data.startDate, 'startDate');
  const endDate = validateIsoDate(data.endDate, 'endDate');
  if (startDate && endDate && endDate < startDate) throw new Error('endDate cannot be earlier than startDate.');
  if (data.featured !== undefined && typeof data.featured !== 'boolean') {
    throw new Error('featured must be true or false.');
  }

  const demoUrl = validateHttpsUrl(data.demoUrl, 'demoUrl');
  let video;
  if (data.video !== undefined && data.video !== null && data.video !== '') {
    if (typeof data.video !== 'string') throw new Error('video must be an HTTPS URL or a root-level filename.');
    video = /^https:\/\//i.test(data.video)
      ? validateHttpsUrl(data.video, 'video')
      : validateRootFilename(data.video, 'video', VIDEO_EXTENSIONS);
  }
  let thumbnail;
  if (data.thumbnail !== undefined && data.thumbnail !== null && data.thumbnail !== '') {
    if (typeof data.thumbnail !== 'string') throw new Error('thumbnail must be an HTTPS URL or a root-level filename.');
    thumbnail = /^https:\/\//i.test(data.thumbnail)
      ? validateHttpsUrl(data.thumbnail, 'thumbnail')
      : validateRootFilename(data.thumbnail, 'thumbnail', IMAGE_EXTENSIONS);
  }

  const bodyMarkdown = String(parsed.content || '').trim();
  if (bodyMarkdown.length > MAX_BODY_LENGTH) throw new Error(`Markdown body must be ${MAX_BODY_LENGTH} characters or fewer.`);

  return {
    title,
    description,
    tagline,
    category,
    status,
    technologies,
    featured: data.featured === true,
    startDate,
    endDate,
    demoUrl,
    video,
    thumbnail,
    bodyMarkdown,
  };
}

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project';
}

function encodePath(value) {
  return String(value).split('/').map(encodeURIComponent).join('/');
}

function rawUrl(repo, filename) {
  return `https://raw.githubusercontent.com/${repo.full_name}/${encodePath(repo.default_branch)}/${encodePath(filename)}`;
}

function chooseMedia(metadata, rootFiles, repo) {
  const lowerNames = new Map(rootFiles.map((name) => [name.toLowerCase(), name]));
  let videoUrl;
  if (metadata.video && /^https:\/\//i.test(metadata.video)) {
    videoUrl = metadata.video;
  } else {
    const selectedVideo = metadata.video
      ? lowerNames.get(metadata.video.toLowerCase())
      : AUTO_VIDEO_NAMES.map((name) => lowerNames.get(name)).find(Boolean);
    if (selectedVideo && VIDEO_EXTENSIONS.has(path.extname(selectedVideo).toLowerCase())) {
      videoUrl = rawUrl(repo, selectedVideo);
    } else if (metadata.video) {
      log(`WARNING ${repo.full_name}: video "${metadata.video}" was not found in the repo root; publishing without a video.`);
    }
  }

  let thumbnailUrl;
  if (metadata.thumbnail && /^https:\/\//i.test(metadata.thumbnail)) {
    thumbnailUrl = metadata.thumbnail;
  } else {
    const selectedImage = metadata.thumbnail
      ? lowerNames.get(metadata.thumbnail.toLowerCase())
      : AUTO_THUMBNAIL_NAMES.map((name) => lowerNames.get(name)).find(Boolean);
    if (selectedImage && IMAGE_EXTENSIONS.has(path.extname(selectedImage).toLowerCase())) {
      thumbnailUrl = rawUrl(repo, selectedImage);
    } else if (metadata.thumbnail) {
      log(`WARNING ${repo.full_name}: thumbnail "${metadata.thumbnail}" was not found in the repo root; using the default.`);
    }
  }
  return { videoUrl, thumbnailUrl };
}

export function buildProjectRecord(repo, markdown, rootFiles, previous = undefined) {
  const metadata = parsePortfolioMarkdown(markdown);
  const media = chooseMedia(metadata, rootFiles, repo);
  const repoUrl = repo.html_url || `https://github.com/${repo.full_name}`;
  const timelineDate = metadata.startDate || (typeof repo.created_at === 'string' ? repo.created_at.slice(0, 10) : undefined);
  const projectLinks = [{ label: 'GitHub Repo', url: repoUrl, external: true }];
  if (metadata.demoUrl) projectLinks.push({ label: 'Live Demo', url: metadata.demoUrl, external: true });

  return {
    source: 'github-portfolio-md',
    repositoryId: repo.id,
    repositoryFullName: repo.full_name,
    repositoryUrl: repoUrl,
    name: metadata.title,
    slug: previous?.slug || `github-${slugify(repo.name)}`,
    task: metadata.tagline || metadata.title,
    architecture: metadata.technologies.slice(0, 5).join(' · ') || metadata.category || 'GitHub project',
    description: metadata.description,
    status: metadata.status,
    url: metadata.demoUrl || repoUrl,
    metrics: [],
    techStack: metadata.technologies,
    links: projectLinks,
    category: metadata.category,
    featured: metadata.featured,
    startDate: metadata.startDate,
    endDate: metadata.endDate,
    timelineDate,
    timelineDateSource: metadata.startDate ? 'portfolio.md' : 'repository-created-at',
    demoUrl: metadata.demoUrl,
    videoUrl: media.videoUrl,
    thumbnailUrl: media.thumbnailUrl,
    bodyMarkdown: metadata.bodyMarkdown,
  };
}

async function readPreviousRegistry() {
  try {
    const text = await fs.readFile(OUTPUT_PATH, 'utf8');
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error(`${OUTPUT_PATH} must contain a JSON array.`);
    return { raw: text, projects: parsed };
  } catch (error) {
    if (error?.code === 'ENOENT') return { raw: null, projects: [] };
    throw new Error(`Could not read previous registry at ${OUTPUT_PATH}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function projectKey(project) {
  return String(project.repositoryId ?? project.repositoryFullName ?? '').toLowerCase();
}

export async function main() {
  log(`Scanning public repositories owned by ${OWNER}.`);
  const previousState = await readPreviousRegistry();
  const previousById = new Map(previousState.projects.map((project) => [projectKey(project), project]));
  const repos = await listOwnedPublicRepos(); // A listing failure aborts before writing anything.
  const nextById = new Map();
  const counters = { eligible: 0, skipped: 0, added: 0, updated: 0, preservedOnError: 0, scanErrors: 0 };

  for (const repo of repos) {
    const key = String(repo.id).toLowerCase();
    const oldProject = previousById.get(key);
    try {
      const markdown = await getPortfolioMarkdown(repo);
      if (markdown === null) {
        counters.skipped += 1;
        continue; // Confirmed absence: marker deletion removes the old generated record.
      }

      counters.eligible += 1;
      const rootFiles = await getRootEntries(repo);
      const record = buildProjectRecord(repo, markdown, rootFiles, oldProject);
      nextById.set(key, record);
      if (!oldProject) counters.added += 1;
      else if (JSON.stringify(oldProject) !== JSON.stringify(record)) counters.updated += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      counters.scanErrors += 1;
      log(`ERROR ${repo.full_name}: ${message}`);
      if (oldProject) {
        // Do not remove a previously valid public project due to a transient API or validation issue.
        nextById.set(key, oldProject);
        counters.preservedOnError += 1;
      } else {
        counters.skipped += 1;
      }
    }
  }

  if (repos.length > 0 && counters.scanErrors === repos.length) {
    throw new Error('Every repository scan failed or had invalid metadata; refusing to replace the registry.');
  }

  const nextProjects = [...nextById.values()].sort((a, b) =>
    String(a.repositoryFullName).localeCompare(String(b.repositoryFullName))
  );
  const nextRaw = `${JSON.stringify(nextProjects, null, 2)}\n`;
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  if (previousState.raw === nextRaw) {
    log('Registry is already up to date; no file change needed.');
  } else {
    const temporaryPath = `${OUTPUT_PATH}.tmp`;
    await fs.writeFile(temporaryPath, nextRaw, 'utf8');
    await fs.rename(temporaryPath, OUTPUT_PATH); // atomic replacement on the runner filesystem
    log(`Wrote ${nextProjects.length} project record(s) to ${OUTPUT_PATH}.`);
  }

  const previousIds = new Set(previousState.projects.map(projectKey));
  const nextIds = new Set(nextProjects.map(projectKey));
  const removed = [...previousIds].filter((id) => !nextIds.has(id)).length;
  log(`Summary: ${counters.added} added, ${counters.updated} updated, ${removed} removed, ${counters.skipped} skipped, ${counters.preservedOnError} preserved after errors.`);
  if (counters.preservedOnError > 0) {
    log('Some repositories could not be refreshed; their last valid records were retained. Review the errors above.');
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    console.error(`[portfolio-sync] FATAL: ${error instanceof Error ? error.stack || error.message : String(error)}`);
    process.exitCode = 1;
  });
}
