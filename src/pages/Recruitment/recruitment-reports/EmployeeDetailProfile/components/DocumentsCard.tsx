import { CheckCircle2, XCircle } from "lucide-react";
import type { EmployeeDocument } from "../types/types";

interface Props {
  documents: EmployeeDocument[];
}

export default function DocumentsCard({
  documents,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="rounded-t-xl border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h3 className="font-semibold text-slate-700">
          Documents
        </h3>
      </div>

      {documents.length === 0 ? (
        <div className="px-5 py-6 text-center text-slate-500">
          No documents available
        </div>
      ) : (
        <div>
          {documents.map((doc) => (
            <div
              key={doc.documentType}
              className="flex items-center justify-between gap-4 px-5 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {doc.documentType}
                </p>

                <p className="text-sm text-slate-500">
                  {doc.status}
                </p>
              </div>

              {doc.isAvailable ? (
                <CheckCircle2
                  size={22}
                  className="shrink-0 text-green-600"
                />
              ) : (
                <XCircle
                  size={22}
                  className="shrink-0 text-red-600"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}