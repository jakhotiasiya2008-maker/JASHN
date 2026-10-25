import React, { useState, useEffect } from 'react';
import { usePlannerStore } from './lib/store';
import { SkipLink } from './components/ui/SkipLink';
import { Navbar } from './components/ui/Navbar';
import { AuroraBackground } from './components/ui/AuroraBackground';
import { LandingPage } from './features/landing/LandingPage';
import { IntakeWizard } from './features/wizard/IntakeWizard';
import { Dashboard } from './features/dashboard/Dashboard';
import { ToastProvider } from './components/ui/Toast';

export default function App(): React.JSX.Element {
  const { intake, initializeStore } = usePlannerStore();
  const [isWizardActive, setIsWizardActive] = useState(false);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <ToastProvider>
      <AuroraBackground>
        <SkipLink />
        <Navbar />

        <div className="min-h-[calc(100vh-65px)]">
          {intake ? (
            <Dashboard />
          ) : isWizardActive ? (
            <IntakeWizard />
          ) : (
            <LandingPage onStartWizard={() => setIsWizardActive(true)} />
          )}
        </div>

        <footer role="contentinfo" className="no-print border-t border-border-subtle bg-bg-card/50 py-6 text-center text-xs text-text-muted">
          <p>
            Jashn AI Indian Wedding Planner • Hack2Skill PromptWars Challenge 5
          </p>
          <p className="mt-1">
            Hybrid Deterministic Architecture • Zero Math Hallucinations • WCAG 2.2 AA Compliant
          </p>
        </footer>
      </AuroraBackground>
    </ToastProvider>
  );
}
