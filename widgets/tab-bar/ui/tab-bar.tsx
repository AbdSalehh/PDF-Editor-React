import { motion } from "motion/react";
import { TABS_CONFIG } from "@/entities/tab";
import { useIsMobile } from "@/shared/hooks/useMobile";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const isMobile = useIsMobile();

  return (
    <div className="sticky top-0 z-999 w-full bg-[#f5f2eb] dark:bg-[#141311]">
      <div className="scrollbar-hide mx-auto max-w-[84rem] overflow-x-auto border-y border-[#1a1917] px-2 sm:px-6 dark:border-[#ece8df]">
        <nav
          className="flex min-w-max"
          aria-label="Tabs"
          role="tablist"
          aria-orientation="horizontal"
        >
          {TABS_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`relative cursor-pointer px-4 py-3.5 font-mono text-xs tracking-wide uppercase transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#d9482b] ${
                  isActive
                    ? "text-[#1a1917] dark:text-[#ece8df]"
                    : "text-[#1a1917]/50 hover:text-[#1a1917] dark:text-[#ece8df]/50 dark:hover:text-[#ece8df]"
                }`}
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                role="tab"
              >
                {isMobile ? tab.labelMobile : tab.label}
                {isActive && (
                  <motion.span
                    layoutId="active-tab-line"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-[#d9482b] dark:bg-[#ff7a59]"
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
