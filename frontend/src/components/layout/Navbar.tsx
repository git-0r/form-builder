import { LayoutGrid, TableProperties } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Navbar() {
  const linkBaseClass =
    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200";
  const activeClass = "bg-white text-violet-700 shadow-sm ring-1 ring-black/5";
  const inactiveClass =
    "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link to="/">
          <div className="flex items-center gap-2">
            <img src="/aperture.svg" className="size-9 shrink-0" />
            <span className="hidden sm:inline-block text-lg font-bold tracking-tight text-slate-900">
              Form<span className="text-violet-600">Builder</span>
            </span>
          </div>
        </Link>

        <nav className="flex gap-1 sm:gap-2 bg-slate-100/50 p-1 rounded-lg border border-slate-200/50">
          <Link
            to="/"
            className={linkBaseClass}
            activeProps={{ className: activeClass }}
            inactiveProps={{ className: inactiveClass }}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="inline sm:hidden">Entry</span>
            <span className="hidden sm:inline">New Entry</span>
          </Link>

          <Link
            to="/submissions"
            className={linkBaseClass}
            activeProps={{ className: activeClass }}
            inactiveProps={{ className: inactiveClass }}
            search={{
              page: 1,
              limit: 10,
              sortOrder: "DESC",
              q: "",
            }}
          >
            <TableProperties className="h-4 w-4" />
            <span className="inline sm:hidden">List</span>
            <span className="hidden sm:inline">Submissions</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
