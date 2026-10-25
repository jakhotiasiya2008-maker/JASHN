import React from 'react';
import { usePlannerStore, AppTheme } from '../../lib/store';

const THEMES: Array<{
  id: AppTheme;
  name: string;
  colors: [string, string];
}> = [
  { id: 'royal-gold', name: 'Royal Gold', colors: ['#12100E', '#D4AF37'] },
  { id: 'pastel-floral', name: 'Pastel Floral', colors: ['#FAF6F0', '#C95D73'] },
  { id: 'midnight-sangeet', name: 'Midnight Sangeet', colors: ['#0A0B14', '#EC4899'] },
  { id: 'ivory-minimal', name: 'Ivory Minimal', colors: ['#FBFBF9', '#9B783E'] },
];

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { activeTheme, setTheme } = usePlannerStore();

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className={`inline-flex items-center gap-1.5 rounded-full border border-border-primary bg-bg-card p-1 backdrop-blur-md ${className}`}
    >
      {THEMES.map((t) => {
        const isSelected = activeTheme === t.id;
        return (
          <button
            key={t.id}
            role="radio"
            aria-checked={isSelected}
            aria-label={`Switch to ${t.name} theme`}
            title={t.name}
            onClick={() => setTheme(t.id)}
            className={`group relative flex h-7 w-7 items-center justify-center rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
              isSelected ? 'ring-2 ring-accent-primary scale-110' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <span
              className="h-5 w-5 rounded-full border border-black/20 shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${t.colors[0]} 50%, ${t.colors[1]} 50%)`,
              }}
            />
          </button>
        );
      })}
    </div>
  );
};
