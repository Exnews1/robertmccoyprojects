import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, Lock, Mail, ChevronRight, GitBranch, UserCheck, FileSearch, ClipboardList, KeyRound } from "lucide-react";

const GUEST_EMAIL = "guest@pinnacleins.demo";
const GUEST_PASSWORD = "ViewOnly";
const DEMO_PASSWORD = "Pinnacle2026!";
const CONTACT_EMAIL = "robert@theaigovernanceguy.com";

const STAFF_ACCOUNTS = [
  { name: "Robert McCoy",    email: "robert.mccoy@pinnacleins.demo",    role: "ADMIN",    title: "Managing Director",   initials: "RM" },
  { name: "David Marsh",     email: "david.marsh@pinnacleins.demo",     role: "ADMIN",    title: "Agency Principal",    initials: "DM" },
  { name: "Karen Whitfield", email: "karen.whitfield@pinnacleins.demo", role: "APPROVER", title: "Sr. Account Manager", initials: "KW" },
  { name: "Tom Jennings",    email: "tom.jennings@pinnacleins.demo",    role: "OPERATOR", title: "Document Specialist", initials: "TJ" },
];

const ROLE_COLORS: Record<string, string> = {
  ADMIN:    "bg-red-900/50 text-red-300 border-red-700",
  APPROVER: "bg-amber-900/50 text-amber-300 border-amber-700",
  OPERATOR: "bg-sky-900/50 text-sky-300 border-sky-700",
};

const CAPABILITIES = [
  {
    icon: GitBranch,
    title: "Document Version Control",
    desc: "Every metadata change is permanently recorded — field changed, old value, new value, operator name and role, reason, and timestamp. No record is ever overwritten.",
  },
  {
    icon: UserCheck,
    title: "Human-in-the-Loop Governance",
    desc: "AI classifies each document; a named, credentialed operator must review and approve before any file enters the repository. No document bypasses human judgment.",
  },
  {
    icon: FileSearch,
    title: "AI-Powered Classification",
    desc: "GPT-4o reads each uploaded PDF and assigns document type, line of business, client, and policy period from a structured taxonomy of 21 P&C document codes.",
  },
  {
    icon: ClipboardList,
    title: "Immutable Audit Trail",
    desc: "Every action in the system — upload, approval, rejection, modification — is logged with operator attribution. The audit trail cannot be cleared or edited.",
  },
];

export default function InsuranceLogin() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect") || "/research/knowledge-systems/insurance/demo";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doLogin = async (e?: string, p?: string) => {
    const loginEmail = e ?? email;
    const loginPassword = p ?? password;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/insurance/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      setLocation(redirect);
    } catch {
      setError("Network error — please try again");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">

      {/* ── LEFT PANEL — Instructional / Security Description ─────────────── */}
      <div className="lg:w-[55%] bg-slate-900 border-r border-slate-800 flex flex-col p-8 lg:p-12">

        {/* Brand header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded bg-amber-900/60 border border-amber-700 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 tracking-tight">Pinnacle Insurance Group</div>
            <div className="text-xs text-amber-600 font-medium tracking-widest uppercase">OKS Knowledge Management System</div>
          </div>
        </div>

        {/* Main headline */}
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 leading-snug mb-3">
          Secure Document Management<br />
          <span className="text-amber-400">& Version Control Portal</span>
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-lg">
          This is the authenticated entry point to Pinnacle's document ingestion pipeline and knowledge management system. Access is role-based and session-tracked. Every action taken inside this system is attributed to a named, credentialed operator and permanently recorded.
        </p>

        {/* Capability grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {CAPABILITIES.map(cap => (
            <div key={cap.title} className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <cap.icon className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wide">{cap.title}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>

        {/* How access works */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <KeyRound className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">How Access Works</span>
          </div>
          <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
            <p><span className="text-amber-400 font-semibold">Guest visitors</span> may log in with the shared credentials shown on the right to browse the KMS portal and observe the ingestion pipeline interface.</p>
            <p><span className="text-amber-400 font-semibold">Credentialed operators</span> sign in with their assigned account and are granted permissions according to their role — Administrator, Approver, Operator, or Viewer.</p>
            <p><span className="text-amber-400 font-semibold">To run the live document ingestion pipeline</span> with real PDF uploads, a pre-formatted sample document package is required. Contact the system administrator to arrange a guided session.</p>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-auto pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 mb-1">To arrange a guided demo with your own documents</div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            data-testid="link-contact-email"
          >
            <Mail className="h-4 w-4" />
            {CONTACT_EMAIL}
          </a>
          <div className="text-xs text-slate-600 mt-3">
            Pinnacle Insurance Group · OKS Demo Environment · All data is synthetic
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Login ────────────────────────────────────────────── */}
      <div className="lg:w-[45%] flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm space-y-5">

          <div className="mb-2">
            <div className="text-lg font-bold text-slate-100 mb-1">Sign In</div>
            <div className="text-xs text-slate-500">Authentication is required to access this system</div>
          </div>

          {/* Guest access */}
          <div className="bg-amber-950/30 border border-amber-800/60 rounded-lg p-4">
            <div className="text-xs font-semibold text-amber-300 mb-2 uppercase tracking-wide">Guest Demo Access</div>
            <div className="bg-slate-900/80 border border-slate-700 rounded p-2.5 mb-3 font-mono text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-16">Email</span>
                <span className="text-slate-300 select-all">{GUEST_EMAIL}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-16">Password</span>
                <span className="text-amber-300 select-all font-bold">{GUEST_PASSWORD}</span>
              </div>
            </div>
            <button
              onClick={() => doLogin(GUEST_EMAIL, GUEST_PASSWORD)}
              disabled={loading}
              className="w-full py-2 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded text-sm transition-colors flex items-center justify-center gap-2"
              data-testid="button-guest-login"
            >
              Enter as Guest <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-slate-800" />
            <span className="text-xs text-slate-600">or use your account</span>
            <div className="flex-1 border-t border-slate-800" />
          </div>

          {/* Staff quick-login */}
          <div className="space-y-1.5">
            {STAFF_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => { setEmail(acc.email); setPassword(DEMO_PASSWORD); doLogin(acc.email, DEMO_PASSWORD); }}
                disabled={loading}
                className="w-full flex items-center gap-3 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors text-left disabled:opacity-50"
                data-testid={`button-quicklogin-${acc.initials.toLowerCase()}`}
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                  {acc.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-200">{acc.name}</div>
                  <div className="text-xs text-slate-500">{acc.title}</div>
                </div>
                {acc.role in ROLE_COLORS && (
                  <span className={`text-xs px-1.5 py-0.5 rounded border font-mono shrink-0 ${ROLE_COLORS[acc.role]}`}>{acc.role}</span>
                )}
              </button>
            ))}
          </div>

          {/* Manual form */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="text-xs text-slate-600 text-center">Or enter credentials manually</div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doLogin()}
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2.5 pl-10 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-600"
                data-testid="input-email"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doLogin()}
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-600"
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded px-3 py-2">
                {error}
              </div>
            )}

            <button
              onClick={() => doLogin()}
              disabled={loading || !email || !password}
              className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-100 font-medium rounded text-sm transition-colors"
              data-testid="button-login"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
