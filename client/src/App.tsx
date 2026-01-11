import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Portfolio from "@/pages/portfolio";
import CMGFRoot from "@/pages/cmgf/index";
import Downloads from "@/pages/cmgf/downloads";
import Walkthrough from "@/pages/cmgf/walkthrough/index";
import PartA from "@/pages/cmgf/walkthrough/part-a";
import PartB from "@/pages/cmgf/walkthrough/part-b";
import PartC from "@/pages/cmgf/walkthrough/part-c";
import Library from "@/pages/cmgf/library";
import Engagement from "@/pages/cmgf/engagement";
import { ThemeToggle } from "@/components/theme-toggle";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route path="/cmgf" component={CMGFRoot} />
      <Route path="/cmgf/downloads" component={Downloads} />
      <Route path="/cmgf/walkthrough" component={Walkthrough} />
      <Route path="/cmgf/walkthrough/part-a" component={PartA} />
      <Route path="/cmgf/walkthrough/part-b" component={PartB} />
      <Route path="/cmgf/walkthrough/part-c" component={PartC} />
      <Route path="/cmgf/library" component={Library} />
      <Route path="/cmgf/engagement" component={Engagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a href="/" className="text-sm font-bold tracking-wide text-foreground hover:text-primary transition-colors" data-testid="link-home">
                  Robert McCoy
                </a>
                <span className="text-muted-foreground/50">|</span>
                <a 
                  href="mailto:robert.mccoy@indwes.edu" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-header-email"
                >
                  robert.mccoy@indwes.edu
                </a>
              </div>
              <ThemeToggle />
            </div>
          </header>
          <main>
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
