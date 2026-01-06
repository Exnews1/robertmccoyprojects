import { LucideIcon } from "lucide-react";

interface TagProps {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "high-impact" | "security";
}

export function Tag({ label, icon: Icon, variant = "default" }: TagProps) {
  const styles = {
    default: "bg-neutral-100 text-neutral-700 border-neutral-200",
    "high-impact": "bg-orange-50 text-orange-700 border-orange-100",
    security: "bg-blue-50 text-blue-700 border-blue-100"
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${styles[variant]} mr-2 mb-1`}>
      {Icon && <Icon className="w-3 h-3 mr-1.5" />}
      {label}
    </span>
  );
}
