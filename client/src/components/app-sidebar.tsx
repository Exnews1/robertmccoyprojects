import { Home, FileText, BarChart2, Shield, BookOpen, Download, Presentation } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const items = [
  {
    title: "OPERATIONS_CENTER",
    url: "/",
    icon: Home,
  },
  {
    title: "RESEARCH_LEDGER",
    url: "/publications",
    icon: FileText,
  },
  {
    title: "REFERENCE_DOCUMENTS",
    url: "/references",
    icon: BookOpen,
  },
  {
    title: "REGULATORY_FRAMEWORKS",
    url: "/#frameworks",
    icon: Shield,
  },
  {
    title: "GAP_ANALYSIS",
    url: "/#analysis",
    icon: BarChart2,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r border-primary/10 bg-slate-950/50 backdrop-blur-md">
      <SidebarContent>
        {/* PRIMARY DOCUMENTS - Front and Center */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-fuchsia-400/80 font-mono text-[10px] uppercase tracking-[0.2em] px-6 mb-2">
            PRIMARY DOCUMENTS
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-3 px-3 border-fuchsia-500/30 bg-fuchsia-500/5"
              asChild
              data-testid="sidebar-download-paper"
            >
              <a href="/attached_assets/Career_Mobility_2026__CCME_1767731035930.docx" download>
                <Download className="w-4 h-4 text-fuchsia-400" />
                <div className="text-left">
                  <div className="text-xs font-semibold">CMGF Paper</div>
                  <div className="text-[10px] text-muted-foreground">McCoy (2026) - DOCX</div>
                </div>
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-3 px-3 border-primary/30 bg-primary/5"
              asChild
              data-testid="sidebar-download-presentation"
            >
              <a href="/attached_assets/CCME_2026_1767730819889.pdf" download>
                <Presentation className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <div className="text-xs font-semibold">CCME 2026 Slides</div>
                  <div className="text-[10px] text-muted-foreground">Presentation - PDF</div>
                </div>
              </a>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4 bg-neutral-700/50" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/50 font-mono text-[10px] uppercase tracking-[0.2em] px-6 mb-4">
            NAVIGATION
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    className="h-11 rounded-lg hover-elevate data-[active=true]:bg-primary/10 data-[active=true]:text-primary transition-all duration-300"
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium tracking-tight">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
