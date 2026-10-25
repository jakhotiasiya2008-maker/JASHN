import React from 'react';
import { usePlannerStore } from '../../lib/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';

export const TimelineTab: React.FC = () => {
  const { timelinePlan, toggleTimelineTask } = usePlannerStore();

  if (!timelinePlan) return null;

  const { tasks, isCompressedMode, daysRemaining, summary, riskWarnings } = timelinePlan;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="ok" size="sm">Completed</Badge>;
      case 'overdue':
        return <Badge variant="overdue" size="sm">Overdue Action</Badge>;
      case 'at_risk':
        return <Badge variant="risk" size="sm">Due Soon (At Risk)</Badge>;
      case 'ok':
      default:
        return <Badge variant="info" size="sm">On Track</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <GlassCard className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-border-highlight">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-accent-primary">
              Critical-Path Timeline Roadmap
            </h2>
            {isCompressedMode && (
              <Badge variant="risk" size="sm">
                <AlertTriangle className="mr-1 h-3 w-3 inline" />
                Compressed Schedule ({daysRemaining}d)
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            Backward-scheduled from your muhurat date. Tasks dynamically adapt lead times while preserving hard dependency order.
          </p>
        </div>

        {/* Counters */}
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 text-xs">
          <span className="rounded-lg border border-border-subtle bg-bg-card px-2.5 py-1 text-text-muted">
            Total: <strong className="text-text-primary">{summary.total}</strong>
          </span>
          <span className="rounded-lg border border-status-ok/30 bg-status-ok/10 px-2.5 py-1 text-status-ok">
            Completed: <strong>{summary.completed}</strong>
          </span>
          {summary.overdue > 0 && (
            <span className="rounded-lg border border-status-overdue/30 bg-status-overdue/10 px-2.5 py-1 text-status-overdue font-bold">
              Overdue: {summary.overdue}
            </span>
          )}
          <span className="rounded-lg border border-status-risk/30 bg-status-risk/10 px-2.5 py-1 text-status-risk">
            At-Risk: <strong>{summary.atRisk}</strong>
          </span>
        </div>
      </GlassCard>

      {/* Compressed Mode Warnings */}
      {riskWarnings.length > 0 && (
        <div className="space-y-3">
          {riskWarnings.map((warn) => (
            <div
              key={warn.id}
              className="flex items-start gap-3 rounded-xl border border-status-risk/40 bg-status-risk/10 p-4"
              role="alert"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-status-risk" />
              <div>
                <p className="font-semibold text-text-primary text-sm">{warn.message}</p>
                <p className="mt-1 text-xs text-text-secondary">
                  <span className="font-bold text-status-risk">Deterministic Fix: </span>
                  {warn.fixAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chronological Roadmap Items */}
      <div className="relative pl-6 sm:pl-8 before:absolute before:bottom-0 before:top-2 before:left-3 before:w-0.5 before:bg-border-primary/40">
        <div className="space-y-6">
          {tasks.map((task, idx) => {
            const isCompleted = task.completed;
            const isCritical = task.isCriticalPath;

            return (
              <div key={task.id} className="relative group">
                {/* Timeline node marker */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'border-status-ok bg-status-ok text-white'
                      : task.status === 'overdue'
                      ? 'border-status-overdue bg-status-overdue/20 text-status-overdue'
                      : task.status === 'at_risk'
                      ? 'border-status-risk bg-status-risk/20 text-status-risk'
                      : 'border-border-primary bg-bg-card text-accent-primary'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Card Container */}
                <GlassCard
                  className={`transition-all ${
                    isCompleted
                      ? 'opacity-70 border-border-subtle'
                      : isCritical
                      ? 'border-accent-primary/50 shadow-glow'
                      : 'border-border-subtle'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(task.status)}
                        {isCritical && (
                          <Badge variant="accent" size="sm">
                            <Sparkles className="mr-1 h-3 w-3 inline" /> Critical Path
                          </Badge>
                        )}
                        <span className="text-xs text-text-muted flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          Ideal: {task.idealWeeksBefore}w before
                          {isCompressedMode && ` (Compressed: ${task.compressedWeeksBefore}w)`}
                        </span>
                      </div>

                      <h3
                        className={`mt-2 font-serif text-lg font-bold ${
                          isCompleted ? 'line-through text-text-muted' : 'text-text-primary'
                        }`}
                      >
                        {task.title}
                      </h3>

                      <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                        {task.description}
                      </p>
                    </div>

                    {/* Completion Checkbox */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-border-subtle pt-2 sm:pt-0">
                      <div className="text-right">
                        <span className="text-xs text-text-muted">Target Due Date</span>
                        <p className="font-mono text-xs font-bold text-accent-primary">
                          {task.dueDate}
                        </p>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => toggleTimelineTask(task.id)}
                          className="h-4 w-4 rounded border-border-subtle accent-accent-primary focus:ring-accent-primary"
                        />
                        <span className="text-xs font-medium text-text-secondary">
                          {isCompleted ? 'Done' : 'Mark Completed'}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Action Tip */}
                  <div className="mt-3 rounded-lg border border-border-subtle bg-bg-card p-2.5 text-xs text-text-secondary">
                    <span className="font-semibold text-accent-primary">Pro Tip: </span>
                    {task.actionTip}
                  </div>

                  {/* Dependency Chain Display */}
                  {task.dependencies.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-text-muted">
                      <LinkIcon className="h-3 w-3 text-accent-primary" />
                      <span>Prerequisites: {task.dependencies.join(', ')}</span>
                    </div>
                  )}
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
