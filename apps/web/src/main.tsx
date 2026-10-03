/**
 * CertifiedPass Web App — Entry Point
 *
 * Provider hierarchy (outermost → innermost):
 *   WagmiProvider → QueryClientProvider → RainbowKitProvider → BrowserRouter → AuthProvider → App
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, fallback, http } from "wagmi";
import { getDefaultConfig, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { polygonAmoy } from "wagmi/chains";

import App from "./App.js";
import { AuthProvider } from "./context/AuthContext.js";
import { ThemeProvider } from "./context/ThemeContext.js";
import "./styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";

// ---------------------------------------------------------------------------
// WalletConnect / Reown Project Configuration & Rejection Guard
// ---------------------------------------------------------------------------
const WALLET_CONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "21fef48091f12692cad574a6f7753643";

// Catch unhandled WalletConnect socket rejections when domain is not allowlisted on cloud.reown.com
// & auto-reload when a new deployment invalidates cached chunk hashes
if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    console.warn("[CertifiedPass] Fresh version detected, updating resources...");
    window.location.reload();
  });

  window.addEventListener("error", (event) => {
    const msg = String(event?.message || "");
    if (
      msg.includes("Failed to fetch dynamically imported module") ||
      msg.includes("Importing a module script failed") ||
      msg.includes("error loading dynamically imported module")
    ) {
      event.preventDefault();
      console.warn("[CertifiedPass] Module chunk outdated after deployment, refreshing...");
      window.location.reload();
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reasonStr = String(event.reason?.message || event.reason || "");
    if (
      reasonStr.includes("Failed to fetch dynamically imported module") ||
      reasonStr.includes("Importing a module script failed") ||
      reasonStr.includes("error loading dynamically imported module")
    ) {
      event.preventDefault();
      window.location.reload();
      return;
    }
    if (
      reasonStr.includes("trying to subscribe") ||
      reasonStr.includes("origin not allowed") ||
      reasonStr.includes("Unauthorized: origin not allowed") ||
      reasonStr.includes("pulse.walletconnect.org") ||
      reasonStr.includes("Allowlist") ||
      reasonStr.includes("Cross-Origin-Opener-Policy")
    ) {
      event.preventDefault();
      console.warn(
        "[WalletConnect / Reown notice] Domain allowlist restriction active on cloud.reown.com for https://certifiedpass.polylance.codes. Injected wallets (MetaMask, Coinbase, Phantom, etc.) and direct web3 flows work with 100% functionality."
      );
    }
  });
}

// ---------------------------------------------------------------------------
// Wagmi + RainbowKit Configuration with High-Reliability Fallback RPCs
// ---------------------------------------------------------------------------
const wagmiConfig = getDefaultConfig({
  appName: "CertifiedPass",
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: fallback([
      http("https://polygon-amoy-bor-rpc.publicnode.com"),
      http("https://rpc.ankr.com/polygon_amoy"),
      http("https://polygon-amoy.drpc.org"),
      http("https://1rpc.io/amoy"),
    ]),
  },
  ssr: false,
});

// ---------------------------------------------------------------------------
// React Query
// ---------------------------------------------------------------------------
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ---------------------------------------------------------------------------
// RainbowKit Theme
// ---------------------------------------------------------------------------
const rainbowTheme = lightTheme({
  accentColor: "#4F46E5",
  accentColorForeground: "#FFFFFF",
  borderRadius: "large",
  fontStack: "system",
  overlayBlur: "small",
});

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found in index.html");

const appBaseName = import.meta.env.BASE_URL || "/";

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={rainbowTheme}>
            <BrowserRouter basename={appBaseName} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  </React.StrictMode>
);
