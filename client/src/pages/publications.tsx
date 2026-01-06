import { useQuery, useMutation } from "@tanstack/react-query";
import { Publication, insertPublicationSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, ExternalLink, Calendar, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Publications() {
  const { toast } = useToast();
  const { data: pubs, isLoading } = useQuery<Publication[]>({
    queryKey: ["/api/publications"],
  });

  const form = useForm({
    resolver: zodResolver(insertPublicationSchema),
    defaultValues: {
      title: "",
      type: "Paper",
      url: "",
      abstract: "",
      author: "",
      publishedDate: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      await apiRequest("POST", "/api/publications", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/publications"] });
      form.reset();
      toast({
        title: "SUCCESS: DATABASE UPDATE",
        description: "New publication record successfully committed to ledger.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end border-b border-primary/20 pb-8">
        <div>
          <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 font-mono no-default-hover-elevate">
            REPOS://RESEARCH_LEDGER
          </Badge>
          <h1 className="text-5xl font-black tracking-tighter glow-text">PUBLICATIONS</h1>
          <p className="text-muted-foreground mt-2 font-light max-w-xl">
            A centralized repository for technical documentation, research papers, and policy analyses supporting the 
            Career Mobility Governance Framework.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {pubs?.map((pub) => (
            <Card key={pub.id} className="high-tech-card">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">{pub.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                      <User className="w-3 h-3 text-primary" /> {pub.author}
                    </span>
                    <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                      <Calendar className="w-3 h-3 text-primary" /> {pub.publishedDate}
                    </span>
                    <span className="border border-primary/30 text-primary px-2 py-1 rounded">
                      {pub.type}
                    </span>
                  </div>
                </div>
                {pub.url && (
                  <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 text-primary no-default-hover-elevate" asChild>
                    <a href={pub.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" /> ACCESS_NODE
                    </a>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-primary/20 rounded-full" />
                  <p className="pl-6 text-sm leading-relaxed text-muted-foreground font-light italic">
                    {pub.abstract}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {pubs?.length === 0 && (
            <div className="text-center py-32 border-2 border-dashed border-primary/10 rounded-2xl bg-muted/5">
              <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-primary/30" />
              </div>
              <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">No data clusters detected in primary storage.</p>
            </div>
          )}
        </div>

        <div>
          <Card className="high-tech-card sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg font-bold tracking-tight">INGEST_NEW_RECORD</CardTitle>
              <CardDescription className="font-light">Sync latest research to the CMGF core.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/70">Document Title</FormLabel>
                        <FormControl>
                          <Input className="bg-muted/30 border-primary/10 focus:border-primary/40" placeholder="IDENTIFY_TITLE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/70">Principal Investigator</FormLabel>
                        <FormControl>
                          <Input className="bg-muted/30 border-primary/10 focus:border-primary/40" placeholder="IDENTIFY_AUTHOR" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/70">Record Type</FormLabel>
                        <FormControl>
                          <select 
                            className="w-full h-10 px-3 py-2 bg-muted/30 border border-primary/10 focus:border-primary/40 rounded-md text-sm outline-none"
                            {...field}
                          >
                            <option value="Paper">Paper</option>
                            <option value="Publication">Publication</option>
                            <option value="Technical Report">Technical Report</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="publishedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/70">Timestamp</FormLabel>
                        <FormControl>
                          <Input className="bg-muted/30 border-primary/10 focus:border-primary/40" placeholder="MM/YYYY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/70">Access Point URL</FormLabel>
                        <FormControl>
                          <Input className="bg-muted/30 border-primary/10 focus:border-primary/40" placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="abstract"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/70">Data Summary</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="bg-muted/30 border-primary/10 focus:border-primary/40 min-h-[120px] resize-none" 
                            placeholder="INJECT_ABSTRACT_DATA..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-widest no-default-hover-elevate"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "INGESTING..." : <><Plus className="w-4 h-4 mr-2" /> COMMIT_TO_LEDGER</>}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
