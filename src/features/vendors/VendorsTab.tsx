import React, { useState } from 'react';
import { usePlannerStore } from '../../lib/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { computeVendorProgress } from '../../domain/vendors';
import { VendorStatus } from '../../domain/types';
import {
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  TrendingDown,
  IndianRupee,
} from 'lucide-react';

export const VendorsTab: React.FC = () => {
  const { vendorItems, updateVendorStatus } = usePlannerStore();
  const [selectedVendorId, setSelectedVendorId] = useState<string>(vendorItems[0]?.id || '');

  const progress = computeVendorProgress(vendorItems);
  const activeVendor = vendorItems.find((v) => v.id === selectedVendorId) || vendorItems[0];

  const handleStatusChange = (status: VendorStatus) => {
    if (!activeVendor) return;
    updateVendorStatus(activeVendor.id, status);
  };

  const handleAmountChange = (quoted?: number, booked?: number) => {
    if (!activeVendor) return;
    updateVendorStatus(
      activeVendor.id,
      activeVendor.status,
      quoted !== undefined ? quoted : activeVendor.quotedAmountINR,
      booked !== undefined ? booked : activeVendor.bookedAmountINR
    );
  };

  const handleNameChange = (name: string) => {
    if (!activeVendor) return;
    updateVendorStatus(
      activeVendor.id,
      activeVendor.status,
      activeVendor.quotedAmountINR,
      activeVendor.bookedAmountINR,
      name
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Circular Progress Ring */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between gap-6 border-border-highlight">
        <div>
          <h2 className="font-serif text-2xl font-bold text-accent-primary">
            Vendor Negotiation & Red Flag Checklist
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            Cultural questions, contract loopholes, and red flags for caterers, mandap decorators, candid photographers, and banquets.
          </p>
        </div>

        {/* Circular Progress Ring */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative h-16 w-16">
            <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-bg-card"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-accent-primary transition-all duration-700 ease-out"
                strokeDasharray={`${progress.percentBooked}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-accent-primary">
              {progress.percentBooked}%
            </div>
          </div>

          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-text-primary">
              {progress.bookedCount} of {progress.totalItems} Booked
            </p>
            <p className="text-text-muted">
              Booked Sum: ₹{(progress.totalBookedINR / 1000).toFixed(0)}k
            </p>
            <p className="text-text-muted">
              Quoted Sum: ₹{(progress.totalQuotedINR / 1000).toFixed(0)}k
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Main Vendor Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Categories */}
        <div className="lg:col-span-4 space-y-2">
          {vendorItems.map((vendor) => {
            const isSelected = activeVendor?.id === vendor.id;
            return (
              <button
                key={vendor.id}
                type="button"
                onClick={() => setSelectedVendorId(vendor.id)}
                className={`w-full flex items-center justify-between rounded-xl border p-3.5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
                  isSelected
                    ? 'border-accent-primary bg-accent-primary/10 shadow-glow'
                    : 'border-border-subtle bg-bg-card hover:bg-bg-card-hover'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">{vendor.title}</p>
                  <p className="text-xs text-text-muted capitalize">
                    {vendor.vendorName ? vendor.vendorName : vendor.categoryId.replace('_', ' ')}
                  </p>
                </div>

                <Badge
                  variant={
                    vendor.status === 'booked'
                      ? 'ok'
                      : vendor.status === 'quoted'
                      ? 'info'
                      : 'risk'
                  }
                  size="sm"
                >
                  {vendor.status.replace('_', ' ')}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        {activeVendor && (
          <div className="lg:col-span-8 space-y-5">
            <GlassCard className="border-border-highlight">
              {/* Header & Status Control */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-subtle pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-accent-primary">
                    {activeVendor.title}
                  </h3>
                  <input
                    type="text"
                    value={activeVendor.vendorName || ''}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter vendor business name (e.g. Royal Decorators)"
                    className="mt-1 w-full text-xs text-text-secondary bg-transparent border-b border-border-subtle focus:border-accent-primary focus:outline-none py-1"
                  />
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  {(['to_contact', 'contacted', 'quoted', 'booked'] as VendorStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(st)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                          activeVendor.status === st
                            ? 'bg-accent-primary text-bg-primary font-bold shadow-glow'
                            : 'border border-border-subtle bg-bg-card text-text-muted hover:text-text-primary'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Amount Inputs */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted">
                    Quoted Estimate (INR ₹)
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      step="5000"
                      value={activeVendor.quotedAmountINR || ''}
                      onChange={(e) => handleAmountChange(Number(e.target.value), undefined)}
                      placeholder="e.g. 250000"
                      className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-1.5 text-sm font-mono font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                    />
                    <IndianRupee className="absolute right-2 top-2 h-4 w-4 text-text-muted" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-muted">
                    Final Booked Amount (INR ₹)
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      step="5000"
                      value={activeVendor.bookedAmountINR || ''}
                      onChange={(e) => handleAmountChange(undefined, Number(e.target.value))}
                      placeholder="e.g. 220000"
                      className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-1.5 text-sm font-mono font-bold text-status-ok focus:outline-none focus:ring-1 focus:ring-accent-primary"
                    />
                    <IndianRupee className="absolute right-2 top-2 h-4 w-4 text-status-ok/60" />
                  </div>
                </div>
              </div>

              {/* Cultural Questions to Ask */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-primary">
                  <HelpCircle className="h-4 w-4 text-accent-primary" />
                  <span>Crucial Questions to Ask Vendor</span>
                </div>
                <div className="space-y-2">
                  {activeVendor.keyQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 rounded-lg border border-border-subtle bg-bg-card/50 p-2.5 text-xs text-text-secondary leading-relaxed"
                    >
                      <span className="font-bold text-accent-primary">{idx + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flags to Avoid */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-status-overdue">
                  <AlertOctagon className="h-4 w-4 text-status-overdue" />
                  <span>Indian Wedding Red Flags (Watch Out!)</span>
                </div>
                <div className="space-y-2">
                  {activeVendor.redFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 rounded-lg border border-status-overdue/30 bg-status-overdue/10 p-2.5 text-xs text-text-primary leading-relaxed"
                    >
                      <span className="font-bold text-status-overdue">⚠️</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Negotiation Tips */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-status-ok">
                  <TrendingDown className="h-4 w-4 text-status-ok" />
                  <span>Negotiation Playbook & Savings</span>
                </div>
                <div className="space-y-2">
                  {activeVendor.negotiationTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 rounded-lg border border-status-ok/30 bg-status-ok/10 p-2.5 text-xs text-text-secondary leading-relaxed"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-status-ok" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};
