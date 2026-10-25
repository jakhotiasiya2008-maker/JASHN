/**
 * Jashn Versioned Storage Service
 * Strictly validates loaded state with Zod against StorageStateV1Schema.
 * Recovers gracefully from data corruption and supports atomic reset.
 */

import { StorageStateV1Schema, ValidatedStorageStateV1 } from '../domain/schemas';

const STORAGE_KEY = 'jashn_wedding_planner_state_v1';

export function loadSavedState(): ValidatedStorageStateV1 | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const validated = StorageStateV1Schema.safeParse(parsed);

    if (validated.success) {
      return validated.data;
    } else {
      console.warn('Storage schema version mismatch or corruption; initializing fresh state.', validated.error);
      return null;
    }
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return null;
  }
}

export function saveState(state: ValidatedStorageStateV1): void {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify({
      ...state,
      version: 1,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function clearSavedState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear state:', err);
  }
}
