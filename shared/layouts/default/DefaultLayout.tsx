// import Header from "@/widgets/header/Header";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

/**
 * Default Layout
 * Main layout with header and content area
 */
const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DefaultLayout;
