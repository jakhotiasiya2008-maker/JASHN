import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 min-h-[44px] px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-primary active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none';

    const sizeStyles = {
      sm: 'text-xs min-h-[40px] px-3 py-1.5',
      md: 'text-sm min-h-[44px] px-5 py-2.5',
      lg: 'text-base min-h-[48px] px-7 py-3 font-semibold',
    }[size];

    const variantStyles = {
      primary:
        'bg-accent-primary text-bg-primary font-semibold shadow-glow hover:brightness-110 active:brightness-95',
      secondary:
        'bg-bg-card text-text-primary border border-border-primary hover:border-border-highlight hover:bg-bg-card-hover',
      outline:
        'border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-bg-primary',
      ghost:
        'text-text-secondary hover:text-text-primary hover:bg-bg-card/50',
      danger:
        'bg-status-overdue text-white hover:brightness-110',
    }[variant];

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
