import React, { useRef } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onChange,
  className = '',
}) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % items.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextTab = items[nextIndex];
    if (nextTab) {
      onChange(nextTab.id);
      const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons?.[nextIndex]?.focus();
    }
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label="Wedding Planning Sections"
      className={`no-print flex overflow-x-auto scrollbar-none gap-1 rounded-xl border border-border-subtle bg-bg-card p-1 backdrop-blur-md ${className}`}
    >
      {items.map((tab, idx) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
              isSelected
                ? 'bg-accent-primary text-bg-primary font-semibold shadow-glow'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
            }`}
          >
            {tab.icon && <span className="inline-flex" aria-hidden="true">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 rounded-full px-1.5 py-0.2 text-xs ${
                  isSelected ? 'bg-bg-primary text-accent-primary' : 'bg-bg-secondary text-text-muted'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
