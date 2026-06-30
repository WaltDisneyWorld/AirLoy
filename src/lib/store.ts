import { useSyncExternalStore } from "react";
import type { Activity, Member } from "../types";
import { MEMBER, SEED_ACTIVITY } from "../data/account";

// ─────────────────────────────────────────────────────────────────────────────
// A tiny external store, persisted to localStorage. The member's activity
// ledger is the single source of truth: redeem an award here and the balance,
// status bars, and expiry clock recompute everywhere (and survive reloads).
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "airloy.account.v1";
type Listener = () => void;

interface AccountState {
  member: Member;
  activity: Activity[];
}

function sortDesc(a: Activity[]): Activity[] {
  return [...a].sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime());
}

function seed(): AccountState {
  return { member: MEMBER, activity: SEED_ACTIVITY };
}

function load(): AccountState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AccountState;
      if (parsed && Array.isArray(parsed.activity) && parsed.member) {
        return { member: parsed.member, activity: sortDesc(parsed.activity) };
      }
    }
  } catch {
    /* ignore corrupt state */
  }
  return seed();
}

let state: AccountState = load();
const listeners = new Set<Listener>();

// Cross-tab sync: when another tab redeems or earns, reload and notify.
if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      state = load();
      listeners.forEach((l) => l());
    }
  });
}

function commit(next: AccountState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage may be unavailable; in-memory still works */
  }
  listeners.forEach((l) => l());
}

let counter = 0;
function newId(): string {
  counter += 1;
  return `live-${Date.now().toString(36)}-${counter}`;
}

export const accountStore = {
  snapshot: () => state,
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  /** Append a ledger entry (earn or redeem). Returns the stored entry. */
  post(entry: Omit<Activity, "id">): Activity {
    const full: Activity = { ...entry, id: newId() };
    commit({ ...state, activity: sortDesc([full, ...state.activity]) });
    return full;
  },
  reset() {
    commit(seed());
  },
};

const SERVER = seed();

export function useAccount(): AccountState {
  return useSyncExternalStore(accountStore.subscribe, accountStore.snapshot, () => SERVER);
}
