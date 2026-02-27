import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Check, Mail, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ConsultingContact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    title: "",
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
          inquiryType: "consulting",
          message: formData.title
            ? `[Title: ${formData.title}] ${formData.message}`
            : formData.message
        })
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setIsSubmitted(true);
      toast({
        title: "Inquiry submitted",
        description: "Thank you for reaching out. You will receive a response within 2-3 business days.",
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
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <Card className="max-w-lg w-full border-primary/20 bg-primary/5">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="heading-submitted">Inquiry Received</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest. You will receive a response at your provided email within 2-3 business days.
            </p>
            <Link href="/">
              <Button variant="outline" data-testid="button-return-home">
                Return Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh]">
      <section className="py-16 px-6" data-testid="section-contact">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground" data-testid="heading-contact">
              Let's Discuss Your Systems Governance Needs
            </h1>
            <p className="text-muted-foreground">
              If your organization is adopting AI and you are not certain your governance, risk, or literacy frameworks are keeping pace, that gap is worth a conversation.
            </p>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Consulting Email</p>
                  <a
                    href="mailto:robert.mccoy@thegovernanceframework.com"
                    className="text-foreground hover:text-primary transition-colors text-sm break-all"
                    data-testid="link-consulting-email"
                  >
                    robert.mccoy@thegovernanceframework.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Send an Inquiry</CardTitle>
              <CardDescription>
                All fields marked with * are required. Inquiries are typically answered within 2-3 business days.
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
                      placeholder="Jane Smith"
                      data-testid="input-consulting-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane.smith@organization.gov"
                      data-testid="input-consulting-email"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization *</Label>
                    <Input
                      id="organization"
                      required
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Department of Defense, University, etc."
                      data-testid="input-consulting-organization"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Your Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Director of Operations"
                      data-testid="input-consulting-title"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">How can I help? *</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your organization's AI governance challenge and what you're looking to accomplish."
                    className="resize-none"
                    data-testid="textarea-consulting-message"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.organization || !formData.message}
                  data-testid="button-submit-consulting-inquiry"
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

          <p className="text-xs text-muted-foreground text-center">
            Response time is typically 2-3 business days. For urgent matters, please contact via direct email.
          </p>
        </div>
      </section>
    </div>
  );
}
