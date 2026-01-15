import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface HistoricalTooltip {
  historicalValue: number | string;
  reason: string;
  source?: string;
}

interface Props {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  tooltip?: string;
  historicalTooltip?: HistoricalTooltip;
}

export const InputGroup: React.FC<Props> = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  tooltip,
  historicalTooltip
}) => {
  const [showDetailedTooltip, setShowDetailedTooltip] = useState(false);

  const hasTooltip = tooltip || historicalTooltip;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
        {hasTooltip && (
          <div className="relative">
            <button
              type="button"
              className="text-slate-400 hover:text-blue-600 transition-colors p-0.5 rounded-full hover:bg-blue-50"
              onMouseEnter={() => setShowDetailedTooltip(true)}
              onMouseLeave={() => setShowDetailedTooltip(false)}
              onClick={() => setShowDetailedTooltip(!showDetailedTooltip)}
            >
              <Info size={14} />
            </button>

            {/* Detailed Tooltip */}
            {showDetailedTooltip && (
              <div className="absolute z-50 right-0 top-6 w-64 max-w-[calc(100vw-3rem)] bg-slate-900 text-white text-xs rounded-lg shadow-xl p-3">
                <div className="absolute -top-1.5 right-2 w-3 h-3 bg-slate-900 transform rotate-45" />

                {historicalTooltip ? (
                  <div className="space-y-2">
                    {/* Historical Value Badge */}
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Historical
                      </span>
                      <span className="font-bold text-blue-300">
                        {typeof historicalTooltip.historicalValue === 'number'
                          ? historicalTooltip.historicalValue.toLocaleString()
                          : historicalTooltip.historicalValue}
                        {suffix && ` ${suffix}`}
                      </span>
                    </div>

                    {/* Reason */}
                    <p className="text-slate-300 leading-relaxed">
                      {historicalTooltip.reason}
                    </p>

                    {/* Source */}
                    {historicalTooltip.source && (
                      <p className="text-slate-500 text-[10px] italic border-t border-slate-700 pt-2 mt-2">
                        Source: {historicalTooltip.source}
                      </p>
                    )}
                  </div>
                ) : tooltip ? (
                  <p className="text-slate-300">{tooltip}</p>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="relative rounded-md shadow-sm">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-500 sm:text-sm font-medium">{prefix}</span>
          </div>
        )}
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`block w-full rounded-md border-0 py-2 text-slate-900 bg-white ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow ${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'}`}
        />
        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-slate-500 sm:text-sm font-medium">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};