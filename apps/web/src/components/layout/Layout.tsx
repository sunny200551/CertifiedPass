import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar.js";
import { Footer } from "./Footer.js";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-bg)] text-[var(--text-primary)] relative overflow-x-hidden selection:bg-[var(--brand-from)]/20 selection:text-[var(--brand-from)] transition-colors duration-300">
      {/* Background subtle ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40 dark:opacity-20">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-gradient-to-b from-[var(--brand-from)]/10 via-[var(--accent-cyan)]/5 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-[500px] w-[500px] rounded-full bg-[var(--accent-blue)]/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 h-[500px] w-[500px] rounded-full bg-[var(--accent-purple)]/5 blur-3xl" />
      </div>

      <Navbar />

      <main className="flex-1 relative z-10 min-h-[calc(100vh-240px)] flex flex-col">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.18, ease: "easeIn" } }}
            className="flex-1 w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};
