import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../../data/content';
import type { Project } from '../../types';

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [projectIndex, setProjectIndex] = useState(0);

  useEffect(() => {
    const found = projects.find((p) => p.slug === slug);
    const index = projects.findIndex((p) => p.slug === slug);
    if (found) {
      setProject(found);
      setProjectIndex(index);
    }
  }, [slug]);

  if (!project) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full text-center">
          <h1 className="font-mono text-2xl text-accent-violet mb-4">404 — case study not found</h1>
          <p className="text-text-muted mb-6">The requested project case study does not exist.</p>
          <Link to="#projects" className="font-mono text-accent-violet hover:text-accent-amber transition-colors">
            ← back to model_zoo
          </Link>
        </div>
      </section>
    );
  }

  const prevProject = projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  const statusConfig = {
    shipped: { color: 'bg-green-500', label: 'shipped' },
    live: { color: 'bg-green-500', label: 'live' },
    training: { color: 'bg-accent-amber', label: 'training' },
    private: { color: 'bg-text-muted', label: 'private' },
  };

  const config = statusConfig[project.status];

  return (
    <article className="min-h-screen px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="font-mono text-sm text-accent-violet">GET /model_zoo/{project.slug}</span>
            <div className={`terminal-status-dot ${config.color} ml-2`} />
            <span className="font-mono text-sm text-text-muted">{config.label}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {project.name}
          </h1>

          <p className="text-lg text-text-muted mb-6 max-w-2xl">{project.task}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack?.slice(0, 8).map((tech, i) => (
              <span key={i} className="bg-bg-base border border-border-subtle rounded px-3 py-1 font-mono text-xs text-text-primary">
                {tech}
              </span>
            ))}
            {project.techStack && project.techStack.length > 8 && (
              <span className="bg-bg-base border border-border-subtle rounded px-3 py-1 font-mono text-xs text-text-muted">
                +{project.techStack.length - 8} more
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {project.links?.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="gradient-border px-6 py-3 font-mono text-sm text-text-primary hover:text-accent-violet transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:ring-offset-2 focus:ring-offset-bg-base rounded"
              >
                {link.label}
              </a>
            ))}
          </div>
        </header>

        {/* Problem/Motivation */}
        <section className="terminal-card mb-12">
          <div className="terminal-card-titlebar">
            <span className="font-mono text-sm text-accent-violet">problem.statement</span>
          </div>
          <div className="terminal-card-body">
            <p className="text-text-primary leading-relaxed">{project.problem}</p>
          </div>
        </section>

        {/* Architecture */}
        <section className="terminal-card mb-12">
          <div className="terminal-card-titlebar">
            <span className="font-mono text-sm text-accent-violet">architecture.diagram</span>
          </div>
          <div className="terminal-card-body">
            <ArchitectureDiagram project={project} />
          </div>
        </section>

        {/* Approach */}
        <section className="terminal-card mb-12">
          <div className="terminal-card-titlebar">
            <span className="font-mono text-sm text-accent-violet">approach.methodology</span>
          </div>
          <div className="terminal-card-body">
            <ol className="space-y-4">
              {project.approach?.map((step, i) => (
                <li key={i} className="flex gap-4 text-text-primary leading-relaxed">
                  <span className="font-mono text-accent-violet shrink-0 pt-0.5">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Results/Metrics */}
        <section className="terminal-card mb-12">
          <div className="terminal-card-titlebar">
            <span className="font-mono text-sm text-accent-violet">results.metrics</span>
          </div>
          <div className="terminal-card-body">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.results?.map((metric, idx) => (
                <div key={idx} className="bg-bg-base border border-border-subtle rounded px-4 py-3">
                  <div className="font-mono text-xs text-text-muted mb-1">{metric.label}</div>
                  <div className="font-mono text-sm text-text-primary">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="terminal-card mb-12">
          <div className="terminal-card-titlebar">
            <span className="font-mono text-sm text-accent-violet">tech.stack</span>
          </div>
          <div className="terminal-card-body">
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tech, i) => (
                <span key={i} className="bg-bg-base border border-border-subtle rounded px-3 py-1 font-mono text-xs text-text-primary">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <nav className="flex items-center justify-between pt-8 border-t border-border-subtle">
          <Link
            to={`/model_zoo/${prevProject.slug}`}
            className="font-mono text-sm text-text-muted hover:text-accent-violet transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span>{prevProject.name}</span>
          </Link>

          <Link
            to="#projects"
            className="font-mono text-sm text-text-muted hover:text-accent-violet transition-colors"
          >
            model_zoo index
          </Link>

          <Link
            to={`/model_zoo/${nextProject.slug}`}
            className="font-mono text-sm text-text-muted hover:text-accent-violet transition-colors flex items-center gap-2"
          >
            <span>{nextProject.name}</span>
            <span>→</span>
          </Link>
        </nav>
      </div>
    </article>
  );
}

function ArchitectureDiagram({ project }: { project: Project }) {
  // Define architecture components per project
  const diagrams: Record<string, { nodes: Array<{ id: string; label: string }>; edges: Array<{ from: string; to: string }> }> = {
    autocodeiq: {
      nodes: [
        { id: 'code', label: 'source code\n(PR diff)' },
        { id: 'parser', label: 'AST parser\n(tree-sitter)' },
        { id: 'model', label: 'CodeBERT\nclassifier' },
        { id: 'gh', label: 'GitHub App\ninline comments' },
        { id: 'ci', label: 'CI/CD gate\nmerge check' },
      ],
      edges: [
        { from: 'code', to: 'parser' },
        { from: 'parser', to: 'model' },
        { from: 'model', to: 'gh' },
        { from: 'gh', to: 'ci' },
      ],
    },
    'nexus-inventory-os': {
      nodes: [
        { id: 'ui', label: 'React\nDashboard' },
        { id: 'api', label: 'Express\nAPI' },
        { id: 'mysql', label: 'MySQL\n(3NF schema)' },
        { id: 'sqlite', label: 'SQLite\n(fallback)' },
        { id: 'engine', label: 'Demand\nEngine' },
      ],
      edges: [
        { from: 'ui', to: 'api' },
        { from: 'api', to: 'mysql' },
        { from: 'mysql', to: 'sqlite' },
        { from: 'api', to: 'engine' },
        { from: 'engine', to: 'mysql' },
      ],
    },
    openreframe: {
      nodes: [
        { id: 'img', label: 'input\nimage' },
        { id: 'depth', label: 'Depth Anything V2\nmetric depth' },
        { id: 'warp', label: 'reproject to\nnew viewpoint' },
        { id: 'mask', label: 'disocclusion\nmask' },
        { id: 'inpaint', label: 'diffusion\ninpainting' },
        { id: 'out', label: 'reframed\noutput' },
      ],
      edges: [
        { from: 'img', to: 'depth' },
        { from: 'depth', to: 'warp' },
        { from: 'warp', to: 'mask' },
        { from: 'mask', to: 'inpaint' },
        { from: 'inpaint', to: 'out' },
      ],
    },
    'enterprise-risk-management': {
      nodes: [
        { id: 'auth', label: 'JWT Auth\n+ RBAC' },
        { id: 'risks', label: 'Risk Register\nCRUD' },
        { id: 'dash', label: 'Recharts\nDashboards' },
        { id: 'cron', label: 'Cron Jobs\nreminders/export' },
        { id: 'pg', label: 'PostgreSQL\n(Prisma)' },
      ],
      edges: [
        { from: 'auth', to: 'risks' },
        { from: 'risks', to: 'dash' },
        { from: 'risks', to: 'cron' },
        { from: 'risks', to: 'pg' },
      ],
    },
  };

  const diagram = diagrams[project.slug] || { nodes: [], edges: [] };

  return (
    <div className="overflow-x-auto">
      <svg
        className="w-full min-w-[600px]"
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
        style={{ height: '200px' }}
        role="img"
        aria-label={`Architecture diagram for ${project.name}`}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#A855F7" />
          </marker>
        </defs>

        {/* Edges */}
        {diagram.edges.map((edge, i) => {
          const fromNode = diagram.nodes.find((n) => n.id === edge.from);
          const toNode = diagram.nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          // Simple layout: horizontal arrangement
          const fromIndex = diagram.nodes.findIndex((n) => n.id === edge.from);
          const toIndex = diagram.nodes.findIndex((n) => n.id === edge.to);
          const x1 = 60 + fromIndex * 160 + 100;
          const x2 = 60 + toIndex * 160;
          const y = 100;

          return (
            <line
              key={i}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="#A855F7"
              strokeWidth="1.5"
              markerEnd="url(#arrowhead)"
              opacity="0.6"
            />
          );
        })}

        {/* Nodes */}
        {diagram.nodes.map((node, i) => {
          const x = 60 + i * 160;
          const y = 100;
          const lines = node.label.split('\n');

          return (
            <g key={node.id} transform={`translate(${x}, ${y})`}>
              <rect
                x="-50"
                y="-35"
                width="100"
                height="70"
                rx="4"
                fill="#131826"
                stroke="#232833"
                strokeWidth="1"
              />
              {lines.map((line, li) => (
                <text
                  key={li}
                  x="0"
                  y={-20 + li * 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#E4E7EC"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="10"
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}