"use client";

import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type SortingState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, ArrowUpDown, Calendar, Trash2 } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { useSubmissions, type Submission } from "../../hooks/useSubmissions";
import { api } from "../../lib/api";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Pagination } from "./Pagination";
import Toolbar from "./Toolbar";
import { exportSubmissionsToCSV } from "../../lib/export";
import DataTable from "./DataTable";
import ViewSheet from "./ViewSheet";

const columnHelper = createColumnHelper<Submission>();

export function SubmissionsTable() {
  const queryClient = useQueryClient();

  const navigate = useNavigate({ from: "/submissions" });
  const {
    page,
    limit,
    sortOrder,
    q: search,
  } = useSearch({
    from: "/submissions",
  });

  const sorting: SortingState = [
    { id: "createdAt", desc: sortOrder === "DESC" },
  ];

  const [searchTerm, setSearchTerm] = useState(search);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== search) {
        navigate({
          search: (prev) => ({ ...prev, q: searchTerm, page: 1 }),
          replace: true,
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, search, navigate]);

  const { data: response, isLoading } = useSubmissions({
    page,
    limit,
    sortOrder,
    q: search,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/submissions/${id}`),
    onSuccess: () => {
      toast.success("Entry Deleted", {
        description: "The submission has been permanently removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      setSubmissionToDelete(null);
    },
    onError: () => {
      toast.error("Delete Failed", {
        description: "Could not delete the submission.",
      });
      setSubmissionToDelete(null);
    },
  });

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const newSorting =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting)
        : updaterOrValue;

    const newOrder = newSorting[0]?.desc ? "DESC" : "ASC";

    navigate({
      search: (prev) => ({ ...prev, sortOrder: newOrder }),
    });
  };

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
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
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedSubmission(props.row.original)}
            className="h-8 w-8 p-0 text-slate-500 hover:text-violet-600 hover:bg-violet-50"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSubmissionToDelete(props.row.original.id)}
            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
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
    onSortingChange: handleSortingChange,
    pageCount: response?.meta.totalPages ?? -1,
  });

  return (
    <>
      <div className="space-y-4">
        <Toolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalCount={response?.meta.total || 0}
          onExport={() => exportSubmissionsToCSV(response?.data || [])}
        />

        <Card className="overflow-hidden border-slate-200 rounded-xl shadow-none bg-white py-0">
          <DataTable
            table={table}
            isLoading={isLoading}
            columnsLength={columns.length}
            emptyMessage={
              searchTerm
                ? "No matches found for your search."
                : "No submissions found."
            }
          />

          <Pagination
            page={page}
            totalPages={response?.meta.totalPages || 1}
            limit={limit}
            isLoading={isLoading}
            onPageChange={(p) =>
              navigate({ search: (prev) => ({ ...prev, page: p }) })
            }
            onLimitChange={(l) =>
              navigate({ search: (prev) => ({ ...prev, limit: l, page: 1 }) })
            }
          />
        </Card>
      </div>

      <ViewSheet
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        submission={selectedSubmission}
      />

      <AlertDialog
        open={!!submissionToDelete}
        onOpenChange={(open) => !open && setSubmissionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              submission from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() =>
                submissionToDelete && deleteMutation.mutate(submissionToDelete)
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
