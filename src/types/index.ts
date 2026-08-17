export interface Project {
  name: string;
  slug: string;
  task: string;
  architecture: string;
  description: string;
  status: 'shipped' | 'live' | 'training' | 'private';
  url?: string;
  metrics?: Array<{ label: string; value: string }>;
  // Case study fields
  problem?: string;
  approach?: string[];
  results?: Array<{ label: string; value: string }>;
  techStack?: string[];
  links?: Array<{ label: string; url: string; external?: boolean }>;
}

export interface PersonalInfo {
  name: string;
  role: string;
  education: string;
  year: string;
  cgpa: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  bio: string;
}

export interface Skills {
  [category: string]: string[];
}
