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
        title: "Success",
        description: "Publication added successfully.",
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Publications & Papers</h1>
          <p className="text-muted-foreground mt-2">
            Research, technical reports, and papers supporting the CMGF framework.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {pubs?.map((pub) => (
            <Card key={pub.id} className="hover-elevate">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl">{pub.title}</CardTitle>
                  </div>
                  <CardDescription className="flex flex-wrap gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" /> {pub.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {pub.publishedDate}
                    </span>
                    <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium">
                      {pub.type}
                    </span>
                  </CardDescription>
                </div>
                {pub.url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={pub.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" /> View Paper
                    </a>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  &quot;{pub.abstract}&quot;
                </p>
              </CardContent>
            </Card>
          ))}
          {pubs?.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
              <p className="mt-4 text-muted-foreground">No publications found. Use the form to add your first one.</p>
            </div>
          )}
        </div>

        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Add New Publication</CardTitle>
              <CardDescription>Share your research and papers here.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Paper Title" {...field} />
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
                        <FormLabel>Author(s)</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe, Jane Smith" {...field} />
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
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <select 
                            className="w-full h-10 px-3 py-2 bg-background border rounded-md text-sm"
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
                        <FormLabel>Published Date</FormLabel>
                        <FormControl>
                          <Input placeholder="January 2024" {...field} />
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
                        <FormLabel>URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
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
                        <FormLabel>Abstract/Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe the key findings..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Adding..." : <><Plus className="w-4 h-4 mr-2" /> Add Publication</>}
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
