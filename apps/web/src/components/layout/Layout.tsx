import React from "react";
import { Navbar } from "./Navbar.js";
import { Footer } from "./Footer.js";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-cyan-600/10 via-blue-600/5 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-3xl" />
      </div>

      <Navbar />

      <main className="flex-1 relative z-10">{children}</main>

      <Footer />
    </div>
  );
};
