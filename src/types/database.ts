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
  created_at: string;
}
