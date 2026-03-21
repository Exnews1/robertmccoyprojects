import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, RefreshCw, Lock, Mail, KeyRound, CheckCircle, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type DemoTOTP = { code: string; remaining: number };

const DEMO_ACCOUNTS = [
  { name: "Robert McCoy", email: "robert.mccoy@pinnacleins.demo", role: "ADMIN", license: "IN-1000001" },
  { name: "David Marsh", email: "david.marsh@pinnacleins.demo", role: "ADMIN", license: "IN-2847561" },
  { name: "Karen Whitfield", email: "karen.whitfield@pinnacleins.demo", role: "APPROVER", license: "IN-3195842" },
  { name: "Tom Jennings", email: "tom.jennings@pinnacleins.demo", role: "OPERATOR", license: "IN-4028736" },
  { name: "Demo Viewer", email: "viewer@pinnacleins.demo", role: "VIEWER", license: null },
];

const ROLE_COLORS: Record<string, string> = {
  ADMIN:    "bg-red-900/50 text-red-300 border-red-700",
  APPROVER: "bg-amber-900/50 text-amber-300 border-amber-700",
  OPERATOR: "bg-sky-900/50 text-sky-300 border-sky-700",
  VIEWER:   "bg-slate-800 text-slate-400 border-slate-600",
};

export default function InsuranceLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoTotp, setDemoTotp] = useState<DemoTOTP | null>(null);
  const totpRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchDemoTotp = async () => {
    try {
      const res = await fetch("/api/insurance/auth/totp-demo");
      const data = await res.json();
      setDemoTotp(data);
    } catch {}
  };

  useEffect(() => {
    fetchDemoTotp();
    timerRef.current = setInterval(fetchDemoTotp, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleTotpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setTotpCode(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || totpCode.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/insurance/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, totpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed");
        setTotpCode("");
        totpRef.current?.focus();
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/research/knowledge-systems/insurance/demo";
      setLocation(redirect);
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  const fillAccount = (acct: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acct.email);
    setPassword("Pinnacle2026!");
    setTotpCode(demoTotp?.code || "");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6">

        {/* Left — Login form */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-7 w-7 text-amber-500 shrink-0" />
            <div>
              <div className="text-base font-bold text-slate-100">Pinnacle Insurance Group</div>
              <div className="text-xs text-amber-600 font-medium tracking-widest uppercase">OKS Knowledge Management System</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-lg font-semibold text-slate-100">Operator Sign-In</div>
            <div className="text-xs text-slate-500 mt-0.5">Multi-factor authentication required for all operators</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="operator@pinnacleins.demo"
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5 pl-10 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-600"
                  data-testid="input-email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 12 characters"
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-600"
                  data-testid="input-password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* TOTP */}
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1.5">
                Authenticator Code <span className="text-slate-600">(6-digit TOTP)</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  ref={totpRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={totpCode}
                  onChange={handleTotpChange}
                  placeholder="000000"
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5 pl-10 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-600 font-mono tracking-widest text-center"
                  data-testid="input-totp"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded px-3 py-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password || totpCode.length !== 6}
              className="w-full py-2.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded transition-colors text-sm"
              data-testid="button-login"
            >
              {loading ? "Authenticating…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-xs text-slate-600 space-y-1">
            <div>Sessions expire after 15 minutes of inactivity.</div>
            <div>All actions are logged to the governance audit trail.</div>
          </div>
        </div>

        {/* Right — Demo panel */}
        <div className="space-y-4">
          {/* Live TOTP display */}
          <div className="bg-slate-900 border border-amber-800/50 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-amber-500 uppercase tracking-widest">Demo Mode — Live TOTP</div>
              <button onClick={fetchDemoTotp} className="text-slate-600 hover:text-slate-400">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="text-center py-4">
              <div className="font-mono text-5xl font-bold text-amber-400 tracking-[0.3em] mb-2">
                {demoTotp?.code || "------"}
              </div>
              <div className="text-xs text-slate-500">
                Refreshes in <span className="font-mono text-amber-600">{demoTotp?.remaining ?? "—"}s</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 text-center mt-2">
              This code is auto-filled when you click a demo account below.
            </div>
          </div>

          {/* Demo accounts */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Demo Accounts</div>
            <div className="text-xs text-slate-600 mb-3">Password for all: <span className="font-mono text-slate-400">Pinnacle2026!</span></div>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map(acct => (
                <button
                  key={acct.email}
                  onClick={() => fillAccount(acct)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors text-left"
                  data-testid={`demo-account-${acct.email.split("@")[0]}`}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-900/40 border border-amber-800 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">
                    {acct.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-100 truncate">{acct.name}</div>
                    <div className="text-xs text-slate-500 truncate">{acct.email}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${ROLE_COLORS[acct.role] || ROLE_COLORS.VIEWER}`}>{acct.role}</span>
                    {acct.license && <span className="text-xs font-mono text-slate-600">{acct.license}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded p-4 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium"><CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> argon2id password hashing</div>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium"><CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> RFC 6238 TOTP (SHA-1, 30s window)</div>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium"><CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> HttpOnly session cookie, 15-min inactivity timeout</div>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium"><CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Every action recorded to governance audit log</div>
          </div>
        </div>

      </div>
    </div>
  );
}
