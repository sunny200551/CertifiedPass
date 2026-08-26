import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Shield, Award, Search, Menu, X, PlusCircle, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext.js";
import { Button } from "../ui/Button.js";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isIssuer, user, login, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-md shadow-cyan-500/20 text-slate-950 font-black">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              CertifiedPass
              <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-300">
                Polygon
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive("/") && location.pathname === "/"
                ? "bg-slate-800 text-cyan-300"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/verify"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive("/verify") || isActive("/c")
                ? "bg-slate-800 text-cyan-300"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <Search className="h-4 w-4" />
            Verify
          </Link>

          {/* Holder Links */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive("/dashboard") || isActive("/credentials")
                ? "bg-slate-800 text-cyan-300"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Holder Portal
          </Link>

          {/* Issuer Links */}
          <Link
            to="/issuer"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive("/issuer")
                ? "bg-purple-950/40 text-purple-300 border border-purple-800/40"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <Award className="h-4 w-4 text-purple-400" />
            Issuer Portal
          </Link>
        </nav>

        {/* Right side: Wallet connect & Auth button */}
        <div className="hidden md:flex items-center gap-3">
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />

          {!isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              onClick={login}
              isLoading={isLoading}
            >
              Sign In (SIWE)
            </Button>
          ) : (
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 transition-colors"
            >
              <User className="h-3.5 w-3.5 text-cyan-400" />
              <span>{user?.displayName ?? "My Profile"}</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
              if (!mounted || !account || !chain) {
                return (
                  <Button variant="cyan" size="sm" onClick={openConnectModal}>
                    Connect
                  </Button>
                );
              }
              return (
                <Button variant="secondary" size="sm" onClick={openAccountModal}>
                  {account.displayName}
                </Button>
              );
            }}
          </ConnectButton.Custom>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Verify Credential
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Holder Dashboard
          </Link>
          <Link
            to="/issuer"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-purple-300 hover:bg-purple-950/40"
          >
            Issuer Portal
          </Link>

          {!isAuthenticated && (
            <div className="pt-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  login();
                  setMobileMenuOpen(false);
                }}
              >
                Sign In with Wallet
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
