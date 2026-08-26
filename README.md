# CertifiedPass

<div align="center">
  <h3>Proof of What You've Achieved.</h3>
  <p><strong>AI-powered verifiable credentials anchored on Polygon Amoy EVM — verifiable by anyone without a wallet.</strong></p>

  <p>
    <a href="https://polygon.technology"><img src="https://img.shields.io/badge/Blockchain-Polygon%20Amoy%20(80002)-8247e5.svg" alt="Polygon Amoy" /></a>
    <a href="https://ai.google.dev"><img src="https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285f4.svg" alt="Gemini AI" /></a>
    <a href="https://turbo.build"><img src="https://img.shields.io/badge/monorepo-Turborepo%202.0-ef4444.svg" alt="Turborepo" /></a>
  </p>
</div>

---

## 🌟 The Problem & The Solution

- **The Problem:** Hackathon wins, internships, open-source milestones, and competitions are real career achievements, but certificates are easily forged, screenshots prove nothing, and LinkedIn endorsements are unverified.
- **The Solution:** **CertifiedPass** provides an end-to-end credential infrastructure. Verified organizations parse documents/spreadsheets with **Gemini 1.5 Flash AI**, preview and approve structured records, and anchor immutable SHA-256 digests onto the **Polygon Amoy EVM** registry. Anyone can audit authenticity via public URL or QR code in seconds with zero wallet required.

---

## 🏛 System Architecture

```
┌────────────────────────────────┐        ┌────────────────────────────────┐
│   Web Application (React/Vite)  │        │   Backend API (Express / TS)   │
│   • 3D Holographic Card (Tilt) │  REST  │   • SIWE / EIP-191 Auth        │
│   • Hash Audit & QR Verification│ ◄────► │   • Gemini 1.5 Flash Parser    │
│   • RainbowKit + wagmi (80002) │        │   • Prisma ORM (PostgreSQL)    │
└────────────────────────────────┘        └────────────────┬───────────────┘
                                                           │ JSON-RPC
                                                           ▼
                                          ┌────────────────────────────────┐
                                          │      Polygon Amoy Testnet      │
                                          │   CertifiedPassRegistry.sol    │
                                          │   • Immutable SHA-256 Anchors  │
                                          │   • Permanent Revocation State │
                                          └────────────────────────────────┘
```

- **Blockchain Owns:** Integrity proof, timestamp, issuer authorization, and irreversible revocation.
- **AI Owns:** Unstructured document parsing, field extraction, and bulk draft generation.
- **Hard Rule:** AI never signs transactions directly. *AI drafts → Issuer reviews → Issuer approves → On-chain signature*.
- **Privacy (§11 Compliance):** Zero PII on-chain. Only cryptographic digests, addresses, types, and timestamps touch the ledger.

---

## 📂 Monorepo Structure

```
CertifiedPass/
├── apps/
│   ├── web/                # React 18, Vite, RainbowKit, wagmi, Framer Motion, TailwindCSS
│   └── api/                # Express, TypeScript, Prisma ORM, Ethers v6, Google GenAI
├── contracts/              # Foundry / Solidity — CertifiedPassRegistry.sol
├── packages/
│   ├── types/              # Shared TypeScript definitions & verification interfaces
│   ├── utils/              # Canonical JSON hashing (SHA-256) & strict Zod schemas
│   ├── config/             # Chain constants (Polygon Amoy 80002) & app configuration
│   └── design-tokens/      # Cyberpunk-clean color palettes, typography & spacing
├── docs/                   # Specifications, smart contract ABI, and architecture guides
└── turbo.json              # Turborepo task pipeline
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `≥ 20.0.0`
- **pnpm**: `≥ 9.0.0` (`npm install -g pnpm`)
- **Foundry**: (`curl -L https://foundry.paradigm.xyz | bash && foundryup`)
- **Docker** (Optional, for PostgreSQL & Redis)

### 1. Clone & Install
```bash
git clone https://github.com/sunny200551/CertifiedPass.git
cd CertifiedPass
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Key variables in `.env`:
- `DATABASE_URL`: PostgreSQL connection URL
- `JWT_SECRET`: Secret key for JWT sessions
- `CHAIN_ID`: `80002` (Polygon Amoy Testnet)
- `RPC_URL`: `https://rpc-amoy.polygon.technology`
- `CONTRACT_ADDRESS`: Deployed `CertifiedPassRegistry` contract address
- `GOOGLE_AI_API_KEY`: Google Gemini API key for AI document parsing

### 3. Database Setup
```bash
pnpm db:generate   # Generate Prisma client
pnpm db:migrate    # Run database migrations
```

### 4. Run Development Servers
```bash
pnpm dev           # Launches API (:3001) and Frontend Web (:5173) in parallel
```
Open **http://localhost:5173** to explore the application.

---

## 🧭 Routes & User Portals

### 🌐 Public Pages (Zero Wallet Required)
- `/`: Landing page with live 3D Holographic Card demo and instant verifier.
- `/verify`: Universal credential lookup by Credential ID or SHA-256 hash.
- `/c/:credentialId`: Interactive certificate inspection, 3D card, and cryptographic hash comparison widget.
- `/u/:username`: Holder public Proof Profile and verified achievements showcase.
- `/issuers/:id`: Public issuer profile and issued program records.

### 👤 Holder Portal (Authenticated via Wallet)
- `/dashboard`: Holder achievement overview and stats.
- `/credentials`: Categorized credential archive (Hackathons, Internships, Open Source, etc.).
- `/profile`: Profile customization (username, display name, bio).
- `/settings`: Connected wallet session and privacy controls.

### 🏢 Issuer Portal (Verified Organizations)
- `/issuer`: Issuer analytics dashboard.
- `/issuer/issue`: Multi-step AI issuance flow (Upload Document/CSV → Gemini AI parsing → Review & approve → Anchor on-chain).
- `/issuer/events`: Program and event manager.
- `/issuer/credentials`: Organization credential log with irreversible revocation controls.

---

## 📜 Smart Contract Specification

The core contract is [`CertifiedPassRegistry.sol`](./contracts/src/CertifiedPassRegistry.sol):
- **Interface:** `ICertifiedPassRegistry`
- **Network:** Polygon Amoy Testnet (`chainId: 80002`)
- **Key Functions:**
  - `issueCredential(bytes32 id, address holder, bytes32 hash, string type, string uri)`: Issues and anchors a new credential.
  - `revokeCredential(bytes32 id, string reason)`: Permanently marks a credential as revoked.
  - `verifyCredential(bytes32 id)`: Returns on-chain existence, hash, issuer, and revocation status.
  - `registerIssuer(address issuer, string name, string metadataUri)`: Onboards a verified issuing organization.

---

## 🧪 Testing & Verification

```bash
# Run Turborepo workspace type-checks
pnpm type-check

# Run Smart Contract unit tests (Foundry)
cd contracts && forge test -vvv

# Run Frontend and Backend production builds
pnpm build
```

---

## 🛡 Security & Privacy Highlights

1. **Deterministic Hashing**: Canonical JSON sorting prevents whitespace/key-order mismatches.
2. **EIP-191 SIWE Authentication**: Cryptographic wallet signatures with timestamped nonces prevent replay attacks.
3. **Zod Validation**: Untrusted inputs and AI outputs are strictly sanitized against type schemas before database insertion.
4. **Permanent Revocation**: Once revoked on-chain by the issuing entity, credentials cannot be un-revoked or re-issued under the same ID.



---

<div align="center">
  <sub>Built with ❤️ on Polygon Amoy EVM using React, TypeScript, Foundry, TailwindCSS, RainbowKit, and Gemini AI.</sub>
</div>
