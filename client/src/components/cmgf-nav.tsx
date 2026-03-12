import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Download,
  Library,
  Search,
  Layers,
  BarChart3,
  UserCircle,
  ClipboardList,
  Shield,
  Rocket,
  Compass,
  PlayCircle,
  MonitorPlay,
  ChevronDown,
  Cpu,
  FileCheck,
} from "lucide-react";

const frameworkItems = [
  { href: "/research/cmgf", label: "CMGF Home", icon: Home },
  { href: "/research/ai", label: "AI Architecture", icon: Cpu },
  { href: "/research/cmgf/dashboard", label: "Executive Dashboard", icon: BarChart3 },
  { href: "/research/cmgf/five-pillars", label: "Five Pillars", icon: Layers },
  { href: "/research/explorer", label: "Reference Explorer", icon: Search },
  { href: "/research/cmgf/series", label: "Series 2026", icon: Layers },
  { href: "/research/cmgf/downloads", label: "Downloads", icon: Download },
  { href: "/research/cmgf/library", label: "Library", icon: Library },
];

const pipelineItems = [
  { href: "/research/eso", label: "ESO Pipeline Overview", icon: FileCheck },
  { href: "/research/career-advisor", label: "Career Path Advisor", icon: Compass },
  { href: "/research/demo", label: "Scenario Engine", icon: Rocket },
  { href: "/research/sm-hub", label: "SM Request Hub", icon: UserCircle },
  { href: "/research/isr", label: "ISR Queue", icon: ClipboardList },
  { href: "/research/audit", label: "Audit Trail", icon: Shield },
];

const walkthroughItems = [
  { href: "/research/cmgf/walkthrough/part-a", label: "Part A — Architecture", icon: MonitorPlay },
  { href: "/research/cmgf/walkthrough/part-b", label: "Part B — Data Flow", icon: MonitorPlay },
  { href: "/research/cmgf/walkthrough/part-c", label: "Part C — Governance", icon: MonitorPlay },
];

function NavDropdown({
  label,
  items,
  currentPath,
}: {
  label: string;
  items: typeof frameworkItems;
  currentPath: string;
}) {
  const isGroupActive = items.some(
    (item) =>
      currentPath === item.href ||
      (item.href !== "/research/cmgf" && currentPath.startsWith(item.href))
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1 text-xs font-medium ${
            isGroupActive
              ? "text-amber-400"
              : "text-slate-300 hover:text-white hover:bg-white/10"
          }`}
          data-testid={`nav-group-${label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {label}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[220px]"
        style={{ backgroundColor: "#0F172A", border: "1px solid #334155" }}
      >
        {items.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== "/research/cmgf" && currentPath.startsWith(item.href));
          return (
            <DropdownMenuItem
              key={item.href}
              asChild
              className={`cursor-pointer gap-2.5 py-2 px-3 text-sm ${
                isActive
                  ? "text-amber-400 bg-white/5"
                  : "text-slate-300 hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10"
              }`}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CMGFNav() {
  const [location] = useLocation();

  const isSignalFlowActive = location === "/research/signal-flow";

  return (
    <nav
      className="sticky top-14 z-40 border-b py-2 mb-4 md:mb-6"
      style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      data-testid="cmgf-nav"
    >
      <div className="max-w-6xl mx-auto px-3 md:px-6">
        <div className="flex items-center gap-1 md:gap-2">
          <NavDropdown label="Framework" items={frameworkItems} currentPath={location} />

          <div className="w-px h-5 bg-slate-600 flex-shrink-0" />

          <NavDropdown label="Pipeline" items={pipelineItems} currentPath={location} />

          <div className="w-px h-5 bg-slate-600 flex-shrink-0" />

          <NavDropdown label="Walkthrough" items={walkthroughItems} currentPath={location} />

          <div className="w-px h-5 bg-slate-600 flex-shrink-0" />

          <Link href="/research/signal-flow">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 text-xs font-semibold border ${
                isSignalFlowActive
                  ? "text-amber-400 border-amber-500/60 bg-amber-500/10"
                  : "text-amber-400 border-amber-500/40 hover:border-amber-500/70 hover:bg-amber-500/10"
              }`}
              data-testid="nav-signal-flow"
            >
              <PlayCircle className="h-4 w-4" />
              Signal Flow
            </Button>
          </Link>

          <div className="ml-auto flex-shrink-0">
            <Badge
              variant="outline"
              className="text-[10px] border-amber-500/40 text-amber-400/80"
              data-testid="badge-demo-data"
            >
              Demonstration Data
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  );
}
