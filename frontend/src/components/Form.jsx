import React from 'react';

export const Input = React.forwardRef(({ className = '', label, error, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="mb-1 block text-sm font-medium text-slate-300">{label}</label>}
    <input
      ref={ref}
      className={`w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 transition placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${error ? 'border-orange-500' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
));

Input.displayName = 'Input';

export const Select = React.forwardRef(({ className = '', label, options = [], error, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="mb-1 block text-sm font-medium text-slate-300">{label}</label>}
    <select
      ref={ref}
      className={`w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${error ? 'border-orange-500' : ''} ${className}`}
      {...props}
    >
      <option value="">Select an option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
));

Select.displayName = 'Select';

export const Textarea = React.forwardRef(({ className = '', label, error, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="mb-1 block text-sm font-medium text-slate-300">{label}</label>}
    <textarea
      ref={ref}
      className={`w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 transition placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${error ? 'border-orange-500' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
));

Textarea.displayName = 'Textarea';
