"use client";

import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import type { FeatureRequest, PaginatedResponse } from "@/types";

interface UseFeaturesParams {
  ordering?: string;
  search?: string;
}

export function useFeatures({ ordering = "-vote_count", search = "" }: UseFeaturesParams = {}) {
  return useQuery({
    queryKey: ["features", ordering, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (ordering) params.set("ordering", ordering);
      if (search) params.set("search", search);
      const { data } = await api.get<PaginatedResponse<FeatureRequest>>(
        `/features/?${params.toString()}`
      );
      return data;
    },
  });
}
