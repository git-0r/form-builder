import { type Table, flexRender } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

interface DataTableProps<TData> {
  table: Table<TData>;
  isLoading: boolean;
  columnsLength: number;
  emptyMessage?: string;
}

export default function DataTable<TData>({
  table,
  isLoading,
  columnsLength,
  emptyMessage = "No results found.",
}: DataTableProps<TData>) {
  return (
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
                    colSpan={columnsLength}
                    className="h-32 text-center align-middle text-slate-500 bg-slate-50/30"
                  >
                    {emptyMessage}
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
  );
}
