import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

export const Alert = ({ type = 'info', title, children, className = '' }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle2 className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
  };

  return (
    <div className={`border rounded-lg p-4 flex gap-3 ${styles[type]} ${className}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div>
        {title && <h3 className="font-medium">{title}</h3>}
        <div>{children}</div>
      </div>
    </div>
  );
};
