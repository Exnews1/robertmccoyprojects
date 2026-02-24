import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Download, Library, Search, Layers, ExternalLink, BarChart3, UserCircle, ClipboardList, Shield, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/research/cmgf", label: "CMGF", icon: Home, external: false, group: "research" },
  { href: "/research/cmgf/dashboard", label: "Dashboard", icon: BarChart3, external: false, group: "research" },
  { href: "/research/cmgf/five-pillars", label: "Five Pillars", icon: Layers, external: false, group: "research" },
  { href: "/research/explorer", label: "Explorer", icon: Search, external: false, group: "research" },
  { href: "/research/cmgf/series", label: "Series 2026", icon: Layers, external: false, group: "research" },
  { href: "/research/cmgf/downloads", label: "Downloads", icon: Download, external: false, group: "research" },
  { href: "/research/cmgf/library", label: "Library", icon: Library, external: false, group: "research" },
  { href: "/research/demo", label: "Demo", icon: Rocket, external: false, group: "pipeline" },
  { href: "/research/sm-hub", label: "SM Hub", icon: UserCircle, external: false, group: "pipeline" },
  { href: "/research/isr", label: "ISR Queue", icon: ClipboardList, external: false, group: "pipeline" },
  { href: "/research/audit", label: "Audit Trail", icon: Shield, external: false, group: "pipeline" },
];

export function CMGFNav() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-2 mb-4 md:mb-6" data-testid="cmgf-nav">
      <div className="max-w-6xl mx-auto px-3 md:px-6">
        <div className="flex items-center gap-0.5 md:gap-1 overflow-x-auto scrollbar-hide pb-1 -mb-1">
          {navItems.map((item, i) => {
            const isActive = !item.external && (location === item.href || 
              (item.href !== "/cmgf" && location.startsWith(item.href)));
            
            const showDivider = i > 0 && navItems[i - 1].group !== item.group;
            
            return (
              <div key={item.href} className="flex items-center">
                {showDivider && (
                  <div className="w-px h-5 bg-border/60 mx-1 flex-shrink-0" />
                )}
                {item.external ? (
                  <a 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 gap-1.5"
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      <span className="text-xs">{item.label}</span>
                    </Button>
                  </a>
                ) : (
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="flex-shrink-0 gap-1.5"
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      <span className="text-xs">{item.label}</span>
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
          <div className="ml-auto flex-shrink-0">
            <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-400/80" data-testid="badge-demo-data">
              Demonstration Data
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  );
}
