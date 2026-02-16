import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Download, Library, Search, Layers, ExternalLink } from "lucide-react";

const navItems = [
  { href: "/cmgf", label: "CMGF", icon: Home, external: false },
  { href: "/cmgf/five-pillars", label: "Five Pillars", icon: Layers, external: false },
  { href: "/explorer", label: "Reference Explorer", icon: Search, external: false },
  { href: "https://cmgfdemo.robertmccoyprojects.com", label: "Walkthrough", icon: ExternalLink, external: true },
  { href: "/cmgf/series", label: "Series 2026", icon: Layers, external: false },
  { href: "/cmgf/downloads", label: "Downloads", icon: Download, external: false },
  { href: "/cmgf/library", label: "Library", icon: Library, external: false },
];

export function CMGFNav() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-2 mb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = !item.external && (location === item.href || 
              (item.href !== "/cmgf" && location.startsWith(item.href)));
            
            if (item.external) {
              return (
                <a 
                  key={item.href} 
                  href={item.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 gap-1.5"
                    data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                </a>
              );
            }
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="flex-shrink-0 gap-1.5"
                  data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
