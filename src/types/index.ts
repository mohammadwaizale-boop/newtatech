export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  architecturalComponents: string[];
  techStack: string[];
  iconName: string;
}

export interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: 'Coming Soon' | 'In Development' | 'Concept Stage';
  category: string;
  features: string[];
  previewUrl?: string;
  releaseWindow: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  image: string;
  technologies: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  challenge: string;
  solution: string;
  architectureDetails: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  summary: string;
  description: string;
  milestones: string[];
  durationEstimate: string;
}

export interface TechItem {
  name: string;
  category: 'Frontend' | 'Backend & Data' | 'AI & Machine Intelligence' | 'Cloud & Infra';
  role: string;
  iconSlug?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budgetRange: string;
  description: string;
}
