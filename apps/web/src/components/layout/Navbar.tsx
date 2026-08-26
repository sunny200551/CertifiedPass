import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Award, Search, Menu, X, PlusCircle, LayoutDashboard, User, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext.js";
import { Button } from "../ui/Button.js";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isIssuer, user, login, loginDemo, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/CP_logo.png"
            alt="CertifiedPass Logo"
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-slate-950 flex items-center gap-1.5 font-display">
              CertifiedPass
              <span className="rounded-full bg-indigo-100 border border-indigo-300 px-2 py-0.5 text-[10px] font-black text-indigo-900">
                Polygon
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/80">
          <Link
            to="/"
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              isActive("/") && location.pathname === "/"
                ? "bg-white text-slate-900 shadow-apple-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Home
          </Link>
          <Link
            to="/verify"
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              isActive("/verify") || isActive("/c")
                ? "bg-white text-slate-900 shadow-apple-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search className="h-3.5 w-3.5 text-slate-500" />
            Verify
          </Link>
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              isActive("/dashboard") || isActive("/credentials")
                ? "bg-white text-slate-900 shadow-apple-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-slate-500" />
            Holder Portal
          </Link>
          <Link
            to="/issuer"
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              isActive("/issuer")
                ? "bg-white text-indigo-700 shadow-apple-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Award className="h-3.5 w-3.5 text-indigo-600" />
            Issuer Portal
          </Link>
        </nav>

        {/* Right side: Wallet connect & Auth button */}
        <div className="hidden md:flex items-center gap-2.5">
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />

          {!isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={login}
                isLoading={isLoading}
                className="text-xs shadow-apple-sm"
              >
                Sign In (SIWE)
              </Button>
              <button
                type="button"
                onClick={() => loginDemo("issuer")}
                className="rounded-xl border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-apple-sm flex items-center gap-1"
                title="Instant Demo Access without Wallet"
              >
                <Sparkles className="h-3 w-3" />
                Demo Issuer
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {isIssuer && (
                <Link to="/issuer/issue">
                  <Button variant="cyan" size="sm" className="gap-1 text-xs">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Issue Credential
                  </Button>
                </Link>
              )}
              {user?.username && (
                <Link
                  to={`/u/${user.username}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
                  title="My Public Proof Profile"
                >
                  <User className="h-4 w-4" />
                </Link>
              )}
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                title="Disconnect / Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ConnectButton.Custom>
            {({ account, openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-apple-sm"
              >
                {account ? account.displayName : "Connect"}
              </button>
            )}
          </ConnectButton.Custom>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Universal Verifier
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Holder Dashboard
          </Link>
          <Link
            to="/issuer"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            Issuer Portal
          </Link>
          {!isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
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
            <div className="pt-2 border-t border-slate-100">
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
