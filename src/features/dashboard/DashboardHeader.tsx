import React from 'react';
import { usePlannerStore } from '../../lib/store';
import { Badge } from '../../components/ui/Badge';
import { GlassCard } from '../../components/ui/GlassCard';
import { CountUp } from '../../components/ui/CountUp';
import {
  Calendar,
  Users,
  IndianRupee,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { intake, budgetPlan, timelinePlan } = usePlannerStore();
  if (!intake || !budgetPlan || !timelinePlan) return null;

  const daysRemaining = timelinePlan.daysRemaining;
  const budgetInLakhs = (budgetPlan.totalBudgetINR / 100000);

  return (
    <GlassCard className="relative overflow-hidden border-border-highlight">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-15 blur-3xl"
        style={{ background: 'var(--accent-glow)' }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Title & Couple Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" size="sm">
              <Sparkles className="mr-1 h-3 w-3 inline" />
              {intake.vibe.replace('_', ' ').toUpperCase()}
            </Badge>
            {timelinePlan.isCompressedMode && (
              <Badge variant="risk" size="sm">
                <AlertTriangle className="mr-1 h-3 w-3 inline" />
                Compressed Mode ({daysRemaining} Days Left)
              </Badge>
            )}
            {timelinePlan.summary.overdue > 0 && (
              <Badge variant="overdue" size="sm">
                {timelinePlan.summary.overdue} Tasks Overdue
              </Badge>
            )}
          </div>

          <h1 className="mt-2 font-serif text-3xl font-extrabold text-accent-primary sm:text-4xl">
            {intake.coupleNames ? `${intake.coupleNames}'s Wedding` : 'Our Wedding Plan'}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {intake.cityName ? `${intake.cityName} • ` : ''}
            {new Date(intake.weddingDate).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Core Quick Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {/* Days to Go */}
          <div className="rounded-xl border border-border-subtle bg-bg-card p-3 shadow-sm">
            <div className="flex items-center text-xs text-text-muted">
              <Clock className="mr-1 h-3.5 w-3.5 text-accent-primary" />
              <span>Countdown</span>
            </div>
            <p className="mt-1 font-serif text-2xl font-bold text-accent-primary">
              <CountUp value={daysRemaining} />
              <span className="ml-1 text-xs font-normal text-text-secondary">days</span>
            </p>
          </div>

          {/* Total Budget */}
          <div className="rounded-xl border border-border-subtle bg-bg-card p-3 shadow-sm">
            <div className="flex items-center text-xs text-text-muted">
              <IndianRupee className="mr-1 h-3.5 w-3.5 text-status-ok" />
              <span>Total Budget</span>
            </div>
            <p className="mt-1 font-serif text-2xl font-bold text-text-primary">
              ₹<CountUp value={budgetInLakhs} formatter={(v) => v.toFixed(1)} />
              <span className="ml-1 text-xs font-normal text-text-secondary">L</span>
            </p>
          </div>

          {/* Guest Count */}
          <div className="rounded-xl border border-border-subtle bg-bg-card p-3 shadow-sm">
            <div className="flex items-center text-xs text-text-muted">
              <Users className="mr-1 h-3.5 w-3.5 text-accent-secondary" />
              <span>Attendees</span>
            </div>
            <p className="mt-1 font-serif text-2xl font-bold text-text-primary">
              <CountUp value={intake.guestCount} />
              <span className="ml-1 text-xs font-normal text-text-secondary">guests</span>
            </p>
          </div>

          {/* Per-Guest Index */}
          <div className="rounded-xl border border-border-subtle bg-bg-card p-3 shadow-sm">
            <div className="flex items-center text-xs text-text-muted">
              <Calendar className="mr-1 h-3.5 w-3.5 text-status-info" />
              <span>Per Guest</span>
            </div>
            <p className="mt-1 font-serif text-2xl font-bold text-accent-primary">
              ₹<CountUp value={budgetPlan.perGuestCostINR} />
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
