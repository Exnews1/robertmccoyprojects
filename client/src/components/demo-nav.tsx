import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Cpu,
  FileCheck,
  Compass,
  PlayCircle,
} from "lucide-react";

const demoNavItems = [
  { href: "/research/ai", label: "AI Architecture", icon: Cpu },
  { href: "/research/eso", label: "ESO Pipeline", icon: FileCheck },
  { href: "/research/career-advisor", label: "Career Advisor", icon: Compass },
  { href: "/research/signal-flow", label: "Signal Flow", icon: PlayCircle },
];

export function DemoNav() {
  const [location] = useLocation();
  return (
    <nav
      className="sticky top-14 z-40 border-b py-2 mb-4 md:mb-6"
      style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      data-testid="demo-nav"
    >
      <div className="max-w-6xl mx-auto px-3 md:px-6">
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          <Link href="/research/cmgf">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-medium text-slate-300"
              data-testid="demo-nav-cmgf"
            >
              ← CMGF
            </Button>
          </Link>
          <div className="w-px h-5 bg-slate-600 flex-shrink-0" />
          {demoNavItems.map(item => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 text-xs font-medium ${
                    isActive
                      ? "text-amber-400"
                      : "text-slate-300"
                  }`}
                  data-testid={`demo-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
