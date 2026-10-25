import React from 'react';

export interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  formatValue?: (val: number) => string;
  onChange: (value: number) => void;
  helperText?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  formatValue = (v) => v.toString(),
  onChange,
  helperText,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
        <span className="font-serif text-base font-bold text-accent-primary" aria-live="polite">
          {formatValue(value)}
        </span>
      </div>

      <div className="relative flex items-center py-2">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-bg-card accent-accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
          style={{
            background: `linear-gradient(to right, var(--accent-primary) ${percentage}%, rgba(255,255,255,0.12) ${percentage}%)`,
          }}
        />
      </div>

      {helperText && <p className="text-xs text-text-muted">{helperText}</p>}
    </div>
  );
};
