import React, { useState, useEffect, useRef } from 'react';
import { usePlannerStore } from '../../lib/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Slider } from '../../components/ui/Slider';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { TypewriterText } from '../../components/ui/TypewriterText';
import { fetchTradeoffExplanation } from '../../lib/apiClient';
import { computeVendorProgress } from '../../domain/vendors';
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    intake,
    budgetPlan,
    timelinePlan,
    vendorItems,
    tradeoffExplanation,
    isAnalyzingTradeoffs,
    updateWhatIfSliders,
    setTradeoffExplanation,
    setIsAnalyzingTradeoffs,
    setCurrentTab,
  } = usePlannerStore();

  const [sliderBudget, setSliderBudget] = useState(budgetPlan?.totalBudgetINR || 2500000);
  const [sliderGuests, setSliderGuests] = useState(intake?.guestCount || 300);

  const initialBudgetRef = useRef(budgetPlan?.totalBudgetINR || 2500000);
  const initialGuestsRef = useRef(intake?.guestCount || 300);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync state if store updates from elsewhere
  useEffect(() => {
    if (budgetPlan) setSliderBudget(budgetPlan.totalBudgetINR);
    if (intake) setSliderGuests(intake.guestCount);
  }, [budgetPlan, intake]);

  // Debounced Trade-Off AI analysis
  useEffect(() => {
    const budgetDelta = sliderBudget - initialBudgetRef.current;
    const guestDelta = sliderGuests - initialGuestsRef.current;

    // Only analyze if there is an actual delta
    if (budgetDelta === 0 && guestDelta === 0) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      setIsAnalyzingTradeoffs(true);
      const res = await fetchTradeoffExplanation(
        {
          budgetDelta,
          guestDelta,
          newBudgetINR: sliderBudget,
          newGuestCount: sliderGuests,
        },
        controller.signal
      );
      setTradeoffExplanation(res.data);
      setIsAnalyzingTradeoffs(false);
    }, 450);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [sliderBudget, sliderGuests, setIsAnalyzingTradeoffs, setTradeoffExplanation]);

  const handleBudgetChange = (val: number) => {
    setSliderBudget(val);
    updateWhatIfSliders(val, sliderGuests);
  };

  const handleGuestsChange = (val: number) => {
    setSliderGuests(val);
    updateWhatIfSliders(sliderBudget, val);
  };

  if (!budgetPlan || !timelinePlan || !intake) return null;

  const vendorProgress = computeVendorProgress(vendorItems);
  const percentTasksCompleted =
    timelinePlan.summary.total > 0
      ? Math.round((timelinePlan.summary.completed / timelinePlan.summary.total) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* High-priority Risk Alerts */}
      {timelinePlan.riskWarnings.length > 0 && (
        <div className="space-y-3">
          {timelinePlan.riskWarnings.map((warn) => (
            <div
              key={warn.id}
              className="flex items-start gap-3 rounded-xl border border-status-risk/40 bg-status-risk/10 p-4 shadow-sm"
              role="alert"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-status-risk" />
              <div>
                <p className="font-semibold text-text-primary text-sm">{warn.message}</p>
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                  <span className="font-bold text-status-risk">Recommended Action: </span>
                  {warn.fixAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4 Interactive Progress Highlights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Budget Allocation Progress */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-text-muted">Budget Discipline</span>
            <p className="mt-1 font-serif text-2xl font-bold text-accent-primary">
              ₹{(budgetPlan.totalBudgetINR / 100000).toFixed(1)} Lakhs
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Zero floating drift. Hare-Niemeyer verified.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-status-ok border-t border-border-subtle pt-2">
            <span className="flex items-center">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" /> 10% Safety Net
            </span>
            <span>₹{(budgetPlan.contingencyINR / 1000).toFixed(0)}k</span>
          </div>
        </GlassCard>

        {/* Milestone Tracker */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-text-muted">Task Milestones</span>
            <p className="mt-1 font-serif text-2xl font-bold text-text-primary">
              {percentTasksCompleted}%{' '}
              <span className="text-sm font-normal text-text-muted">done</span>
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              {timelinePlan.summary.completed} of {timelinePlan.summary.total} tasks completed
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-border-subtle pt-2">
            <span className="text-status-risk">{timelinePlan.summary.atRisk} At-Risk</span>
            <button
              onClick={() => setCurrentTab('timeline')}
              className="text-accent-primary font-medium hover:underline inline-flex items-center"
            >
              View Roadmap <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          </div>
        </GlassCard>

        {/* Vendor Booking Status */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-text-muted">Vendors Booked</span>
            <p className="mt-1 font-serif text-2xl font-bold text-text-primary">
              {vendorProgress.percentBooked}%{' '}
              <span className="text-sm font-normal text-text-muted">locked</span>
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              {vendorProgress.bookedCount} booked • {vendorProgress.toContactCount} to contact
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-border-subtle pt-2">
            <span className="text-text-muted">Quoted: ₹{(vendorProgress.totalQuotedINR / 1000).toFixed(0)}k</span>
            <button
              onClick={() => setCurrentTab('vendors')}
              className="text-accent-primary font-medium hover:underline inline-flex items-center"
            >
              Checklist <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          </div>
        </GlassCard>

        {/* Ceremonies Hosted */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-text-muted">Celebrations</span>
            <p className="mt-1 font-serif text-2xl font-bold text-accent-secondary">
              {intake.selectedFunctions.length}{' '}
              <span className="text-sm font-normal text-text-muted">functions</span>
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              {intake.selectedFunctions.map((f) => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-border-subtle pt-2">
            <span className="text-accent-primary flex items-center">
              <Calendar className="mr-1 h-3.5 w-3.5" /> Synchronized
            </span>
            <button
              onClick={() => setCurrentTab('ideas')}
              className="text-accent-primary font-medium hover:underline inline-flex items-center"
            >
              Ideas & Menu <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          </div>
        </GlassCard>
      </div>

      {/* What-If Instant Rebalancing Sliders & AI Trade-Off Analysis */}
      <GlassCard className="border-border-highlight">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border-subtle pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-primary/20 text-accent-primary">
                <TrendingUp className="h-4 w-4" />
              </span>
              <h2 className="font-serif text-xl font-bold text-text-primary">
                Live &quot;What-If&quot; Scenario Simulator
              </h2>
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              Move the sliders below. The pure TypeScript engine rebalances all unlocked categories instantly, while Gemini evaluates strategic trade-offs.
            </p>
          </div>

          <Badge variant="ok" size="sm" className="mt-2 sm:mt-0 w-fit">
            <ShieldCheck className="mr-1 h-3 w-3 inline" /> Deterministic Rebalance
          </Badge>
        </div>

        {/* Sliders Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Slider
            id="overview-budget-slider"
            label="Total Wedding Budget"
            min={200000}
            max={15000000}
            step={50000}
            value={sliderBudget}
            onChange={handleBudgetChange}
            formatValue={(v) => `₹${(v / 100000).toFixed(1)} Lakhs`}
            helperText={`Equates to ₹${Math.round(sliderBudget / sliderGuests).toLocaleString('en-IN')} per guest`}
          />

          <Slider
            id="overview-guest-slider"
            label="Guest Count"
            min={20}
            max={1500}
            step={10}
            value={sliderGuests}
            onChange={handleGuestsChange}
            formatValue={(v) => `${v} Guests`}
            helperText="Directly impacts catering, banquet size, and invitation count"
          />
        </div>

        {/* AI Trade-Off Analysis Box */}
        <div className="mt-6 rounded-xl border border-border-primary bg-bg-card-hover p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-primary" />
              <span className="font-serif text-sm font-bold text-accent-primary">
                AI Trade-Off Analysis & Recommendations
              </span>
            </div>
            {isAnalyzingTradeoffs && (
              <span className="text-xs text-accent-primary animate-pulse">
                Evaluating impact...
              </span>
            )}
          </div>

          {tradeoffExplanation ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm font-medium text-text-primary leading-relaxed">
                <TypewriterText text={tradeoffExplanation.summary} />
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-border-subtle">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-status-ok">
                    Strategic Advantages:
                  </span>
                  <ul className="mt-1 space-y-1 text-xs text-text-secondary">
                    {tradeoffExplanation.pros.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-status-ok" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-status-risk">
                    Compromises & Recommendations:
                  </span>
                  <ul className="mt-1 space-y-1 text-xs text-text-secondary">
                    {tradeoffExplanation.recommendations.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-status-risk" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs text-text-muted">
              Adjust any slider above to see a real-time AI impact breakdown on catering buffers, vendor tiers, and venue capacity.
            </p>
          )}
        </div>

        {/* Quick Action Buttons to Other Tabs */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentTab('budget')}
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            Review Category Breakdowns
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentTab('planb')}
            rightIcon={<AlertTriangle className="h-3.5 w-3.5" />}
          >
            Simulate Crisis Plan B
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};
