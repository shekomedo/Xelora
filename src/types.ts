export interface AppSettings {
  language: 'en' | 'ar';
  theme: 'dark' | 'light';
  dateFormat: string;
  currency: string;
}

export interface ProductCost {
  id: string;
  name: string;
  materialCost: number;
  laborCost: number;
  operationalCost: number;
  profitMarginPercentage: number;
  totalCost?: number;
  sellingPrice?: number;
  profit?: number;
}

export type Screen = 'splash' | 'dashboard' | 'cleaner' | 'calculator' | 'settings';
