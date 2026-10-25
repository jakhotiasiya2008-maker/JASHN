import React from 'react';
import { Mandala } from '../../components/ui/Mandala';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  Store,
  Compass,
  AlertTriangle,
  HeartHandshake,
} from 'lucide-react';

export const LandingPage: React.FC<{ onStartWizard: () => void }> = ({ onStartWizard }) => {
  return (
    <div className="relative overflow-hidden py-12 sm:py-20">
      {/* Procedurally Generated Rotating SVG Mandala in Background */}
      <div className="pointer-events-none absolute -top-32 -right-32 -z-10 text-accent-primary/20">
        <Mandala size={650} />
      </div>
      <div className="pointer-events-none absolute top-1/2 -left-48 -z-10 text-accent-secondary/15">
        <Mandala size={550} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          <Badge variant="accent" size="md" className="mb-4">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 inline" />
            Hack2Skill PromptWars • Challenge 5: Celebration & Event Planner
          </Badge>

          <h1 className="font-serif text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl sm:leading-tight max-w-4xl">
            Indian Wedding Planning with{' '}
            <span className="text-accent-primary">Mathematical Precision</span> & AI Personalization.
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed">
            Engineered for the busy family member planning a multi-function Indian celebration on a fixed budget who needs{' '}
            <strong className="text-accent-primary font-semibold">clarity, not chaos</strong>. Pure TypeScript engines compute your budget and timeline; Gemini personalizes your vision.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onStartWizard}
              rightIcon={<ArrowRight className="h-5 w-5" />}
              className="shadow-glow"
            >
              Start Free Planning (60s Intake)
            </Button>
          </div>

          {/* Social Proof & Guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
            <span className="flex items-center">
              <ShieldCheck className="mr-1.5 h-4 w-4 text-status-ok" />
              100% Deterministic (Zero Math Drift)
            </span>
            <span className="flex items-center">
              <Compass className="mr-1.5 h-4 w-4 text-accent-primary" />
              Haldi • Mehendi • Sangeet • Pheras
            </span>
            <span className="flex items-center">
              <HeartHandshake className="mr-1.5 h-4 w-4 text-accent-secondary" />
              No Data Harvested • Local Persistence
            </span>
          </div>
        </div>

        {/* 5 Core Feature Pillar Cards */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1: Budget Engine */}
          <GlassCard interactive className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-text-primary">
              Hare-Niemeyer Budget Engine
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Allocates exact INR across 10 wedding categories using tiered presets, guest counts, and city tiers. Built-in 10% contingency cushion and zero arithmetic hallucination.
            </p>
          </GlassCard>

          {/* Feature 2: Timeline Engine */}
          <GlassCard interactive className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-secondary/15 text-accent-secondary">
              <CalendarDays className="h-5 w-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-text-primary">
              Critical-Path Timeline Engine
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Schedules tasks backwards from your muhurat date. Detects critical bottlenecks, computes overdue/at-risk states, and activates compressed emergency scheduling when dates are close.
            </p>
          </GlassCard>

          {/* Feature 3: Vendor Checklist */}
          <GlassCard interactive className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-info/15 text-status-info">
              <Store className="h-5 w-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-text-primary">
              Vendor Red Flag Playbook
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Category-specific negotiation tactics and red flags for caterers, lawn banquets, mandap decorators, and candid photographers to protect your hard-earned funds.
            </p>
          </GlassCard>

          {/* Feature 4: AI Personalization */}
          <GlassCard interactive className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-ok/15 text-status-ok">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-text-primary">
              Gemini Cultural Personalization
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Schema-validated AI recommendations for curated color palettes, signature royal feast menus, decor moodboards, and high-energy Sangeet entertainment tailored to your aesthetic.
            </p>
          </GlassCard>

          {/* Feature 5: Plan B Crisis Recovery */}
          <GlassCard interactive className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-risk/15 text-status-risk">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-text-primary">
              Tactical Plan B Crisis Mode
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Instant panic-free recovery protocols for unseasonal rain, sudden guest surges, or vendor cancellations with copyable WhatsApp communication scripts.
            </p>
          </GlassCard>

          {/* Feature 6: ICS & WhatsApp Export */}
          <GlassCard interactive className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary">
              <Compass className="h-5 w-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-text-primary">
              One-Click Calendar & WhatsApp
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Export standard .ics calendars for family reminders, print-optimized offline binders, and WhatsApp-ready summaries for parental consensus.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
