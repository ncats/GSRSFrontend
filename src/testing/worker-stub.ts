// jsdom (used by the Vitest runner) has no `Worker` global. `defiant.js`
// (imported for its side effects by a few components) constructs a real
// `Worker` at module-load time, which crashes the whole spec file before any
// test runs. This is a test-environment gap, not something the components
// themselves need real Worker behavior for in a smoke test — import this
// file first, before any component that pulls in `defiant.js`.
if (typeof (globalThis as any).Worker === 'undefined') {
  (globalThis as any).Worker = class {
    constructor(_url?: any, _options?: any) {}
    postMessage(_msg?: any): void {}
    terminate(): void {}
    addEventListener(): void {}
    removeEventListener(): void {}
  };
}
