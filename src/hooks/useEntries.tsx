import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LifestyleEntry, LIFESTYLE_CATEGORIES } from '@/types/entry';

interface EntriesContextType {
  entries: LifestyleEntry[];
  addEntry: (entry: Omit<LifestyleEntry, 'id' | 'date'>) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => LifestyleEntry | undefined;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

// Generate mock data for demo
function generateMockEntries(): LifestyleEntry[] {
  const mockDescriptions = [
    "Customer expressed strong interest in sustainable living practices. They've recently transitioned to a plant-based diet and are looking at electric vehicles. Active gym membership with focus on yoga and meditation classes.",
    "High-end luxury preferences noted. Travels first class internationally 4-5 times per year. Interested in exclusive experiences and premium brands. Golf club membership and wine collecting as hobbies.",
    "Tech-forward minimalist lifestyle. Works remotely, digital nomad tendencies. Prefers experiences over possessions. Regular user of productivity apps and smart home devices.",
    "Family-focused with emphasis on work-life balance. Weekend activities center around children's sports and outdoor activities. Values quality time and educational experiences.",
    "Wellness-oriented individual. Regular spa visits, organic food preferences, and mindfulness practices. Interested in holistic health approaches and preventive care.",
    "Career-driven professional with focus on personal development. Attends conferences, takes online courses, and networks actively. Values efficiency and premium services.",
  ];

  const entries: LifestyleEntry[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    const numCategories = Math.floor(Math.random() * 3) + 1;
    const categories: string[] = [];
    const availableCategories = [...LIFESTYLE_CATEGORIES];
    
    for (let j = 0; j < numCategories; j++) {
      const idx = Math.floor(Math.random() * availableCategories.length);
      categories.push(availableCategories[idx]);
      availableCategories.splice(idx, 1);
    }

    entries.push({
      id: crypto.randomUUID(),
      date: date.toISOString(),
      description: mockDescriptions[i % mockDescriptions.length],
      categories,
      agentId: 'demo-agent',
    });
  }

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function EntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LifestyleEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('lifestyle_entries');
    if (stored) {
      setEntries(JSON.parse(stored));
    } else {
      const mockEntries = generateMockEntries();
      setEntries(mockEntries);
      localStorage.setItem('lifestyle_entries', JSON.stringify(mockEntries));
    }
  }, []);

  const addEntry = (entry: Omit<LifestyleEntry, 'id' | 'date'>) => {
    const newEntry: LifestyleEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('lifestyle_entries', JSON.stringify(updated));
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('lifestyle_entries', JSON.stringify(updated));
  };

  const getEntryById = (id: string) => entries.find(e => e.id === id);

  return (
    <EntriesContext.Provider value={{ entries, addEntry, deleteEntry, getEntryById }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const context = useContext(EntriesContext);
  if (context === undefined) {
    throw new Error('useEntries must be used within an EntriesProvider');
  }
  return context;
}
