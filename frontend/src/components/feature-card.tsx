"use client";

import { ChevronUp } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import { useVote } from "@/hooks/use-vote";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeatureRequest, FeatureStatus } from "@/types";

const STATUS_VARIANT: Record<FeatureStatus, "default" | "secondary" | "outline" | "destructive"> =
  {
    open: "secondary",
    under_review: "outline",
    planned: "default",
    in_progress: "default",
    completed: "default",
    declined: "destructive",
  };

const STATUS_LABEL: Record<FeatureStatus, string> = {
  open: "Open",
  under_review: "Under Review",
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  declined: "Declined",
};

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

interface FeatureCardProps {
  feature: FeatureRequest;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const voteMutation = useVote();

  const handleVote = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to vote");
      return;
    }
    voteMutation.mutate(feature.id);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-start gap-3">
        <button
          onClick={handleVote}
          className={`flex flex-col items-center gap-0.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
            feature.has_voted
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-primary"
          }`}
        >
          <ChevronUp className="size-4" />
          <span>{feature.vote_count}</span>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="leading-snug">{feature.title}</CardTitle>
            <Badge variant={STATUS_VARIANT[feature.status]} className="shrink-0">
              {STATUS_LABEL[feature.status]}
            </Badge>
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {feature.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {feature.created_by.first_name} {feature.created_by.last_name}
          </span>
          <span>&middot;</span>
          <span>{timeAgo(feature.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
