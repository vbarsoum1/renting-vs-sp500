import React from 'react';

interface Props {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  tooltip?: string;
}

export const InputGroup: React.FC<Props> = ({ label, value, onChange, prefix, suffix, step = 1, tooltip }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
        {tooltip && <span className="text-xs text-slate-400 cursor-help hover:text-slate-600 transition-colors" title={tooltip}>?</span>}
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