"use client";

import { useState, useCallback, useEffect } from "react";
import {
  StellarWalletsKit,
  Networks,
} from "@creit.tech/stellar-wallets-kit";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";

let initialized = false;

function initKit() {
  if (!initialized) {
    StellarWalletsKit.init({
      network: Networks.TESTNET,
      modules: defaultModules(),
    });
    initialized = true;
  }
}

export interface WalletAuthState {
  address: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

export function useWalletAuth() {
  const [state, setState] = useState<WalletAuthState>({
    address: null,
    token: null,
    isAuthenticated: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      initKit();

      const { address } = await StellarWalletsKit.authModal();

      const challengeRes = await fetch("/api/auth/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: address }),
      });

      if (!challengeRes.ok) throw new Error("Failed to get challenge");
      const { challenge, networkPassphrase } = await challengeRes.json();

      const { signedTxXdr } = await StellarWalletsKit.signTransaction(challenge, {
        networkPassphrase,
      });

      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: address, signedXdr: signedTxXdr }),
      });

      if (!verifyRes.ok) throw new Error("Verification failed");
      const { token, user } = await verifyRes.json();

      localStorage.setItem("stellarscope_token", token);
      localStorage.setItem("stellarscope_wallet", user.walletAddress);

      setState({
        address: user.walletAddress,
        token,
        isAuthenticated: true,
      });

      return { address: user.walletAddress, token };
    } catch (err) {
      console.error("Wallet connection failed:", err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem("stellarscope_token");
    localStorage.removeItem("stellarscope_wallet");
    setState({ address: null, token: null, isAuthenticated: false });
    initKit();
    StellarWalletsKit.disconnect();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("stellarscope_token");
    const address = localStorage.getItem("stellarscope_wallet");
    if (token && address) {
      setState({ address, token, isAuthenticated: true });
    }
  }, []);

  return {
    ...state,
    isConnecting,
    connect,
    disconnect,
  };
}