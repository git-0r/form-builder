"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Loader2, Eye, ArrowUpDown, Calendar } from "lucide-react";
import { useSubmissions, type Submission } from "../../hooks/useSubmissions";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ViewModal } from "./ViewModal";
import { Pagination } from "./Pagination";

const columnHelper = createColumnHelper<Submission>();

export function SubmissionsTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const sortOrder = sorting.length > 0 && sorting[0].desc ? "DESC" : "ASC";

  const { data: response, isLoading } = useSubmissions({
    page,
    limit,
    sortOrder,
  });

  const columns = [
    columnHelper.accessor("id", {
      header: "Submission ID",
      cell: (info) => (
        <span className="font-mono text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
          {info.getValue().slice(0, 8)}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 hover:bg-violet-50 hover:text-violet-700"
        >
          Created Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="font-medium">
            {format(new Date(info.getValue()), "MMM dd, yyyy")}
          </span>
          <span className="text-slate-400 text-xs">
            at {format(new Date(info.getValue()), "HH:mm")}
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (props) => (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => setSelectedSubmission(props.row.original)}
            className="bg-violet-100 text-violet-700 hover:bg-violet-200 hover:text-violet-800 border-none shadow-none font-semibold"
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: response?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    state: { sorting },
    onSortingChange: setSorting,
    pageCount: response?.meta.totalPages ?? -1,
  });

  return (
    <>
      <Card className="overflow-hidden border-slate-200 shadow-slate-200/40 rounded-xl bg-white py-0">
        <div className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center bg-slate-50/50">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                <p className="text-sm text-slate-500 font-medium">
                  Loading records...
                </p>
              </div>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm text-left caption-bottom">
                <thead className="bg-slate-50/80 [&_tr]:border-b">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="border-b border-slate-200 transition-colors"
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="h-12 px-6 text-left align-middle font-semibold text-slate-500"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="h-32 text-center align-middle text-slate-500 bg-slate-50/30"
                      >
                        No submissions found.
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-100 transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-100"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="p-6 align-middle">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={response?.meta.totalPages || 1}
          limit={limit}
          isLoading={isLoading}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      </Card>

      <ViewModal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        submission={selectedSubmission}
      />
    </>
  );
}
