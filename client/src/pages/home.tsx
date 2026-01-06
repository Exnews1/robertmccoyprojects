import { useQuery } from "@tanstack/react-query";
import { Framework, ComplianceItem } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Landmark, BarChart2, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: frameworks, isLoading: loadingFrameworks } = useQuery<Framework[]>({
    queryKey: ["/api/frameworks"],
  });

  const { data: items, isLoading: loadingItems } = useQuery<ComplianceItem[]>({
    queryKey: ["/api/compliance-items"],
  });

  if (loadingFrameworks || loadingItems) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <section className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-12">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Compliant by Design</h2>
          <p className="text-xl opacity-90 leading-relaxed">
            Integrating Ethics, Safety, and Strategic Advantage into every AI deployment. 
            The CMGF framework ensures high-impact AI systems are trustworthy and resilient.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Shield className="w-full h-full" />
        </div>
      </section>

      <div id="frameworks" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {frameworks?.map((framework) => (
          <Card key={framework.id} className="hover-elevate">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Landmark className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>{framework.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{framework.year} • {framework.description}</p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card id="analysis" className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl">Framework Gap Analysis</CardTitle>
          </div>
          <p className="text-muted-foreground">Detailed mapping of requirements to design choices and strategic outcomes.</p>
        </CardHeader>
        <CardContent className="px-0">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Requirement</TableHead>
                  <TableHead>Design Choice</TableHead>
                  <TableHead>Strategic Advantage</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium align-top py-4">
                      {item.requirement}
                      <div className="flex gap-1 mt-2">
                        {item.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-4">{item.designChoice}</TableCell>
                    <TableCell className="align-top py-4">{item.strategicAdvantage}</TableCell>
                    <TableCell className="text-right align-top py-4">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === "Fully Compliant" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-sm font-medium">{item.status}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
