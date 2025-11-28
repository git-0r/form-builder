import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Pagination({
  page,
  totalPages,
  limit,
  isLoading,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 gap-4">
      <div className="flex items-center gap-6">
        <div className="text-sm text-slate-500 font-medium">
          Page <span className="text-slate-900">{page}</span> of{" "}
          <span className="text-slate-900">{totalPages || 1}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 hidden sm:inline">
            Rows per page:
          </span>
          <Select
            value={String(limit)}
            onValueChange={(val) => onLimitChange(Number(val))}
          >
            <SelectTrigger className="h-8 w-[70px] bg-white border-slate-300 focus:ring-violet-500">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
