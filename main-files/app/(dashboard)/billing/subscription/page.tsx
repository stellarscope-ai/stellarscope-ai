import SubscriptionHeader from "@/components/billing/subscription/subscription-header";
import CurrentSubscription from "@/components/billing/subscription/current-subscription";
import PaymentMethod from "@/components/billing/subscription/payment-method";
import BillingAddress from "@/components/billing/subscription/billing-address";
import PaymentHistory from "@/components/billing/subscription/payment-history";
import CancelSubscription from "@/components/billing/subscription/cancel-subscription";

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">

      <SubscriptionHeader />

      <div className="grid gap-6 lg:grid-cols-2">

        <CurrentSubscription />

        <PaymentMethod />

      </div>

      <BillingAddress />

      <PaymentHistory />

      <CancelSubscription />

    </div>
  );
}