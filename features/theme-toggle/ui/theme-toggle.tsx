import { useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useTheme } from "@/shared/hooks/useTheme";

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {}

export const ThemeToggle = ({ className, ...props }: ThemeToggleProps) => {
  const { isDark, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    toggleTheme(buttonRef);
  };

  return (
    <div className="fixed top-4 right-4 z-999999">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="lg"
        onClick={handleToggle}
        className={cn(
          "relative w-10 overflow-hidden bg-neutral-100 px-0! py-0! dark:bg-neutral-800!",
          className,
        )}
        title="Toggle theme"
        suppressHydrationWarning
        {...props}
      >
        <motion.div
          initial={false}
          animate={{
            y: isDark ? 0 : 20,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="absolute"
        >
          <Moon className="h-4 w-4" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            y: !isDark ? 0 : -20,
            opacity: !isDark ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="absolute"
        >
          <Sun className="h-4 w-4" />
        </motion.div>
      </Button>
    </div>
  );
};
