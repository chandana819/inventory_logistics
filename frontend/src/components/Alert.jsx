import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

export const Alert = ({ type = 'info', title, children, className = '' }) => {
  const styles = {
    info: 'bg-blue-500/10 border-blue-400/30 text-blue-200',
    success: 'bg-green-500/10 border-green-400/30 text-green-200',
    warning: 'bg-yellow-500/10 border-yellow-400/30 text-yellow-200',
    error: 'bg-orange-500/10 border-orange-400/30 text-orange-200',
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
