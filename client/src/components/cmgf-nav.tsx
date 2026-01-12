import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Download, Library, User, Users, Cpu } from "lucide-react";

const navItems = [
  { href: "/cmgf", label: "CMGF", icon: Home },
  { href: "/cmgf/walkthrough", label: "Walkthrough", icon: BookOpen },
  { href: "/cmgf/walkthrough/part-a", label: "Part A", icon: User },
  { href: "/cmgf/walkthrough/part-b", label: "Part B", icon: Cpu },
  { href: "/cmgf/walkthrough/part-c", label: "Part C", icon: Users },
  { href: "/cmgf/downloads", label: "Downloads", icon: Download },
  { href: "/cmgf/library", label: "Library", icon: Library },
];

export function CMGFNav() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-2 mb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/cmgf" && location.startsWith(item.href));
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
