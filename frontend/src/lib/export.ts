import type { Submission } from "../hooks/useSubmissions";

export function exportSubmissionsToCSV(data: Submission[]) {
  if (!data || data.length === 0) return;

  const headers = ["ID", "Created At", ...Object.keys(data[0].data)];

  const csvContent = [
    headers.join(","),
    ...data.map((row) => {
      const rowData = Object.values(row.data).map((val) =>
        Array.isArray(val) ? `"${val.join(";")}"` : `"${val ?? ""}"`
      );
      return [`"${row.id}"`, `"${row.createdAt}"`, ...rowData].join(",");
    }),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `submissions_export_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
