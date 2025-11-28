import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  isLoading,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
      <div className="text-sm text-slate-500 font-medium">
        Page <span className="text-slate-900">{page}</span> of{" "}
        <span className="text-slate-900">{totalPages || 1}</span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="default"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1 || isLoading}
          className="h-10 px-4 border-slate-300 text-slate-600 hover:bg-white hover:text-violet-600 hover:border-violet-300 transition-colors"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="default"
          onClick={() => {
            if (page < totalPages) onPageChange(page + 1);
          }}
          disabled={page >= totalPages || isLoading}
          className="h-10 px-4 border-slate-300 text-slate-600 hover:bg-white hover:text-violet-600 hover:border-violet-300 transition-colors"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
