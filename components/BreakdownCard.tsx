import React from 'react';
import { SimulationParams } from '../types';
import { Minus, Info, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  params: SimulationParams;
  onUpdate: (key: keyof SimulationParams, val: number) => void;
}

export const BreakdownCard: React.FC<Props> = ({ params, onUpdate }) => {
  // --- 1. Current State Calculations ---
  
  const loanAmount = params.purchasePrice * (1 - params.downPaymentPercent / 100);
  
  // Canadian Semi-Annual Compounding
  const annualRateDecimal = params.mortgageRate / 100;
  const semiAnnualRate = annualRateDecimal / 2;
  const monthlyRate = Math.pow(1 + semiAnnualRate, 2 / 12) - 1;
  const numPayments = params.amortizationYears * 12;
  
  const monthlyMortgage = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const monthlyInterest = loanAmount * monthlyRate;
  const monthlyPrincipal = monthlyMortgage - monthlyInterest;

  const monthlyVacancy = params.monthlyRent * (params.vacancyRate / 100);
  const effectiveRent = params.monthlyRent - monthlyVacancy;
  
  // Tax is now included in OpEx, so we don't calculate it separately here
  const monthlyOpEx = params.monthlyRent * (params.operatingExpensePercent / 100);
  
  // Fixed expenses only include utilities now, as tax is in OpEx
  const currentFixedExpenses = params.utilitiesMonthly;
  
  const totalMonthlyExpenses = currentFixedExpenses + monthlyOpEx + monthlyMortgage;
  const monthlyCashFlow = effectiveRent - totalMonthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;

  // --- 2. Solver Logic ---

  // Solve for Rent
  // 0 = Rent*(1-Vacancy-OpEx) - (FixedExpenses + Mortgage)
  // Rent = (FixedExpenses + Mortgage) / (1 - Vacancy - OpEx)
  const denominator = 1 - (params.vacancyRate / 100) - (params.operatingExpensePercent / 100);
  const breakEvenRent = denominator > 0 ? (currentFixedExpenses + monthlyMortgage) / denominator : 0;

  // Solve for Down Payment
  // TargetMortgage = EffectiveRent_current - OpEx_current - FixedExpenses
  const targetMortgagePayment = effectiveRent - monthlyOpEx - currentFixedExpenses;
  
  let breakEvenDownPaymentPercent = 0;
  let canSolveDownPayment = true;

  if (targetMortgagePayment <= 0) {
      canSolveDownPayment = false; // Expenses exceed income even with 0 mortgage
  } else {
      // P = PMT * ( (1+r)^n - 1 ) / ( r(1+r)^n )
      const powFactor = Math.pow(1 + monthlyRate, numPayments);
      const targetPrincipal = targetMortgagePayment * (powFactor - 1) / (monthlyRate * powFactor);
      
      const requiredDownPayment = params.purchasePrice - targetPrincipal;
      breakEvenDownPaymentPercent = (requiredDownPayment / params.purchasePrice) * 100;
      
      if (breakEvenDownPaymentPercent > 100) canSolveDownPayment = false;
      if (breakEvenDownPaymentPercent < 0) breakEvenDownPaymentPercent = 0;
  }

  // Formatting
  const format = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  const formatPercent = (num: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(num) + '%';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                Monthly Cash Flow Analysis <span className="text-xs font-normal text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">Year 1</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Calculator size={12} className="text-blue-500"/>
                Using Canadian Mortgage Rules (Semi-Annual Compounding)
            </p>
        </div>
        <div className="text-right">
             <span className={`text-lg font-bold px-4 py-1.5 rounded-lg border ${monthlyCashFlow >= -1 && monthlyCashFlow <= 1 ? 'bg-slate-100 border-slate-300 text-slate-600' : monthlyCashFlow > 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {format(monthlyCashFlow)}<span className="text-xs font-normal text-slate-500 ml-1">/mo</span>
            </span>
            <div className={`text-xs mt-1 font-medium ${monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {format(annualCashFlow)} / year
            </div>
        </div>
      </div>
      
      {/* Detail Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-sm">
        {/* Income Section */}
        <div>
            <h4 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-[11px] border-b pb-2 flex justify-between">
                <span>Income</span>
                <span className="text-slate-400">Monthly</span>
            </h4>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Gross Rent</span>
                    <span className="font-bold text-slate-900">{format(params.monthlyRent)}</span>
                </div>
                <div className="flex justify-between items-center text-red-500">
                    <span className="flex items-center gap-1.5 text-xs"><Minus size={12}/> Vacancy Allowance ({params.vacancyRate}%)</span>
                    <span>({format(monthlyVacancy)})</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2">
                    <span className="font-bold text-slate-700">Effective Monthly Income</span>
                    <span className="font-bold text-blue-600">{format(effectiveRent)}</span>
                </div>
            </div>
        </div>

        {/* Expenses Section */}
        <div>
            <h4 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-[11px] border-b pb-2 flex justify-between">
                <span>Expenses</span>
                <span className="text-slate-400">Monthly</span>
            </h4>
            <div className="space-y-3">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-slate-600 font-medium flex items-center gap-1">
                             Mortgage Payment 
                             <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded-full border border-slate-200 font-normal">
                                Loan: {format(loanAmount)}
                             </span>
                        </span>
                        <span className="text-[10px] text-slate-400">P: {format(monthlyPrincipal)} | I: {format(monthlyInterest)}</span>
                    </div>
                    <span className="font-bold text-slate-900">{format(monthlyMortgage)}</span>
                </div>
                {/* Property Tax Row Removed - Included in OpEx */}
                <div className="flex justify-between items-center">
                     <div className="flex items-center gap-1.5">
                        <span className="text-slate-600 font-medium">Operating Expenses</span>
                        <div className="group relative">
                            <Info size={12} className="text-slate-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {params.operatingExpensePercent}% of Gross Rent. Includes Property Tax, Maintenance, Insurance, & Management.
                            </div>
                        </div>
                     </div>
                    <span className="font-medium text-slate-800">{format(monthlyOpEx)}</span>
                </div>
                {params.utilitiesMonthly > 0 && (
                     <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Utilities</span>
                        <span className="font-medium text-slate-800">{format(params.utilitiesMonthly)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2">
                    <span className="font-bold text-slate-700">Total Monthly Expenses</span>
                    <span className="font-bold text-red-600">{format(totalMonthlyExpenses)}</span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Break Even Solutions Bar */}
      {monthlyCashFlow < -1 && (
        <div className="bg-orange-50 px-6 py-4 border-t border-orange-100 flex flex-col md:flex-row md:items-center gap-4">
             <div className="text-xs text-orange-800 font-medium shrink-0 flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Fix Negative Cash Flow:</span>
             </div>
             <div className="flex flex-wrap gap-3 w-full">
                {canSolveDownPayment && (
                    <button 
                        onClick={() => onUpdate('downPaymentPercent', parseFloat(breakEvenDownPaymentPercent.toFixed(1)))}
                        className="flex-1 min-w-[200px] flex items-center justify-between bg-white border border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-900 px-3 py-2 rounded-lg text-xs transition-all shadow-sm group"
                    >
                        <span className="text-slate-500 group-hover:text-orange-800">Set Down Pmt to</span>
                        <span className="font-bold flex items-center gap-1">
                            {formatPercent(breakEvenDownPaymentPercent)}
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                    </button>
                )}
                
                <button 
                    onClick={() => onUpdate('monthlyRent', Math.ceil(breakEvenRent))}
                    className="flex-1 min-w-[200px] flex items-center justify-between bg-white border border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-900 px-3 py-2 rounded-lg text-xs transition-all shadow-sm group"
                >
                     <span className="text-slate-500 group-hover:text-orange-800">Set Rent to</span>
                     <span className="font-bold flex items-center gap-1">
                        {format(breakEvenRent)}
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                </button>
             </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="bg-slate-50 p-4 text-xs text-slate-500 border-t border-slate-100 flex items-start gap-2">
        <Info size={14} className="mt-0.5 shrink-0 text-blue-500" />
        <p>
            <span className="font-semibold text-slate-700">Note on Principal Paydown:</span> Although your cash flow is 
            <span className={monthlyCashFlow < 0 ? 'text-red-600 font-bold mx-1' : 'mx-1'}>{format(monthlyCashFlow)}</span>, 
            you are paying down <span className="text-green-600 font-bold">{format(monthlyPrincipal)}</span> of mortgage principal monthly. 
            This "forced savings" increases your net worth, even if your bank account balance decreases month-to-month.
        </p>
      </div>
    </div>
  );
};