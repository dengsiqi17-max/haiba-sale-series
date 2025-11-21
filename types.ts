export interface SaleRecord {
  id: string;
  seriesName: string;
  country: string;
  customerName: string;
  timestamp: number;
}

export interface ProductSeries {
  name: string;
  category?: string;
}

export interface AnalysisResult {
  totalSales: number;
  topMarket: string;
  topSeries: string;
  insight: string;
}

export enum TabView {
  RECORD = 'RECORD',
  EXPLORE = 'EXPLORE',
  MANAGE = 'MANAGE',
  INSIGHTS = 'INSIGHTS'
}

export const COMMON_COUNTRIES = [
  "China", "Russia", "United States", "Germany", "India", 
  "Brazil", "United Kingdom", "France", "Italy", "Canada", 
  "Australia", "Japan", "South Korea", "Mexico", "Indonesia", 
  "Turkey", "Saudi Arabia", "South Africa", "Vietnam", "Thailand"
];