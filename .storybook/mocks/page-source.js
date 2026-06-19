/**
 * Reactive store for the Storybook page-source selector.
 *
 * Tracks whether stories run against the in-memory mock CMS (and which
 * scenario) or a real page server (base URL). It is a tiny external store
 * (subscribe / getSnapshot) read with `useSyncExternalStore`, and it persists
 * the choice to localStorage so it survives reloads and story navigation.
 */

import { createPageStore } from './page-store.js';
import { createRealPageStore } from './page-real.js';

const STORAGE_KEY = 'page-storybook-source';

const DEFAULTS = {
  source: 'mock', // 'mock' | 'real'
  baseUrl: 'http://localhost:3000',
  scenario: 'page',
  // Bumped to force a re-read without changing the store identity.
  nonce: 0,
};

function load() {
  try {
    const raw =
      typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw), nonce: 0 };
  } catch {
    return { ...DEFAULTS };
  }
}

let state = load();
const listeners = new Set();

function persist() {
  try {
    if (typeof localStorage === 'undefined') return;
    const { source, baseUrl, scenario } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ source, baseUrl, scenario }));
  } catch {
    /* storage unavailable (sandboxed iframe) — ignore */
  }
}

/** Subscribe to store changes; returns an unsubscribe function. */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Current snapshot (stable reference until the next change). */
export function getSnapshot() {
  return state;
}

/** Merge a partial update and notify subscribers. */
export function setSource(patch) {
  state = { ...state, ...patch };
  persist();
  listeners.forEach((l) => l());
}

/** Bump the nonce to trigger a live re-read without rebuilding the store. */
export function reload() {
  state = { ...state, nonce: state.nonce + 1 };
  listeners.forEach((l) => l());
}

let cache = { signature: null, store: null };

function signatureOf(s) {
  return s.source === 'real' ? `real|${s.baseUrl}` : `mock|${s.scenario}`;
}

/**
 * The store backing the current selection. Rebuilt only when the source, base
 * URL, or scenario changes — not on a plain reload — so edits persist across
 * live refreshes.
 * @returns {object} A mock or real store exposing the data-access surface.
 */
export function getActiveStore() {
  const signature = signatureOf(state);
  if (cache.signature === signature && cache.store) return cache.store;
  const store =
    state.source === 'real'
      ? createRealPageStore({ baseUrl: state.baseUrl })
      : createPageStore({ scenario: state.scenario });
  cache = { signature, store };
  return store;
}

/** Drop the cached store so the next read rebuilds it (resets mock edits). */
export function resetStore() {
  cache = { signature: null, store: null };
  reload();
}
