export const portfolioEase = [0.22, 1, 0.36, 1] as const;

export const inViewViewport = {
  once: true,
  amount: 0.3,
} as const;

export const fadeUpTransition = {
  duration: 0.85,
  ease: portfolioEase,
} as const;
