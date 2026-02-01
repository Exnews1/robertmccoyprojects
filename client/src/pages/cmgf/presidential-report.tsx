import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";

export default function PresidentialReport() {
  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/cmgf/downloads">
          <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground" data-testid="button-back-downloads">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Downloads
          </Button>
        </Link>

        <article className="max-w-none">
          <header className="border-b-2 border-foreground pb-8 mb-10">
            <div className="text-center">
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4" data-testid="text-document-type">
                Policy Brief
              </p>
              <h1 className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-foreground mb-4" data-testid="text-report-title">
                From Fragmentation to Integration
              </h1>
              <p className="text-xl md:text-2xl font-serif font-light text-foreground/80 mb-6" data-testid="text-report-subtitle">
                A New Vision for Military Transition
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground" data-testid="text-report-meta">
                <span>The Career Mobility Governance Framework</span>
                <span>•</span>
                <span>January 2026</span>
              </div>
            </div>
          </header>

          <section className="mb-12" data-testid="section-executive-summary">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-foreground border-b border-border pb-2 mb-6">
              Executive Summary
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Each year, approximately 200,000 servicemembers transition from military to civilian life. Despite significant federal investment in transition programs, outcomes remain inconsistent. The fundamental challenge is not a lack of programs—it is a lack of integration.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Career Mobility Governance Framework (CMGF) proposes a governance-first approach to military transition that unifies existing systems rather than replacing them. This framework positions itself as institutional infrastructure—a "binder layer" that connects Installation Status Reports, Education Service Officers, credentialing bodies, and civilian institutions into a coherent decision-support ecosystem.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This brief outlines the policy rationale, research foundation, and implementation pathway for CMGF as a national initiative.
            </p>
          </section>

          <section className="mb-12" data-testid="section-current-state">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-foreground border-b border-border pb-2 mb-6">
              The Current State
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Fragmented Systems</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Military transition currently operates through disconnected channels: Transition Assistance Programs (TAP), Education Service Officers, credentialing agencies, state licensing boards, and civilian higher education institutions. Each system maintains its own data, processes, and accountability structures with minimal cross-system visibility.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Information Asymmetry</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Servicemembers navigate these systems without comprehensive visibility into their options. Credit articulation, credential recognition, and career pathway data exist in silos. Advisors lack unified tools to provide evidence-based guidance tailored to individual circumstances.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Underutilized Research</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A substantial body of peer-reviewed research exists on military transition, adult learning, and workforce development. This evidence base remains largely disconnected from the tools and processes that shape transition decisions.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12" data-testid="section-research-foundation">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-foreground border-b border-border pb-2 mb-6">
              Research Foundation
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              CMGF is grounded in systematic analysis of 797 peer-reviewed sources spanning military education, workforce development, credentialing, and transition outcomes. This research base is organized around five pillars:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-4">
              <li><strong className="text-foreground">Military Learner Career Mobility</strong> — Understanding the unique trajectory of military-connected learners</li>
              <li><strong className="text-foreground">Empowerment Strategies & Stackable Pathways</strong> — Building credential sequences that maximize portability</li>
              <li><strong className="text-foreground">Tools & Frameworks for Career Advising</strong> — Decision-support infrastructure for advisors and servicemembers</li>
              <li><strong className="text-foreground">Translating Military Experience</strong> — Methods for articulating military competencies in civilian terms</li>
              <li><strong className="text-foreground">Veteran & Servicemember Learner Voice</strong> — Centering the transition experience in policy design</li>
            </ol>
          </section>

          <section className="mb-12" data-testid="section-binder-layer">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-foreground border-b border-border pb-2 mb-6">
              The Binder Layer Concept
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              CMGF introduces the concept of a "binder layer"—governance infrastructure that connects existing systems without replacing them. This approach:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
              <li>Preserves institutional autonomy and existing investments</li>
              <li>Creates interoperability through shared data standards</li>
              <li>Enables population-level learning from transition outcomes</li>
              <li>Supports human decision-makers with evidence-based context</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              The framework explicitly rejects surveillance, predictive scoring, or automated decision-making. Human authority remains at the center of every transition decision.
            </p>
          </section>

          <section className="mb-12" data-testid="section-governance-constraints">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-foreground border-b border-border pb-2 mb-6">
              Governance Constraints
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              CMGF is defined as much by what it will not do as by what it will do. Non-negotiable constraints include:
            </p>
            <div className="bg-muted/50 border border-border p-6 my-6">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground/60 mt-1">—</span>
                  <span><strong className="text-foreground">No predictive outcome scoring</strong> of individual servicemembers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground/60 mt-1">—</span>
                  <span><strong className="text-foreground">No individual risk classification</strong> or success probability ratings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground/60 mt-1">—</span>
                  <span><strong className="text-foreground">No automated approvals</strong> or denials of transition resources</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground/60 mt-1">—</span>
                  <span><strong className="text-foreground">No surveillance framing</strong> or behavioral monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground/60 mt-1">—</span>
                  <span><strong className="text-foreground">Population-level learning only</strong>—insights derived from aggregate patterns, not individual tracking</span>
                </li>
              </ul>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              These constraints distinguish CMGF from typical technology modernization initiatives. The framework is governance infrastructure, not a predictive analytics platform.
            </p>
          </section>

          <section className="mb-12" data-testid="section-implementation">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-foreground border-b border-border pb-2 mb-6">
              Implementation Pathway
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Phase 1: Standards Development</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Establish interoperability standards for credit articulation, credential recognition, and outcome tracking across DoD, VA, and civilian institutions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Phase 2: Pilot Integration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Deploy binder layer infrastructure at select installations, connecting existing ESO workflows with credentialing databases and institutional partnerships.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Phase 3: National Scaling</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Extend framework to all service branches and transition points, with governance oversight through established military education channels.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12" data-testid="section-policy-considerations">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-foreground border-b border-border pb-2 mb-6">
              Policy Considerations
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Interagency Coordination</h3>
                <p className="text-muted-foreground leading-relaxed">
                  CMGF requires coordination between DoD, VA, Department of Education, and Department of Labor. The framework's governance-first approach positions it as shared infrastructure rather than a single agency's initiative.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Data Governance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Clear policies must govern data sharing, retention, and use. The framework's prohibition on individual-level prediction simplifies compliance requirements while maintaining analytical value.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Institutional Partnerships</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Civilian institutions participate voluntarily through standardized integration protocols. Incentive structures should reward participation without mandating adoption.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Oversight Mechanisms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The framework should include standing governance bodies representing all stakeholder groups, with explicit authority to enforce constraint boundaries.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12" data-testid="section-conclusion">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-foreground border-b border-border pb-2 mb-6">
              Conclusion
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The challenge of military transition is not a technology problem to be solved, but a coordination problem to be governed. CMGF offers a framework for connecting existing systems, surfacing existing research, and supporting existing advisors—without displacing the human judgment that must remain central to every servicemember's transition.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The convergence of research maturity, institutional readiness, and technological capability creates a window for action. CMGF provides the governance architecture to act wisely.
            </p>
          </section>

          <footer className="border-t-2 border-foreground pt-8 mt-12" data-testid="section-footer">
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>Prepared for the Council of College and Military Educators (CCME)</p>
              <p>Research Foundation: 797 peer-reviewed sources (2015–2026)</p>
              <p className="italic">The system informs. Humans decide. Always.</p>
            </div>
          </footer>
        </article>

        <div className="mt-12 flex justify-center">
          <Button variant="outline" size="lg" asChild data-testid="button-download-pdf">
            <a href="/attached_assets/Mobility_By_Design_1769930188953.pdf" download>
              <Download className="h-4 w-4 mr-2" />
              Download Original Presentation
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
