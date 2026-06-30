/* Minimal browser-global shims so the app's modules can be imported and
   server-rendered under Node for the smoke test. Imported first. */
const g = globalThis as unknown as Record<string, unknown>;

if (!g.localStorage) {
  const store: Record<string, string> = {};
  g.localStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = String(v);
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k];
    },
  };
}
if (!g.window) g.window = g;
if (!g.matchMedia) {
  g.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
}

export {};
