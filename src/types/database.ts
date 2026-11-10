export interface Profile {
  id: string;
  name: string;
  tagline: string;
  about: string;
  created_at: string;
}

export interface Education {
  id: string;
  institution: string;
  period: string;
  level: string;
  notes: string | null;
  created_at: string;
}

export interface Experience {
  id: string;
  organization: string;
  period: string;
  roles: string[];
  created_at: string;
}

export interface Skill {
  id: string;
  category: string;
  items: string[];
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string | null;
  role?: string | null;
  platform?: string | null;
  domain?: string | null;
  long_description?: string | null;
  features?: string[] | null;
  impact?: string[] | null;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface Writing {
  id: string;
  title: string;
  category: string;
  description: string;
  link?: string | null;
  date: string;
  slug?: string | null;
  content?: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  avatar_url?: string | null;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}
