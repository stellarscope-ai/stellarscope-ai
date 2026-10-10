import { NavItem } from "@/types/navigation";
import {
  Bot,
  CreditCard,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  LibraryBig,
  Settings,
  Users,
  UserRoundPen,
  FileText
} from "lucide-react";

export const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI",
    href: "/ai",
    icon: Bot,
    children: [
      {
        title: "Chat",
        href: "/ai/chat",
      },
      {
        title: "Agents",
        href: "/ai/agents",
      },
      {
        title: "Prompts",
        href: "/ai/prompts",
      },
      {
        title: "Workflows",
        href: "/ai/workflows",
      },
      {
        title: "Models",
        href: "/ai/models",
      },
      {
        title: "Knowledge",
        href: "/ai/knowledge",
      },
      {
        title: "Documents",
        href: "/ai/documents",
      },
    ],
  },
  {
    title: "Workspace",
    href: "/workspace",
    icon: FolderOpen,
  },
  {
  title: "Library",
  href: "/library",
  icon: LibraryBig,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
    children: [
      {
        title: "Overview",
        href: "/billing/overview",
      },
      {
        title: "Plans",
        href: "/billing/plans",
      },
      {
        title: "Subscription",
        href: "/billing/subscription",
      },
      {
        title: "Payment Methods",
        href: "/billing/payment",
      },
      {
        title: "Invoices",
        href: "/billing/invoices",
      },
      {
        title: "Usage",
        href: "/billing/usage",
      },
      {
        title: "API Keys",
        href: "/billing/api-keys",
      },
    ],
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
    children: [
      {
        title: "Members",
        href: "/team/members",
      },
      {
        title: "Invitations",
        href: "/team/invitations",
      },
      {
        title: "Permissions",
        href: "/team/permissions",
      },
      {
        title: "Roles",
        href: "/team/roles",
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: UserRoundPen,
  },
  {
  title: "Pages",
  href: "/pages",
  icon: FileText,
  children: [
    {
      title: "Sign In",
      href: "/sign-in",
    },
    {
      title: "Sign Up",
      href: "/sign-up",
    },
    {
      title: "Forgot Password",
      href: "/forgot-password",
    },
    {
      title: "Reset Password",
      href: "/reset-password",
    },
    {
      title: "Verify Email",
      href: "/verify-email",
    },
    {
      title: "Two Factor",
      href: "/two-factor",
    },
    {
      title: "Onboarding",
      href: "/onboarding",
    },
  ],
},
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
];