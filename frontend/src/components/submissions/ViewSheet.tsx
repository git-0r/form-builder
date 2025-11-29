import { format } from "date-fns";
import { X, Calendar, Clock, FileText } from "lucide-react";
import { Button } from "../ui/button";
import type { Submission } from "../../hooks/useSubmissions";

interface ViewSheetProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
}

export default function ViewSheet({
  isOpen,
  onClose,
  submission,
}: ViewSheetProps) {
  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative h-full w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="px-6 py-6 border-b border-zinc-100 flex justify-between items-start bg-zinc-50/50">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">
              Submission Details
            </h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
              <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">
                #{submission.id.slice(0, 8)}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-zinc-200/50 rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-violet-50/50 rounded-xl p-4 border border-violet-100 space-y-3">
            <div className="flex items-center gap-3 text-sm text-violet-900">
              <Calendar className="h-4 w-4 text-violet-500" />
              <span className="font-medium">
                {format(new Date(submission.createdAt), "MMMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-violet-900">
              <Clock className="h-4 w-4 text-violet-500" />
              <span className="font-medium">
                {format(new Date(submission.createdAt), "h:mm a")}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <FileText className="h-3 w-3" /> Application Data
            </h3>

            <div className="grid gap-4">
              {Object.entries(submission.data).map(([key, value]) => (
                <div key={key} className="group">
                  <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide group-hover:text-violet-600 transition-colors">
                    {key.replace(/_/g, " ")}
                  </label>
                  <div className="mt-1.5 p-3 bg-zinc-50 rounded-lg border border-zinc-100 text-sm font-medium text-zinc-900 wrap-break-word group-hover:border-violet-100 group-hover:bg-violet-50/30 transition-colors">
                    {Array.isArray(value) ? (
                      <div className="flex flex-wrap gap-2">
                        {value.map((v: string) => (
                          <span
                            key={v}
                            className="bg-white border border-zinc-200 px-2 py-1 rounded-md text-xs shadow-sm"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    ) : (
                      String(value)
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-100 bg-zinc-50/30">
          <Button
            onClick={onClose}
            className="w-full bg-violet-900 hover:bg-violet-800 text-white rounded-lg"
          >
            Close Panel
          </Button>
        </div>
      </div>
    </div>
  );
}
