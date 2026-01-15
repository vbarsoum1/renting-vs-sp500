<div align="center">
  <img src="./renting-sp-banner.jpeg" alt="Rent vs S&P 500 Banner" width="100%" />
</div>

# Rent vs. S&P 500 Simulator (Ontario)

A financial simulation tool designed to compare the long-term wealth accumulation of purchasing a rental property versus renting and investing in the S&P 500, specifically tailored to the Ontario, Canada market.

View the app in AI Studio: [https://ai.studio/apps/drive/1KptjHeEEjE1txOaGsxkNSEnyzZriC2Ek](https://ai.studio/apps/drive/1KptjHeEEjE1txOaGsxkNSEnyzZriC2Ek)

## Project Purpose

The simulator compares two strategies over a 25-year period:
1.  **Buying a Property**: Purchasing a rental property.
2.  **Investing in the S&P 500**: Renting instead and investing the initial capital (down payment + closing costs) and any monthly cash flow surpluses into the S&P 500.

The tool aims to provide a **fair comparison** by ensuring that every dollar spent in the Real Estate scenario (including covering monthly deficits) is matched by an equivalent contribution in the Stock Market scenario.

## Core Features & Logic

### Financial Simulation
The core logic performs a granular 25-year month-by-month simulation with key mechanics:
- **Canadian Mortgage Math**: Calculates payments using semi-annual compounding (standard in Canada).
- **Cash Flow Analysis**: Tracks rental income, vacancies, operating expenses, and mortgage payments.
- **Reinvestment Strategy**:
    - **Positive Cash Flow**: Reinvested into an accumulated stock portfolio.
    - **Negative Cash Flow**: Deficits are tracked as "Out of Pocket". To remain fair, the S&P 500 scenario *also* receives this "deficit amount" as an additional contribution to its principal.
- **Inflation & Appreciation**: Applies annual rent increases, property appreciation, and expense inflation.

### AI Integration
Powered by Google's Gemini AI (`@google/genai`) for:
1.  **Smart Analysis**: Generates a critique of the simulation results, highlighting ROI differences, liquidity risks, and Ontario-specific market factors (e.g., LTB delays).
2.  **Realistic Defaults**: Auto-fills parameters with current market data for Ontario.

## Technology Stack

- **Framework**: React 19 (via Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **Icons**: Lucide React
- **AI**: Google Gemini SDK

## Run Locally

**Prerequisites:** Node.js

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key.

3.  Run the app:
    ```bash
    npm run dev
    ```
