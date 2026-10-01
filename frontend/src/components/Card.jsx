import React from 'react';

export const Card = ({ className = '', ...props }) => (
  <div className={`bg-white rounded-lg shadow-md border border-slate-200 ${className}`} {...props} />
);

export const CardHeader = ({ className = '', ...props }) => (
  <div className={`px-6 py-4 border-b border-slate-200 ${className}`} {...props} />
);

export const CardTitle = ({ className = '', ...props }) => (
  <h2 className={`text-xl font-bold text-slate-900 ${className}`} {...props} />
);

export const CardContent = ({ className = '', ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props} />
);

export const CardFooter = ({ className = '', ...props }) => (
  <div className={`px-6 py-4 border-t border-slate-200 flex gap-3 justify-end ${className}`} {...props} />
);
