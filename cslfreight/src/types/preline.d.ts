declare global {
  interface Window {
    HSCarousel?: {
      autoInit: () => void;
    };
  }
}

export {};
