"use client";

import { useState } from "react";
import {
  Rocket,
  Bot,
  CreditCard,
  Shield,
  Plug,
  Users,
} from "lucide-react";

import { HelpSearch } from "@/components/help/help-search";
import { HelpCategoryCard } from "@/components/help/help-category-card";
import { FaqAccordion } from "@/components/help/faq-accordion";
import { ContactSupportDialog } from "@/components/help/contact-support-dialog";

const categories = [
  {
    icon: Rocket,
    title: "Getting Started",
    description: "Set up your workspace and send your first chat",
    articleCount: 12,
    href: "/help/getting-started",
  },
  {
    icon: Bot,
    title: "AI Tools",
    description: "Chat, agents, prompts, workflows, and models",
    articleCount: 24,
    href: "/help/ai-tools",
  },
  {
    icon: CreditCard,
    title: "Billing & Plans",
    description: "Subscriptions, invoices, and usage limits",
    articleCount: 9,
    href: "/help/billing",
  },
  {
    icon: Users,
    title: "Team & Permissions",
    description: "Invite members and manage access levels",
    articleCount: 7,
    href: "/help/team",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Two-factor auth, sessions, and data privacy",
    articleCount: 6,
    href: "/help/security",
  },
  {
    icon: Plug,
    title: "Integrations",
    description: "Connect Slack, Notion, GitHub, and more",
    articleCount: 10,
    href: "/help/integrations",
  },
];

const faqs = [
  {
    id: "1",
    question: "How do I reset my monthly credit limit?",
    answer:
      "Credits automatically reset at the start of each billing cycle. You can view your exact reset date under Billing → Usage.",
  },
  {
    id: "2",
    question: "Can I change my plan at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan anytime from Billing → Plans. Changes take effect immediately, and charges are prorated.",
  },
  {
    id: "3",
    question: "How do I invite team members?",
    answer:
      "Go to Team → Members and click 'Invite members'. You can invite multiple people at once and assign roles during the process.",
  },
  {
    id: "4",
    question: "What happens if my payment fails?",
    answer:
      "We'll retry the payment and notify you by email. Your workspace remains active for a grace period before any features are restricted.",
  },
  {
    id: "5",
    question: "Can I use my own custom domain?",
    answer:
      "Yes, this is available for Team plans. Set it up under Settings → Branding and follow the DNS verification steps.",
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFaqs = faqs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase())
  );

  const handleSupportSubmit = (data: {
    subject: string;
    category: string;
    message: string;
  }) => {
    console.log("support ticket submitted:", data);
    // In real app: POST to backend/support ticketing system
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-4 py-6">
        <h1 className="text-3xl font-semibold">How can we help?</h1>
        <HelpSearch value={search} onChange={setSearch} />
      </div>

      {filteredCategories.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <HelpCategoryCard key={category.title} {...category} />
          ))}
        </div>
      )}

      {filteredFaqs.length > 0 && (
        <div className="max-w-2xl mx-auto w-full space-y-3">
          <h2 className="text-lg font-semibold">Frequently asked questions</h2>
          <FaqAccordion items={filteredFaqs} />
        </div>
      )}

      {filteredCategories.length === 0 && filteredFaqs.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-12">
          No results for "{search}". Try a different search or contact support below.
        </p>
      )}

      <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/30 p-8 text-center">
        <h3 className="text-lg font-semibold">Still need help?</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Our support team is here to help with anything you can't find in the docs.
        </p>
        <ContactSupportDialog onSubmit={handleSupportSubmit} />
      </div>
    </div>
  );
}