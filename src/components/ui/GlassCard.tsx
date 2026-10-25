import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  interactive?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ glow = false, interactive = false, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`glass-card rounded-xl p-5 sm:p-6 ${
          glow ? 'shadow-glow' : 'shadow-glass'
        } ${
          interactive
            ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-glow focus-within:border-accent-primary'
            : ''
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
