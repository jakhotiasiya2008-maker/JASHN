/**
 * Jashn API Client
 * Manages serverless communication with request deduplication, sessionStorage caching,
 * AbortController support, and offline deterministic fallback.
 */

import {
  ValidatedPersonalizedIdeas,
  ValidatedPlanBResponse,
  ValidatedTradeoffExplanation,
} from '../domain/schemas';
import {
  generateFallbackIdeas,
  generateFallbackPlanB,
  generateFallbackTradeoff,
} from '../domain/fallbacks';
import { WeddingFunction, WeddingVibe } from '../domain/constants';

function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `jashn_cache_${Math.abs(hash)}`;
}

function getFromSessionCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = sessionStorage.getItem(key);
    return cached ? (JSON.parse(cached) as T) : null;
  } catch {
    return null;
  }
}

function setToSessionCache(key: string, data: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {
    // sessionStorage quota exceeded, silent ignore
  }
}

export async function fetchPersonalizedIdeas(
  params: {
    vibe: WeddingVibe;
    budgetINR: number;
    guestCount: number;
    selectedFunctions: WeddingFunction[];
  },
  signal?: AbortSignal
): Promise<{ data: ValidatedPersonalizedIdeas; fallback: boolean }> {
  const cacheKey = generateHash(`ideas_${params.vibe}_${params.budgetINR}_${params.guestCount}_${params.selectedFunctions.sort().join(',')}`);
  const cached = getFromSessionCache<{ data: ValidatedPersonalizedIdeas; fallback: boolean }>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });

    if (res.ok) {
      const json = await res.json();
      setToSessionCache(cacheKey, json);
      return json;
    }
  } catch (_err) {
    // Offline, aborted, or server error
  }

  // Graceful deterministic fallback
  const fallback = {
    data: generateFallbackIdeas(params.vibe, params.budgetINR, params.guestCount, params.selectedFunctions),
    fallback: true,
  };
  setToSessionCache(cacheKey, fallback);
  return fallback;
}

export async function fetchPlanBRecovery(
  params: {
    scenario: string;
    budgetINR: number;
    guestCount: number;
  },
  signal?: AbortSignal
): Promise<{ data: ValidatedPlanBResponse; fallback: boolean }> {
  const cacheKey = generateHash(`planb_${params.scenario}_${params.budgetINR}_${params.guestCount}`);
  const cached = getFromSessionCache<{ data: ValidatedPlanBResponse; fallback: boolean }>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch('/api/planb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });

    if (res.ok) {
      const json = await res.json();
      setToSessionCache(cacheKey, json);
      return json;
    }
  } catch (_err) {
    // Fallback on failure
  }

  const fallback = {
    data: generateFallbackPlanB(params.scenario, params.budgetINR, params.guestCount),
    fallback: true,
  };
  setToSessionCache(cacheKey, fallback);
  return fallback;
}

export async function fetchTradeoffExplanation(
  params: {
    budgetDelta: number;
    guestDelta: number;
    newBudgetINR: number;
    newGuestCount: number;
  },
  signal?: AbortSignal
): Promise<{ data: ValidatedTradeoffExplanation; fallback: boolean }> {
  const cacheKey = generateHash(`tradeoff_${params.budgetDelta}_${params.guestDelta}_${params.newBudgetINR}_${params.newGuestCount}`);
  const cached = getFromSessionCache<{ data: ValidatedTradeoffExplanation; fallback: boolean }>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch('/api/tradeoff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });

    if (res.ok) {
      const json = await res.json();
      setToSessionCache(cacheKey, json);
      return json;
    }
  } catch (_err) {
    // Fallback on failure
  }

  const fallback = {
    data: generateFallbackTradeoff(
      params.budgetDelta,
      params.guestDelta,
      params.newBudgetINR,
      params.newGuestCount
    ),
    fallback: true,
  };
  setToSessionCache(cacheKey, fallback);
  return fallback;
}
