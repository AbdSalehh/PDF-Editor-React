import { Button } from "@/shared/ui/button";

interface PageNavigationProps {
  currentPage: number;
  numPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function PageNavigation({
  currentPage,
  numPages,
  onPrevPage,
  onNextPage,
}: PageNavigationProps) {
  return (
    <div className="border-t pt-4">
      <p className="mb-2 text-sm font-medium">Halaman</p>
      <div className="flex items-center gap-2">
        <Button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="bg-slate-900!"
        >
          ←
        </Button>
        <span className="flex-1 text-center text-sm">
          {currentPage} / {numPages}
        </span>
        <Button
          onClick={onNextPage}
          disabled={currentPage === numPages}
          variant="outline"
          size="sm"
          className="bg-slate-900!"
        >
          →
        </Button>
      </div>
    </div>
  );
}
