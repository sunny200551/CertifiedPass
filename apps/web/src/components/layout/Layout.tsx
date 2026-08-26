import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar.js";
import { Footer } from "./Footer.js";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFD] text-slate-900 relative overflow-x-hidden selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Background Apple-style soft ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-gradient-to-b from-indigo-50/70 via-sky-50/40 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-[500px] w-[500px] rounded-full bg-sky-50/50 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 h-[500px] w-[500px] rounded-full bg-purple-50/40 blur-3xl" />
      </div>

      <Navbar />

      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};
