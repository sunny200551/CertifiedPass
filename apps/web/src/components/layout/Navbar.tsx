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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.js";
import { useTheme } from "../../context/ThemeContext.js";
import { Button } from "../ui/Button.js";
import { logoUrl } from "../../lib/urls.js";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isIssuer, user, login, loginDemo, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full pt-3 px-3 sm:px-6 lg:px-8 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 rounded-full neo-raised bg-[var(--surface-bg)] transition-all">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="neo-raised-sm rounded-full p-1.5 flex items-center justify-center bg-[var(--surface-bg)] transition-transform group-hover:scale-105">
            <img
              src={logoUrl}
              alt="CertifiedPass Logo"
              className="h-7 w-7 object-contain rounded-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight text-[var(--text-primary)] flex items-center gap-2 font-display">
              CertifiedPass
            </span>
            <span className="neo-inset-sm rounded-full px-2.5 py-0.5 text-[10px] font-black text-[var(--accent-indigo)] flex items-center gap-1.5 bg-[var(--surface-bg)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-green)] animate-pulse-glow" />
              Polygon
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 neo-inset p-1 rounded-full bg-[var(--surface-bg)]">
          <Link
            to="/"
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              isActive("/") && location.pathname === "/"
                ? "neo-pill-active text-[var(--brand-indigo)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:neo-raised-sm"
            }`}
          >
            Home
          </Link>
          <Link
            to="/verify"
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              isActive("/verify") || isActive("/c")
                ? "neo-pill-active text-[var(--accent-blue)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:neo-raised-sm"
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            Verify
          </Link>
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              isActive("/dashboard") || isActive("/credentials")
                ? "neo-pill-active text-[var(--accent-purple)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:neo-raised-sm"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Holder Portal
          </Link>
          <Link
            to="/issuer"
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              isActive("/issuer")
                ? "neo-pill-active text-[var(--accent-pink)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:neo-raised-sm"
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            Issuer Portal
          </Link>
        </nav>

        {/* Right side: Theme toggle, Wallet connect & Auth button */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            type="button"
            className={`p-2.5 rounded-full transition-all duration-300 ${
              theme === "dark" ? "neo-inset text-amber-400" : "neo-raised-sm text-slate-600 hover:text-indigo-600"
            } active:scale-95`}
            aria-label="Toggle light and dark theme"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="relative h-4 w-4">
              <Sun
                className={`h-4 w-4 absolute inset-0 transition-transform duration-300 ${
                  theme === "dark" ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
                }`}
              />
              <Moon
                className={`h-4 w-4 absolute inset-0 transition-transform duration-300 ${
                  theme === "dark" ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"
                }`}
              />
            </div>
          </button>

          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={login}
                isLoading={isLoading}
                className="text-xs"
              >
                Sign In (SIWE)
              </Button>
              <button
                type="button"
                onClick={() => loginDemo("issuer")}
                className="neo-raised-sm rounded-full bg-[var(--accent-purple-bg)] px-3 py-1.5 text-[11px] font-bold text-[var(--accent-purple)] hover:text-[var(--brand-indigo)] transition-all flex items-center gap-1.5 active:neo-inset-sm"
                title="Instant Demo Access without Wallet"
              >
                <Sparkles className="h-3 w-3 animate-pulse-glow" />
                Demo Issuer
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {isIssuer && (
                <Link to="/issuer/issue">
                  <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Issue Credential
                  </Button>
                </Link>
              )}
              {user?.username && (
                <Link
                  to={`/u/${user.username}`}
                  className="neo-raised-sm flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-bg)] text-[var(--text-primary)] hover:text-[var(--brand-indigo)] transition-all"
                  title="My Public Proof Profile"
                >
                  <User className="h-4 w-4" />
                </Link>
              )}
              <button
                onClick={logout}
                className="neo-raised-sm p-2 text-[var(--text-secondary)] hover:text-red-500 rounded-full transition-all active:neo-inset-sm"
                title="Disconnect / Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button & Theme toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            type="button"
            className={`p-2 rounded-full transition-all ${
              theme === "dark" ? "neo-inset text-amber-400" : "neo-raised-sm text-slate-600"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <ConnectButton.Custom>
            {({ account, openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="neo-btn-primary rounded-full px-3 py-1 text-xs font-bold text-white"
              >
                {account ? account.displayName : "Connect"}
              </button>
            )}
          </ConnectButton.Custom>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="neo-raised-sm rounded-full p-2 text-[var(--text-primary)]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 rounded-2xl neo-floating bg-[var(--surface-bg)] px-4 py-4 space-y-2 transition-all">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-xl px-3 py-2 text-sm font-bold ${
              isActive("/") && location.pathname === "/"
                ? "neo-inset text-[var(--brand-indigo)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            Home
          </Link>
          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-xl px-3 py-2 text-sm font-bold ${
              isActive("/verify") || isActive("/c")
                ? "neo-inset text-[var(--accent-blue)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            Universal Verifier
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-xl px-3 py-2 text-sm font-bold ${
              isActive("/dashboard") || isActive("/credentials")
                ? "neo-inset text-[var(--accent-purple)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            Holder Dashboard
          </Link>
          <Link
            to="/issuer"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-xl px-3 py-2 text-sm font-bold ${
              isActive("/issuer")
                ? "neo-inset text-[var(--accent-pink)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            Issuer Portal
          </Link>
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
