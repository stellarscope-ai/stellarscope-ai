"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/components/navigation/workspace-switcher";
import { HeaderBreadcrumbs } from "@/components/navigation/header-breadcrumbs";
import { CreditsBadge } from "@/components/navigation/credits-badge";
import { NewButton } from "@/components/navigation/new-button";
import { NotificationsMenu } from "@/components/navigation/notifications-menu";

export default function AppHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center gap-4 border-b px-6 transition-colors duration-200",
        scrolled
          ? "border-border bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
          : "border-transparent bg-background"
      )}
    >
      <SidebarTrigger className="md:hidden" />

      <WorkspaceSwitcher />

      <div className="h-5 w-px bg-border hidden md:block" />

      <HeaderBreadcrumbs />

      <div className="ml-auto flex items-center gap-2">
        <CreditsBadge used={2450} limit={5000} plan="Free" />
        <NewButton />
        <ThemeToggle />
        <NotificationsMenu />
      </div>
    </header>
  );
}