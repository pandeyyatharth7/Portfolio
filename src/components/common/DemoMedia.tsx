import type { Project } from '../../types';

interface DemoMediaProps {
  project: Pick<Project, 'name' | 'videoUrl' | 'thumbnailUrl'>;
}

function getEmbedUrl(rawUrl: string): string | undefined {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return undefined;
  }
  if (url.protocol !== 'https:') return undefined;

  const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  let youtubeId: string | undefined;
  if (hostname === 'youtu.be') {
    youtubeId = url.pathname.split('/').filter(Boolean)[0];
  } else if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
    youtubeId = url.searchParams.get('v') ?? undefined;
    if (!youtubeId) {
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts[0] === 'embed' || parts[0] === 'shorts') youtubeId = parts[1];
    }
  }
  if (youtubeId && /^[A-Za-z0-9_-]{11}$/.test(youtubeId)) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
  }

  const vimeoId = (hostname === 'vimeo.com' || hostname === 'player.vimeo.com')
    ? url.pathname.match(/(?:video\/)?(\d{5,})/)?.[1]
    : undefined;
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
  return undefined;
}

function isDirectVideoUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    return url.protocol === 'https:' && /\.(mp4|webm)$/i.test(url.pathname);
  } catch {
    return false;
  }
}

export default function DemoMedia({ project }: DemoMediaProps) {
  if (!project.videoUrl) return null;
  const embedUrl = getEmbedUrl(project.videoUrl);

  return (
    <section className="terminal-card mb-12" aria-label={`${project.name} demo video`}>
      <div className="terminal-card-titlebar">
        <span className="font-mono text-sm text-accent-violet">demo.media</span>
        <span className="ml-auto font-mono text-xs text-text-muted">optional_asset</span>
      </div>
      <div className="terminal-card-body">
        {embedUrl ? (
          <div className="aspect-video overflow-hidden rounded border border-border-subtle bg-black">
            <iframe
              src={embedUrl}
              title={`${project.name} demonstration video`}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : isDirectVideoUrl(project.videoUrl) ? (
          <video
            className="w-full rounded border border-border-subtle bg-black"
            controls
            playsInline
            preload="metadata"
            poster={project.thumbnailUrl}
          >
            <source src={project.videoUrl} />
            Your browser does not support embedded video. Use the video link below.
          </video>
        ) : (
          <a
            href={project.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-accent-violet hover:text-accent-amber underline"
          >
            Watch demo in a new tab →
          </a>
        )}
      </div>
    </section>
  );
}
