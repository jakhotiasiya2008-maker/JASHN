import React, { useState } from 'react';
import { usePlannerStore } from '../../lib/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { fetchPlanBRecovery } from '../../lib/apiClient';
import { ValidatedPlanBResponse } from '../../domain/schemas';
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  Copy,
  CheckCircle2,
  Sparkles,
  Send,
} from 'lucide-react';

const COMMON_SCENARIOS = [
  'Unseasonal torrential rain during open-air lawn sangeet',
  'Guest count jumped by 120 people 48 hours before wedding',
  'Lead photographer cancelled last minute due to medical emergency',
  'Banquet manager refuses loud music permission post 10 PM',
];

export const PlanBTab: React.FC = () => {
  const { intake, budgetPlan } = usePlannerStore();
  const [scenarioInput, setScenarioInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [planBResult, setPlanBResult] = useState<ValidatedPlanBResponse | null>(null);

  if (!intake || !budgetPlan) return null;

  const handleGeneratePlanB = async (scenarioToRun: string) => {
    const query = scenarioToRun.trim();
    if (!query) return;

    setIsLoading(true);
    const res = await fetchPlanBRecovery({
      scenario: query,
      budgetINR: budgetPlan.totalBudgetINR,
      guestCount: intake.guestCount,
    });
    setPlanBResult(res.data);
    setIsLoading(false);
  };

  const handleCopyScript = () => {
    if (!planBResult) return;
    navigator.clipboard.writeText(planBResult.vendorCommunicationScript);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="border-border-highlight">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-status-risk/20 text-status-risk">
            <ShieldAlert className="h-4 w-4" />
          </span>
          <h2 className="font-serif text-2xl font-bold text-accent-primary">
            Plan B Crisis & Recovery Engine
          </h2>
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          Indian weddings have unexpected weather twists, guest surges, and vendor cancellations. Describe your scenario to get an immediate, panic-free tactical recovery protocol.
        </p>

        {/* Quick Scenario Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {COMMON_SCENARIOS.map((sc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setScenarioInput(sc);
                handleGeneratePlanB(sc);
              }}
              className="rounded-full border border-border-subtle bg-bg-card/70 px-3 py-1.5 text-xs text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-all text-left"
            >
              ⚡ {sc}
            </button>
          ))}
        </div>

        {/* Custom Input Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={scenarioInput}
            onChange={(e) => setScenarioInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGeneratePlanB(scenarioInput);
            }}
            placeholder="Or describe your custom emergency (e.g. Flower vendor stuck in highway traffic...)"
            className="flex-1 rounded-xl border border-border-subtle bg-bg-primary px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
          />

          <Button
            variant="primary"
            onClick={() => handleGeneratePlanB(scenarioInput)}
            isLoading={isLoading}
            disabled={!scenarioInput.trim()}
            rightIcon={<Send className="h-4 w-4" />}
          >
            Activate Plan B
          </Button>
        </div>
      </GlassCard>

      {/* Structured Recovery Plan Result */}
      {planBResult && (
        <GlassCard className="border-status-risk/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-subtle pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    planBResult.riskLevel === 'critical'
                      ? 'overdue'
                      : planBResult.riskLevel === 'medium'
                      ? 'risk'
                      : 'ok'
                  }
                  size="sm"
                >
                  <AlertTriangle className="mr-1 h-3 w-3 inline" />
                  Risk Level: {planBResult.riskLevel.toUpperCase()}
                </Badge>
                <span className="text-xs text-text-muted">Structured Protocol Activated</span>
              </div>
              <h3 className="mt-2 font-serif text-xl font-bold text-text-primary">
                Scenario: &quot;{planBResult.scenario}&quot;
              </h3>
            </div>

            <div className="rounded-xl border border-border-primary bg-bg-card p-3 text-right">
              <span className="text-xs text-text-muted">Estimated Budget Cushion Impact</span>
              <p className="font-semibold text-xs text-status-ok">
                {planBResult.budgetImpactEstimate}
              </p>
            </div>
          </div>

          {/* Immediate Actions & Next 24 Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Immediate 1-4 Hours */}
            <div className="rounded-xl border border-status-risk/30 bg-status-risk/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-status-risk">
                <Clock className="h-4 w-4 text-status-risk" />
                <span>Immediate Tactical Steps (Next 1–4 Hours)</span>
              </div>
              <div className="space-y-2">
                {planBResult.immediateActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-text-primary leading-relaxed"
                  >
                    <span className="font-bold text-status-risk shrink-0">{idx + 1}.</span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next 24 Hours */}
            <div className="rounded-xl border border-border-subtle bg-bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-primary">
                <CheckCircle2 className="h-4 w-4 text-accent-primary" />
                <span>Follow-Through Protocol (Next 24 Hours)</span>
              </div>
              <div className="space-y-2">
                {planBResult.next24Hours.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed"
                  >
                    <span className="font-bold text-accent-primary shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copyable Vendor Script */}
          <div className="rounded-xl border border-border-highlight bg-bg-card-hover p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-primary">
                <Sparkles className="h-4 w-4" />
                <span>Ready-To-Send Vendor Message Script (SMS / WhatsApp)</span>
              </div>

              <Button
                size="sm"
                variant="secondary"
                onClick={handleCopyScript}
                leftIcon={
                  isCopied ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-status-ok" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )
                }
              >
                {isCopied ? 'Copied!' : 'Copy Script'}
              </Button>
            </div>

            <div className="rounded-lg border border-border-subtle bg-bg-primary p-3 font-mono text-xs text-text-primary leading-relaxed select-all">
              {planBResult.vendorCommunicationScript}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
