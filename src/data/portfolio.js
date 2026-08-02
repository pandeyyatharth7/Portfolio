// Single source of truth for personal data. Edit this file to update the site.

export const profile = {
  name: 'Yatharth Pandey',
  initials: 'YP',
  role: 'AI/ML Engineer & Full-Stack Developer',
  shortRole: 'AI/ML Engineer',
  location: 'Chennai, Tamil Nadu, India',
  tagline: 'I build practical machine-learning systems and production-grade web apps — and I care about the engineering that makes them hold up in the real world.',
  // Primary positioning: AI/ML roles, with SWE clearly available.
  positioning: {
    primary: 'Open to AI/ML internships & full-time roles',
    secondary: 'Also open to Software Engineering roles',
  },
  // Contact details — keep these in one place so the navbar/contact page agree.
  contact: {
    email: 'pandeyyatharth7@gmail.com',
    phone: '+91 9019940437',
    linkedin: 'https://linkedin.com/in/pandeyyatharth7',
    github: 'https://github.com/pandeyyatharth7',
  },
}

// Three hard-hitting statements for the manifesto strip below the hero.
// Exported as a top-level constant so the Home page can import it directly.
export const manifesto = [
  {
    label: 'I build',
    headline: 'AI/ML systems that survive contact with production.',
  },
  {
    label: 'I ship',
    headline: 'Full-stack products end-to-end, not just notebooks.',
  },
  {
    label: 'I care about',
    headline: 'The engineering that makes models actually useful.',
  },
]

// Education, in display order (most recent first).
export const education = [
  {
    school: 'Vellore Institute of Technology (VIT), Chennai',
    degree: 'B.Tech Computer Science and Engineering (AI & ML)',
    period: '2024 – 2028',
    detail: 'CGPA 8.20 / 10. Coursework in DSA, OOP, DBMS, Operating Systems, Computer Networks, Machine Learning, Deep Learning.',
  },
  {
    school: 'Shri Ram Global School',
    degree: 'Class 12 (CBSE)',
    period: 'Apr 2024',
    detail: '80%. Strong in mathematics and the sciences — the foundation under everything I build now.',
  },
  {
    school: 'Narayana E-Techno School',
    degree: 'Class 10 (CBSE)',
    period: 'Apr 2022',
    detail: '91%.',
  },
]

// Projects, in display order. The live link is only added when it actually exists.
export const projects = [
  {
    id: 'autocodeiq',
    name: 'AutoCodeIQ',
    tagline: 'Intelligent autonomous code review and bug detection',
    summary:
      'An AI-assisted code-review system that reads code the way a senior engineer would — surfacing bugs and vulnerability-prone patterns before they reach main.',
    problem:
      'Pre-merge reviews catch the bugs CI does not. Most static-analysis tools are noisy; most LLM tools hallucinate patterns that aren’t there. AutoCodeIQ aims at the middle: semantic understanding with clear, actionable feedback.',
    approach: [
      'Transformers from Hugging Face fine-tuned for code-semantics tasks.',
      'PyTorch training + evaluation loops; flagging vulnerability-prone patterns.',
      'Generated clear, actionable review comments (not just labels).',
      'Designed to plug into Git/GitHub and CI/CD for pre-merge quality gates.',
    ],
    stack: ['Transformers', 'Hugging Face', 'PyTorch', 'Python', 'Git', 'CI/CD'],
    role: 'Designed and built the system end-to-end: data prep, model training, evaluation, and the reviewer-style feedback generator.',
    outcome:
      'A working code-review assistant that produces feedback closer to a human reviewer than a typical linter — the kind of tool I would actually want running on my own PRs.',
    live: null,
    repo: 'https://github.com/pandeyyatharth7',
    accent: 'lime',
  },
  {
    id: 'nexus-inventory',
    name: 'Nexus Inventory OS',
    tagline: 'Full-stack industrial warehouse management system',
    summary:
      'A React + Node platform for multi-warehouse stock tracking, supplier management, and automated restock-demand calculation — live in production.',
    problem:
      'Small and mid-size operations juggle stock across multiple warehouses with spreadsheets and gut feel. Restock thresholds get missed; replenishment costs are invisible until the invoice lands.',
    approach: [
      'Designed a 3NF MySQL schema covering warehouses, SKUs, suppliers, and stock movements.',
      'Built a demand engine that watches reorder thresholds and estimates replenishment cost per warehouse node.',
      'React front-end + Node.js / Express API; full supplier-management workflow.',
      'Added an automatic SQLite fallback so the app stays usable when the cloud DB is unavailable.',
    ],
    stack: ['React', 'Node.js', 'Express', 'MySQL', 'SQLite', 'Vercel', 'Render', 'Aiven'],
    role: 'Sole builder. Schema, API, front-end, deployment, and the offline-fallback that made it survive a real Aiven outage.',
    outcome:
      'Deployed across Vercel (front-end), Render (API), and Aiven (DB) with the SQLite fallback that has actually saved the day in production.',
    live: 'https://nexus-inventory-os.vercel.app',
    repo: 'https://github.com/pandeyyatharth7',
    accent: 'lime',
  },
  {
    id: 'openreframe',
    name: 'OpenReframe',
    tagline: 'Single-image spatial reframing via 3D inference & diffusion inpainting',
    summary:
      'A computational-photography pipeline that infers 3D geometry from a single image and lets you virtually pan, tilt, and zoom — with diffusion-based inpainting filling what the new viewpoint reveals.',
    problem:
      'Cropping a photo is a 2D decision about a 3D scene. The interesting reframings (moving the camera, not the crop box) require knowing the scene’s geometry — which usually means many images or a depth sensor.',
    approach: [
      'Depth Anything V2 for monocular depth estimation.',
      'Camera reprojection to synthesize the new viewpoint from the depth map.',
      'Diffusion-based inpainting to plausibly reconstruct gaps revealed by the viewpoint change.',
      'CUDA-accelerated FastAPI / PyTorch / OpenCV backend with a React + Vite interface and real-time controls.',
      'Target hardware: 8GB consumer GPU — every choice was made with that memory budget in mind.',
    ],
    stack: ['Depth Anything V2', 'PyTorch', 'CUDA', 'OpenCV', 'FastAPI', 'React', 'Vite'],
    role: 'Designed and built the whole pipeline — depth inference, reprojection, inpainting, the GPU memory plan, and the real-time UI.',
    outcome:
      'A working real-time reframing tool that runs on an 8GB consumer GPU — and a much better understanding of where the bottlenecks in monocular 3D actually live.',
    live: null,
    repo: 'https://github.com/pandeyyatharth7',
    accent: 'lime',
  },
]

// Skills grouped for visual layout. `level` is a 1-5 used by the Skills page bars.
export const skillGroups = [
  {
    name: 'Programming',
    blurb: 'Comfortable across paradigms — systems, OO, and scripting.',
    skills: [
      { name: 'Python', level: 5 },
      { name: 'C', level: 4 },
      { name: 'C++', level: 4 },
      { name: 'Java', level: 4 },
      { name: 'OOP', level: 5 },
    ],
  },
  {
    name: 'AI / ML',
    blurb: 'The core of where I want to work.',
    skills: [
      { name: 'Machine Learning', level: 5 },
      { name: 'Deep Learning', level: 4 },
      { name: 'NLP', level: 4 },
      { name: 'Feature Engineering', level: 4 },
      { name: 'Model Evaluation', level: 4 },
    ],
  },
  {
    name: 'Frameworks & Libraries',
    blurb: 'The tools I reach for most often.',
    skills: [
      { name: 'PyTorch', level: 5 },
      { name: 'TensorFlow', level: 4 },
      { name: 'Hugging Face', level: 4 },
      { name: 'NumPy', level: 5 },
      { name: 'Pandas', level: 5 },
    ],
  },
  {
    name: 'Web',
    blurb: 'Front to back, including a soft spot for React.',
    skills: [
      { name: 'HTML', level: 5 },
      { name: 'CSS', level: 5 },
      { name: 'JavaScript', level: 5 },
      { name: 'React.js', level: 5 },
      { name: 'FastAPI', level: 4 },
      { name: 'Node.js / Express', level: 4 },
    ],
  },
  {
    name: 'Databases',
    blurb: 'Relational first, with a pragmatic fallback story.',
    skills: [
      { name: 'MySQL', level: 4 },
      { name: 'SQLite', level: 4 },
    ],
  },
  {
    name: 'Dev Tools',
    blurb: 'The unglamorous stuff that actually ships the work.',
    skills: [
      { name: 'Git', level: 5 },
      { name: 'GitHub', level: 5 },
      { name: 'CI / CD concepts', level: 4 },
      { name: 'Jupyter', level: 5 },
      { name: 'VS Code', level: 5 },
    ],
  },
  {
    name: 'Core CS',
    blurb: 'The foundation I keep going back to.',
    skills: [
      { name: 'Data Structures', level: 5 },
      { name: 'Algorithms', level: 5 },
      { name: 'Debugging', level: 4 },
      { name: 'SDLC', level: 4 },
    ],
  },
]

// "Beyond code" content for the About page.
export const beyond = {
  certifications: [
    { name: 'AR / VR Workshop Certification', org: 'VIT Chennai' },
    { name: 'Student Volunteer — Vibrance ’26', org: 'VIT Chennai (annual fest)' },
  ],
  hackathons: [
    { name: 'Makethon ’25', org: 'VIT Chennai' },
    { name: 'Cosmonova', org: 'VIT Chennai' },
  ],
  languages: [
    { name: 'English', level: 'Fluent' },
    { name: 'Hindi', level: 'Native / Bilingual' },
    { name: 'Spanish', level: 'Basic' },
  ],
}
