export {};

type Ix2Engine = { init: () => void };

declare global {
  interface Window {
    Webflow?: {
      // queue helper
      push?: (fn: () => void) => void;

      // lifecycle helpers
      destroy?: () => void;
      ready?: () => void;

      // module loader
      require?: (module: "ix2" | string) => Ix2Engine;
    };
  }
}
