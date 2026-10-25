import { describe, it, expect } from 'vitest';
import {
  createDefaultVendorChecklist,
  computeVendorProgress,
  VENDOR_TEMPLATES,
} from '../../src/domain/vendors';
import { VendorItem } from '../../src/domain/types';

describe('Vendor Engine - Pure Domain Logic', () => {
  it('creates comprehensive vendor checklist covering major categories', () => {
    const list = createDefaultVendorChecklist();
    expect(list.length).toBe(VENDOR_TEMPLATES.length);
    expect(list.some((v) => v.categoryId === 'venue')).toBe(true);
    expect(list.some((v) => v.categoryId === 'catering')).toBe(true);
    expect(list.some((v) => v.categoryId === 'photography')).toBe(true);

    for (const item of list) {
      expect(item.keyQuestions.length).toBeGreaterThan(0);
      expect(item.redFlags.length).toBeGreaterThan(0);
      expect(item.negotiationTips.length).toBeGreaterThan(0);
      expect(item.status).toBe('to_contact');
    }
  });

  it('calculates vendor progress metrics and percentage accurately', () => {
    const mockVendors: VendorItem[] = [
      {
        id: 'v1',
        categoryId: 'venue',
        title: 'Banquet Hall',
        status: 'booked',
        bookedAmountINR: 500000,
        keyQuestions: [],
        redFlags: [],
        negotiationTips: [],
      },
      {
        id: 'v2',
        categoryId: 'catering',
        title: 'Caterer',
        status: 'quoted',
        quotedAmountINR: 400000,
        keyQuestions: [],
        redFlags: [],
        negotiationTips: [],
      },
      {
        id: 'v3',
        categoryId: 'photography',
        title: 'Photographer',
        status: 'to_contact',
        keyQuestions: [],
        redFlags: [],
        negotiationTips: [],
      },
      {
        id: 'v4',
        categoryId: 'decor',
        title: 'Decorator',
        status: 'to_contact',
        keyQuestions: [],
        redFlags: [],
        negotiationTips: [],
      },
    ];

    const progress = computeVendorProgress(mockVendors);
    expect(progress.totalItems).toBe(4);
    expect(progress.bookedCount).toBe(1);
    expect(progress.quotedCount).toBe(1);
    expect(progress.toContactCount).toBe(2);
    expect(progress.percentBooked).toBe(25); // 1 out of 4 = 25%
    expect(progress.totalBookedINR).toBe(500000);
    expect(progress.totalQuotedINR).toBe(400000);
  });
});
