/**
 * CertifiedPass Web App — Route Map
 *
 * Routes from §19:
 *
 * PUBLIC (no wallet required):
 *   /                          → Landing page
 *   /verify                    → Verify by credential ID
 *   /c/:credentialId           → Public credential verification page
 *   /u/:username               → Holder's Proof Profile
 *   /issuers/:id               → Public issuer profile
 *
 * USER (wallet connected, authenticated):
 *   /dashboard                 → Holder dashboard
 *   /credentials               → My credentials list
 *   /profile                   → Edit my profile
 *   /settings                  → Account settings
 *
 * ISSUER (wallet connected + issuer account):
 *   /issuer                    → Issuer dashboard
 *   /issuer/events             → My events list
 *   /issuer/events/:id         → Event detail + credentials
 *   /issuer/credentials        → All issued credentials
 *   /issuer/issue              → Issue new credentials (AI flow)
 */

import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-secondary)",
        fontFamily: "var(--font-body)",
      }}
    >
      Loading…
    </div>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ---------------------------------------------------------------- */}
        {/* Public routes                                                     */}
        {/* ---------------------------------------------------------------- */}
        <Route path="/"                   element={<LandingPage />} />
        <Route path="/verify"             element={<VerifyPage />} />
        <Route path="/c/:credentialId"    element={<CredentialPage />} />
        <Route path="/u/:username"        element={<ProfilePage />} />
        <Route path="/issuers/:id"        element={<IssuerPublicPage />} />

        {/* ---------------------------------------------------------------- */}
        {/* Holder routes (require wallet + auth)                             */}
        {/* ---------------------------------------------------------------- */}
        <Route path="/dashboard"          element={<DashboardPage />} />
        <Route path="/credentials"        element={<MyCredentials />} />
        <Route path="/profile"            element={<MyProfile />} />
        <Route path="/settings"           element={<SettingsPage />} />

        {/* ---------------------------------------------------------------- */}
        {/* Issuer routes (require wallet + issuer account)                   */}
        {/* ---------------------------------------------------------------- */}
        <Route path="/issuer"                       element={<IssuerDashboard />} />
        <Route path="/issuer/events"                element={<IssuerEvents />} />
        <Route path="/issuer/events/:id"            element={<IssuerEventDetail />} />
        <Route path="/issuer/credentials"           element={<IssuerCredentials />} />
        <Route path="/issuer/issue"                 element={<IssuerIssuePage />} />
      </Routes>
    </Suspense>
  );
}
