/**
 * CertifiedPass Web App — Route Map
 */

import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "./context/AuthContext.js";
import { ProfileSetupModal } from "./components/profile/ProfileSetupModal.js";

// ---------------------------------------------------------------------------
// Lazy-loaded page components (code split per route)
// ---------------------------------------------------------------------------

// Public pages
const LandingPage      = lazy(() => import("./pages/LandingPage.js"));
const VerifyPage       = lazy(() => import("./pages/VerifyPage.js"));
const CredentialPage   = lazy(() => import("./pages/CredentialPage.js"));
const ProfilePage      = lazy(() => import("./pages/ProfilePage.js"));
const IssuerPublicPage = lazy(() => import("./pages/IssuerPublicPage.js"));

// Authenticated holder pages
const DashboardPage    = lazy(() => import("./pages/DashboardPage.js"));
const MyCredentials    = lazy(() => import("./pages/MyCredentials.js"));
const MyProfile        = lazy(() => import("./pages/MyProfile.js"));
const SettingsPage     = lazy(() => import("./pages/SettingsPage.js"));

// Issuer pages
const IssuerDashboard  = lazy(() => import("./pages/issuer/IssuerDashboard.js"));
const IssuerEvents     = lazy(() => import("./pages/issuer/IssuerEvents.js"));
const IssuerEventDetail= lazy(() => import("./pages/issuer/IssuerEventDetail.js"));
const IssuerCredentials= lazy(() => import("./pages/issuer/IssuerCredentials.js"));
const IssuerIssuePage  = lazy(() => import("./pages/issuer/IssuerIssuePage.js"));

// ---------------------------------------------------------------------------
// Loading fallback
// ---------------------------------------------------------------------------
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBFBFD] text-slate-500 font-medium">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        <span className="text-xs font-mono">Loading CertifiedPass...</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  const { isProfileModalOpen, closeProfileModal } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/"                   element={<LandingPage />} />
        <Route path="/verify"             element={<VerifyPage />} />
        <Route path="/c/:credentialId"    element={<CredentialPage />} />
        <Route path="/u/:username"        element={<ProfilePage />} />
        <Route path="/issuers/:id"        element={<IssuerPublicPage />} />

        {/* Holder routes */}
        <Route path="/dashboard"          element={<DashboardPage />} />
        <Route path="/credentials"        element={<MyCredentials />} />
        <Route path="/profile"            element={<MyProfile />} />
        <Route path="/settings"           element={<SettingsPage />} />

        {/* Issuer routes */}
        <Route path="/issuer"                       element={<IssuerDashboard />} />
        <Route path="/issuer/events"                element={<IssuerEvents />} />
        <Route path="/issuer/events/:id"            element={<IssuerEventDetail />} />
        <Route path="/issuer/credentials"           element={<IssuerCredentials />} />
        <Route path="/issuer/issue"                 element={<IssuerIssuePage />} />
      </Routes>

      {/* Global Cross-Device Profile Setup / Edit Modal */}
      <ProfileSetupModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />
    </Suspense>
  );
}
