import React, { useState, useMemo } from 'react';
import { calculateSimulation } from './utils/simulation';
import { DEFAULT_PARAMS } from './constants';
import { SimulationParams } from './types';
import { NetWorthChart, CashFlowChart } from './components/SimulationCharts';
import { InputGroup } from './components/InputGroup';
import { BreakdownCard } from './components/BreakdownCard';
import { getMarketInsights, getRealisticDefaults } from './services/geminiService';
import { BrainCircuit, Loader2, TrendingUp, Home, DollarSign, Trophy, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingDefaults, setLoadingDefaults] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const results = useMemo(() => calculateSimulation(params), [params]);

  const handleFetchDefaults = async () => {
    setLoadingDefaults(true);
    const newDefaults = await getRealisticDefaults();
    if (newDefaults) {
      setParams(prev => ({ ...prev, ...newDefaults }));
    }
    setLoadingDefaults(false);
  };

  const handleAnalyze = async () => {
    if (!process.env.API_KEY) {
        alert("API Key not found in environment variables.");
        return;
    }
    setLoadingAi(true);
    const analysis = await getMarketInsights(params, results);
    setAiAnalysis(analysis);
    setLoadingAi(false);
  };

  const updateParam = (key: keyof SimulationParams, val: number) => {
    setParams(prev => ({ ...prev, [key]: val }));
  };

  const finalRe = results.summary.totalReNetWorth;
  const finalSp = results.summary.totalSpNetWorth;
  const winner = finalRe > finalSp ? 'Real Estate' : 'S&P 500';
  const diff = Math.abs(finalRe - finalSp);
  const winnerColor = winner === 'Real Estate' ? 'text-blue-600' : 'text-green-600';
  const winnerBg = winner === 'Real Estate' ? 'bg-blue-50 border-blue-100' : 'bg-green-50 border-green-100';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg text-white shadow-md">
                    <TrendingUp size={20} className="stroke-[2.5px]" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">Rent vs. S&P 500</h1>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ontario Simulator</p>
                </div>
            </div>
            <div className="flex items-center">
                <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Documentation</a>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Configuration */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* Configuration Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Configuration</h2>
                    <button
                        onClick={handleFetchDefaults}
                        disabled={loadingDefaults}
                        className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
                    >
                        {loadingDefaults ? <Loader2 className="animate-spin" size={12}/> : <Sparkles size={12} />}
                        Auto-Fill with AI
                    </button>
                </div>

                {/* Property Details Card */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center gap-2">
                        <Home size={16} className="text-blue-600" />
                        <h3 className="font-semibold text-sm text-slate-700">Property Details</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 gap-5">
                        <InputGroup label="Purchase Price" value={params.purchasePrice} onChange={(v) => updateParam('purchasePrice', v)} prefix="$" step={5000} />
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Down Payment" value={params.downPaymentPercent} onChange={(v) => updateParam('downPaymentPercent', v)} suffix="%" />
                            <InputGroup label="Mortgage Rate" value={params.mortgageRate} onChange={(v) => updateParam('mortgageRate', v)} suffix="%" step={0.1} />
                        </div>
                        <InputGroup label="Closing Costs" value={params.closingCostsPercent} onChange={(v) => updateParam('closingCostsPercent', v)} suffix="%" step={0.1} tooltip="Land Transfer Tax + Legal Fees" />
                        <InputGroup label="Amortization" value={params.amortizationYears} onChange={(v) => updateParam('amortizationYears', v)} suffix="Yrs" />
                    </div>
                </section>

                {/* Income & Expenses Card */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600" />
                        <h3 className="font-semibold text-sm text-slate-700">Income & Expenses</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 gap-5">
                        <InputGroup label="Monthly Rent" value={params.monthlyRent} onChange={(v) => updateParam('monthlyRent', v)} prefix="$" />
                        <div className="grid grid-cols-2 gap-4">
                             <InputGroup label="Vacancy Rate" value={params.vacancyRate} onChange={(v) => updateParam('vacancyRate', v)} suffix="%" />
                             <InputGroup label="Utilities (Landlord Paid)" value={params.utilitiesMonthly} onChange={(v) => updateParam('utilitiesMonthly', v)} prefix="$" />
                        </div>
                        <InputGroup 
                            label="Operating Expenses" 
                            value={params.operatingExpensePercent} 
                            onChange={(v) => updateParam('operatingExpensePercent', v)} 
                            suffix="% of Rent" 
                            tooltip="Includes Property Tax, Maintenance, Insurance, and Property Management"
                        />
                    </div>
                </section>

                {/* Market Assumptions Card */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center gap-2">
                        <TrendingUp size={16} className="text-purple-600" />
                        <h3 className="font-semibold text-sm text-slate-700">Market Assumptions</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 gap-5">
                         <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Prop. Apprec." value={params.propertyAppreciation} onChange={(v) => updateParam('propertyAppreciation', v)} suffix="%" step={0.1} />
                            <InputGroup label="Rent Increase" value={params.rentIncrease} onChange={(v) => updateParam('rentIncrease', v)} suffix="%" step={0.1} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="S&P 500 Return" value={params.sp500Return} onChange={(v) => updateParam('sp500Return', v)} suffix="%" step={0.1} />
                            <InputGroup label="Exp. Inflation" value={params.expenseInflation} onChange={(v) => updateParam('expenseInflation', v)} suffix="%" step={0.1} />
                        </div>
                    </div>
                </section>

            </div>

            {/* Right Column: Visualization */}
            <div className="lg:col-span-8 space-y-6">
                
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {/* Real Estate Card */}
                     <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Home size={60} className="text-blue-600" />
                        </div>
                        <div className="flex justify-between items-start mb-1">
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Real Estate (25y)</p>
                             <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">ROI: {results.summary.reRoi.toFixed(0)}%</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight">${(finalRe / 1000000).toFixed(2)}M</p>
                        <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500">
                             <div className="flex justify-between">
                                <span>Equity:</span>
                                <span className="font-medium text-slate-700">${(results.data[24].equity / 1000).toFixed(0)}k</span>
                             </div>
                             <div className="flex justify-between">
                                <span>Portfolio:</span>
                                <span className="font-medium text-slate-700">${(results.data[24].accumulatedCashFlow / 1000).toFixed(0)}k</span>
                             </div>
                        </div>
                     </div>

                     {/* S&P Card */}
                     <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={60} className="text-green-600" />
                        </div>
                        <div className="flex justify-between items-start mb-1">
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">S&P 500 (25y)</p>
                             <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200">ROI: {results.summary.spRoi.toFixed(0)}%</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight">${(finalSp / 1000000).toFixed(2)}M</p>
                        <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500">
                             <div className="flex justify-between">
                                <span>Initial Inv:</span>
                                <span className="font-medium text-slate-700">${(results.summary.initialInvestment / 1000).toFixed(0)}k</span>
                             </div>
                             <div className="flex justify-between">
                                <span>Total Contribution:</span>
                                <span className="font-medium text-slate-700">${(results.summary.totalOutPocket / 1000).toFixed(0)}k</span>
                             </div>
                        </div>
                     </div>

                     {/* Winner Card */}
                     <div className={`p-5 rounded-2xl shadow-sm border relative overflow-hidden flex flex-col justify-center ${winnerBg}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Trophy size={60} className={winner === 'Real Estate' ? 'text-blue-700' : 'text-green-700'} />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">The Winner</p>
                        <p className={`text-2xl font-bold tracking-tight ${winnerColor}`}>{winner}</p>
                        <div className="mt-2 flex items-center gap-2">
                             <span className="text-sm text-slate-600 font-medium">wins by</span>
                             <span className={`text-lg font-bold ${winnerColor}`}>${(diff / 1000).toFixed(0)}k</span>
                        </div>
                     </div>
                </div>

                {/* Monthly Breakdown Card */}
                <BreakdownCard params={params} onUpdate={updateParam} />

                {/* Charts */}
                <div className="space-y-6">
                    <NetWorthChart data={results.data} />
                    <CashFlowChart data={results.data} />
                </div>

                {/* AI Analysis Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden ring-1 ring-purple-50">
                    <div className="bg-gradient-to-r from-purple-50 to-white px-6 py-4 border-b border-purple-100 flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                             <div className="bg-purple-100 p-1.5 rounded-md text-purple-600">
                                <BrainCircuit size={18} />
                             </div>
                             <h3 className="font-bold text-slate-900">Smart Analysis</h3>
                        </div>
                        <button 
                            onClick={handleAnalyze} 
                            disabled={loadingAi}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                        >
                            {loadingAi ? <Loader2 className="animate-spin" size={14}/> : 'Generate Insights'}
                        </button>
                    </div>
                    
                    <div className="p-6">
                        {aiAnalysis ? (
                            <div className="prose prose-slate prose-sm max-w-none text-slate-600">
                                <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>') }} />
                            </div>
                        ) : (
                            <div className="text-center py-6 px-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                                    <Sparkles size={20} className="text-slate-400" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium">
                                    Ready to analyze. Click the button above to have Gemini AI evaluate this scenario based on real Ontario market conditions.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;