// Node's own experimental global `localStorage` (present without `--localstorage-file`)
// shadows jsdom's working implementation under the Vitest runner, leaving
// `localStorage.getItem` undefined. This is a test-environment gap, not
// something the component needs real persistent storage for in a smoke
// test — import this file first, before any component that reads
// `localStorage` at construction/init time.
if (typeof (globalThis as any).localStorage?.getItem !== 'function') {
  const store = new Map<string, string>();
  (globalThis as any).localStorage = {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
}
