import React from 'react';

export const Button = React.forwardRef(({ className = '', variant = 'default', size = 'md', ...props }, ref) => {
  const baseStyles = 'font-medium rounded-lg transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950';
  
  const variants = {
    default: 'bg-blue-600 text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500 focus:ring-blue-400',
    secondary: 'border border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-700 focus:ring-slate-500',
    outline: 'border border-blue-400/50 text-blue-300 hover:bg-blue-500/10 focus:ring-blue-400',
    danger: 'bg-orange-600 text-white shadow-lg shadow-orange-950/30 hover:bg-orange-500 focus:ring-orange-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
});

Button.displayName = 'Button';
