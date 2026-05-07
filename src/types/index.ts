// All shared database types for the portfolio

export type Profile = {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  location: string;
  email: string;
  phone?: string;
  resume?: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
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
  start_date: string;
  end_date?: string;
  description: string;
  bullets: string[];
  tags: string[];
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
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  approved: boolean;
  created_at: string;
};

export type SiteSettings = {
  id: string;
  show_testimonials: boolean;
};
