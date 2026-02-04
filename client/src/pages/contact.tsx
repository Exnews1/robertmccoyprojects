import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Send, Check, Mail, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    inquiryType: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          organization: formData.organization || null,
          inquiryType: formData.inquiryType,
          message: formData.message
        })
      });
      
      if (!response.ok) {
        throw new Error("Submission failed");
      }
      
      setIsSubmitted(true);
      toast({
        title: "Inquiry submitted",
        description: "Thank you for your interest. You will receive a response within 2-3 business days.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact directly via email.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Inquiry Received</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your interest in the Career Mobility Governance Framework. 
                You will receive a response within 2-3 business days.
              </p>
              <Link href="/">
                <Button variant="outline" data-testid="button-return-home">
                  Return to Portfolio
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <span className="text-foreground">Inquiry</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">Professional Inquiry</h1>
          <p className="text-muted-foreground">
            For questions regarding research collaboration, speaking engagements, policy consultation, 
            or institutional partnerships related to the Career Mobility Governance Framework.
          </p>
        </header>

        <div className="grid gap-6 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Direct Email</p>
                  <a 
                    href="mailto:data@robertmccoyprojects.com" 
                    className="text-foreground hover:text-primary transition-colors"
                    data-testid="link-contact-email"
                  >
                    data@robertmccoyprojects.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Institutional Affiliation</p>
                  <p className="text-foreground">Indiana Wesleyan University</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Submit an Inquiry</CardTitle>
            <CardDescription>
              Complete the form below for a structured response. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Jane Smith"
                    data-testid="input-contact-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane.smith@institution.edu"
                    data-testid="input-contact-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization / Institution</Label>
                <Input 
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Department of Defense, University, etc."
                  data-testid="input-contact-organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inquiryType">Inquiry Type *</Label>
                <Select 
                  value={formData.inquiryType}
                  onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}
                  required
                >
                  <SelectTrigger id="inquiryType" data-testid="select-inquiry-type">
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research Collaboration</SelectItem>
                    <SelectItem value="speaking">Speaking Engagement</SelectItem>
                    <SelectItem value="policy">Policy Consultation</SelectItem>
                    <SelectItem value="partnership">Institutional Partnership</SelectItem>
                    <SelectItem value="media">Media / Press Inquiry</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea 
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your inquiry, including relevant context and any specific questions."
                  className="resize-none"
                  data-testid="textarea-contact-message"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.inquiryType || !formData.message}
                data-testid="button-submit-inquiry"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Inquiry
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Response time is typically 2-3 business days. For urgent matters, please contact via direct email.
        </p>
      </div>
    </div>
  );
}
