// All shared database types for the portfolio

export type Profile = {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  location: string;
  email: string;
  phone?: string;
  image?: string;
  resume?: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    imageMeta?: { x?: number; y?: number; scale?: number };
    imageCrop?: { left: number; top: number; size: number };
  };
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  image?: string;
  tags: string[];
  github?: string;
  live?: string;
  category?: string;
  date?: string;
  featured: boolean;
  order: number;
  created_at: string;
};

export type Skill = {
  id: string;
  category: string;
  skills: string[];
  order: number;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  employment_type?: string;
  start_date: string;
  end_date?: string;
  description: string;
  bullets: string[];
  tags: string[];
  certificate_url?: string;
  recommendation_url?: string;
  repo_url?: string;
  related_projects: string[];
  order: number;
};

export type Achievement = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  url?: string;
  order: number;
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  year: string;
  description?: string;
  order: number;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
  image?: string;
  credly_id?: string;
  order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  approved: boolean;
  created_at: string;
  order: number;
};

export type SiteSettings = {
  id: string;
  show_testimonials: boolean;
};

export type FooterLink = {
  id: string;
  category: string;
  label: string;
  url: string;
  order: number;
};
