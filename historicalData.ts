/**
 * Historical Data Constants
 * Based on 50-Year Canadian Housing Market Analysis (1975-2025)
 * Source: background_research/50-year-history.md
 */

export interface HistoricalMetric {
    value: number;
    source: string;
    reason: string;
}

export interface HistoricalDataType {
    purchasePrice: HistoricalMetric;
    downPaymentPercent: HistoricalMetric;
    mortgageRate: HistoricalMetric;
    closingCostsPercent: HistoricalMetric;
    amortizationYears: HistoricalMetric;
    monthlyRent: HistoricalMetric;
    vacancyRate: HistoricalMetric;
    utilitiesMonthly: HistoricalMetric;
    operatingExpensePercent: HistoricalMetric;
    propertyAppreciation: HistoricalMetric;
    rentIncrease: HistoricalMetric;
    sp500Return: HistoricalMetric;
    expenseInflation: HistoricalMetric;
}

export const HISTORICAL_DATA: HistoricalDataType = {
    purchasePrice: {
        value: 682000,
        source: "CREA National Average (Nov 2025)",
        reason: "Home prices cooled down to $682k after the crazy 2022 frenzy."
    },

    downPaymentPercent: {
        value: 20,
        source: "Standard Canadian Mortgage Requirements",
        reason: "20% is the magic number to avoid paying extra for mortgage insurance."
    },

    mortgageRate: {
        value: 4.5,
        source: "2025 Bank of Canada Policy Rate",
        reason: "Rates have settled around 4.5% after the recent aggressive hikes."
    },

    closingCostsPercent: {
        value: 1.5,
        source: "Ontario Land Transfer Tax + Legal Fees",
        reason: "Don't forget the 'Welcome Tax' (Land Transfer) and lawyer fees!"
    },

    amortizationYears: {
        value: 25,
        source: "Standard Canadian Amortization",
        reason: "25 years is the standard timeline to be mortgage-free."
    },

    monthlyRent: {
        value: 2127,
        source: "Rentals.ca & CMHC 2025 Market Report",
        reason: "This is the real price for a new place—ignore the cheap 'grandfathered' rents."
    },

    vacancyRate: {
        value: 3.1,
        source: "CMHC 2025 National Vacancy Rate",
        reason: "Vacancies are up slightly, meaning a few more apartments are sitting empty."
    },

    utilitiesMonthly: {
        value: 0,
        source: "Tenant-Paid Standard",
        reason: "Assume 0 if the landlord pays heat/hydro, otherwise budget for bills."
    },

    operatingExpensePercent: {
        value: 15,
        source: "Industry Standard (Property Tax, Maintenance, Insurance, Management)",
        reason: "Owning costs money—taxes, repairs, insurance. Experts say budget 15% of rent."
    },

    propertyAppreciation: {
        value: 5.4,
        source: "50-Year CAGR (1975-2025)",
        reason: "Over 50 years, Canadian homes have gained about 5.4% in value every single year."
    },

    rentIncrease: {
        value: 5.8,
        source: "50-Year Market Rent CAGR",
        reason: "Market rents have historically jumped 5.8% per year. Ouch."
    },

    sp500Return: {
        value: 9.0,
        source: "Historical S&P 500 Average Return",
        reason: "The stock market usually delivers solid 9-10% returns over the long haul."
    },

    expenseInflation: {
        value: 3.2,
        source: "50-Year Average CPI",
        reason: "Life gets about 3.2% more expensive every year on average."
    }
};

/**
 * Summary information for the documentation modal
 */
export const RESEARCH_SUMMARY = {
    title: "50-Year Canadian Housing Market Analysis (1975-2025)",
    title: "What History Tells Us: 50 Years of Canadian Housing Data (1975-2025)",

    keyFindings: [
        {
            label: "Home Values Soar",
            value: "5.4% Yearly Growth",
            detail: "Average homes jumped from $52k in '75 to $682k today. That's huge."
        },
        {
            label: "Rents Skyrocket",
            value: "5.8% Yearly Growth",
            detail: "Rent used to be $120/month. Now? You're looking at over $2,100."
        },
        {
            label: "Affordability Crisis",
            value: "Much Harder Now",
            detail: "It now takes 7x the average income to buy a house (vs just 3x back then)."
        },
        {
            label: "Beats Inflation",
            value: "Real Winner",
            detail: "Real estate consistently beats inflation, making it a solid hedge."
        }
    ],

    historicalMilestones: [
        { year: 1975, event: "Baseline: $52k average home, $120/month rent, 10-11% mortgage rates" },
        { year: 1981, event: "Interest rate shock: 21.75% mortgage rates caused severe correction" },
        { year: 1989, event: "Toronto bubble peak: GTA prices nearly doubled to $273k, then crashed" },
        { year: 2008, event: "Financial crisis: Canada showed resilience, prices dipped briefly then recovered" },
        { year: 2022, event: "Post-pandemic peak: National average exceeded $800k before correction" },
        { year: 2025, event: "Stabilization: $682k national average, 3.1% vacancy rate" }
    ],

    sources: [
        { name: "Statistics Canada", url: "https://www.statcan.gc.ca" },
        { name: "CMHC Rental Market Report 2025", url: "https://www.cmhc-schl.gc.ca" },
        { name: "CREA Housing Market Data", url: "https://www.crea.ca" },
        { name: "Rentals.ca Rent Reports", url: "https://rentals.ca" },
        { name: "WOWA Canada Mortgage Rates History", url: "https://wowa.ca" },
        { name: "Bank of Canada Historical Rates", url: "https://www.bankofcanada.ca" }
    ]
};

/**
 * Get historical defaults for autofill (returns values only, no metadata)
 */
export const getHistoricalDefaults = () => ({
    purchasePrice: HISTORICAL_DATA.purchasePrice.value,
    downPaymentPercent: HISTORICAL_DATA.downPaymentPercent.value,
    mortgageRate: HISTORICAL_DATA.mortgageRate.value,
    closingCostsPercent: HISTORICAL_DATA.closingCostsPercent.value,
    amortizationYears: HISTORICAL_DATA.amortizationYears.value,
    monthlyRent: HISTORICAL_DATA.monthlyRent.value,
    vacancyRate: HISTORICAL_DATA.vacancyRate.value,
    utilitiesMonthly: HISTORICAL_DATA.utilitiesMonthly.value,
    operatingExpensePercent: HISTORICAL_DATA.operatingExpensePercent.value,
    propertyAppreciation: HISTORICAL_DATA.propertyAppreciation.value,
    rentIncrease: HISTORICAL_DATA.rentIncrease.value,
    sp500Return: HISTORICAL_DATA.sp500Return.value,
    expenseInflation: HISTORICAL_DATA.expenseInflation.value,
});
