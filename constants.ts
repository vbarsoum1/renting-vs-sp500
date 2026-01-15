import { SimulationParams } from "./types";

export const DEFAULT_PARAMS: SimulationParams = {
    purchasePrice: 750000,
    downPaymentPercent: 20,
    mortgageRate: 4.8,
    amortizationYears: 25,
    monthlyRent: 3850,
    
    // Simplified Expenses requested by user
    // Note: User requested Property Tax be included here.
    operatingExpensePercent: 15, // Covers Tax, Maint, Mgmt, Ins
    utilitiesMonthly: 0, 
    vacancyRate: 5,
    
    propertyAppreciation: 4.5,
    rentIncrease: 2.5, // Ontario guideline cap usually
    expenseInflation: 2.0,
    
    sp500Return: 9.0,
    closingCostsPercent: 1.5, // Land Transfer Tax + Legal
};