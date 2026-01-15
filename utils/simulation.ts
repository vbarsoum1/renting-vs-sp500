import { SimulationParams, SimulationResult, YearData } from "../types";

export const calculateSimulation = (params: SimulationParams): SimulationResult => {
  const {
    purchasePrice,
    downPaymentPercent,
    mortgageRate,
    amortizationYears,
    monthlyRent,
    operatingExpensePercent, // Now includes property tax
    utilitiesMonthly,
    vacancyRate,
    propertyAppreciation,
    rentIncrease,
    expenseInflation,
    sp500Return,
    closingCostsPercent,
  } = params;

  const data: YearData[] = [];

  // Initial Values
  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const closingCosts = purchasePrice * (closingCostsPercent / 100);
  const initialCashOutlay = downPayment + closingCosts;
  
  let currentPropertyValue = purchasePrice;
  const loanPrincipal = purchasePrice - downPayment;
  let currentMortgageBalance = loanPrincipal;
  
  // Canadian Mortgage Calculation (Semi-Annual Compounding)
  // Formula: Effective Monthly Rate = (1 + Rate/2)^(2/12) - 1
  const annualRateDecimal = mortgageRate / 100;
  const semiAnnualRate = annualRateDecimal / 2;
  const monthlyRate = Math.pow(1 + semiAnnualRate, 2 / 12) - 1;
  const numberOfPayments = amortizationYears * 12;
  
  const monthlyMortgagePayment = 
    (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  let currentMonthlyRent = monthlyRent;
  // CRITICAL FIX: Use local variable for utilities so we don't mutate the 'params' object reference
  let currentUtilities = utilitiesMonthly;

  let reAccumulatedPortfolio = 0; // Cash flow reinvested in S&P
  let spInvestmentValue = initialCashOutlay; // S&P Scenario starts with same cash
  let totalOutOfPocketRE = initialCashOutlay; // Track total cash dumped into RE scenario
  
  for (let year = 1; year <= amortizationYears; year++) {
    let annualRentIncome = 0;
    let annualExpenses = 0;
    let annualMortgagePayment = 0;
    let annualInterest = 0;
    let annualPrincipal = 0;

    // Simulate 12 months
    for (let month = 1; month <= 12; month++) {
        // RE Income
        const grossRent = currentMonthlyRent;
        const vacancyLoss = grossRent * (vacancyRate / 100);
        const effectiveRent = grossRent - vacancyLoss;
        annualRentIncome += effectiveRent;

        // RE Expenses
        // Note: Property Tax is now assumed to be part of operatingExpensePercent
        
        // Consolidated Operating Expenses (Tax, Maint, Mgmt, Ins) calculated on Gross Rent
        const monthlyOpEx = grossRent * (operatingExpensePercent / 100);
        
        const monthlyExpenses = monthlyOpEx + currentUtilities;
        annualExpenses += monthlyExpenses;

        // Mortgage
        const interestPayment = currentMortgageBalance * monthlyRate;
        const principalPayment = monthlyMortgagePayment - interestPayment;
        
        annualInterest += interestPayment;
        annualPrincipal += principalPayment;
        annualMortgagePayment += monthlyMortgagePayment;

        if (currentMortgageBalance > 0) {
            currentMortgageBalance -= principalPayment;
            if (currentMortgageBalance < 0) currentMortgageBalance = 0;
        }

        // Cash Flow Calculation
        const monthlyCashFlow = effectiveRent - monthlyExpenses - monthlyMortgagePayment;

        // RE Side Reinvestment Logic
        if (monthlyCashFlow > 0) {
            // Surplus reinvested into stock market
            reAccumulatedPortfolio += monthlyCashFlow;
            // Grow accumulated portfolio monthly
            reAccumulatedPortfolio *= (1 + sp500Return / 100 / 12);
        } else {
            // Deficit paid out of pocket
            // This is "new money" entering the system.
            const deficit = Math.abs(monthlyCashFlow);
            totalOutOfPocketRE += deficit;
            
            // Fairness: The S&P scenario also gets this "new money" to invest
            spInvestmentValue += deficit;
        }

        // S&P Scenario Growth (Monthly)
        spInvestmentValue *= (1 + sp500Return / 100 / 12);
    }

    // End of Year Updates
    
    // Property Appreciation
    currentPropertyValue *= (1 + propertyAppreciation / 100);
    
    // Rent Increase
    currentMonthlyRent *= (1 + rentIncrease / 100);
    
    // Expense Inflation (Only for fixed costs like utilities)
    currentUtilities *= (1 + expenseInflation / 100);

    // Snapshot
    const equity = currentPropertyValue - currentMortgageBalance;
    const reNetWorth = equity + reAccumulatedPortfolio;

    data.push({
        year,
        propertyValue: currentPropertyValue,
        mortgageBalance: currentMortgageBalance,
        equity,
        accumulatedCashFlow: reAccumulatedPortfolio,
        reNetWorth,
        spInvestmentValue,
        spNetWorth: spInvestmentValue,
        annualCashFlow: annualRentIncome - annualExpenses - annualMortgagePayment,
        totalInvested: totalOutOfPocketRE
    });
  }

  const finalReNetWorth = data[data.length - 1].reNetWorth;
  const finalSpNetWorth = data[data.length - 1].spNetWorth;
  
  // Calculate ROI: (Final Value - Total Invested) / Total Invested
  const reRoi = ((finalReNetWorth - totalOutOfPocketRE) / totalOutOfPocketRE) * 100;
  const spRoi = ((finalSpNetWorth - totalOutOfPocketRE) / totalOutOfPocketRE) * 100;

  return {
    data,
    summary: {
        totalReNetWorth: finalReNetWorth,
        totalSpNetWorth: finalSpNetWorth,
        initialInvestment: initialCashOutlay,
        totalOutPocket: totalOutOfPocketRE,
        reRoi,
        spRoi
    }
  };
};