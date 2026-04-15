"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Zap } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span>FeaturePulse</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {isLoading ? null : isAuthenticated ? (
            <>
              <Button variant="default" size="sm" onClick={() => router.push("/features/new")}>
                <Plus data-icon="inline-start" />
                Submit Feature
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  }
                >
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8}>
                  <div className="px-1.5 py-1 text-xs text-muted-foreground">{user?.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                Sign in
              </Button>
              <Button variant="default" size="sm" onClick={() => router.push("/register")}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
