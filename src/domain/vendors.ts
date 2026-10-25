/**
 * Jashn Vendor Engine (Pure Functions)
 * Deterministic vendor checklists, negotiation tactics, Indian wedding red flags,
 * and budget tracking calculations.
 */

import { BudgetCategoryId } from './constants';
import { VendorItem, VendorProgress } from './types';

export interface VendorTemplate {
  categoryId: BudgetCategoryId;
  title: string;
  keyQuestions: string[];
  redFlags: string[];
  negotiationTips: string[];
}

export const VENDOR_TEMPLATES: VendorTemplate[] = [
  {
    categoryId: 'venue',
    title: 'Banquet Hall / Lawn Venue Manager',
    keyQuestions: [
      'What is the sound curfew limit (is outdoor DJ allowed post 10 PM)?',
      'Is 100% DG generator power backup included, or is diesel billed extra?',
      'Are outside decorators or caterers allowed with an entry fee, or is there a mandatory empanelled list?',
      'What is the refund policy if rain or municipal guidelines force changes?',
    ],
    redFlags: [
      'Refusal to provide a signed contract with overtime hourly rates.',
      'Hidden electricity/AC per-hour utility surcharges not quoted upfront.',
      'Overbooking double slots on the same muhurat day without 4-hour buffers.',
    ],
    negotiationTips: [
      'Ask for complimentary bridal and groom green rooms.',
      'Request complimentary basic stage lighting and round tables with covers.',
      'Negotiate waiving the royalty fee for bringing an external mehendi or choreo team.',
    ],
  },
  {
    categoryId: 'catering',
    title: 'Wedding Master Caterer',
    keyQuestions: [
      'What is the exact ratio of live food counters to buffet chafing stations?',
      'How many waiters per 50 guests will be deployed on the floor?',
      'Is bottled mineral water, ice cubes, and food tasting session included in the per-plate cost?',
      'What is the policy on leftover unconsumed food (can it be packed for charity/family)?',
    ],
    redFlags: [
      'Reluctance to schedule an in-person live food tasting prior to contract signing.',
      'Vague answers about source of cooking oils and dairy (ghee/paneer purity).',
      'No dedicated staff for VIP elder tables.',
    ],
    negotiationTips: [
      'Exchange slow-moving dessert varieties for an extra live chaat or pasta counter at no extra cost.',
      'Offer early milestone payments in exchange for a 5-7% discount on total food bill.',
      'Cap the guest buffer at 5% overcount rather than the standard 10% penalty rate.',
    ],
  },
  {
    categoryId: 'decor',
    title: 'Floral & Mandap Decorator',
    keyQuestions: [
      'Are flowers 100% fresh, or is there a blend of artificial and natural blooms?',
      'Can you share 3D CAD renders or actual photos of the mandap you plan to erect?',
      'At what time will the decor team get handover for setup?',
    ],
    redFlags: [
      'Showing Pinterest moodboards without proving past execution photos in the same venue.',
      'Lack of fireproof safety certification for mandap drapery and halogen lights.',
    ],
    negotiationTips: [
      'Opt for local marigolds, tuberoses, and mogra over imported orchids and hydrangeas to save 40%.',
      'Reuse morning Haldi marigold backdrops for evening Mehendi photo booths with lighting tweaks.',
    ],
  },
  {
    categoryId: 'photography',
    title: 'Candid Photographer & Cinematographer',
    keyQuestions: [
      'Who will personally shoot the wedding—the lead artist or junior assistants?',
      'What is the turnaround time for the 3-minute teaser, 30-minute film, and raw photos?',
      'Is drone photography permitted at the venue and included in the package?',
    ],
    redFlags: [
      'Lead photographer refusing to commit their presence in the written agreement.',
      'Delivery timeline exceeding 90 days post-wedding.',
    ],
    negotiationTips: [
      'Bundle pre-wedding shoot and wedding coverage into one package for a 15% discount.',
      'Ask for complimentary photo album copies for both sets of parents.',
    ],
  },
  {
    categoryId: 'attire',
    title: 'Bridal Couture & Groom Stylist',
    keyQuestions: [
      'How many trials and fittings are included before the final delivery?',
      'What is the guaranteed delivery date (should be at least 15 days before the first event)?',
      'Are blouse alterations, dupatta tassels, and cancan layering included?',
    ],
    redFlags: [
      'Promising delivery 48 hours before the event (leaves zero room for fit corrections).',
      'No fabric swatch guarantee for groom-bride color coordination.',
    ],
    negotiationTips: [
      'Shop during off-season trunk shows or explore premium rental services for heavy sherwanis.',
      'Ask for complimentary pocket squares, matching safas, or latkans with the outfit.',
    ],
  },
  {
    categoryId: 'music_entertainment',
    title: 'Sangeet DJ, Sound & Dhol Artists',
    keyQuestions: [
      'What audio rig will you supply (JBL line array, subwoofers, wireless mics)?',
      'Do you have a backup laptop and audio mixer on site?',
      'Will you customize the playlist according to family age groups (retro vs modern EDM)?',
    ],
    redFlags: [
      'DJ who does not know regional folk music (Bhangra, Garba, Marwari ghoomar) when requested.',
      'No contract specifying exact call times and performance duration.',
    ],
    negotiationTips: [
      'Book the sound equipment through the venue if discounted, and hire the DJ purely for talent.',
      'Bundle dhol players for the Baraat entry and Sangeet night together.',
    ],
  },
  {
    categoryId: 'invitations',
    title: 'Wedding Stationery & Luxury Gifting',
    keyQuestions: [
      'What is the print proof turnaround time before mass printing?',
      'Are digital WhatsApp motion video invites included with the physical order?',
      'What is the shelf life of mithai/dry fruit boxes during distribution?',
    ],
    redFlags: [
      'Grammatical or muhurat time errors in final proofs without complimentary reprints.',
      'Fragile packaging that breaks during postal courier.',
    ],
    negotiationTips: [
      'Order 70% digital invites and reserve boxed luxury invites strictly for close family elders.',
      'Purchase vacuum-packed artisanal sweets directly from wholesale sweet makers.',
    ],
  },
  {
    categoryId: 'travel_stay',
    title: 'Guest Hotel & Logistics Fleet',
    keyQuestions: [
      'Is early check-in and late checkout guaranteed for outstation guests?',
      'Are breakfasts included in the group room rate?',
      'Are dedicated driver coordinators assigned for airport and railway transfers?',
    ],
    redFlags: [
      'Hotels scattered far from the wedding venue leading to transit delays.',
      'Surprise luggage or parking fees added to the master folio.',
    ],
    negotiationTips: [
      'Book room blocks 5-6 months early to lock corporate discount tariffs.',
      'Charter 18-seater Tempo Travellers instead of individual sedans for large family groups.',
    ],
  },
  {
    categoryId: 'rituals',
    title: 'Family Priest / Pandit & Samagri Supplier',
    keyQuestions: [
      'What are the exact auspicious muhurat windows for Varmala and Pheras?',
      'Will the pandit explain the sacred Sanskrit vows in Hindi/English for the younger generation?',
      'Do you provide the havan kund, mango wood, and brass lamps or should we source them?',
    ],
    redFlags: [
      'Pandit who arrives late or rushes rituals due to overlapping bookings.',
      'Failure to supply an itemized samagri checklist in advance.',
    ],
    negotiationTips: [
      'Buy puja samagri in wholesale packs from local traditional bazaars.',
      'Agree upon the complete dakshina upfront in writing with family consensus.',
    ],
  },
];

/**
 * Initializes default vendor checklist items.
 */
export function createDefaultVendorChecklist(): VendorItem[] {
  return VENDOR_TEMPLATES.map((tmpl, idx) => ({
    id: `vendor_${tmpl.categoryId}_${idx}`,
    categoryId: tmpl.categoryId,
    title: tmpl.title,
    status: 'to_contact',
    keyQuestions: tmpl.keyQuestions,
    redFlags: tmpl.redFlags,
    negotiationTips: tmpl.negotiationTips,
  }));
}

/**
 * Calculates vendor completion and budget metrics.
 */
export function computeVendorProgress(vendors: VendorItem[]): VendorProgress {
  const totalItems = vendors.length;
  let bookedCount = 0;
  let quotedCount = 0;
  let toContactCount = 0;
  let totalQuotedINR = 0;
  let totalBookedINR = 0;

  for (const v of vendors) {
    if (v.status === 'booked') {
      bookedCount++;
      totalBookedINR += v.bookedAmountINR || v.quotedAmountINR || 0;
    } else if (v.status === 'quoted') {
      quotedCount++;
      totalQuotedINR += v.quotedAmountINR || 0;
    } else {
      toContactCount++;
    }
  }

  const percentBooked = totalItems > 0 ? Math.round((bookedCount / totalItems) * 100) : 0;

  return {
    totalItems,
    bookedCount,
    quotedCount,
    toContactCount,
    percentBooked,
    totalQuotedINR,
    totalBookedINR,
  };
}
