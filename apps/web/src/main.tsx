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
import "./styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";

// ---------------------------------------------------------------------------
// Wagmi + RainbowKit Configuration with High-Reliability Fallback RPCs
// ---------------------------------------------------------------------------
const wagmiConfig = getDefaultConfig({
  appName: "CertifiedPass",
  projectId: "21fef48091f12692cad574a6f7753643",
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
// RainbowKit Apple-style Light Theme
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
  </React.StrictMode>
);
