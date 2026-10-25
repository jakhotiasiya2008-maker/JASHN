import React, { useState } from 'react';
import { usePlannerStore } from '../../lib/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { CATEGORY_IDS } from '../../domain/constants';
import {
  Calendar,
  Printer,
  Share2,
  Copy,
  CheckCircle2,
  Download,
  FileText,
} from 'lucide-react';

export const ExportTab: React.FC = () => {
  const { intake, budgetPlan, timelinePlan } = usePlannerStore();
  const [isCopied, setIsCopied] = useState(false);

  if (!intake || !budgetPlan || !timelinePlan) return null;

  // 1. Download .ics calendar file
  const handleDownloadIcs = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Jashn//AI Indian Wedding Planner//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ].join('\r\n');

    for (const task of timelinePlan.tasks) {
      const cleanDate = task.dueDate.replace(/-/g, '');
      const uid = `jashn-${task.id}-${cleanDate}@jashn.wedding`;
      const event = [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${cleanDate}T090000Z`,
        `DTSTART;VALUE=DATE:${cleanDate}`,
        `SUMMARY:💍 ${task.title}`,
        `DESCRIPTION:${task.description} Pro Tip: ${task.actionTip}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT1440M', // 1 day before
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder: Wedding milestone due tomorrow',
        'END:VALARM',
        'END:VEVENT',
      ].join('\r\n');

      icsContent += '\r\n' + event;
    }

    icsContent += '\r\nEND:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Jashn_${intake.coupleNames?.replace(/\s+/g, '_') || 'Wedding'}_Timeline.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 2. Print view
  const handlePrint = () => {
    window.print();
  };

  // 3. WhatsApp formatted text summary
  const generateWhatsAppSummary = (): string => {
    const couple = intake.coupleNames || 'Our Wedding';
    const totalLakhs = (budgetPlan.totalBudgetINR / 100000).toFixed(1);
    const perGuest = budgetPlan.perGuestCostINR.toLocaleString('en-IN');

    let text = `✨ *JASHN WEDDING ITINERARY & BUDGET SUMMARY* ✨\n`;
    text += `👑 *Couple:* ${couple}\n`;
    text += `📅 *Date:* ${intake.weddingDate} (${timelinePlan.daysRemaining} days to go!)\n`;
    text += `📍 *City:* ${intake.cityName || 'Home'} (${intake.cityTier.replace('_', ' ').toUpperCase()})\n`;
    text += `👥 *Guests:* ${intake.guestCount} | *Per-Guest Spend:* ₹${perGuest}\n`;
    text += `💰 *Total Budget:* ₹${totalLakhs} Lakhs\n\n`;

    text += `📊 *CATEGORY ALLOCATIONS:*\n`;
    for (const catId of CATEGORY_IDS) {
      const alloc = budgetPlan.allocations[catId]!;
      text += `• ${alloc.label}: ₹${(alloc.allocatedAmountINR / 100000).toFixed(2)}L (${alloc.percentage}%)\n`;
    }

    text += `\n🛡️ *Safety Net Contingency:* ₹${(budgetPlan.contingencyINR / 100000).toFixed(2)}L\n\n`;

    text += `🗓️ *UPCOMING CRITICAL MILESTONES:*\n`;
    const pendingTasks = timelinePlan.tasks.filter((t) => !t.completed).slice(0, 5);
    for (const t of pendingTasks) {
      text += `• [${t.dueDate}] ${t.title}\n`;
    }

    text += `\n✨ Planned with Jashn AI Wedding Planner`;
    return text;
  };

  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppSummary();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppSummary());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="border-border-highlight">
        <h2 className="font-serif text-2xl font-bold text-accent-primary">
          Export, Calendar Sync & Family Sharing
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          Export your complete wedding plan as an Apple/Google .ics calendar, a clean print-friendly PDF itinerary, or a WhatsApp-ready family summary.
        </p>

        {/* Action Buttons Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* ICS Calendar Export */}
          <GlassCard className="flex flex-col justify-between text-left border-border-subtle hover:border-accent-primary">
            <div>
              <div className="flex items-center gap-2 text-accent-primary font-semibold text-sm">
                <Calendar className="h-4 w-4" />
                <span>Calendar (.ICS)</span>
              </div>
              <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                Add all {timelinePlan.tasks.length} milestones, lead times, and reminder alarms to Google Calendar, Apple Calendar, or Outlook.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle">
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadIcs}
                className="w-full"
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                Download .ics File
              </Button>
            </div>
          </GlassCard>

          {/* Print / PDF View */}
          <GlassCard className="flex flex-col justify-between text-left border-border-subtle hover:border-accent-primary">
            <div>
              <div className="flex items-center gap-2 text-accent-secondary font-semibold text-sm">
                <Printer className="h-4 w-4" />
                <span>Printable Itinerary</span>
              </div>
              <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                Generates a clean black-and-white, ink-saving printable document formatted specifically for family meetings and venue binders.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrint}
                className="w-full"
                leftIcon={<FileText className="h-3.5 w-3.5" />}
              >
                Print / Save PDF
              </Button>
            </div>
          </GlassCard>

          {/* WhatsApp Direct Share */}
          <GlassCard className="flex flex-col justify-between text-left border-border-subtle hover:border-accent-primary">
            <div>
              <div className="flex items-center gap-2 text-status-ok font-semibold text-sm">
                <Share2 className="h-4 w-4" />
                <span>WhatsApp Summary</span>
              </div>
              <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                Pre-formatted WhatsApp message ready to broadcast to parents, in-laws, and the wedding coordination committee.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenWhatsApp}
                className="flex-1"
              >
                Open WhatsApp
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyWhatsApp}
                title="Copy to clipboard"
              >
                {isCopied ? <CheckCircle2 className="h-3.5 w-3.5 text-status-ok" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </GlassCard>
        </div>
      </GlassCard>

      {/* WhatsApp Message Preview Box */}
      <GlassCard className="space-y-3">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            WhatsApp Live Preview
          </span>
          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className="text-xs text-accent-primary hover:underline flex items-center gap-1"
          >
            {isCopied ? <CheckCircle2 className="h-3 w-3 text-status-ok" /> : <Copy className="h-3 w-3" />}
            {isCopied ? 'Copied to Clipboard' : 'Copy Text'}
          </button>
        </div>

        <pre className="whitespace-pre-wrap rounded-xl border border-border-subtle bg-bg-card p-4 font-mono text-xs text-text-secondary leading-relaxed select-all">
          {generateWhatsAppSummary()}
        </pre>
      </GlassCard>
    </div>
  );
};
