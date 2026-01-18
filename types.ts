
export interface TaxData {
  fullName: string;
  year: number;
  householdParts: number;
  taxableIncome: number;
  tmi: number; // Tranche Marginale d'Imposition (0, 11, 30, 41, 45)
  totalTaxPaid: number;
  perCeilingAvailable: number;
  realEstateIncome: {
    amount: number;
    regime: 'Micro' | 'Reel';
    type: 'Foncier' | 'LMNP';
  }[];
  financialIncome: {
    dividends: number;
    capitalGains: number;
    regime: 'PFU' | 'Scale';
  };
}

export interface OptimizationSuggestion {
  category: 'Retirement' | 'Investment' | 'RealEstate' | 'TaxRegime' | 'Family';
  title: string;
  description: string;
  estimatedGain: string;
  complexity: 'Low' | 'Medium' | 'High';
  actionable: string;
}

export interface AnalysisResult {
  extractedData: TaxData;
  optimizations: OptimizationSuggestion[];
  summary: string;
}
