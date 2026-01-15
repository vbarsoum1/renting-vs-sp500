import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { YearData } from '../types';

interface Props {
  data: YearData[];
}

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const formatLargeCurrency = (val: number) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return `$${val}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-200 shadow-xl rounded-xl text-sm ring-1 ring-slate-100">
        <p className="font-bold mb-2 text-slate-800">Year {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
                {/* Use a line for Total Invested in tooltip icon even though others are areas */}
                <div className={`w-2.5 h-2.5 ${entry.dataKey === 'totalInvested' ? 'rounded-none h-[2px]' : 'rounded-full'}`} style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600">{entry.name}:</span>
            </div>
            <span className="font-semibold tabular-nums text-slate-900">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const NetWorthChart: React.FC<Props> = ({ data }) => {
  const ticks = [1, 5, 10, 15, 20, 25].filter(t => t <= data.length);

  return (
    <div className="h-[400px] w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Net Worth Trajectory</h3>
          <p className="text-xs text-slate-500 mt-1">Dashed line represents your total cash contribution over time</p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">25 Year Projection</span>
      </div>
      <ResponsiveContainer width="100%" height="100%" className="!h-[320px]">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="year" 
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            tickFormatter={formatLargeCurrency}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '24px' }} iconType="circle" />
          
          <Area 
            type="monotone" 
            dataKey="reNetWorth" 
            name="Real Estate Net Worth" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorRe)" 
            strokeWidth={3}
          />
          <Area 
            type="monotone" 
            dataKey="spNetWorth" 
            name="S&P 500 Net Worth" 
            stroke="#22c55e" 
            fillOpacity={1} 
            fill="url(#colorSp)" 
            strokeWidth={3}
          />
          {/* Add Total Invested as a Line overlaid on the areas */}
          <Area 
            type="monotone"
            dataKey="totalInvested"
            name="Cash Invested"
            stroke="#94a3b8"
            strokeDasharray="5 5"
            fill="none"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CashFlowChart: React.FC<Props> = ({ data }) => {
    const ticks = [1, 5, 10, 15, 20, 25].filter(t => t <= data.length);

    return (
      <div className="h-[350px] w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Annual Real Estate Cash Flow</h3>
        <ResponsiveContainer width="100%" height="100%" className="!h-[270px]">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="year" 
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              tickFormatter={(val) => `$${val}`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '24px' }} iconType="circle" />
            <Line 
              type="monotone" 
              dataKey="annualCashFlow" 
              name="Annual Cash Flow" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };