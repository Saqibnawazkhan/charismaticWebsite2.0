import type Lenis from "lenis";

// Shared handle so components (mobile menu, modals, anchor links) can pause or drive smooth scrolling.
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;
