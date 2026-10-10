"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { InvoicesTable, type Invoice } from "@/components/billing/invoices/invoices-table";
import { InvoiceDetailDialog } from "@/components/billing/invoices/invoice-detail-dialog";
import { InvoicesFilterBar } from "@/components/billing/invoices/invoices-filter-bar";
import { Button } from "@/components/ui/button";

const invoices: Invoice[] = [
  {
    id: "INV-2026-007",
    date: "Jul 1, 2026",
    plan: "Pro Plan",
    amount: 49.0,
    status: "paid",
    paymentMethod: "Visa •••• 4242",
    lineItems: [
      { label: "Pro Plan (monthly)", amount: 39.0 },
      { label: "Extra credits (5,000)", amount: 10.0 },
    ],
  },
  {
    id: "INV-2026-006",
    date: "Jun 1, 2026",
    plan: "Pro Plan",
    amount: 39.0,
    status: "paid",
    paymentMethod: "Visa •••• 4242",
    lineItems: [{ label: "Pro Plan (monthly)", amount: 39.0 }],
  },
  {
    id: "INV-2026-005",
    date: "May 1, 2026",
    plan: "Pro Plan",
    amount: 39.0,
    status: "failed",
    paymentMethod: "Visa •••• 4242",
    lineItems: [{ label: "Pro Plan (monthly)", amount: 39.0 }],
  },
  {
    id: "INV-2026-004",
    date: "Apr 1, 2026",
    plan: "Free Plan",
    amount: 0,
    status: "paid",
    paymentMethod: "—",
    lineItems: [{ label: "Free Plan", amount: 0 }],
  },
  {
    id: "INV-2026-003",
    date: "Mar 1, 2026",
    plan: "Pro Plan",
    amount: 39.0,
    status: "refunded",
    paymentMethod: "Visa •••• 4242",
    lineItems: [{ label: "Pro Plan (monthly)", amount: 39.0 }],
  },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "failed" | "refunded">("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || inv.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleRowClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDetailOpen(true);
  };

  const handleDownload = (id: string) => {
    console.log("downloading invoice", id);
    // In real app: trigger PDF generation/download
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and download your billing history.
          </p>
        </div>

        <Button variant="outline" className="gap-1.5">
          <Download className="size-4" />
          Export all
        </Button>
      </div>

      <InvoicesFilterBar
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
      />

      {filteredInvoices.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No invoices match your search.
        </p>
      ) : (
        <InvoicesTable
          invoices={filteredInvoices}
          onRowClick={handleRowClick}
          onDownload={handleDownload}
        />
      )}

      <InvoiceDetailDialog
        invoice={selectedInvoice}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}