import { create } from 'zustand';

interface ConfigState {
  systemSize: number;
  customObjects: number;
  users: number;
  modules: string[];
  complexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'HIGHLY_COMPLEX';
  scenario: 'best' | 'realistic' | 'worst';
  updateConfig: (config: Partial<ConfigState>) => void;
  calculateReadiness: () => number;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  systemSize: 2500,
  customObjects: 150,
  users: 1200,
  modules: ['FI', 'CO', 'SD', 'MM', 'PP', 'HR'],
  complexity: 'COMPLEX',
  scenario: 'realistic',
  
  updateConfig: (config) => set((state) => ({ ...state, ...config })),
  
  calculateReadiness: () => {
    const state = get();
    let score = 100;
    
    // Deduct points based on complexity factors
    if (state.systemSize > 5000) score -= 15;
    else if (state.systemSize > 2000) score -= 10;
    else if (state.systemSize > 1000) score -= 5;
    
    if (state.customObjects > 200) score -= 20;
    else if (state.customObjects > 100) score -= 15;
    else if (state.customObjects > 50) score -= 8;
    
    if (state.users > 2000) score -= 10;
    else if (state.users > 1000) score -= 5;
    
    return Math.max(20, Math.min(100, score));
  }
}));
