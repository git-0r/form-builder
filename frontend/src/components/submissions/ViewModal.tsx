import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";

interface Submission {
  id: string;
  data: Record<string, unknown>;
  createdAt: string;
}

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
}

export function ViewModal({ isOpen, onClose, submission }: ViewModalProps) {
  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden rounded-xl border-none">
        <div className="bg-linear-to-r from-violet-600 to-indigo-600 px-6 py-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              Submission Details
            </DialogTitle>
            <DialogDescription className="text-violet-100">
              View the complete data payload for this entry.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex gap-3">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">
              ID: {submission.id.slice(0, 8)}
            </Badge>
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">
              {format(new Date(submission.createdAt), "MMM dd, yyyy • HH:mm")}
            </Badge>
          </div>
        </div>

        <ScrollArea className="max-h-[60vh] bg-slate-50/50 p-6">
          <div className="grid gap-4">
            {Object.entries(submission.data).map(([key, value]) => (
              <div
                key={key}
                className="group flex flex-col space-y-1 rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-violet-200"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-violet-500">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="text-base font-medium text-slate-700">
                  {Array.isArray(value) ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {value.map((v) => (
                        <Badge key={v} variant="secondary">
                          {v}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    String(value) || (
                      <span className="text-slate-300 italic">Empty</span>
                    )
                  )}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
