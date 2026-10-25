/**
 * Jashn Demo Walkthrough Fixtures
 * Seeded data used exclusively by the demo script.
 * Configures a realistic 350-guest Jaipur royal wedding ~5 months out.
 */

export interface DemoFixture {
  coupleNames: string;
  weddingDate: string; // YYYY-MM-DD
  daysOut: number;
  cityTier: 'tier_2';
  cityName: string;
  guestCount: number;
  totalBudgetINR: number;
  selectedFunctions: Array<'mehendi' | 'sangeet' | 'wedding' | 'reception'>;
  vibe: 'royal_heritage';
  priorities: Array<'grand_venue' | 'culinary_feast' | 'cinematic_photography'>;
  specialNotes: string;
  whatIfTargetBudgetINR: number;
}

export function createDemoFixture(): DemoFixture {
  const today = new Date();
  // Set date 145 days out (~4.8 months)
  const targetDate = new Date(today.getTime() + 145 * 24 * 60 * 60 * 1000);
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const weddingDate = `${year}-${month}-${day}`;

  return {
    coupleNames: 'Aarav & Simran',
    weddingDate,
    daysOut: 145,
    cityTier: 'tier_2',
    cityName: 'Jaipur, Rajasthan',
    guestCount: 350,
    totalBudgetINR: 2500000,
    selectedFunctions: ['mehendi', 'sangeet', 'wedding', 'reception'],
    vibe: 'royal_heritage',
    priorities: ['grand_venue', 'culinary_feast', 'cinematic_photography'],
    specialNotes: 'Grand heritage haveli setup; family desires authentic Rajasthani folk artists and Awadhi feast.',
    whatIfTargetBudgetINR: 3000000,
  };
}
