import { lazy, Suspense, useState } from "react";
import { ThemeToggle } from "@/features/theme-toggle";
import { TabBar } from "@/widgets/tab-bar";
import { TABS_CONFIG } from "@/entities/tab";

const BackgroundEffects = lazy(() =>
  import("@/widgets/background-effects").then((m) => ({
    default: m.BackgroundEffects,
  })),
);

const HeroSection = lazy(() =>
  import("@/widgets/hero-section").then((m) => ({ default: m.HeroSection })),
);

const TabContent = lazy(() =>
  import("@/widgets/tab-content").then((m) => ({ default: m.TabContent })),
);

export function HomePage() {
  const [activeTab, setActiveTab] = useState<string>(TABS_CONFIG[0].id);

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-[#f5f2eb] text-[#1a1917] dark:bg-[#141311] dark:text-[#ece8df]">
      <Suspense fallback={null}>
        <BackgroundEffects />
      </Suspense>

      <ThemeToggle />

      <main className="relative z-10 flex flex-col items-center pb-16">
        <Suspense fallback={null}>
          <HeroSection />
        </Suspense>

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <Suspense fallback={null}>
          <TabContent activeTab={activeTab} />
        </Suspense>
      </main>
    </div>
  );
}
