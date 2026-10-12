"use client";

import { Button } from "@/components/ui/button";
import { useWalletAuth } from "@/lib/use-wallet-auth";

export function WalletConnectButton() {
  const {
    address,
    isAuthenticated,
    isConnecting,
    connect,
    disconnect,
  } = useWalletAuth();

  if (isAuthenticated && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[#6366f1]/20 px-3 py-1.5 font-mono text-xs text-[#6366f1]">
          {address.slice(0, 4)}...{address.slice(-4)}
        </span>
        <Button variant="outline" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => connect().catch(console.error)}
      disabled={isConnecting}
      size="sm"
    >
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}