import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Shield, Award, GraduationCap, Briefcase,
  Building2, Plane, BookOpen, Users, Bot, ExternalLink,
  ChevronRight, Mail, ArrowRight
} from "lucide-react";
import { SiLinkedin } from "react-icons/si";

const timeline = [
  {
    era: "Military Service",
    years: "1970s–1990s",
    color: "hsl(210, 30%, 40%)",
    items: [
      { role: "Sonar Technician", org: "U.S. Navy", detail: "Active duty service" },
      { role: "Chief Warrant Officer & Aviator", org: "U.S. Army", detail: "9.5 years active duty" },
      { role: "Presidential Support Staff", org: "U.S. Military", detail: "21+ years combined service" },
    ]
  },
  {
    era: "Aerospace & Defense",
    years: "1990s–2010s",
    color: "hsl(260, 40%, 50%)",
    items: [
      { role: "Director of Operations", org: "Belcan Corporation", detail: "$42M+ in annual contracts" },
      { role: "Program Contributor", org: "Lockheed Martin / NASA", detail: "F-35 Joint Strike Fighter, Martian Lander" },
    ]
  },
  {
    era: "Education & Research",
    years: "2010s–Present",
    color: "hsl(200, 70%, 50%)",
    items: [
      { role: "Military Partnership Executive", org: "Indiana Wesleyan University", detail: "Veterans workforce & STEM initiatives" },
      { role: "Board Member", org: "MidSouth Advisory Council on Military Education", detail: "Military education policy" },
      { role: "CMGF Author & Researcher", org: "CCME 2026 Learner Track", detail: "Bounded AI for career transitions" },
    ]
  }
];

const credentials = [
  { degree: "M.S. Artificial Intelligence & Data Analytics", school: "Indiana Wesleyan University" },
  { degree: "MBA", school: "Indiana Wesleyan University" },
  { degree: "B.S. Aeronautics", school: "" },
];

const researchHighlights = [
  {
    title: "Career Mobility Governance Framework",
    tag: "CMGF",
    description: "A three-part bounded AI architecture for military-to-civilian career transitions. Presented at CCME 2026.",
    href: "/cmgf"
  },
  {
    title: "AI Education Futures Hub",
    tag: "557 Papers",
    description: "Evidence-based implementation pathways for AI across K-12, higher ed, vocational, and corporate sectors.",
    href: "/education-ai"
  },
  {
    title: "Human Capital Throughput Framework",
    tag: "453 Papers",
    description: "Comparative analysis of military and correctional education systems. Modeling institutional efficiency gaps.",
    href: "/human-capital"
  },
  {
    title: "U.S. Incarceration Research Hub",
    tag: "728 Papers",
    description: "Comprehensive criminal justice data analysis with state-level policy comparisons and demographic breakdowns.",
    href: "/incarceration-research"
  }
];

const knowledgeSystems = [
  { title: "Professional Staffing", url: "https://prostaff.robertmccoyprojects.com" },
  { title: "Non-Profit Services", url: "https://valley.robertmccoyprojects.com" },
  { title: "Construction Management", url: "https://construction.robertmccoyprojects.com" },
  { title: "Regional Aviation (FBO)", url: "https://regionalfbo.robertmccoyprojects.com" },
  { title: "Small Aviation (FBO)", url: "https://forrestfbosmall.robertmccoyprojects.com" },
  { title: "HVAC Services", url: "https://hvac.robertmccoyprojects.com" },
];

export default function Bio() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="link-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Bio</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">

        <section className="py-20 md:py-28 border-b border-border" data-testid="section-bio-hero">
          <div className="max-w-3xl">
            <p className="text-sm font-mono uppercase tracking-widest text-primary mb-6" data-testid="text-bio-label">
              Researcher / Builder / Veteran
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-8" data-testid="text-bio-name">
              Robert E. McCoy
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Lifelong servant-leader bridging military service, aerospace engineering, and AI-governed education systems. Five decades of building things that matter.
            </p>
            <div className="flex flex-wrap gap-3">
              {credentials.map((c) => (
                <div key={c.degree} className="flex items-center gap-2 text-sm text-foreground bg-muted/50 px-4 py-2 rounded-md border border-border">
                  <GraduationCap className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{c.degree}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border" data-testid="section-bio-about">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground sticky top-20">About</p>
            </div>
            <div className="md:col-span-8 space-y-6 text-foreground leading-relaxed">
              <p className="text-lg">
                Robert McCoy is an aerospace executive, education advocate, and AI governance researcher whose career spans over five decades across military, engineering, and community leadership.
              </p>
              <p>
                With a foundation forged in both the United States Army and Navy, Robert served over 21 years in the U.S. military, including nine and a half years on active duty. He held roles as a Sonar Technician in the Navy and later as a Chief Warrant Officer and Aviator in the Army, with assignments that included Presidential Support Staff.
              </p>
              <p>
                Following military service, he transitioned into the aerospace and defense sector, contributing to programs like the F-35 Joint Strike Fighter and NASA's Martian Lander. As Director of Operations for Belcan Corporation, he oversaw more than $42 million in annual contracts.
              </p>
              <p>
                Today, Robert serves as the Military Partnership Executive at Indiana Wesleyan University, building strategic education and workforce initiatives that connect veterans with high-demand careers in STEM, aerospace, and emerging technologies. He also serves on the board of the MidSouth Advisory Council on Military Education.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border" data-testid="section-bio-timeline">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground sticky top-20">Career Timeline</p>
            </div>
            <div className="md:col-span-8 space-y-12">
              {timeline.map((era) => (
                <div key={era.era} data-testid={`timeline-era-${era.era.replace(/\s+/g, '-').toLowerCase()}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: era.color }} />
                    <h3 className="text-lg font-bold text-foreground">{era.era}</h3>
                    <span className="text-sm text-muted-foreground font-mono">{era.years}</span>
                  </div>
                  <div className="ml-1.5 pl-6 border-l-2 space-y-6" style={{ borderColor: `${era.color}40` }}>
                    {era.items.map((item, idx) => (
                      <div key={idx} className="relative" data-testid={`timeline-item-${era.era.replace(/\s+/g, '-').toLowerCase()}-${idx}`}>
                        <div
                          className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-background"
                          style={{ borderColor: era.color }}
                        />
                        <p className="font-semibold text-foreground">{item.role}</p>
                        <p className="text-sm text-primary">{item.org}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border" data-testid="section-bio-research">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground sticky top-20">Research</p>
            </div>
            <div className="md:col-span-8 space-y-4">
              {researchHighlights.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="group flex items-start justify-between gap-4 py-5 px-5 -mx-5 rounded-md hover-elevate cursor-pointer" data-testid={`bio-research-${item.href.replace(/\//g, '-')}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <Badge variant="outline" className="text-[10px] font-mono">{item.tag}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border" data-testid="section-bio-systems">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground sticky top-20">Knowledge Systems</p>
              <p className="text-sm text-muted-foreground mt-2 hidden md:block">6 live organizational AI deployments</p>
            </div>
            <div className="md:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {knowledgeSystems.map((sys) => (
                  <a
                    key={sys.url}
                    href={sys.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 py-3 px-4 rounded-md border border-border hover-elevate cursor-pointer group"
                    data-testid={`bio-system-${sys.title.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 no-default-hover-elevate text-[9px] px-1.5">
                        Live
                      </Badge>
                      <span className="text-sm font-medium text-foreground truncate">{sys.title}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20" data-testid="section-bio-connect">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Connect</p>
            </div>
            <div className="md:col-span-8">
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:data@robertmccoyprojects.com"
                  className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  data-testid="bio-link-email"
                >
                  <Mail className="w-4 h-4" />
                  data@robertmccoyprojects.com
                </a>
                <a
                  href="https://www.linkedin.com/in/robert-mccoy-mba-9451142a0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  data-testid="bio-link-linkedin"
                >
                  <SiLinkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild data-testid="bio-button-cmgf">
                  <Link href="/cmgf">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View CMGF Research
                  </Link>
                </Button>
                <Button variant="outline" asChild data-testid="bio-button-profile">
                  <Link href="/profile">
                    <Users className="w-4 h-4 mr-2" />
                    Full Systems Profile
                  </Link>
                </Button>
                <Button variant="outline" asChild data-testid="bio-button-contact">
                  <Link href="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
