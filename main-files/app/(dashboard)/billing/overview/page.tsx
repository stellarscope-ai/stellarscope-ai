import BillingHeader from "@/components/billing/overview/billing-header";
import BillingStats from "@/components/billing/overview/billing-stats";
import CurrentPlanCard from "@/components/billing/overview/current-plan-card";
import UsageOverview from "@/components/billing/overview/usage-overview";
import RecentInvoices from "@/components/billing/overview/recent-invoices";
import QuickActions from "@/components/billing/overview/quick-actions";

export default function BillingPage() {
  return (
    <div className="space-y-6">

      <BillingHeader />

      <BillingStats />

      <div className="grid gap-6 lg:grid-cols-3">
        <CurrentPlanCard />

        <div className="lg:col-span-2">
          <UsageOverview />
        </div>
      </div>

      <RecentInvoices />

      <QuickActions />

    </div>
  );
}