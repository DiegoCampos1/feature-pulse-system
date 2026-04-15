"use client";

import { useRef } from "react";
import { ChevronUp, Clock, User } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import { useVote } from "@/hooks/use-vote";
import type { FeatureRequest, FeatureStatus } from "@/types";

const STATUS_STYLES: Record<FeatureStatus, string> = {
  open: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  under_review: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  planned: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  in_progress: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  declined: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
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
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleVote = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to vote");
      return;
    }
    const el = btnRef.current;
    if (el) {
      el.classList.remove("vote-pulse");
      void el.offsetWidth;
      el.classList.add("vote-pulse");
    }
    voteMutation.mutate(feature.id);
  };

  return (
    <div
      className={`group flex items-stretch gap-0 overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 shadow-sm transition-all duration-200 hover:shadow-md hover:ring-foreground/20 dark:hover:ring-primary/30 ${
        feature.has_voted ? "border-l-3 border-l-primary" : ""
      }`}
    >
      {/* Vote button */}
      <button
        ref={btnRef}
        onClick={handleVote}
        className={`flex w-16 shrink-0 flex-col items-center justify-center gap-0.5 border-r transition-colors sm:w-20 ${
          feature.has_voted
            ? "border-primary/20 bg-primary text-primary-foreground"
            : "border-border bg-muted/40 text-muted-foreground hover:bg-primary/5 hover:text-primary"
        }`}
      >
        <ChevronUp className="size-5" />
        <span className="text-lg font-bold leading-none">{feature.vote_count}</span>
        <span className="text-[10px] font-medium uppercase tracking-wide opacity-70">votes</span>
      </button>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-4 py-3 sm:gap-2 sm:py-4">
        {/* Title + Badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold leading-snug sm:text-base">
            {feature.title}
          </h3>
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[feature.status]}`}
          >
            {STATUS_LABEL[feature.status]}
          </span>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:line-clamp-3 sm:text-sm">
          {feature.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground sm:text-xs">
          <span className="inline-flex items-center gap-1">
            <User className="size-3" />
            {feature.created_by.first_name} {feature.created_by.last_name}
          </span>
          <span className="text-border">&middot;</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {timeAgo(feature.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function FeatureCardSkeleton() {
  return (
    <div className="flex items-stretch overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="flex w-16 shrink-0 flex-col items-center justify-center gap-1.5 border-r border-border bg-muted/40 sm:w-20">
        <div className="skeleton-shimmer h-5 w-5 rounded" />
        <div className="skeleton-shimmer h-5 w-8 rounded" />
        <div className="skeleton-shimmer h-2.5 w-10 rounded" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2.5 px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="skeleton-shimmer h-4 w-3/5 rounded" />
          <div className="skeleton-shimmer h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="skeleton-shimmer h-3 w-full rounded" />
          <div className="skeleton-shimmer h-3 w-4/5 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="skeleton-shimmer h-3 w-20 rounded" />
          <div className="skeleton-shimmer h-3 w-14 rounded" />
        </div>
      </div>
    </div>
  );
}
