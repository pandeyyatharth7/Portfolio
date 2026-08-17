export const personalInfo = {
  name: 'Yatharth Pandey',
  role: 'AI/ML & Full-Stack Engineer',
  education: 'B.Tech CSE (AI & ML), VIT Chennai',
  year: 'Third-year',
  cgpa: '8.20',
  location: 'Chennai, Tamil Nadu, India',
  email: 'pandeyyatharth7@gmail.com',
  linkedin: 'linkedin.com/in/pandeyyatharth7',
  github: 'github.com/pandeyyatharth7',
  bio: "Third-year B.Tech CSE (AI & ML) student building practical machine learning and full-stack applications — from AI-assisted code review systems to computational photography pipelines. Cares about shipping things that actually run, not just demoing well.",
};

import type { Project } from '../types';

export const projects: Project[] = [
  {
    name: 'AutoCodeIQ',
    slug: 'autocodeiq',
    task: 'AI-assisted code review system',
    architecture: 'Transformers · Hugging Face · PyTorch',
    description: 'Analyzes code semantics and flags bugs/vulnerability-prone patterns. Integrated with Git/GitHub and CI/CD concepts for pre-merge quality checks.',
    status: 'shipped',
    metrics: [
      { label: 'Integration', value: 'Git/GitHub' },
      { label: 'Pipeline', value: 'CI/CD' },
    ],
    problem: 'Code reviews are time-consuming and inconsistent — human reviewers miss subtle bugs, security issues, and maintainability problems, especially in large PRs. Existing linters only catch syntax/style issues, not semantic bugs.',
    approach: [
      'Fine-tuned a CodeBERT-based transformer on a curated dataset of buggy vs. clean code patterns from open-source repos',
      'Built a GitHub App that posts inline comments on PRs with severity classifications (critical/warning/info)',
      'Integrated with CI/CD pipelines to gate merges on critical findings — configurable per repo',
      'Added a local CLI for pre-commit checks without leaving the editor',
    ],
    results: [
      { label: 'Model', value: 'CodeBERT fine-tuned' },
      { label: 'Detection', value: 'Semantic bugs, security patterns, complexity' },
      { label: 'Integration', value: 'GitHub App + CLI + CI/CD gates' },
      { label: 'Status', value: 'Shipped — used in personal workflow' },
    ],
    techStack: ['Python', 'PyTorch', 'Hugging Face Transformers', 'CodeBERT', 'GitHub API', 'Node.js', 'Docker'],
    links: [
      { label: 'GitHub Repo', url: 'https://github.com/pandeyyatharth7/autocodeiq', external: true },
    ],
  },
  {
    name: 'Nexus Inventory OS',
    slug: 'nexus-inventory-os',
    task: 'Full-stack industrial warehouse management system',
    architecture: 'React · Node.js/Express · MySQL',
    description: '3NF-normalized MySQL schema, demand engine monitoring reorder thresholds and replenishment costs across warehouse nodes. Automatic SQLite fallback for cloud outages.',
    status: 'live',
    url: 'https://nexus-inventory-os.vercel.app',
    metrics: [
      { label: 'Deploy', value: 'Vercel/Render/Aiven' },
      { label: 'Fallback', value: 'SQLite' },
    ],
    problem: 'Small-to-mid manufacturers rely on spreadsheets or legacy ERPs for inventory — no real-time visibility across nodes, no demand forecasting, and no offline resilience. Cloud outages halt operations entirely.',
    approach: [
      'Designed a 3NF MySQL schema for items, warehouses, suppliers, purchase orders, and stock movements',
      'Built a demand engine that computes reorder points using rolling consumption averages and lead-time variance',
      'Implemented automatic SQLite fallback: on cloud DB failure, the app seamlessly switches to local SQLite with sync-on-reconnect',
      'Created a React dashboard with real-time stock levels, reorder alerts, and multi-warehouse transfer workflows',
    ],
    results: [
      { label: 'Schema', value: '3NF MySQL (12 tables, FK constraints)' },
      { label: 'Forecasting', value: 'Rolling average + lead-time variance' },
      { label: 'Resilience', value: 'Auto SQLite fallback + background sync' },
      { label: 'Deploy', value: 'Vercel (FE) + Render (BE) + Aiven (MySQL)' },
      { label: 'Status', value: 'Live — https://nexus-inventory-os.vercel.app' },
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'SQLite', 'Prisma', 'Tailwind CSS', 'Vercel', 'Render', 'Aiven'],
    links: [
      { label: 'Live Demo', url: 'https://nexus-inventory-os.vercel.app', external: true },
      { label: 'GitHub Repo', url: 'https://github.com/pandeyyatharth7/nexus-inventory-os', external: true },
    ],
  },
  {
    name: 'OpenReframe',
    slug: 'openreframe',
    task: 'Single-image spatial reframing pipeline',
    architecture: 'Depth Anything V2 · Diffusion · FastAPI',
    description: 'Integrates depth estimation with diffusion-based inpainting to reconstruct gaps from viewpoint changes. CUDA-accelerated FastAPI/PyTorch/OpenCV backend with React/Vite interface.',
    status: 'training',
    metrics: [
      { label: 'Target', value: '8GB consumer GPU' },
      { label: 'Stack', value: 'PyTorch/OpenCV' },
    ],
    problem: 'Changing the viewpoint of a single photo requires hallucinating occluded regions. Traditional inpainting fails on large disocclusions from perspective shifts. Need a pipeline that estimates depth, warps to target view, then fills gaps plausibly.',
    approach: [
      'Use Depth Anything V2 for metric depth estimation from a single image',
      'Reproject pixels to target camera pose using estimated depth — creates disocclusion masks',
      'Feed masked regions + context to a diffusion inpainting model (Stable Diffusion based) conditioned on depth edges',
      'Iterative refinement: inpaint → re-project → blend → repeat for temporal stability in video',
      'Optimized for 8GB VRAM: fp16, gradient checkpointing, sequential module execution',
    ],
    results: [
      { label: 'Depth', value: 'Depth Anything V2 (ViT-L)' },
      { label: 'Inpainting', value: 'SDXL-based, depth-conditioned' },
      { label: 'Target HW', value: '8GB consumer GPU (RTX 3070/4060)' },
      { label: 'Backend', value: 'FastAPI + PyTorch + OpenCV (CUDA)' },
      { label: 'Frontend', value: 'React + Vite + Three.js preview' },
      { label: 'Status', value: 'Training — pipeline components integrating' },
    ],
    techStack: ['Python', 'PyTorch', 'FastAPI', 'OpenCV', 'Depth Anything V2', 'Stable Diffusion', 'React', 'Vite', 'Three.js', 'CUDA'],
    links: [
      { label: 'GitHub Repo', url: 'https://github.com/pandeyyatharth7/openreframe', external: true },
    ],
  },
  {
    name: 'Enterprise Risk Management System',
    slug: 'enterprise-risk-management',
    task: 'Freelance full-stack risk management platform',
    architecture: 'React/Tailwind · Node.js/Express · PostgreSQL',
    description: 'Recharts dashboards, RBAC, JWT auth, Excel export, automated cron-based review monitoring.',
    status: 'private',
    metrics: [
      { label: 'Auth', value: 'JWT + RBAC' },
      { label: 'Client', value: 'Confidential' },
    ],
    problem: 'Enterprise risk teams needed a centralized platform to register risks, assign owners, track mitigation progress, and generate compliance reports — replacing fragmented spreadsheets with audit trails and automated reminders.',
    approach: [
      'Built a role-based access control system: Admin, Risk Owner, Viewer — with granular permissions per risk category',
      'Implemented JWT authentication with refresh tokens, password policies, and session management',
      'Created interactive Recharts dashboards: risk heatmaps, trend lines, category breakdowns, owner workload',
      'Added automated cron jobs for review reminders, escalation emails, and compliance report generation',
      'Excel export with formatted templates for offline review and auditor handoff',
    ],
    results: [
      { label: 'Auth', value: 'JWT + RBAC (3 roles, category-level perms)' },
      { label: 'Dashboards', value: 'Recharts — heatmap, trends, workload' },
      { label: 'Automation', value: 'Cron reminders, escalation, Excel export' },
      { label: 'Client', value: 'Confidential (freelance engagement)' },
      { label: 'Status', value: 'Private — delivered to client' },
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Recharts', 'JWT', 'node-cron', 'ExcelJS'],
    links: [
      { label: 'Private — Client Confidential', url: '#', external: false },
    ],
  },
];

export const skills = {
  'core/languages': ['Python', 'C', 'C++', 'Java'],
  'ai/ml': ['PyTorch', 'TensorFlow', 'Hugging Face', 'NumPy', 'Pandas', 'OpenCV'],
  'web': ['React.js', 'Node.js/Express', 'FastAPI', 'HTML', 'CSS', 'JavaScript'],
  'databases': ['MySQL', 'SQLite'],
  'tooling': ['Git', 'GitHub', 'CI/CD', 'Jupyter', 'VS Code'],
};

export const certifications = [
  'AR/VR Workshop Certification',
  'Student Volunteer — Vibrance \'26, VIT Chennai Annual Fest',
  'Team Participant — Makethon \'25',
  'Team Participant — Cosmonova',
];
