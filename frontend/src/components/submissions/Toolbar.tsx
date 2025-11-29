import { Search, Download, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SubmissionsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
  onExport: () => void;
}

export default function Toolbar({
  searchTerm,
  onSearchChange,
  totalCount,
  onExport,
}: SubmissionsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />

        <Input
          placeholder="Search submissions..."
          className="pl-9 pr-9 bg-white border-slate-200 focus-visible:ring-violet-500"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <div className="flex-1 sm:flex-none flex items-center justify-center px-4 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 h-9">
          Total:{" "}
          <span className="ml-1 text-slate-900 font-bold">{totalCount}</span>
        </div>
        <Button
          variant="outline"
          onClick={onExport}
          className="flex-1 sm:flex-none gap-2 text-slate-700 border-slate-200 hover:bg-white hover:text-violet-700 hover:border-violet-200 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
