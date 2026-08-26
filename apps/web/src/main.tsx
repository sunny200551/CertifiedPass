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
import { WagmiProvider, createConfig, http } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

import App from "./App.js";
import { AuthProvider } from "./context/AuthContext.js";
import "./styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";

// ---------------------------------------------------------------------------
// Wagmi config — Polygon Amoy testnet as primary chain
// ---------------------------------------------------------------------------
import { polygonAmoy } from "wagmi/chains";
import { colors } from "@certifiedpass/design-tokens";

const wagmiConfig = createConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(
      import.meta.env["VITE_RPC_URL"] ?? "https://rpc-amoy.polygon.technology"
    ),
  },
});

// ---------------------------------------------------------------------------
// React Query
// ---------------------------------------------------------------------------
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// ---------------------------------------------------------------------------
// RainbowKit theme — matches CertifiedPass dark palette
// ---------------------------------------------------------------------------
const rainbowTheme = darkTheme({
  accentColor: colors.accent.cyan,
  accentColorForeground: colors.bg.primary,
  borderRadius: "medium",
  fontStack: "system",
  overlayBlur: "small",
});

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found in index.html");

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowTheme}>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
