import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'ok' | 'risk' | 'overdue' | 'info' | 'accent';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'info',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    ok: 'bg-status-ok/15 text-status-ok border-status-ok/30',
    risk: 'bg-status-risk/15 text-status-risk border-status-risk/30',
    overdue: 'bg-status-overdue/15 text-status-overdue border-status-overdue/30',
    info: 'bg-status-info/15 text-status-info border-status-info/30',
    accent: 'bg-accent-primary/15 text-accent-primary border-accent-primary/35',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs sm:text-sm px-2.5 py-1',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
