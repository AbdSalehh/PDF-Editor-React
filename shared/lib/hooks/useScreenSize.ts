import { useMediaQuery } from "./useMediaQuery";

/**
 * Breakpoints (matching Tailwind defaults)
 */
const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

/**
 * useScreenSize Hook
 * Detect current screen size with Tailwind breakpoints
 *
 * @example
 * const { isMobile, isTablet, isDesktop, isLarge } = useScreenSize();
 *
 * if (isMobile) {
 *   return <MobileView />;
 * }
 */
export const useScreenSize = () => {
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const isXl = useMediaQuery(`(min-width: ${breakpoints.xl})`);
  const is2Xl = useMediaQuery(`(min-width: ${breakpoints["2xl"]})`);

  return {
    // Specific breakpoints
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,

    // Semantic names
    isMobile: !isSm, // < 640px
    isTablet: isSm && !isLg, // 640px - 1023px
    isDesktop: isLg, // >= 1024px
    isLarge: isXl, // >= 1280px
    isExtraLarge: is2Xl, // >= 1536px

    // Orientation
    isPortrait: useMediaQuery("(orientation: portrait)"),
    isLandscape: useMediaQuery("(orientation: landscape)"),

    // Touch device
    isTouchDevice: useMediaQuery("(hover: none) and (pointer: coarse)"),

    // Reduced motion preference
    prefersReducedMotion: useMediaQuery("(prefers-reduced-motion: reduce)"),
  };
};
