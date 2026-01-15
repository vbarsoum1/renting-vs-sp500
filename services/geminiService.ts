import { GoogleGenAI } from "@google/genai";
import { SimulationParams, SimulationResult } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. Gemini features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getMarketInsights = async (params: SimulationParams, result: SimulationResult): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API Key missing. Cannot generate insights.";

  const prompt = `
    Act as a senior real estate financial analyst for the Ontario, Canada market.
    Analyze the following investment simulation comparison between a Single Family Rental and S&P 500 over 25 years.

    **Simulation Parameters:**
    - Purchase Price: $${params.purchasePrice.toLocaleString()}
    - Down Payment: ${params.downPaymentPercent}%
    - Mortgage Rate: ${params.mortgageRate}%
    - Monthly Rent: $${params.monthlyRent.toLocaleString()}
    - Operating Expenses (Inc. Tax): ${params.operatingExpensePercent}% of Rent
    - Property Appreciation Used: ${params.propertyAppreciation}%
    - S&P 500 Return Used: ${params.sp500Return}%
    - Rent Increase: ${params.rentIncrease}% (Note: Ontario rent control cap is typically ~2.5%)

    **Results (Year 25):**
    - Real Estate Total Net Worth: $${result.summary.totalReNetWorth.toLocaleString()}
    - S&P 500 Total Net Worth: $${result.summary.totalSpNetWorth.toLocaleString()}
    - Initial Cash Invested: $${result.summary.initialInvestment.toLocaleString()}
    - Total Cash Out of Pocket (Deficits covered): $${result.summary.totalOutPocket.toLocaleString()}
    
    **Task:**
    Provide a concise, critical analysis (max 300 words). 
    1. Compare the ROI.
    2. Highlight risks specific to Ontario (e.g., LTB delays, special assessments, interest rate renewals).
    3. Comment on the liquidity difference between the two assets.
    4. Conclude which strategy appears better based strictly on these numbers, but add a caveat about "active" vs "passive" investing.
    
    Format using Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to retrieve AI insights. Please check your API key or try again later.";
  }
};

export const getRealisticDefaults = async (): Promise<Partial<SimulationParams> | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  const prompt = `
    Provide realistic, current average financial parameters for a single-family starter home rental in Ontario, Canada for 2024/2025.
    Return ONLY a valid JSON object with no markdown formatting.
    
    Keys required:
    - purchasePrice (number, e.g. 750000)
    - monthlyRent (number, e.g. 2800)
    - mortgageRate (number, e.g. 4.5)
    - propertyAppreciation (number, historical avg ~5.5)
    - sp500Return (number, conservative avg ~9)
    - operatingExpensePercent (number, ~30 to include tax/maint/ins)
    
    Do not include any text outside the JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const text = response.text || "{}";
    // Sanitize in case of markdown code blocks
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error fetching defaults:", error);
    return null;
  }
};