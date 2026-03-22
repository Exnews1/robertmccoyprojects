import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, Lock, Mail, ChevronRight, Users } from "lucide-react";

const GUEST_EMAIL = "guest@pinnacleins.demo";
const GUEST_PASSWORD = "ViewDemo26";

const STAFF_ACCOUNTS = [
  { name: "Robert McCoy",   email: "robert.mccoy@pinnacleins.demo",   role: "ADMIN",    title: "Managing Director",      initials: "RM" },
  { name: "David Marsh",    email: "david.marsh@pinnacleins.demo",    role: "ADMIN",    title: "Agency Principal",       initials: "DM" },
  { name: "Karen Whitfield",email: "karen.whitfield@pinnacleins.demo",role: "APPROVER", title: "Sr. Account Manager",    initials: "KW" },
  { name: "Tom Jennings",   email: "tom.jennings@pinnacleins.demo",   role: "OPERATOR", title: "Document Specialist",    initials: "TJ" },
];

const ROLE_COLORS: Record<string, string> = {
  ADMIN:    "bg-red-900/50 text-red-300 border-red-700",
  APPROVER: "bg-amber-900/50 text-amber-300 border-amber-700",
  OPERATOR: "bg-sky-900/50 text-sky-300 border-sky-700",
};

const DEMO_PASSWORD = "Pinnacle2026!";

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

  const handleGuestLogin = () => doLogin(GUEST_EMAIL, GUEST_PASSWORD);

  const handleQuickLogin = (acc: typeof STAFF_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(DEMO_PASSWORD);
    doLogin(acc.email, DEMO_PASSWORD);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="h-7 w-7 text-amber-500" />
            <span className="text-xl font-bold text-slate-100 tracking-tight">Pinnacle Insurance Group</span>
          </div>
          <div className="text-xs text-amber-600 font-medium tracking-widest uppercase">OKS Knowledge Management System · Demo Portal</div>
        </div>

        {/* Guest Access — most prominent */}
        <div className="bg-amber-950/30 border border-amber-700/60 rounded-lg p-5">
          <div className="flex items-start gap-3 mb-4">
            <Users className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-amber-300">Demo Guest Access</div>
              <div className="text-xs text-slate-400 mt-0.5">Share this with anyone you want to give access to the demo</div>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-700 rounded p-3 mb-4 font-mono text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 w-20">Email</span>
              <span className="text-slate-200 select-all">{GUEST_EMAIL}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 w-20">Password</span>
              <span className="text-amber-300 select-all font-bold">{GUEST_PASSWORD}</span>
            </div>
          </div>
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full py-2.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded text-sm transition-colors flex items-center justify-center gap-2"
            data-testid="button-guest-login"
          >
            Enter as Guest <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-slate-800" />
          <span className="text-xs text-slate-600 uppercase tracking-wide">or sign in with your account</span>
          <div className="flex-1 border-t border-slate-800" />
        </div>

        {/* Staff quick-login buttons */}
        <div className="space-y-2">
          {STAFF_ACCOUNTS.map(acc => (
            <button
              key={acc.email}
              onClick={() => handleQuickLogin(acc)}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors text-left disabled:opacity-50"
              data-testid={`button-quicklogin-${acc.initials.toLowerCase()}`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                {acc.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200">{acc.name}</div>
                <div className="text-xs text-slate-500">{acc.title}</div>
              </div>
              {acc.role in ROLE_COLORS && (
                <span className={`text-xs px-1.5 py-0.5 rounded border font-mono shrink-0 ${ROLE_COLORS[acc.role]}`}>{acc.role}</span>
              )}
            </button>
          ))}
        </div>

        {/* Manual form */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-3">
          <div className="text-xs text-slate-500 text-center mb-1">Or enter credentials manually</div>
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

        <div className="text-center text-xs text-slate-700">
          Pinnacle Insurance Group · OKS Demo Environment · All data is synthetic
        </div>
      </div>
    </div>
  );
}
