/**
 * Jashn Domain Constants
 * Eliminates all magic numbers across budget, timeline, and vendor calculations.
 */

export const BUDGET_CONSTANTS = {
  MIN_BUDGET_INR: 200_000, // 2 Lakhs
  MAX_BUDGET_INR: 100_000_000, // 10 Crores
  DEFAULT_BUDGET_INR: 2_500_000, // 25 Lakhs
  DEFAULT_CONTINGENCY_PERCENT: 10,
  MIN_GUEST_COUNT: 20,
  MAX_GUEST_COUNT: 5000,
  DEFAULT_GUEST_COUNT: 300,
} as const;

export const CATEGORY_IDS = [
  'venue',
  'catering',
  'decor',
  'photography',
  'attire',
  'music_entertainment',
  'invitations',
  'travel_stay',
  'rituals',
  'contingency',
] as const;

export type BudgetCategoryId = (typeof CATEGORY_IDS)[number];

export const CATEGORY_LABELS: Record<BudgetCategoryId, string> = {
  venue: 'Venue & Banquet',
  catering: 'Catering & Food Service',
  decor: 'Decor & Florals',
  photography: 'Photography & Videography',
  attire: 'Bridal & Groom Attire & Styling',
  music_entertainment: 'Music, DJ & Entertainment',
  invitations: 'Invitations & Gifting',
  travel_stay: 'Guest Accommodation & Logistics',
  rituals: 'Pooja, Pandit & Samagri',
  contingency: 'Safety Cushion & Contingency',
};

export const BASE_CATEGORY_WEIGHTS: Record<BudgetCategoryId, number> = {
  venue: 24,
  catering: 26,
  decor: 13,
  photography: 9,
  attire: 8,
  music_entertainment: 4,
  invitations: 2,
  travel_stay: 3,
  rituals: 1,
  contingency: 10, // 10% base contingency
};

export const CITY_TIERS = ['tier_1', 'tier_2', 'tier_3', 'destination'] as const;
export type CityTier = (typeof CITY_TIERS)[number];

export const CITY_TIER_LABELS: Record<CityTier, string> = {
  tier_1: 'Tier 1 Metro (Mumbai, Delhi NCR, Bengaluru, etc.)',
  tier_2: 'Tier 2 City (Jaipur, Lucknow, Chandigarh, etc.)',
  tier_3: 'Tier 3 / Hometown',
  destination: 'Destination Wedding (Udaipur, Goa, Jim Corbett)',
};

export const WEDDING_FUNCTIONS = [
  'haldi',
  'mehendi',
  'sangeet',
  'wedding',
  'reception',
] as const;
export type WeddingFunction = (typeof WEDDING_FUNCTIONS)[number];

export const WEDDING_FUNCTION_LABELS: Record<WeddingFunction, string> = {
  haldi: 'Haldi Ceremony',
  mehendi: 'Mehendi & Henna Evening',
  sangeet: 'Sangeet & Cocktail Night',
  wedding: 'Main Wedding / Pheras',
  reception: 'Grand Reception',
};

export const WEDDING_VIBES = [
  'royal_heritage',
  'pastel_modern',
  'bollywood_extravaganza',
  'minimalist_traditional',
] as const;
export type WeddingVibe = (typeof WEDDING_VIBES)[number];

export const WEDDING_VIBE_LABELS: Record<WeddingVibe, { title: string; desc: string; defaultTheme: string }> = {
  royal_heritage: {
    title: 'Royal Heritage & Regal Grandeur',
    desc: 'Majestic palaces, deep gold hues, opulent marigolds, and classical shehnai echoes.',
    defaultTheme: 'royal-gold',
  },
  pastel_modern: {
    title: 'Modern Pastel Romance',
    desc: 'Soft blush tones, fragrant baby’s breath, fairy lights, and contemporary acoustic melodies.',
    defaultTheme: 'pastel-floral',
  },
  bollywood_extravaganza: {
    title: 'Bollywood Glam & Sangeet Spectacle',
    desc: 'High-energy dance floors, neon lasers, dramatic LED backdrops, and vibrant celebrations.',
    defaultTheme: 'midnight-sangeet',
  },
  minimalist_traditional: {
    title: 'Minimalist Vedic Elegance',
    desc: 'Subtle ivory linens, sacred Vedic shlokas, fragrant mogra florals, and serene intimacy.',
    defaultTheme: 'ivory-minimal',
  },
};

export const USER_PRIORITIES = [
  'grand_venue',
  'culinary_feast',
  'dream_decor',
  'cinematic_photography',
  'couture_fashion',
  'rocking_sangeet',
] as const;
export type UserPriority = (typeof USER_PRIORITIES)[number];

export const USER_PRIORITY_LABELS: Record<UserPriority, string> = {
  grand_venue: 'Luxury Venue & Location',
  culinary_feast: 'Gourmet Food & Royal Spread',
  dream_decor: 'Bespoke Floral & Lighting Decor',
  cinematic_photography: 'Editorial & Cinematic Photo/Video',
  couture_fashion: 'Designer Bridal & Groom Outfits',
  rocking_sangeet: 'High-Energy DJ & Entertainment',
};

export const TIMELINE_CONSTANTS = {
  COMPRESSED_THRESHOLD_DAYS: 90,
  CRITICAL_THRESHOLD_DAYS: 45,
  AT_RISK_BUFFER_DAYS: 14,
} as const;

export const CURRENT_STORAGE_VERSION = 1;
