import { LayoutGrid, TableProperties } from "lucide-react";

interface NavbarProps {
  currentView: "form" | "table";
  onChangeView: (view: "form" | "table") => void;
}

export function Navbar({ currentView, onChangeView }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-violet-600 to-indigo-600 text-white font-bold shadow-sm shrink-0">
            M
          </div>
          <span className="hidden sm:inline-block text-lg font-bold tracking-tight text-slate-900">
            MatBook<span className="text-violet-600">Assignment</span>
          </span>
        </div>

        <nav className="flex gap-1 sm:gap-2 bg-slate-100/50 p-1 rounded-lg border border-slate-200/50">
          <button
            onClick={() => onChangeView("form")}
            className={`
              flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
              ${
                currentView === "form"
                  ? "bg-white text-violet-700 shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
              }
            `}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="inline sm:hidden">Entry</span>
            <span className="hidden sm:inline">New Entry</span>
          </button>

          <button
            onClick={() => onChangeView("table")}
            className={`
              flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
              ${
                currentView === "table"
                  ? "bg-white text-violet-700 shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
              }
            `}
          >
            <TableProperties className="h-4 w-4" />
            <span className="inline sm:hidden">List</span>
            <span className="hidden sm:inline">Submissions</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
