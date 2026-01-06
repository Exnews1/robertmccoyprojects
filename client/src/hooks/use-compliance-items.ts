import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useComplianceItems(frameworkId?: number) {
  return useQuery({
    queryKey: [api.complianceItems.list.path, frameworkId],
    queryFn: async () => {
      let url = api.complianceItems.list.path;
      if (frameworkId) {
        // Technically this is a GET with query params, not URL params
        // wouter/fetch handles standard query strings normally
        const params = new URLSearchParams({ frameworkId: String(frameworkId) });
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch compliance items");
      return api.complianceItems.list.responses[200].parse(await res.json());
    },
  });
}
