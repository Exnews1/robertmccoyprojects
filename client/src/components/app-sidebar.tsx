import { Home, FileText, BarChart2, Shield, BookOpen, Download, ExternalLink, Database } from "lucide-react";
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
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent>
        {/* PRIMARY DOCUMENTS - Front and Center */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 dark:text-slate-400/80 font-mono text-[10px] uppercase tracking-[0.2em] px-6 mb-2">
            PRIMARY DOCUMENTS
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-3 px-3 border-primary/30 bg-primary/5"
              asChild
              data-testid="sidebar-download-cmgf-01"
            >
              <a href="/attached_assets/CMGF-01_Executive_White_Paper_1771217538094.docx" download>
                <FileText className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <div className="text-xs font-semibold">CMGF-01 Executive White Paper</div>
                  <div className="text-[10px] text-muted-foreground">McCoy (2026) - DOCX</div>
                </div>
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-3 px-3 border-primary/30 bg-primary/5"
              asChild
              data-testid="sidebar-download-cmgf-02"
            >
              <a href="/attached_assets/CMGF-02_Policy_Governance_Architecture_Brief_1771217538094.docx" download>
                <Shield className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <div className="text-xs font-semibold">CMGF-02 Policy & Governance</div>
                  <div className="text-[10px] text-muted-foreground">McCoy (2026) - DOCX</div>
                </div>
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-3 px-3 border-primary/30 bg-primary/5"
              asChild
              data-testid="sidebar-download-cmgf-03"
            >
              <a href="/attached_assets/CMGF-03_Data_Flow_Signal_Provenance_Brief_1771217538095.docx" download>
                <Database className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <div className="text-xs font-semibold">CMGF-03 Data Flow & Provenance</div>
                  <div className="text-[10px] text-muted-foreground">McCoy (2026) - DOCX</div>
                </div>
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-3 px-3 border-border"
              asChild
              data-testid="sidebar-link-nist"
            >
              <a href="https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <div className="text-xs font-semibold">NIST AI RMF 1.0</div>
                  <div className="text-[10px] text-muted-foreground">Framework - PDF</div>
                </div>
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-3 px-3 border-border"
              asChild
              data-testid="sidebar-link-eo14110"
            >
              <a href="https://www.federalregister.gov/documents/2023/11/01/2023-24283/safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <div className="text-xs font-semibold">EO 14179</div>
                  <div className="text-[10px] text-muted-foreground">Executive Order - PDF</div>
                </div>
              </a>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4 bg-border" />

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
