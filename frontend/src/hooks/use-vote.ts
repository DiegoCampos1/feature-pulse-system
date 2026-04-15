"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/lib/api";
import type { FeatureRequest, PaginatedResponse, VoteResponse } from "@/types";

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (featureId: string) => {
      const { data } = await api.post<VoteResponse>(`/features/${featureId}/vote/`);
      return { featureId, ...data };
    },
    onMutate: async (featureId) => {
      await queryClient.cancelQueries({ queryKey: ["features"] });
      const previousData = queryClient.getQueriesData<PaginatedResponse<FeatureRequest>>({
        queryKey: ["features"],
      });

      queryClient.setQueriesData<PaginatedResponse<FeatureRequest>>(
        { queryKey: ["features"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.map((f) =>
              f.id === featureId
                ? {
                    ...f,
                    has_voted: !f.has_voted,
                    vote_count: f.has_voted ? f.vote_count - 1 : f.vote_count + 1,
                  }
                : f
            ),
          };
        }
      );

      return { previousData };
    },
    onError: (_err, _featureId, context) => {
      if (context?.previousData) {
        for (const [queryKey, data] of context.previousData) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
  });
}
