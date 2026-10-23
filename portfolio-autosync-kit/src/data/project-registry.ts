import { projects as manuallyMaintainedProjects } from './content';
import generatedProjectsJson from './projects.generated.json';
import type { Project } from '../types';

const generatedProjects = generatedProjectsJson as Project[];

function normalizeGitHubRepo(value?: string): string | undefined {
  if (!value) return undefined;
  const match = value.match(/github\.com[:/]([^/]+)\/([^/#?]+)/i);
  if (!match) return undefined;
  return `${match[1].toLowerCase()}/${match[2].replace(/\.git$/i, '').toLowerCase()}`;
}

const manuallyMaintainedRepoKeys = new Set(
  manuallyMaintainedProjects.flatMap((project) =>
    (project.links ?? [])
      .filter((link) => /github/i.test(link.label))
      .map((link) => normalizeGitHubRepo(link.url))
      .filter((value): value is string => Boolean(value)),
  ),
);

const nonDuplicateGeneratedProjects = generatedProjects.filter((project) => {
  const key = project.repositoryFullName?.toLowerCase();
  return !key || !manuallyMaintainedRepoKeys.has(key);
});

const sortedGeneratedProjects = [...nonDuplicateGeneratedProjects].sort((a, b) => {
  if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
  return (b.timelineDate ?? '').localeCompare(a.timelineDate ?? '');
});

// Keep existing hand-maintained projects intact; append generated projects without duplicates.
export const allProjects: Project[] = [
  ...manuallyMaintainedProjects,
  ...sortedGeneratedProjects,
];

export const timelineProjects: Project[] = allProjects
  .filter((project) => Boolean(project.timelineDate))
  .sort((a, b) => (a.timelineDate ?? '').localeCompare(b.timelineDate ?? ''));

export function normalizeRepositoryUrl(value?: string): string | undefined {
  return normalizeGitHubRepo(value);
}
