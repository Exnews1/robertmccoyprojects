import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Shield } from "lucide-react";

export function CMGFAdvisoryNotice({ defaultExpanded = false }: { defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className="border rounded-sm overflow-hidden"
      style={{
        backgroundColor: "rgba(17,34,64,0.9)",
        borderColor: "rgba(201,168,76,0.25)",
      }}
      data-testid="cmgf-advisory-notice"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={expanded}
        aria-controls="cmgf-advisory-content"
        data-testid="button-toggle-advisory-notice"
      >
        <Shield className="w-4 h-4 flex-shrink-0" style={{ color: "#c9a84c" }} />
        <span
          className="text-xs font-semibold tracking-widest uppercase flex-1"
          style={{ color: "#c9a84c", fontFamily: "var(--font-serif, serif)" }}
        >
          CMGF Advisory Notice
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div id="cmgf-advisory-content" className="px-5 pb-5 space-y-3 text-[13px] leading-relaxed text-muted-foreground border-t" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
          <p className="pt-4">
            The Career Mobility Governance Framework provides informational planning signals based on the data and inputs supplied by the user. The system compares user declared goals with publicly available policy rules, credential requirements, and labor market reference data.
          </p>
          <p>
            The results presented are not recommendations, predictions, or decisions. They are informational indicators designed to help users understand how their current education, experience, and credential status relate to potential career pathways.
          </p>
          <p>
            Some career transitions align closely with existing qualifications, while others may require additional education, licensing, or time to complete prerequisite requirements. When constraints exist, the system will identify them and explain the relevant policy or credential requirements.
          </p>
          <p>
            CMGF does not determine what a user can or cannot pursue. The system has no authority to approve, deny, or restrict career choices. Final decisions remain entirely with the user and their human advisors.
          </p>
          <div className="flex items-start gap-2 mt-1 p-3 rounded-sm" style={{ backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#c9a84c" }} />
            <p className="text-[12px]" style={{ color: "#e8c97a" }}>
              Users are encouraged to review results with qualified advisors such as Education Service Officers, institutional counselors, or credentialing authorities before making career or education decisions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
