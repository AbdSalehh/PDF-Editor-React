import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  toggleTheme: (
    buttonRef?: React.RefObject<HTMLElement | null>,
  ) => Promise<void>;
  setTheme: (theme: Theme) => void;
}

const loadTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    setThemeState(loadTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(
    async (buttonRef?: React.RefObject<HTMLElement | null>) => {
      const newTheme: Theme = theme === "dark" ? "light" : "dark";

      if (!buttonRef?.current || !document.startViewTransition) {
        setThemeState(newTheme);
        return;
      }

      await document.startViewTransition(() => {
        flushSync(() => {
          setThemeState(newTheme);
        });
      }).ready;

      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top),
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 400,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    },
    [theme],
  );

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };
};
