export interface RevenueEntry {
  date: string; // ISO date string: "2026-09-20"
  revenue: number;
}

export interface AppSettings {
  currency: string;
  theme: 'light' | 'dark' | 'system';
}

const REVENUE_STORAGE_KEY = 'teo_revenue_data';
const SETTINGS_STORAGE_KEY = 'teo_app_settings';

export const storage = {
  // Revenue data operations
  getRevenueData: (): RevenueEntry[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(REVENUE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading revenue data from localStorage:', error);
      return [];
    }
  },

  saveRevenueData: (data: RevenueEntry[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(REVENUE_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving revenue data to localStorage:', error);
    }
  },

  getRevenueForDate: (date: string): number | null => {
    const data = storage.getRevenueData();
    const entry = data.find(entry => entry.date === date);
    return entry ? entry.revenue : null;
  },

  setRevenueForDate: (date: string, revenue: number): void => {
    const data = storage.getRevenueData();
    const existingIndex = data.findIndex(entry => entry.date === date);
    
    if (existingIndex >= 0) {
      data[existingIndex] = { date, revenue };
    } else {
      data.push({ date, revenue });
    }
    
    storage.saveRevenueData(data);
  },

  deleteRevenueForDate: (date: string): void => {
    const data = storage.getRevenueData();
    const filtered = data.filter(entry => entry.date !== date);
    storage.saveRevenueData(filtered);
  },

  clearAllRevenueData: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(REVENUE_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing revenue data from localStorage:', error);
    }
  },

  // Settings operations
  getSettings: (): AppSettings => {
    if (typeof window === 'undefined') {
      return { currency: 'GH₵', theme: 'system' };
    }
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return data ? JSON.parse(data) : { currency: 'GH₵', theme: 'system' };
    } catch (error) {
      console.error('Error reading settings from localStorage:', error);
      return { currency: 'GH₵', theme: 'system' };
    }
  },

  saveSettings: (settings: AppSettings): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  },

  // Export functionality
  exportDataAsJSON: (): string => {
    const data = storage.getRevenueData();
    return JSON.stringify(data, null, 2);
  },

  exportDataAsCSV: (): string => {
    const data = storage.getRevenueData();
    if (data.length === 0) return 'date,revenue\n';
    
    const header = 'date,revenue\n';
    const rows = data
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => `${entry.date},${entry.revenue}`)
      .join('\n');
    
    return header + rows;
  },
};