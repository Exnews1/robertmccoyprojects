import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Presentation, Grid3X3 } from "lucide-react";

const presentationData = {
  metadata: {
    title: "AI as Decision Infrastructure for Military Career Mobility",
    audience: "Senior policy, education, and workforce stakeholders",
    duration: "60 minutes",
    author: "RobertMcCoyProjects.com"
  },
  slides: [
    {
      number: 1,
      title: "AI as Decision Infrastructure for Military Career Mobility",
      concept: "Establish the framing of AI as enabling infrastructure, not decision authority.",
      visual: "cover"
    },
    {
      number: 2,
      title: "A Systems Problem, Not an Individual Failure",
      concept: "Career mobility failures emerge from fragmented systems, not from service members.",
      visual: "disconnected"
    },
    {
      number: 3,
      title: "Where Value Is Lost",
      concept: "Misalignment between military experience and civilian labor markets creates systemic loss.",
      visual: "erosion"
    },
    {
      number: 4,
      title: "The Single-Event Fallacy",
      concept: "Transition is incorrectly treated as a moment instead of a process.",
      visual: "contrast"
    },
    {
      number: 5,
      title: "The Missing Capability",
      concept: "Existing systems lack continuous career visibility over time.",
      visual: "timeline"
    },
    {
      number: 6,
      title: "Reframing the Role of AI",
      concept: "AI provides structure and visibility, not answers or prescriptions.",
      visual: "sidebyside"
    },
    {
      number: 7,
      title: "Human Judgment Remains Central",
      concept: "AI supports human advisors and service members without replacing judgment or agency.",
      visual: "partnership"
    },
    {
      number: 8,
      title: "Four Coordinated Signal Domains",
      concept: "Education, credentialing, experience translation, and voice are inputs to a governed system.",
      visual: "hub"
    },
    {
      number: 9,
      title: "Career Planning Is Longitudinal",
      concept: "Career decisions accumulate across service, transition, and post-service life.",
      visual: "pathway"
    },
    {
      number: 10,
      title: "Institutional Learning Without Surveillance",
      concept: "Aggregated, de-identified signals enable policy insight without controlling individuals.",
      visual: "flow"
    },
    {
      number: 11,
      title: "Why This Matters Now",
      concept: "Scale, complexity, and cumulative cost make this a present-day governance issue.",
      visual: "pressure"
    },
    {
      number: 12,
      title: "Extended Materials and Ongoing Work",
      concept: "Direct the audience to deeper research without summarizing it.",
      visual: "handoff"
    }
  ]
};

function SlideVisual({ type }: { type: string }) {
  const baseClasses = "w-full h-48 md:h-64 rounded-lg flex items-center justify-center";
  
  switch (type) {
    case "cover":
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-slate-800 to-slate-900`}>
          <div className="grid grid-cols-3 gap-2 opacity-20">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-12 h-12 border border-slate-500 rounded" />
            ))}
          </div>
        </div>
      );
    case "disconnected":
      return (
        <div className={`${baseClasses} bg-slate-100 dark:bg-slate-800/50`}>
          <div className="flex gap-6">
            {["Education", "Credentials", "Transition", "Employment"].map((label, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded border-2 border-dashed border-slate-400 dark:border-slate-600" />
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "erosion":
      return (
        <div className={`${baseClasses} bg-slate-100 dark:bg-slate-800/50`}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-amber-600/80 rounded" />
            <div className="flex flex-col gap-1">
              <div className="w-32 h-1 bg-slate-300 dark:bg-slate-600" />
              <div className="w-28 h-1 bg-slate-300 dark:bg-slate-600" />
              <div className="w-24 h-1 bg-slate-300 dark:bg-slate-600" />
            </div>
            <div className="w-14 h-14 bg-slate-400/50 rounded" />
          </div>
        </div>
      );
    case "contrast":
      return (
        <div className={`${baseClasses} bg-slate-100 dark:bg-slate-800/50`}>
          <div className="flex gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-600 rounded" />
                <div className="w-12 h-0.5 bg-slate-400" />
                <div className="w-8 h-8 bg-slate-600 rounded" />
              </div>
              <span className="text-[10px] text-muted-foreground">Linear Model</span>
            </div>
            <div className="w-px h-16 bg-slate-300 dark:bg-slate-600" />
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 bg-slate-600 rounded" />
                <div className="absolute -right-6 -top-4 w-6 h-6 bg-slate-400 rounded opacity-60" />
                <div className="absolute -right-8 top-6 w-6 h-6 bg-slate-400 rounded opacity-40" />
                <div className="absolute right-4 -bottom-4 w-6 h-6 bg-slate-400 rounded opacity-50" />
              </div>
              <span className="text-[10px] text-muted-foreground mt-4">Reality</span>
            </div>
          </div>
        </div>
      );
    case "timeline":
      return (
        <div className={`${baseClasses} bg-slate-100 dark:bg-slate-800/50`}>
          <div className="flex flex-col gap-3 w-3/4">
            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-slate-700 dark:bg-slate-600 rounded text-[8px] text-white flex items-center justify-center">Entry</div>
              <div className="flex-1 h-4 bg-slate-300/50 dark:bg-slate-700/50 rounded relative overflow-hidden">
                <div className="absolute inset-y-0 left-1/4 right-1/2 bg-slate-400/30 dark:bg-slate-500/30" />
              </div>
              <div className="w-16 h-6 bg-slate-500 rounded text-[8px] text-white flex items-center justify-center">Exit</div>
            </div>
            <div className="text-center text-[10px] text-muted-foreground">Blind spots across career lifecycle</div>
          </div>
        </div>
      );
    case "sidebyside":
      return (
        <div className={`${baseClasses} bg-slate-100 dark:bg-slate-800/50`}>
          <div className="flex gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500/40 rounded flex items-center justify-center">
                <span className="text-red-500 text-2xl font-bold">AI</span>
              </div>
              <span className="text-[10px] text-red-500">Decision Authority</span>
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground text-xl">vs</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500/40 rounded flex items-center justify-center">
                <span className="text-green-600 text-2xl font-bold">AI</span>
              </div>
              <span className="text-[10px] text-green-600">Infrastructure</span>
            </div>
          </div>
        </div>
      );
    case "partnership":
      return (
        <div className={`${baseClasses} bg-slate-100 dark:bg-slate-800/50`}>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-slate-600 dark:border-slate-400" />
              <span className="text-[10px] text-muted-foreground">Human</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-20 h-1 bg-amber-500/60" />
              <div className="w-20 h-1 bg-amber-500/60" />
              <div className="w-20 h-1 bg-amber-500/60" />
            </div>
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground">System</span>
            </div>
          </div>
        </div>
      );
    case "hub":
      return (
        <div className={`${baseClasses} bg-slate-100 dark:bg-slate-800/50`}>
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-slate-700 dark:bg-slate-600 flex items-center justify-center">
              <span className="text-[10px] text-white text-center">Governed<br/>Framework</span>
            </div>
            {["Education", "Credentials", "Translation", "Voice"].map((label, i) => {
              const positions = [
                { top: "-40px", left: "50%", transform: "translateX(-50%)" },
                { top: "50%", right: "-50px", transform: "translateY(-50%)" },
                { bottom: "-40px", left: "50%", transform: "translateX(-50%)" },
                { top: "50%", left: "-50px", transform: "translateY(-50%)" }
              ];
              return (
                <div key={i} className="absolute flex flex-col items-center" style={positions[i] as React.CSSProperties}>
                  <div className="w-10 h-10 rounded bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                    <span className="text-[8px] text-center">{label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    case "pathway":
      return (
        <div className={`${baseClasses} bg-slate-100 dark:bg-slate-800/50`}>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-700 dark:bg-slate-500 rounded text-[8px] text-white flex items-center justify-center">Start</div>
            <div className="flex flex-col gap-3">
              <div className="w-24 h-1 bg-slate-400" />
              <div className="flex gap-2">
                <div className="w-16 h-1 bg-slate-400" />
                <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded" />
              </div>
              <div className="w-20 h-1 bg-slate-400" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded" />
              <div className="w-16 h-1 bg-slate-400" />
              <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded" />
            </div>
            <div className="w-12 h-1 bg-slate-400" />
            <div className="w-10 h-10 bg-amber-600/80 rounded text-[8px] text-white flex items-center justify-center">Now</div>
          </div>
        </div>
      );
    case "flow":
      return (
        <div className={`${baseClasses} bg-slate-100 dark:bg-slate-800/50`}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-10 bg-slate-300 dark:bg-slate-600 rounded flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground">Policy Insight</span>
            </div>
            <div className="flex gap-1">
              <div className="w-0.5 h-8 bg-slate-400" />
              <div className="w-0.5 h-8 bg-slate-400" />
              <div className="w-0.5 h-8 bg-slate-400" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-slate-400/50 dark:bg-slate-500/50" />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">Aggregated, De-identified Signals</span>
          </div>
        </div>
      );
    case "pressure":
      return (
        <div className={`${baseClasses} bg-slate-100 dark:bg-slate-800/50`}>
          <div className="flex items-end gap-2 h-32">
            {[20, 35, 45, 55, 70, 85, 95].map((h, i) => (
              <div 
                key={i} 
                className="w-8 bg-gradient-to-t from-slate-600 to-slate-400 dark:from-slate-500 dark:to-slate-700 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      );
    case "handoff":
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-slate-800 to-slate-900`}>
          <div className="text-center space-y-3">
            <div className="text-white/80 text-sm font-medium">Extended Materials Available</div>
            <div className="flex flex-wrap justify-center gap-2">
              {["Research Paper", "Academic Deck", "V1 Framework", "Reference Explorer"].map((item) => (
                <span key={item} className="px-3 py-1 bg-white/10 rounded text-[10px] text-white/70">{item}</span>
              ))}
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className={`${baseClasses} bg-slate-100 dark:bg-slate-800/50`}>
          <div className="w-16 h-16 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded" />
        </div>
      );
  }
}

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<"slide" | "grid">("slide");
  const slides = presentationData.slides;
  const totalSlides = slides.length;

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
    setViewMode("slide");
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {presentationData.metadata.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {presentationData.metadata.audience} | {presentationData.metadata.duration}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "slide" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("slide")}
              data-testid="button-view-slide"
            >
              <Presentation className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "slide" ? (
          <div className="space-y-6">
            <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-[16/9] bg-white dark:bg-slate-900 flex flex-col">
                  <div className="flex-1 p-8 md:p-12 flex flex-col">
                    <div className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-4">
                      {String(slides[currentSlide].number).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 font-serif">
                      {slides[currentSlide].title}
                    </h2>
                    
                    <SlideVisual type={slides[currentSlide].visual} />
                    
                    <p className="mt-6 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl">
                      {slides[currentSlide].concept}
                    </p>
                  </div>
                  
                  <div className="border-t border-slate-100 dark:border-slate-800 px-8 py-3 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      Supporting research, academic materials, and reference explorer available at RobertMcCoyProjects.com
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                data-testid="button-prev-slide"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentSlide 
                        ? "bg-slate-700 dark:bg-slate-300" 
                        : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                    }`}
                    data-testid={`button-slide-dot-${i}`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
                data-testid="button-next-slide"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {slides.map((slide, i) => (
              <Card 
                key={i}
                className="cursor-pointer hover-elevate overflow-hidden border-slate-200 dark:border-slate-800"
                onClick={() => goToSlide(i)}
                data-testid={`card-slide-thumb-${i}`}
              >
                <CardContent className="p-0">
                  <div className="aspect-[16/9] bg-white dark:bg-slate-900 p-3 flex flex-col">
                    <span className="text-[8px] font-mono text-slate-400 mb-1">
                      {String(slide.number).padStart(2, "0")}
                    </span>
                    <h3 className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 mb-2">
                      {slide.title}
                    </h3>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                      <div className="w-6 h-6 border border-dashed border-slate-300 dark:border-slate-600 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Use arrow keys or buttons to navigate | Press G for grid view
          </p>
        </div>
      </div>
    </div>
  );
}
