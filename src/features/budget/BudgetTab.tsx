import React, { useState } from 'react';
import { usePlannerStore } from '../../lib/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CATEGORY_IDS, BudgetCategoryId } from '../../domain/constants';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Table as TableIcon,
  PieChart as PieIcon,
  IndianRupee,
} from 'lucide-react';

const CATEGORY_COLORS: Record<BudgetCategoryId, string> = {
  venue: '#D4AF37',
  catering: '#EAB308',
  decor: '#EC4899',
  photography: '#38BDF8',
  attire: '#A855F7',
  music_entertainment: '#F97316',
  invitations: '#10B981',
  travel_stay: '#6366F1',
  rituals: '#F43F5E',
  contingency: '#14B8A6',
};

export const BudgetTab: React.FC = () => {
  const { budgetPlan, toggleLockCategory, updateCategoryAllocation } = usePlannerStore();
  const [editingCategory, setEditingCategory] = useState<BudgetCategoryId | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [showTable, setShowTable] = useState(false);

  if (!budgetPlan) return null;

  const total = budgetPlan.totalBudgetINR;
  const allocations = budgetPlan.allocations;

  const handleStartEdit = (catId: BudgetCategoryId, currentAmount: number) => {
    setEditingCategory(catId);
    setEditAmount(currentAmount);
  };

  const handleSaveEdit = (catId: BudgetCategoryId) => {
    updateCategoryAllocation(catId, editAmount, true); // Automatically lock custom amount
    setEditingCategory(null);
  };

  // Compute SVG Donut Chart Slices
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  const slices = CATEGORY_IDS.map((catId) => {
    const alloc = allocations[catId]!;
    const percentage = alloc.allocatedAmountINR / total;
    const strokeDasharray = `${percentage * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeOffset;
    cumulativeOffset += percentage * circumference;

    return {
      catId,
      label: alloc.label,
      amount: alloc.allocatedAmountINR,
      percentage: alloc.percentage,
      color: CATEGORY_COLORS[catId],
      strokeDasharray,
      strokeDashoffset,
      isLocked: alloc.isLocked,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <GlassCard className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-border-highlight">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-accent-primary">
              Deterministic Budget Distribution
            </h2>
            <Badge variant="ok" size="sm">
              <ShieldCheck className="mr-1 h-3.5 w-3.5 inline" />
              Sum Exact (₹{budgetPlan.allocatedSumINR.toLocaleString('en-IN')})
            </Badge>
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            Hare-Niemeyer integer quotas guarantee ₹0 arithmetic drift. Lock any category to preserve its amount while other allocations auto-rebalance.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowTable(!showTable)}
            leftIcon={showTable ? <PieIcon className="h-4 w-4" /> : <TableIcon className="h-4 w-4" />}
          >
            {showTable ? 'Show Donut Chart' : 'Accessible Table'}
          </Button>
        </div>
      </GlassCard>

      {/* Visual Donut Chart & Legend Section */}
      {!showTable ? (
        <GlassCard className="flex flex-col lg:flex-row items-center justify-around gap-8 py-8">
          {/* Animated SVG Donut */}
          <div className="relative flex items-center justify-center">
            <svg
              width="240"
              height="240"
              viewBox="0 0 240 240"
              className="transform -rotate-90 transition-all duration-700"
              aria-label="Wedding budget category distribution chart"
              role="img"
            >
              {slices.map((slice) => (
                <circle
                  key={slice.catId}
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="28"
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  className="transition-all duration-500 hover:opacity-80"
                />
              ))}
            </svg>

            {/* Inner Center Label */}
            <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase tracking-wider text-text-muted">Total Budget</span>
              <span className="font-serif text-xl font-bold text-accent-primary">
                ₹{(total / 100000).toFixed(1)}L
              </span>
              <span className="text-[11px] text-text-secondary">
                ₹{budgetPlan.perGuestCostINR.toLocaleString('en-IN')} / guest
              </span>
            </div>
          </div>

          {/* Color Legend & Category List */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-2 max-w-md w-full">
            {slices.map((slice) => (
              <div key={slice.catId} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="truncate text-text-secondary font-medium">
                    {slice.label.split('&')[0]}
                  </span>
                </div>
                <div className="ml-2 font-mono font-semibold text-text-primary">
                  {slice.percentage}%
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      ) : (
        /* Accessible Data Table (WCAG 2.2 AA Text Alternative) */
        <GlassCard className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="Wedding Budget Allocation Breakdown">
            <caption className="sr-only">Detailed breakdown of allocations by category</caption>
            <thead>
              <tr className="border-b border-border-subtle text-xs uppercase tracking-wider text-accent-primary">
                <th scope="col" className="py-3 px-4">Category</th>
                <th scope="col" className="py-3 px-4">Allocated (INR)</th>
                <th scope="col" className="py-3 px-4">Percentage</th>
                <th scope="col" className="py-3 px-4">Status</th>
                <th scope="col" className="py-3 px-4">Guidance Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary text-xs sm:text-sm">
              {slices.map((slice) => (
                <tr key={slice.catId} className="hover:bg-bg-card-hover transition-colors">
                  <th scope="row" className="py-3 px-4 font-medium text-text-primary">
                    {slice.label}
                  </th>
                  <td className="py-3 px-4 font-mono font-semibold text-text-primary">
                    ₹{slice.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-mono">{slice.percentage}%</td>
                  <td className="py-3 px-4">
                    {slice.isLocked ? (
                      <span className="inline-flex items-center text-accent-primary font-medium">
                        <Lock className="mr-1 h-3 w-3" /> Locked
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-text-muted">
                        <Unlock className="mr-1 h-3 w-3" /> Auto
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-text-muted">
                    {allocations[slice.catId]!.notes}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border-highlight font-bold text-text-primary">
                <th scope="row" className="py-3 px-4">Total Budget</th>
                <td className="py-3 px-4 font-mono text-accent-primary">
                  ₹{total.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4">100.0%</td>
                <td colSpan={2} className="py-3 px-4 text-xs text-status-ok font-normal">
                  Exact allocation sum guaranteed.
                </td>
              </tr>
            </tfoot>
          </table>
        </GlassCard>
      )}

      {/* Category Management Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {CATEGORY_IDS.map((catId) => {
          const alloc = allocations[catId]!;
          const isEditing = editingCategory === catId;
          const isContingency = catId === 'contingency';

          return (
            <GlassCard
              key={catId}
              className={`flex flex-col justify-between border transition-all ${
                alloc.isLocked ? 'border-accent-primary/60 bg-accent-primary/5' : 'border-border-subtle'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[catId] }}
                    />
                    <h3 className="font-serif text-base font-bold text-text-primary">
                      {alloc.label}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-text-muted">
                      {alloc.percentage}%
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleLockCategory(catId)}
                      title={alloc.isLocked ? 'Unlock category for automatic rebalancing' : 'Lock category amount'}
                      aria-label={`${alloc.isLocked ? 'Unlock' : 'Lock'} ${alloc.label}`}
                      className={`p-1.5 rounded-lg border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
                        alloc.isLocked
                          ? 'border-accent-primary bg-accent-primary text-bg-primary font-bold shadow-glow'
                          : 'border-border-subtle bg-bg-card text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {alloc.isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  {!isEditing ? (
                    <div className="flex items-baseline justify-between">
                      <p className="font-serif text-2xl font-extrabold text-accent-primary">
                        ₹{alloc.allocatedAmountINR.toLocaleString('en-IN')}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(catId, alloc.allocatedAmountINR)}
                        className="text-xs text-text-secondary hover:text-accent-primary underline ml-2"
                      >
                        Custom Edit
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          step="10000"
                          value={editAmount}
                          onChange={(e) => setEditAmount(Number(e.target.value))}
                          className="w-full rounded-lg border border-border-highlight bg-bg-primary px-3 py-1.5 text-sm font-mono font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        />
                        <IndianRupee className="absolute right-2 top-2 h-4 w-4 text-text-muted" />
                      </div>
                      <Button size="sm" variant="primary" onClick={() => handleSaveEdit(catId)}>
                        Lock & Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {alloc.notes}
                </p>
              </div>

              {isContingency && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-status-ok font-medium border-t border-border-subtle pt-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Reserved buffer for last-minute guest overflows or generator overages.</span>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
