export interface LifestyleEntry {
  id: string;
  date: string;
  description: string;
  audioUrl?: string;
  audioFileName?: string;
  categories: string[];
  agentId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const LIFESTYLE_CATEGORIES = [
  'Fitness',
  'Minimalist',
  'Luxury',
  'Travel',
  'Wellness',
  'Sustainable',
  'Tech-Forward',
  'Social',
  'Family-Focused',
  'Career-Driven'
] as const;

export type LifestyleCategory = typeof LIFESTYLE_CATEGORIES[number];
