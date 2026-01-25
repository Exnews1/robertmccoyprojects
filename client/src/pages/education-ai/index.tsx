import { useEffect } from "react";
import { 
  GraduationCap, Cpu, Award, Gavel, HandHelping, Server, Users, Trophy,
  School, Building, Wrench, Briefcase, TrendingUp, Bot, Scale, Presentation,
  Brain, ClipboardCheck, Calculator, Route, BarChart3, TreeDeciduous, Globe, Layers
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pathways = [
  { id: "pedagogical", name: "Pedagogical Transformation", icon: GraduationCap, color: "#7B68EE", description: "Personalized learning, adaptive systems, AI co-teachers, competency-based education" },
  { id: "technology", name: "Technology Evolution", icon: Cpu, color: "#F77F00", description: "GenAI, intelligent tutoring, learning analytics, emotion AI, neuroadaptive systems" },
  { id: "assessment", name: "Assessment & Credentialing", icon: Award, color: "#9B59B6", description: "Micro-credentials, blockchain verification, continuous assessment, automated grading" },
  { id: "governance", name: "Governance & Ethics", icon: Gavel, color: "#06A77D", description: "Privacy frameworks, bias mitigation, transparency, policy development, accountability" },
  { id: "equity", name: "Equity & Access", icon: HandHelping, color: "#E74C3C", description: "Digital divide solutions, inclusive design, affordability, accessibility, language support" },
  { id: "infrastructure", name: "Infrastructure & Systems", icon: Server, color: "#3498DB", description: "Connectivity, computing power, data systems, interoperability standards, integration" },
  { id: "stakeholders", name: "Stakeholder Ecosystem", icon: Users, color: "#F39C12", description: "Teachers, students, parents, administrators, policymakers - roles and responsibilities" },
  { id: "outcomes", name: "Learning Outcomes", icon: Trophy, color: "#2E86AB", description: "Achievement gains, engagement, retention, skill development, career readiness" },
];

const sectors = [
  { id: "k12", name: "K-12 Education", icon: School, adoption2024: 55, projected2026: 75, description: "Age-appropriate AI tools, curriculum integration, teacher training, parent communication" },
  { id: "higher-ed", name: "Higher Education", icon: Building, adoption2024: 47, facultyPositive: 78, description: "Research applications, academic integrity, credit recognition, institutional transformation" },
  { id: "vocational", name: "Vocational Training", icon: Wrench, adoption2024: 45, projected2026: 60, description: "Skills-based assessment, virtual simulations, competency tracking, industry certification" },
  { id: "corporate", name: "Corporate Learning", icon: Briefcase, adoption2024: 60, projected2026: 75, description: "Performance support, skills gap analysis, leadership development, compliance training" },
];

const insights = [
  { icon: TrendingUp, title: "34.1% CAGR", description: "AI in education market growing at 34.1% annually, reaching $11.5B by 2026" },
  { icon: Bot, title: "60% GenAI Adoption", description: "Generative AI tools adopted by 60% of educational institutions in 2024" },
  { icon: Scale, title: "6x Digital Divide", description: "High-income countries have 6x higher AI adoption than low-income nations" },
  { icon: Presentation, title: "71% Need Training", description: "Inadequate teacher training cited as top barrier to AI implementation" },
];

const tools = [
  { id: "decision", name: "Decision Support", icon: Brain, description: "5-step wizard to evaluate AI solutions for your context" },
  { id: "assessment", name: "Readiness Assessment", icon: ClipboardCheck, description: "40-question diagnostic to measure institutional AI readiness" },
  { id: "roi", name: "ROI Calculator", icon: Calculator, description: "Project costs, benefits, and return on AI investments" },
  { id: "pathway", name: "Pathway Builder", icon: Route, description: "Create customized implementation timelines and milestones" },
];

const visualizations = [
  { id: "adoption", name: "Adoption Trends", icon: BarChart3, description: "Interactive charts showing AI adoption across sectors and regions (2020-2026)" },
  { id: "decision-tree", name: "Decision Tree", icon: TreeDeciduous, description: "Visual guide to choosing the right AI tools for your needs" },
  { id: "regional", name: "Regional Analysis", icon: Globe, description: "Compare AI adoption and readiness across 5 global regions" },
  { id: "technology", name: "Technology Landscape", icon: Layers, description: "Map of AI technologies and their educational applications" },
];

function AnimatedStatNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  return (
    <span className="text-3xl font-bold text-primary" data-testid={`stat-${target}`}>
      {target.toLocaleString()}{suffix}
    </span>
  );
}

export default function EducationAI() {
  useEffect(() => {
    document.title = "AI Education Futures Hub - Robert McCoy Projects";
  }, []);

  return (
    <div className="education-ai-page">
      {/* Hero Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Navigate the AI Transformation in Education
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Evidence-based guidance for implementing AI across K-12, Higher Ed, Vocational, and Corporate learning
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-card rounded-lg border border-border">
              <div className="text-center">
                <AnimatedStatNumber target={557} />
                <span className="block text-sm text-muted-foreground mt-1">Research Papers Analyzed</span>
              </div>
              <div className="text-center">
                <AnimatedStatNumber target={8} />
                <span className="block text-sm text-muted-foreground mt-1">Implementation Pathways</span>
              </div>
              <div className="text-center">
                <AnimatedStatNumber target={4} />
                <span className="block text-sm text-muted-foreground mt-1">Interactive Tools</span>
              </div>
              <div className="text-center">
                <AnimatedStatNumber target={11.5} suffix="B" />
                <span className="block text-sm text-muted-foreground mt-1">USD Market (2026)</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <a href="#pathways" data-testid="link-explore-pathways">Explore Pathways</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#tools" data-testid="link-view-tools">View Tools</a>
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center border border-border">
              <Brain className="w-32 h-32 text-primary/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Key Insights Section */}
      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Key Insights from 557 Research Papers</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Synthesized findings from peer-reviewed research on AI in education
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight, index) => (
              <Card key={index} className="p-6 text-center hover-elevate" data-testid={`insight-card-${index}`}>
                <insight.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{insight.title}</h3>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 8 Pathways Section */}
      <section id="pathways" className="py-16 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">8 Pathways to AI Transformation</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Comprehensive framework covering every dimension of AI in education
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pathways.map((pathway) => (
              <Card 
                key={pathway.id} 
                className="p-6 hover-elevate cursor-pointer group"
                data-testid={`pathway-card-${pathway.id}`}
              >
                <div 
                  className="w-14 h-14 rounded-md flex items-center justify-center mb-4"
                  style={{ backgroundColor: pathway.color }}
                >
                  <pathway.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{pathway.name}</h3>
                <p className="text-sm text-muted-foreground">{pathway.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="sectors" className="py-16 px-6 bg-card/50 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Sector-Specific Implementation Guides</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Tailored strategies for your educational context
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {sectors.map((sector) => (
              <Card key={sector.id} className="p-6 hover-elevate" data-testid={`sector-card-${sector.id}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <sector.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{sector.name}</h3>
                </div>
                
                <div className="flex gap-6 mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary">{sector.adoption2024}%</span>
                    <span className="block text-xs text-muted-foreground">Adoption (2024)</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-green-500">
                      {sector.projected2026 || sector.facultyPositive}%
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {sector.projected2026 ? "Projected (2026)" : "Faculty Positive"}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{sector.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <section id="tools" className="py-16 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Interactive Decision Tools</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Practical tools to support your AI implementation journey
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Card key={tool.id} className="p-6 hover-elevate text-center" data-testid={`tool-card-${tool.id}`}>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <tool.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Visualizations Section */}
      <section id="visualizations" className="py-16 px-6 bg-card/50 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Data Visualizations</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Research-backed data visualizations showing AI adoption trends and patterns
          </p>
          
          <div className="grid gap-8">
            <Card className="p-4 overflow-hidden" data-testid="viz-adoption-trends">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Global AI Adoption Trends (2020-2026)
              </h3>
              <img 
                src="/education-ai/images/ai_education_adoption_trends.png" 
                alt="AI adoption trends across educational sectors from 2020 to 2026"
                className="w-full rounded-lg"
              />
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4 overflow-hidden" data-testid="viz-mind-map">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Education Pathways Mind Map
                </h3>
                <img 
                  src="/education-ai/images/ai_education_mind_map.png" 
                  alt="Comprehensive mind map of AI in education pathways"
                  className="w-full rounded-lg"
                />
              </Card>
              
              <Card className="p-4 overflow-hidden" data-testid="viz-regional">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Regional Perspectives
                </h3>
                <img 
                  src="/education-ai/images/ai_education_regional_perspectives.png" 
                  alt="Regional perspectives on AI adoption in education"
                  className="w-full rounded-lg"
                />
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4 overflow-hidden" data-testid="viz-technology">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Technology Details
                </h3>
                <img 
                  src="/education-ai/images/ai_education_technology_details.png" 
                  alt="Detailed AI technology adoption patterns"
                  className="w-full rounded-lg"
                />
              </Card>
              
              <Card className="p-4 overflow-hidden" data-testid="viz-decision-tree">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TreeDeciduous className="w-5 h-5 text-primary" />
                  Decision Tree & Pathways
                </h3>
                <img 
                  src="/education-ai/images/ai_education_decision_tree.png" 
                  alt="AI education decision tree for implementation"
                  className="w-full rounded-lg"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Research Foundation Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Research Foundation</h2>
          <p className="text-muted-foreground mb-8">
            This resource is built on rigorous analysis of 557 peer-reviewed research papers spanning 2020-2026, 
            covering AI adoption, implementation challenges, and outcomes across global educational contexts.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="p-4 bg-card rounded-lg border border-border">
              <span className="text-2xl font-bold text-primary">557</span>
              <span className="block text-sm text-muted-foreground">Papers Analyzed</span>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <span className="text-2xl font-bold text-primary">5</span>
              <span className="block text-sm text-muted-foreground">Global Regions</span>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <span className="text-2xl font-bold text-primary">15+</span>
              <span className="block text-sm text-muted-foreground">Countries Covered</span>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <span className="text-2xl font-bold text-primary">6</span>
              <span className="block text-sm text-muted-foreground">Years of Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary/5 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Learn More?</h2>
          <p className="text-muted-foreground mb-6">
            Explore the CMGF framework for career mobility governance or reach out with questions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <a href="/cmgf" data-testid="link-explore-cmgf">Explore CMGF Framework</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact" data-testid="link-contact">Get in Touch</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
