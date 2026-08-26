# CertifiedPass — System Architecture

## Overview

CertifiedPass is a monorepo Web3 application with three execution contexts:

1. **Smart Contract** (`contracts/`) — on-chain authority for credential integrity
2. **API Server** (`apps/api/`) — off-chain orchestration, AI, auth, data layer
3. **Web Frontend** (`apps/web/`) — issuer dashboard, holder profile, public verifier

The separation is intentional: blockchain owns **what happened and when**, the API owns **what it means and how to present it**.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CertifiedPass Platform                           │
├──────────────────────────────┬──────────────────────────────────────────────┤
│        Web Frontend           │              API Server (Express/TS)         │
│        (React + Vite)         │                                              │
│                               │  ┌────────────┐  ┌──────────────────────┐  │
│  Public Pages:                │  │ Auth       │  │ Credential Service    │  │
│    / (landing)                │  │ Service    │  │  - Issue              │  │
│    /c/:id (verification)      │  │            │  │  - Verify             │  │
│    /u/:username (profile)     │  │ Wallet sig │  │  - Revoke             │  │
│                               │  │ → JWT      │  │  - List               │  │
│  Holder Dashboard:            │  └────────────┘  └──────────────────────┘  │
│    /dashboard                 │                                              │
│    /credentials               │  ┌────────────┐  ┌──────────────────────┐  │
│    /profile                   │  │ Issuer     │  │ Verification Service │  │
│                               │  │ Service    │  │  - Blockchain lookup │  │
│  Issuer Dashboard:            │  │            │  │  - Hash comparison   │  │
│    /issuer                    │  │ Registration│  │  - State resolution  │  │
│    /issuer/events             │  │ Verification│  └──────────────────────┘  │
│    /issuer/issue              │  └────────────┘                             │
│                               │                                              │
│  Web3:                        │  ┌────────────┐  ┌──────────────────────┐  │
│    wagmi v2                   │  │ AI Service │  │ Blockchain Service    │  │
│    RainbowKit                 │  │            │  │  - ethers.js v6       │  │
│    viem                       │  │ Gemini     │  │  - Contract calls     │  │
│                               │  │ 1.5 Flash  │  │  - Tx submission     │  │
│  3D:                          │  │            │  │  - Event listening    │  │
│    Three.js / R3F             │  │ → Zod val. │  └──────────────────────┘  │
│  Motion:                      │  └────────────┘                             │
│    Framer Motion              │                                              │
│                               │  ┌────────────────────────────────────────┐ │
│                               │  │           Data Layer                    │ │
│                               │  │  PostgreSQL (Prisma) + Redis (Bull)     │ │
│                               │  └────────────────────────────────────────┘ │
└──────────────────────────────┴──────────────────────────────────────────────┘
                                           │
                    ┌──────────────────────┘
                    ▼
┌────────────────────────────────────────────────────────────┐
│           Polygon Amoy (EVM — Testnet)                      │
│                                                            │
│   CertifiedPassRegistry.sol                                │
│   ├── registerIssuer()                                     │
│   ├── issueCredential(id, holder, type, hash, uri)         │
│   ├── verifyCredential(id) → (hash, issuer, revoked, ...)  │
│   └── revokeCredential(id, reason)                         │
└────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Credential Issuance

```
Issuer (browser)
    │
    ├── 1. Upload document / CSV to API
    │         POST /api/v1/ai/extract
    │
    ├── 2. API → Gemini 1.5 Flash → raw extraction JSON
    │         AIService.extractFromDocument()
    │
    ├── 3. API validates raw JSON via Zod schemas
    │         validateCredentialMetadata() → CredentialDraft[]
    │
    ├── 4. Issuer reviews drafts in UI (AI tags visible)
    │         Issuer edits fields → tags disappear on edit
    │
    ├── 5. Issuer approves draft
    │         POST /api/v1/credentials (status: APPROVED)
    │
    ├── 6. API generates canonical JSON
    │         canonicalizeCredential(credential) → canonical string
    │
    ├── 7. API computes SHA-256 hash
    │         hashCredential(credential) → credentialHash (hex)
    │
    ├── 8. API stores metadata off-chain (PostgreSQL)
    │         Credential record with status = ISSUED
    │
    ├── 9. API submits on-chain transaction
    │         BlockchainService.issueCredential(id, holder, type, hash, uri)
    │
    ├── 10. Blockchain confirms → emits CredentialIssued event
    │
    ├── 11. API updates DB: status = ACTIVE, txHash, blockNumber
    │
    └── 12. Frontend shows seal animation → credential appears in list
```

---

## Data Flow: Public Verification

```
Verifier (browser) — NO WALLET REQUIRED
    │
    ├── 1. Open /c/:credentialId or scan QR code
    │
    ├── 2. Frontend calls GET /api/v1/credentials/:id/verify
    │
    ├── 3. API: VerificationService.verify(credentialId)
    │       a. Fetch credential metadata from PostgreSQL
    │       b. Call contract.verifyCredential(credentialId) → onChainHash, revoked, ...
    │       c. Reconstruct canonical JSON from stored metadata
    │       d. Recalculate SHA-256 hash
    │       e. Compare calculated hash vs onChainHash (compareHashes())
    │       f. Verify issuer.verificationStatus === VERIFIED
    │       g. Verify revoked === false
    │       h. Return VerificationResult
    │
    └── 4. Frontend renders:
           VERIFIED (green, hash comparison widget shows match)
           INVALID  (red, hash comparison shows mismatch)
           REVOKED  (amber, single shake animation)
```

---

## Security Boundaries

| Layer | Trust Level | Why |
|-------|-------------|-----|
| Blockchain (contract) | **Absolute** | Immutable; issuer authorization enforced on-chain |
| API (server-side validation) | **High** | Zod schemas gate all AI output; JWT auth |
| AI output | **Untrusted** | Always re-validated before touching storage |
| Frontend | **Low** | Display only; no secrets; no private keys |
| User wallet | **User-controlled** | Signs nonce messages; never sends private key to API |

---

## Shared Packages

| Package | Purpose | Used By |
|---------|---------|---------|
| `@certifiedpass/types` | TypeScript interfaces | API, web |
| `@certifiedpass/utils` | Hashing + Zod schemas | API, web (verification) |
| `@certifiedpass/config` | Chain configs, constants | API, web |
| `@certifiedpass/design-tokens` | CSS vars, Tailwind preset, TS tokens | web |
