import { Link } from "wouter";
import { 
  ArrowLeft, Shield, Award, GraduationCap, 
  Briefcase, Building2, User
} from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="link-back-portfolio">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Portfolio
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Author's Profile</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <section data-testid="section-author-bio">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-8">About the Author</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-2xl font-bold text-foreground" data-testid="text-author-name">Robert E. McCoy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Robert McCoy is a lifelong servant-leader, aerospace executive, and education advocate whose career spans over five decades across military, engineering, and community leadership. With a foundation forged in both the United States Army and Navy, Robert has built a legacy of mission-driven leadership, technical excellence, and a deep commitment to empowering others through education and second chances.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                He served over 21 years in the U.S. military, including nine and a half years on active duty, holding roles as a Sonar Technician in the Navy and later as a Chief Warrant Officer and Aviator in the Army. His assignments included work on Presidential Support Staff.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Following his military service, Robert transitioned into the aerospace and defense sector, contributing to programs like the F-35 Joint Strike Fighter and NASA's Martian Lander. As Director of Operations for Belcan Corporation, he oversaw more than $42 million in annual contracts.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, Robert serves as the Military Partnership Executive at Indiana Wesleyan University, where he builds strategic education and workforce initiatives that connect veterans with high-demand careers in STEM, aerospace, and emerging technologies. He also serves on the board of the MidSouth Advisory Council on Military Education.
              </p>
            </div>
            
            <div className="space-y-6">
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>M.S. Artificial Intelligence & Data Analytics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>MBA</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>B.S. Aeronautics</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Military Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>21+ Years Combined Service</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>U.S. Army Chief Warrant Officer, Aviator</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>U.S. Navy Sonar Technician</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Presidential Support Staff</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Current Role
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Military Partnership Executive</p>
                  <p className="text-primary">Indiana Wesleyan University</p>
                </CardContent>
              </Card>

              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Advisory Roles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Board Member, MidSouth Advisory Council on Military Education</span>
                  </div>
                </CardContent>
              </Card>

              <div className="pt-2">
                <a 
                  href="https://www.linkedin.com/in/robert-mccoy-mba-9451142a0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-linkedin"
                >
                  <SiLinkedin className="w-4 h-4" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
