"use client";

import { useState } from "react";
import { ArrowDownUp, Search, Zap } from "lucide-react";

import { useFeatures } from "@/hooks/use-features";
import { useAuthStore } from "@/stores/auth-store";
import { FeatureCard } from "@/components/feature-card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const SORT_OPTIONS = [
  { label: "Most Voted", value: "-vote_count" },
  { label: "Newest", value: "-created_at" },
  { label: "Oldest", value: "created_at" },
] as const;

export default function HomePage() {
  const [ordering, setOrdering] = useState("-vote_count");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isLoading } = useFeatures({ ordering, search });
  const features = data?.results ?? [];

  const currentSort = SORT_OPTIONS.find((o) => o.value === ordering)?.label ?? "Sort";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <Zap className="size-3.5" />
          Shape the future of our product
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Feature Requests</h1>
        <p className="mt-2 text-muted-foreground">
          Submit ideas, vote on what matters, and help us build what you need.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="mb-6 rounded-lg border border-dashed bg-muted/50 p-3 text-center text-sm text-muted-foreground">
          Sign in to vote and submit feature requests.
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search features..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8"
          />
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="default">
                <ArrowDownUp data-icon="inline-start" className="size-3.5" />
                {currentSort}
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem key={option.value} onClick={() => setOrdering(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Feature List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : features.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium">No feature requests yet.</p>
          <p className="mt-1 text-muted-foreground">Be the first to submit one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      )}
    </div>
  );
}
