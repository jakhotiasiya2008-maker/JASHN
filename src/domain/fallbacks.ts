/**
 * Jashn Deterministic AI Fallbacks
 * Generates culturally authentic, rich personalization templates when LLM calls
 * are offline, rate-limited, fail validation, or when no API key is supplied.
 */

import { WeddingFunction, WeddingVibe } from './constants';
import {
  ValidatedPersonalizedIdeas,
  ValidatedPlanBResponse,
  ValidatedTradeoffExplanation,
} from './schemas';

/**
 * Deterministic fallback for personalized theme, decor, menu, and entertainment.
 */
export function generateFallbackIdeas(
  vibe: WeddingVibe,
  budgetINR: number,
  guestCount: number,
  _selectedFunctions: WeddingFunction[]
): ValidatedPersonalizedIdeas {
  const perPlateEstimate = Math.round((budgetINR * 0.26) / Math.max(1, guestCount));

  switch (vibe) {
    case 'royal_heritage':
      return {
        themeTitle: 'Rajputana Shahi Utsav & Antique Gold',
        palette: ['Deep Royal Crimson', 'Antique Gold', 'Emerald Green', 'Warm Ivory'],
        decorConcepts: [
          'Carved jharokha backdrops draped in marigold and velvet curtains.',
          'Grand entryway lined with brass urli bowls floating lotus flowers and scented tea lights.',
          'Regal royal court mandap illuminated with warm amber fairy lights and copper lanterns.',
          'Vintage brass centerpieces holding tuberoses and hand-tied jasmine tassels.',
        ],
        signatureMenu: [
          `Royal Awadhi Dum Biryani with slow-cooked saffron aroma (est. ₹${perPlateEstimate}/plate).`,
          'Dal Bukhara simmered overnight with artisanal Amritsari kulchas.',
          'Live Chaat Bazaar: Banarasi Tamatar Chaat and crisp Palak Patta Chaat.',
          'Warm Shahi Tukda topped with condensed rabri and pistachio slivers.',
        ],
        entertainmentIdeas: [
          'Authentic Rajasthani Manganiyar folk ensemble to welcome the Baraat.',
          'Classical Shehnai and Sitar jugalbandi welcoming guests at the entryway.',
          'Grand Royal entry on a vintage carriage or floral royal palki.',
        ],
        budgetSavingTips: [
          'Source marigolds from local wholesale mandis rather than imported flowers.',
          'Repurpose daytime Haldi brass vessels and fabric drapes for the evening Sangeet.',
          'Negotiate composite banquet lighting instead of bringing outside trussing.',
        ],
      };

    case 'pastel_modern':
      return {
        themeTitle: 'Blushing Peony & Tuscan Garden Elegance',
        palette: ['Dusty Rose', 'Sage Leaf Green', 'Champagne Cream', 'Powder Blue'],
        decorConcepts: [
          'Organic floral archways woven with eucalyptus, baby’s breath, and blush carnations.',
          'Chic glass photo booth with neon calligraphy ("Better Together") framed in florals.',
          'Transparent acrylic chiavari chairs paired with soft ivory linen runners.',
          'Open-air fairy-light canopies creating a starlit dinner atmosphere.',
        ],
        signatureMenu: [
          'Artisanal Wood-fired Neapolitan Pizzas with exotic truffle oil drizzle.',
          'Live Mezze & Burrata Bar featuring warm pita and pomegranate tabbouleh.',
          'Indo-Western fusion: Paneer Lababdar sliders and mini truffle samosas.',
          'Pistachio Rose Tres Leches and live Gelato cart with Belgian waffle cones.',
        ],
        entertainmentIdeas: [
          'Acoustic indie live band performing unplugged Bollywood and pop romantic ballads.',
          'Interactive polaroid guestbook booth where guests peg handwritten wishes.',
          'Sunset cocktail acoustic session accompanied by a saxophone soloist.',
        ],
        budgetSavingTips: [
          'Use local white seasonal carnations and gypsophila instead of imported hydrangeas.',
          'Opt for high-resolution digital QR code menus instead of embossed printed paper cards.',
          'Bundle your pre-wedding couple photoshoot with the wedding day cinematography.',
        ],
      };

    case 'bollywood_extravaganza':
      return {
        themeTitle: 'Bollywood Starry Night & Neon Glamour',
        palette: ['Midnight Navy', 'Electric Magenta', 'Champagne Shimmer', 'Cosmic Violet'],
        decorConcepts: [
          'Illuminated LED tunnel red carpet entrance with paparazzi-style photo ops.',
          'Dynamic multi-tiered concert stage with pixel-mapped LED backdrops.',
          'Mirror-work mosaic tables reflecting crystal chandeliers and beam spotlights.',
          'Sangeet bar featuring bespoke neon cocktail signage and flair bartenders.',
        ],
        signatureMenu: [
          'Live Amritsari Chole Kulche counter with house-made pickled ginger and chillies.',
          'Barbecue skewers station: Smoky Paneer Tikka, Malai Chaap, and Dahi Ke Kebab.',
          'Late-night munchies corner: Mumbai Pav Bhaji and mini cheese grilled sandwiches.',
          'Sizzling Brownie sundaes with liquid nitrogen ice cream live station.',
        ],
        entertainmentIdeas: [
          'Celebrity DJ set with synchronised cold-pyro sparklers during key dance hook steps.',
          'Professional dance troupe opening act to introduce the bride and groom.',
          'LED Dhol performance synchronised with the bass drop during the Baraat climax.',
        ],
        budgetSavingTips: [
          'Check if the venue’s built-in sound system supports DJ line arrays before renting outside.',
          'Use intelligent LED moving heads rather than expensive floral ceilings.',
          'Choreograph family performances with online tutorials to save choreography fees.',
        ],
      };

    case 'minimalist_traditional':
    default:
      return {
        themeTitle: 'Vedic Serenity & Jasmine Simplicity',
        palette: ['Pearl Ivory', 'Raw Silk Gold', 'Temple Sandalwood', 'Fresh Mogra White'],
        decorConcepts: [
          'Hand-strung fresh Mogra and Rajnigandha curtains filling the venue with sacred fragrance.',
          'Brass diya towers with floating lotus flowers and traditional rangoli art.',
          'Unvarnished teakwood mandap draped in unbleached kora cotton and banana leaves.',
          'Handmade seed-paper place cards welcoming guests with auspicious Sanskrit shlokas.',
        ],
        signatureMenu: [
          'Traditional Sattvic Feast served on banana leaves or copper thalis.',
          'South Indian live filter coffee and fresh tender coconut water stations.',
          'Regional specialities: Bisi Bele Bath, delicate Appams with coconut stew.',
          'Elaneer Payasam (tender coconut pudding) and hot Jalebis with Rabri.',
        ],
        entertainmentIdeas: [
          'Live Carnatic or Hindustani instrumental flute and Santoor recital during rituals.',
          'Sacred Vedic chanting choir explaining the spiritual meaning of the Saptapadi vows.',
          'Traditional Mehndi folk singers with dholak and spoons.',
        ],
        budgetSavingTips: [
          'Work directly with local flower farmers at sunrise markets for fresh mogra.',
          'Host daytime ceremonies in naturally sunlit open courtyards to reduce lighting expenses.',
          'Offer sustainable brass or clay diya souvenirs that support local artisans.',
        ],
      };
  }
}

/**
 * Deterministic fallback for Plan B emergency recovery.
 */
export function generateFallbackPlanB(
  scenario: string,
  budgetINR: number,
  guestCount: number
): ValidatedPlanBResponse {
  const sLower = scenario.toLowerCase();

  if (sLower.includes('rain') || sLower.includes('weather') || sLower.includes('storm')) {
    return {
      scenario,
      riskLevel: 'critical',
      immediateActions: [
        'Notify the venue manager immediately to initiate the waterproof German hangar tent or indoor backup hall.',
        'Relocate all electrical audio cables, sound consoles, and food buffet chafers under covered shelter.',
        'Instruct the decorator to secure high floral arches and mandap canopies with sandbag counterweights.',
      ],
      next24Hours: [
        'Install waterproof vinyl flooring or carpets over wet lawn walkways to prevent slipping.',
        'Procure 50-100 large guest golf umbrellas in unified wedding colors for the arrival walkway.',
        'Send an urgent WhatsApp update to guests confirming indoor valet drop-off instructions.',
      ],
      budgetImpactEstimate: `Estimated ₹40,000 - ₹90,000 for emergency marquee tenting and waterproof matting (absorbed from the ₹${Math.round(budgetINR * 0.1).toLocaleString('en-IN')} contingency cushion).`,
      vendorCommunicationScript: `Urgent Weather Plan Activation: Dear Venue & Decor Team, due to weather alerts for our wedding, we are formally triggering our indoor backup protocol per our contract. Please shift the mandap and buffet stations to the indoor banquet hall immediately. Confirm receipt by return call.`,
    };
  }

  if (sLower.includes('guest') || sLower.includes('headcount') || sLower.includes('surge') || sLower.includes('jump')) {
    const extraGuests = Math.round(guestCount * 0.2);
    return {
      scenario,
      riskLevel: 'medium',
      immediateActions: [
        `Call head caterer immediately to authorize an additional ${extraGuests}-plate buffer using ready-reserve pantry items.`,
        'Instruct venue banquets team to bring out 10 spare round tables and 50 extra cushioned chairs.',
        'Direct valet team to open peripheral overflow parking gates.',
      ],
      next24Hours: [
        'Add one extra live pasta or chaat counter to diffuse main buffet line bottlenecks.',
        'Notify the bar team to restock mineral water cartons, soft beverages, and glassware.',
        'Confirm sufficient return gifts and sweet boxes with the family logistics coordinator.',
      ],
      budgetImpactEstimate: `Estimated ₹50,000 - ₹1,20,000 for additional plates at contracted standard per-plate rate without rush surcharge penalties.`,
      vendorCommunicationScript: `Headcount Adjustment Notice: Dear Catering Team, our confirmed RSVP count has increased by approximately ${extraGuests} guests. Please activate the 15% kitchen reserve buffer. We will settle the additional plates at our agreed contractual rate at tonight's reconciliation.`,
    };
  }

  // Default vendor cancellation or unexpected contingency
  return {
    scenario,
    riskLevel: 'critical',
    immediateActions: [
      'Trigger the pre-screened backup vendor roster from our local coordinator database.',
      'Freeze advance payments on the defaulting vendor until contractual remedies are resolved.',
      'Assign two designated family members to handle new vendor briefing without causing panic.',
    ],
    next24Hours: [
      'Execute an expedited emergency agreement with the verified replacement supplier.',
      'Transfer deposit funds via immediate RTGS/IMPS directly from the wedding contingency reserve.',
      'Conduct a 15-minute briefing phone call ensuring all critical event timings align.',
    ],
    budgetImpactEstimate: `Estimated ₹25,000 - ₹60,000 rush adjustment premium; well within the designated 10% contingency reserve.`,
    vendorCommunicationScript: `Priority Replacement Request: Hello, we require expedited replacement booking for our upcoming wedding celebration. We are ready to execute contract and release 50% advance deposit immediately. Please confirm availability for immediate consultation.`,
  };
}

/**
 * Deterministic fallback for What-If slider trade-offs.
 */
export function generateFallbackTradeoff(
  budgetDelta: number,
  guestDelta: number,
  newBudgetINR: number,
  newGuestCount: number
): ValidatedTradeoffExplanation {
  const newPerGuest = Math.round(newBudgetINR / newGuestCount);

  if (guestDelta > 0 && budgetDelta <= 0) {
    return {
      summary: `Adding ${guestDelta} guests without increasing budget drops per-guest spend to ₹${newPerGuest.toLocaleString('en-IN')}.`,
      pros: ['More loved ones and distant relatives can celebrate together without feeling left out.'],
      cons: [
        'Catering and seating capacity will stretch your venue limits.',
        'Per-plate culinary budget will need to trim live exotic counters.',
      ],
      recommendations: [
        'Shift from plated formal dining to an expansive multi-counter buffet.',
        'Order local seasonal blooms to preserve dining budget without sacrificing aesthetics.',
      ],
    };
  }

  if (budgetDelta > 0) {
    return {
      summary: `Increasing budget by ₹${Math.abs(budgetDelta).toLocaleString('en-IN')} gives you ₹${newPerGuest.toLocaleString('en-IN')}/guest, expanding your creative scope.`,
      pros: [
        'Unlocks top-tier candid cinematography and drone footage.',
        'Allows premium designer floral mandap installations and luxury live counters.',
      ],
      cons: ['Requires strict vendor milestone monitoring to avoid lifestyle creep.'],
      recommendations: [
        'Direct 50% of the additional funds to photography and memorable guest hospitality.',
        'Keep the 10% contingency cushion intact for last-minute emergencies.',
      ],
    };
  }

  return {
    summary: `Adjusted plan: ₹${newBudgetINR.toLocaleString('en-IN')} total across ${newGuestCount} guests (₹${newPerGuest.toLocaleString('en-IN')} per attendee).`,
    pros: ['Budget rebalances proportionally while preserving the 10% safety cushion.'],
    cons: ['Requires vendor contracts to be negotiated firmly around minimum guarantees.'],
    recommendations: [
      'Lock in key venue and catering contracts first before allocating optional decor flourishes.',
    ],
  };
}
