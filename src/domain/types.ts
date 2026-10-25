import {
  BudgetCategoryId,
  CityTier,
  WeddingFunction,
  WeddingVibe,
  UserPriority,
} from './constants';

export type {
  BudgetCategoryId,
  CityTier,
  WeddingFunction,
  WeddingVibe,
  UserPriority,
};

export interface WeddingIntake {
  coupleNames?: string;
  weddingDate: string; // YYYY-MM-DD
  cityTier: CityTier;
  cityName?: string;
  guestCount: number;
  totalBudgetINR: number;
  selectedFunctions: WeddingFunction[];
  vibe: WeddingVibe;
  priorities: UserPriority[];
  specialNotes?: string;
}

export interface CategoryAllocation {
  categoryId: BudgetCategoryId;
  label: string;
  allocatedAmountINR: number;
  percentage: number;
  isLocked: boolean;
  notes: string;
}

export interface BudgetPlan {
  totalBudgetINR: number;
  guestCount: number;
  perGuestCostINR: number;
  allocations: Record<BudgetCategoryId, CategoryAllocation>;
  contingencyINR: number;
  allocatedSumINR: number;
  remainingINR: number;
}

export type TaskStatus = 'ok' | 'at_risk' | 'overdue' | 'completed';

export interface TimelineTask {
  id: string;
  title: string;
  category: BudgetCategoryId;
  functionScope?: WeddingFunction;
  idealWeeksBefore: number;
  compressedWeeksBefore: number;
  dueDate: string; // ISO string YYYY-MM-DD
  dependencies: string[]; // Task IDs that must be completed first
  isCriticalPath: boolean;
  status: TaskStatus;
  completed: boolean;
  description: string;
  actionTip: string;
}

export interface TimelinePlan {
  weddingDate: string;
  daysRemaining: number;
  isCompressedMode: boolean;
  tasks: TimelineTask[];
  criticalPathTaskIds: string[];
  summary: {
    total: number;
    completed: number;
    overdue: number;
    atRisk: number;
    onTrack: number;
  };
  riskWarnings: Array<{
    id: string;
    level: 'high' | 'medium';
    message: string;
    fixAction: string;
  }>;
}

export type VendorStatus = 'to_contact' | 'contacted' | 'quoted' | 'booked';

export interface VendorItem {
  id: string;
  categoryId: BudgetCategoryId;
  title: string;
  vendorName?: string;
  status: VendorStatus;
  quotedAmountINR?: number;
  bookedAmountINR?: number;
  keyQuestions: string[];
  redFlags: string[];
  negotiationTips: string[];
  contactInfo?: string;
  notes?: string;
}

export interface VendorProgress {
  totalItems: number;
  bookedCount: number;
  quotedCount: number;
  toContactCount: number;
  percentBooked: number;
  totalQuotedINR: number;
  totalBookedINR: number;
}
