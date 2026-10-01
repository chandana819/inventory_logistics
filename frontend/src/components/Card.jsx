import React from 'react';

export const Card = ({ className = '', ...props }) => (
  <div className={`bg-slate-900 rounded-lg shadow-md border border-slate-800 text-slate-100 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-blue-950/30 ${className}`} {...props} />
);

export const CardHeader = ({ className = '', ...props }) => (
  <div className={`px-6 py-4 border-b border-slate-800 ${className}`} {...props} />
);

export const CardTitle = ({ className = '', ...props }) => (
  <h2 className={`text-xl font-bold text-slate-100 ${className}`} {...props} />
);

export const CardContent = ({ className = '', ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props} />
);

export const CardFooter = ({ className = '', ...props }) => (
  <div className={`px-6 py-4 border-t border-slate-200 flex gap-3 justify-end ${className}`} {...props} />
);
