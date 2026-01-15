export interface SimulationParams {
  purchasePrice: number;
  downPaymentPercent: number;
  mortgageRate: number;
  amortizationYears: number;
  monthlyRent: number;
  
  // Simplified Expense Structure
  operatingExpensePercent: number; // % of Rent (Covers Tax, Maintenance, Insurance, Management)
  utilitiesMonthly: number; // Fixed monthly cost (e.g. water/sewer if landlord pays)
  vacancyRate: number; // % of rent lost
  
  propertyAppreciation: number; // Annual %
  rentIncrease: number; // Annual %
  expenseInflation: number; // Annual % (Applies to fixed utilities)
  
  sp500Return: number; // Annual %
  closingCostsPercent: number; // % of purchase price (Land transfer tax, legal)
}

export interface YearData {
  year: number;
  // Real Estate Metrics
  propertyValue: number;
  mortgageBalance: number;
  equity: number;
  accumulatedCashFlow: number; // Reinvested
  reNetWorth: number; // Equity + Accumulated Cash Flow
  
  // S&P 500 Metrics (Alternative Scenario)
  spInvestmentValue: number; // Initial capital + monthly contributions
  spNetWorth: number;
  
  // Flow
  annualCashFlow: number;
  totalInvested: number; // Cumulative cash out of pocket
}

export interface SimulationResult {
  data: YearData[];
  summary: {
    totalReNetWorth: number;
    totalSpNetWorth: number;
    initialInvestment: number;
    totalOutPocket: number;
    reRoi: number;
    spRoi: number;
  };
}