"use client";

import { useState } from "react";

import { PaymentMethodCard, type PaymentMethod } from "@/components/billing/payment/payment-method-card";
import { AddPaymentMethodDialog } from "@/components/billing/payment/add-payment-method-dialog";
import { BillingAddressCard } from "@/components/billing/payment/billing-address-card";

const initialMethods: PaymentMethod[] = [
  {
    id: "1",
    brand: "visa",
    last4: "4242",
    expiryMonth: "09",
    expiryYear: "27",
    isDefault: true,
    holderName: "Virendra Kumar",
  },
  {
    id: "2",
    brand: "mastercard",
    last4: "8210",
    expiryMonth: "03",
    expiryYear: "26",
    isDefault: false,
    holderName: "Virendra Kumar",
  },
];

const initialAddress = {
  line1: "221B Baker Street",
  city: "Ghaziabad",
  state: "Uttar Pradesh",
  zip: "201001",
  country: "India",
};

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [address, setAddress] = useState(initialAddress);

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
  };

  const handleDelete = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAdd = (data: {
    cardNumber: string;
    expiry: string;
    cvc: string;
    holderName: string;
  }) => {
    const [month, year] = data.expiry.split("/");
    const newMethod: PaymentMethod = {
      id: crypto.randomUUID(),
      brand: "visa", // In real app: detect from card number via Stripe/processor
      last4: data.cardNumber.slice(-4),
      expiryMonth: month || "01",
      expiryYear: year || "30",
      isDefault: methods.length === 0,
      holderName: data.holderName,
    };
    setMethods((prev) => [...prev, newMethod]);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Payment Methods</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your cards and billing address.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Saved Cards</span>
          <AddPaymentMethodDialog onAdd={handleAdd} />
        </div>

        {methods.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-xl">
            No payment methods added yet.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {methods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onSetDefault={handleSetDefault}
                onEdit={(id) => console.log("edit", id)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <BillingAddressCard address={address} onSave={setAddress} />
    </div>
  );
}