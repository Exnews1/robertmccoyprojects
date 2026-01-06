import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "Fully Compliant") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-700 border border-green-100 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
        {status}
      </span>
    );
  }
  
  if (status.includes("Warning") || status.includes("Risk")) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-100 text-xs font-medium">
        <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 text-xs font-medium">
      <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
      {status}
    </span>
  );
}
