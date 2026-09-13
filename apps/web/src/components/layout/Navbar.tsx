import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Award,
  Search,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  User,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.js";
import { useTheme } from "../../context/ThemeContext.js";
import { Button } from "../ui/Button.js";
import { logoUrl } from "../../lib/urls.js";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isIssuer, user, login, loginDemo, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", exact: true },
    { path: "/verify", label: "Verify", icon: Search, prefix: "/c" },
    { path: "/dashboard", label: "Holder Portal", icon: LayoutDashboard, prefix: "/credentials" },
    { path: "/issuer", label: "Issuer Portal", icon: Award },
  ];

  const isNavActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return location.pathname === "/";
    if (location.pathname.startsWith(item.path)) return true;
    if (item.prefix && location.pathname.startsWith(item.prefix)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full pt-3 px-3 sm:px-6 lg:px-8 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 rounded-full neo-raised border-2 border-[var(--neo-outline)] bg-[var(--surface-bg)] transition-all">
        {/* Unified Logo & Brand Lockup */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="neo-raised-sm rounded-full p-1.5 border-2 border-[var(--neo-outline)] flex items-center justify-center bg-[var(--surface-bg)] shrink-0"
          >
            <img
              src={logoUrl}
              alt="CertifiedPass Logo"
              className="h-6 w-6 object-contain rounded-full"
            />
          </motion.div>
          <span className="text-base sm:text-[17px] font-black tracking-tight text-[var(--text-primary)] font-display transition-colors group-hover:text-[var(--brand-from)]">
            CertifiedPass
          </span>
        </Link>

        {/* Desktop Navigation Links with Balanced Medium Sizing & Magnetic Sliding Indicator */}
        <nav className="hidden lg:flex items-center gap-1 neo-inset p-1 rounded-full border-2 border-[var(--neo-outline)] bg-[var(--surface-bg)] relative">
          {navItems.map((item) => {
            const active = isNavActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-2 text-sm font-bold transition-all z-10 active:scale-[0.98] ${
                  active
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="navbar-tab-pill"
                    className="absolute inset-0 rounded-full neo-pill-active bg-[var(--surface-bg)] -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side: Theme toggle, Wallet connect & Auth button */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Theme Toggle Button - Precisely centered flex container */}
          <button
            onClick={toggleTheme}
            type="button"
            className="neo-icon-btn !w-9 !h-9 flex items-center justify-center cursor-pointer"
            aria-label="Toggle light and dark theme"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <motion.div
                key="moon"
                initial={{ rotate: -30, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Moon className="h-4 w-4 text-amber-400" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 30, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Sun className="h-4 w-4 text-amber-500" />
              </motion.div>
            )}
          </button>

          {/* Compact Neomorphic Wallet Connect & Account Chip */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;
              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                  className="flex items-center"
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="neo-btn-primary rounded-full px-3.5 py-1.5 text-xs font-bold active:scale-[0.98] transition-all"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="neo-raised-sm rounded-full border-2 border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-500 active:scale-[0.98]"
                        >
                          Wrong Network
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="neo-icon-btn !w-9 !h-9"
                          title={chain.name}
                        >
                          {chain.hasIcon && chain.iconUrl ? (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              className="w-4 h-4 rounded-full"
                            />
                          ) : (
                            <span className="text-[10px] font-bold">ETH</span>
                          )}
                        </button>

                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="neo-raised-sm flex items-center gap-2 rounded-full border-2 border-[var(--neo-outline)] bg-[var(--surface-bg)] px-3 py-1.5 text-xs font-bold text-[var(--text-primary)] hover:border-[var(--brand-from)] transition-all active:scale-[0.98] h-9"
                        >
                          {account.ensAvatar ? (
                            <img
                              src={account.ensAvatar}
                              alt={account.displayName}
                              className="h-5 w-5 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-[var(--brand-from)] to-[var(--brand-to)] flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                              {account.displayName.slice(0, 2)}
                            </div>
                          )}
                          <span className="font-mono text-xs">{account.displayName}</span>
                          <ChevronDown className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={login}
                isLoading={isLoading}
                className="text-xs px-3 py-1.5 border-2 border-[var(--neo-outline)] h-9 rounded-full"
              >
                Sign In (SIWE)
              </Button>
              <button
                type="button"
                onClick={() => loginDemo("issuer")}
                className="neo-raised-sm rounded-full border-2 border-[var(--neo-outline)] bg-[var(--accent-purple-bg)] px-3 py-1.5 text-[11px] font-bold text-[var(--accent-purple)] hover:text-[var(--brand-from)] transition-all flex items-center gap-1.5 active:scale-[0.98] h-9"
                title="Instant Demo Access without Wallet"
              >
                <Sparkles className="h-3.5 w-3.5 animate-pulse-glow" />
                Demo Issuer
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {isIssuer && (
                <Link to="/issuer/issue">
                  <Button variant="primary" size="sm" className="gap-1.5 text-xs h-9 px-3 rounded-full">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Issue
                  </Button>
                </Link>
              )}
              {user?.username && (
                <Link
                  to={`/u/${user.username}`}
                  className="neo-icon-btn !w-9 !h-9"
                  title="My Public Proof Profile"
                >
                  <User className="h-4 w-4" />
                </Link>
              )}
              <button
                onClick={logout}
                className="neo-icon-btn !w-9 !h-9 hover:text-red-500"
                title="Disconnect / Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button & Theme toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            type="button"
            className="neo-icon-btn !w-9 !h-9 flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Moon className="h-4 w-4 text-amber-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-500" />
            )}
          </button>

          <ConnectButton.Custom>
            {({ account, openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="neo-btn-primary rounded-full px-3 py-1.5 text-xs font-bold"
              >
                {account ? account.displayName : "Connect"}
              </button>
            )}
          </ConnectButton.Custom>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="neo-icon-btn !w-9 !h-9"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 rounded-2xl neo-floating bg-[var(--surface-bg)] px-4 py-4 space-y-2 transition-all">
          {navItems.map((item) => {
            const active = isNavActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                  active
                    ? "neo-inset text-[var(--brand-from)]"
                    : "text-[var(--text-primary)] hover:neo-raised-sm"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {!isAuthenticated ? (
            <div className="pt-2 space-y-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  login();
                  setMobileMenuOpen(false);
                }}
                isLoading={isLoading}
                className="w-full"
              >
                Sign In (SIWE)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  loginDemo("issuer");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-xs"
              >
                Launch Demo Mode
              </Button>
            </div>
          ) : (
            <div className="pt-2">
              <Button variant="danger" size="sm" onClick={logout} className="w-full text-xs">
                Disconnect
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
