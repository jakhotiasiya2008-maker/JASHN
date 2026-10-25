import React, { useState } from 'react';
import { usePlannerStore } from '../../lib/store';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Button } from './Button';
import { RotateCcw, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { intake, resetPlanner } = usePlannerStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleConfirmReset = () => {
    resetPlanner();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header
        role="banner"
        className="sticky top-0 z-40 w-full border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md transition-colors"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo & Title */}
          <div className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary bg-bg-card text-accent-primary shadow-glow"
              aria-hidden="true"
            >
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <span className="font-serif text-xl font-bold tracking-wider text-accent-primary sm:text-2xl">
                JASHN
              </span>
              <span className="hidden text-xs text-text-muted sm:inline-block sm:ml-2">
                AI Indian Wedding Planner
              </span>
            </div>
          </div>

          {/* Right Controls: Theme Switcher & Reset */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />

            {intake && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
                aria-label="Reset wedding plan"
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              >
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Accessible Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl border border-border-highlight bg-bg-card p-6 shadow-glow">
            <h2 id="reset-dialog-title" className="font-serif text-xl font-bold text-text-primary">
              Reset Wedding Plan?
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              This will clear your customized budgets, timeline milestones, and vendor checklists.
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmReset}>
                Yes, Reset All
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
