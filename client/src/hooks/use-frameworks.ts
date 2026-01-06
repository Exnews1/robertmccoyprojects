import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useFrameworks() {
  return useQuery({
    queryKey: [api.frameworks.list.path],
    queryFn: async () => {
      const res = await fetch(api.frameworks.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch frameworks");
      return api.frameworks.list.responses[200].parse(await res.json());
    },
  });
}

export function useFramework(id: number) {
  return useQuery({
    queryKey: [api.frameworks.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.frameworks.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch framework");
      return api.frameworks.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
