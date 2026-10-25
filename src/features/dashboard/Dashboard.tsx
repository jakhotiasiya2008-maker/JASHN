import React from 'react';
import { usePlannerStore, PlannerTab } from '../../lib/store';
import { DashboardHeader } from './DashboardHeader';
import { OverviewTab } from './OverviewTab';
import { BudgetTab } from '../budget/BudgetTab';
import { TimelineTab } from '../timeline/TimelineTab';
import { VendorsTab } from '../vendors/VendorsTab';
import { IdeasTab } from '../ideas/IdeasTab';
import { PlanBTab } from '../planb/PlanBTab';
import { ExportTab } from '../export/ExportTab';
import { Tabs, TabItem } from '../../components/ui/Tabs';
import {
  LayoutDashboard,
  PieChart,
  CalendarDays,
  Store,
  Sparkles,
  ShieldAlert,
  Share2,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentTab, setCurrentTab, timelinePlan, vendorItems } = usePlannerStore();

  const overdueCount = timelinePlan?.summary.overdue || 0;
  const toContactCount = vendorItems.filter((v) => v.status === 'to_contact').length;

  const tabItems: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: 'budget',
      label: 'Budget Engine',
      icon: <PieChart className="h-4 w-4" />,
    },
    {
      id: 'timeline',
      label: 'Timeline & Milestones',
      icon: <CalendarDays className="h-4 w-4" />,
      badge: overdueCount > 0 ? overdueCount : undefined,
    },
    {
      id: 'vendors',
      label: 'Vendors & Checklist',
      icon: <Store className="h-4 w-4" />,
      badge: toContactCount > 0 ? toContactCount : undefined,
    },
    {
      id: 'ideas',
      label: 'Personalized Ideas',
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      id: 'planb',
      label: 'Plan B Recovery',
      icon: <ShieldAlert className="h-4 w-4" />,
    },
    {
      id: 'export',
      label: 'Export & Share',
      icon: <Share2 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      {/* Header Banner */}
      <DashboardHeader />

      {/* Accessible Tabs Navigation */}
      <Tabs
        items={tabItems}
        activeTab={currentTab}
        onChange={(id) => setCurrentTab(id as PlannerTab)}
      />

      {/* Tab Panels */}
      <main id="main-content" role="main" tabIndex={-1} className="focus:outline-none">
        <div
          role="tabpanel"
          id={`tabpanel-${currentTab}`}
          aria-labelledby={`tab-${currentTab}`}
        >
          {currentTab === 'overview' && <OverviewTab />}
          {currentTab === 'budget' && <BudgetTab />}
          {currentTab === 'timeline' && <TimelineTab />}
          {currentTab === 'vendors' && <VendorsTab />}
          {currentTab === 'ideas' && <IdeasTab />}
          {currentTab === 'planb' && <PlanBTab />}
          {currentTab === 'export' && <ExportTab />}
        </div>
      </main>
    </div>
  );
};
