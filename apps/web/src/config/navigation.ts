import { NavItem } from "@/types/navigation";
import {
  BarChart3,
  Eye,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
} from "lucide-react";

export const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Explore",
    href: "/explore",
    icon: Search,
    children: [
      {
        title: "Accounts",
        href: "/explore/accounts",
      },
      {
        title: "Assets",
        href: "/explore/assets",
      },
      {
        title: "Transactions",
        href: "/explore/transactions",
      },
    ],
  },
  {
    title: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Watchlists",
    href: "/watchlists",
    icon: Eye,
    children: [
      {
        title: "My Watchlists",
        href: "/watchlists",
      },
      {
        title: "Alerts",
        href: "/watchlists/alerts",
      },
    ],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
];
