import { Switch, Route } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import ConsultingHome from "@/pages/consulting-home";
import ConsultingAbout from "@/pages/consulting-about";
import ConsultingServices from "@/pages/consulting-services";
import ConsultingContact from "@/pages/consulting-contact";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import CMGFRoot from "@/pages/cmgf/index";
import Downloads from "@/pages/cmgf/downloads";
import CMGFSeries from "@/pages/cmgf/series";
import Walkthrough from "@/pages/cmgf/walkthrough/index";
import PartA from "@/pages/cmgf/walkthrough/part-a";
import PartB from "@/pages/cmgf/walkthrough/part-b";
import PartC from "@/pages/cmgf/walkthrough/part-c";
import Library from "@/pages/cmgf/library";
import Engagement from "@/pages/cmgf/engagement";
import FivePillars from "@/pages/cmgf/five-pillars";
import PresidentialReport from "@/pages/cmgf/presidential-report";
import Explorer from "@/pages/explorer";
import Contact from "@/pages/contact";
import EducationAI from "@/pages/education-ai/index";
import Profile from "@/pages/profile";
import UniversitiesAI from "@/pages/universities-ai/index";
import IncarcerationResearch from "@/pages/incarceration-research/index";
import IncarcerationHardTruths from "@/pages/incarceration-research/hard-truths";
import HumanCapitalFramework from "@/pages/human-capital/index";
import AITypes from "@/pages/ai-types/index";
import WorkforceAI from "@/pages/workforce-ai/index";
import OngoingResearch from "@/pages/ongoing-research";
import References from "@/pages/references";
import Bio from "@/pages/bio";
import Dashboard from "@/pages/cmgf/dashboard";
import ConferenceAnalytics from "@/pages/cmgf/analytics";
import DemoMode from "@/pages/demo-mode";
import IsrQueue from "@/pages/isr-queue";
import AuditTrail from "@/pages/audit-trail";
import SMHub from "@/pages/sm-hub";
import { PersonaProvider } from "@/components/persona-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccessibilityControls } from "@/components/accessibility-controls";
import { TopNav } from "@/components/top-nav";
import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Users, Eye, Rocket, FileDown, BookOpen } from "lucide-react";

export function useTrackEvent(key: string) {
  const hasTracked = useRef(false);
  useEffect(() => {
    if (!hasTracked.current) {
      hasTracked.current = true;
      apiRequest("POST", `/api/stats/${key}`).catch(() => {});
    }
  }, [key]);
}

export function useTrackClick(key: string) {
  return useCallback(() => {
    apiRequest("POST", `/api/stats/${key}`).catch(() => {});
  }, [key]);
}

function Footer() {
  const hasTracked = useRef(false);
  
  const { data: visitorData } = useQuery<{ count: number }>({
    queryKey: ["/api/visitors"],
  });

  const { data: statsData } = useQuery<Record<string, number>>({
    queryKey: ["/api/stats"],
  });

  useEffect(() => {
    if (!hasTracked.current) {
      hasTracked.current = true;
      apiRequest("POST", "/api/visitors").catch(() => {});
    }
  }, []);

  return (
    <footer className="border-t border-border/50 bg-card/30 py-6 mt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
        <a 
          href="mailto:robert.mccoy@thegovernanceframework.com" 
          className="hover:text-muted-foreground transition-colors"
          data-testid="link-footer-email"
        >
          robert.mccoy@thegovernanceframework.com
        </a>
        <div className="flex items-center gap-4 flex-wrap" data-testid="footer-counters">
          <div className="flex items-center gap-1.5" data-testid="counter-root-visits">
            <Eye className="w-3 h-3" />
            <span>{statsData?.root_visits?.toLocaleString() || "0"}</span>
          </div>
          <div className="flex items-center gap-1.5" data-testid="counter-cmgf-visits">
            <BookOpen className="w-3 h-3" />
            <span>{statsData?.cmgf_visits?.toLocaleString() || "0"}</span>
          </div>
          <div className="flex items-center gap-1.5" data-testid="counter-demo-launches">
            <Rocket className="w-3 h-3" />
            <span>{statsData?.demo_launches?.toLocaleString() || "0"}</span>
          </div>
          <div className="flex items-center gap-1.5" data-testid="counter-paper-downloads">
            <FileDown className="w-3 h-3" />
            <span>{statsData?.paper_downloads?.toLocaleString() || "0"}</span>
          </div>
          <div className="flex items-center gap-1.5" data-testid="counter-visitors">
            <Users className="w-3 h-3" />
            <span>{visitorData?.count?.toLocaleString() || "0"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SiteHeader() {
  const [location] = useLocation();
  const isResearch = location.startsWith("/research");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {isResearch ? (
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-bold tracking-wide text-foreground hover:text-primary transition-colors" data-testid="link-home">
              Robert McCoy
            </a>
            <span className="text-muted-foreground/50">|</span>
            <span className="text-sm text-muted-foreground">Research Portfolio</span>
          </div>
        ) : (
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" data-testid="link-home">
            <span className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: '#1a2e4a', fontFamily: 'Georgia, "Times New Roman", serif' }}>RM</span>
            <span className="w-px h-8 bg-border/60 hidden sm:block" />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold tracking-wide" style={{ color: '#1a2e4a' }}>Robert McCoy</span>
              <span className="text-[10px] text-muted-foreground tracking-wide">AI Governance and Systems Consulting</span>
            </div>
          </a>
        )}
        <div className="flex items-center gap-1">
          <AccessibilityControls />
          <ThemeToggle />
        </div>
      </div>
      <TopNav />
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={ConsultingHome} />
      <Route path="/about" component={ConsultingAbout} />
      <Route path="/services" component={ConsultingServices} />
      <Route path="/contact" component={ConsultingContact} />
      <Route path="/research" component={Landing} />
      <Route path="/research/portfolio" component={Home} />
      <Route path="/research/cmgf" component={CMGFRoot} />
      <Route path="/research/cmgf/series" component={CMGFSeries} />
      <Route path="/research/cmgf/downloads" component={Downloads} />
      <Route path="/research/cmgf/walkthrough" component={Walkthrough} />
      <Route path="/research/cmgf/walkthrough/part-a" component={PartA} />
      <Route path="/research/cmgf/walkthrough/part-b" component={PartB} />
      <Route path="/research/cmgf/walkthrough/part-c" component={PartC} />
      <Route path="/research/cmgf/library" component={Library} />
      <Route path="/research/cmgf/engagement" component={Engagement} />
      <Route path="/research/cmgf/five-pillars" component={FivePillars} />
      <Route path="/research/cmgf/dashboard" component={Dashboard} />
      <Route path="/research/cmgf/analytics" component={ConferenceAnalytics} />
      <Route path="/research/cmgf/presidential-report" component={PresidentialReport} />
      <Route path="/research/cmgf/explorer" component={Explorer} />
      <Route path="/research/explorer" component={Explorer} />
      <Route path="/research/education-ai" component={EducationAI} />
      <Route path="/research/universities-ai" component={UniversitiesAI} />
      <Route path="/research/incarceration-research" component={IncarcerationResearch} />
      <Route path="/research/incarceration-research/hard-truths" component={IncarcerationHardTruths} />
      <Route path="/research/human-capital" component={HumanCapitalFramework} />
      <Route path="/research/ai-types" component={AITypes} />
      <Route path="/research/workforce-ai" component={WorkforceAI} />
      <Route path="/research/research-portfolio" component={OngoingResearch} />
      <Route path="/research/references" component={References} />
      <Route path="/research/bio" component={Bio} />
      <Route path="/research/profile" component={Profile} />
      <Route path="/research/demo" component={DemoMode} />
      <Route path="/research/sm-hub" component={SMHub} />
      <Route path="/research/isr" component={IsrQueue} />
      <Route path="/research/audit" component={AuditTrail} />
      <Route path="/research/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PersonaProvider>
          <div className="min-h-screen bg-background">
            <SiteHeader />
            <main>
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </PersonaProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
