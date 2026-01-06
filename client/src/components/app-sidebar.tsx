import { Home, FileText, BarChart2, Shield } from "lucide-react";
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
} from "@/components/ui/sidebar";

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
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/50 font-mono text-[10px] uppercase tracking-[0.2em] px-6 mb-4">
            CORE INFRASTRUCTURE
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
