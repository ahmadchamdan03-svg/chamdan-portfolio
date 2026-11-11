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
  sort_order?: number | null;
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

export interface Schedule {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  speaker: string;
  description?: string | null;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sort_order?: number;
  created_at?: string;
}

export interface SiteConfig {
  id: string;
  logo_url?: string | null;
  affiliation_arabic?: string;
  affiliation_text?: string;
  full_name?: string;
  address?: string;
  email?: string;
  phone?: string;
  next_ping_date?: string | null;
  created_at?: string;
}

export interface CalendarNote {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  created_at: string;
}

export interface PingHistory {
  id: string;
  pinged_at: string;
  type: "auto" | "manual";
  status: string;
  created_at: string;
}
