# CertifiedPass — Security Reference

## Authentication

### Web3 Wallet Signature Flow

```
1. Client: GET /api/v1/auth/nonce?wallet=0xAddress
   Server: Generate UUID nonce, store with 5-min TTL, return message string

2. Client: wallet.signMessage(message) → signature (EIP-191 personal_sign)

3. Client: POST /api/v1/auth/verify { walletAddress, signature, nonce }
   Server:
     a. Retrieve nonce from DB — reject if expired or already used
     b. ethers.verifyMessage(message, signature) → recoveredAddress
     c. Compare recoveredAddress to walletAddress (case-insensitive)
     d. Mark nonce as used (one-time use — delete or flag)
     e. Upsert user in DB
     f. Sign and return JWT (HS256, 7-day expiry)

4. Client: Include JWT as Bearer token in subsequent requests
```

**Never authenticate on wallet address alone.** The signature proves ownership.

### JWT

- Algorithm: HS256
- Secret: loaded from `JWT_SECRET` env var — never hardcoded
- Payload: `{ walletAddress, issuerId?, isAdmin?, iat, exp }`
- Expiry: 7 days default (configurable via `JWT_EXPIRES_IN`)

---

## Secret Management

| Secret | Where stored | Where used |
|--------|-------------|-----------|
| `JWT_SECRET` | `.env` / secrets manager | API server only |
| `DEPLOYER_PRIVATE_KEY` | `.env` / secrets manager | API server only (contract calls) |
| `GOOGLE_AI_API_KEY` | `.env` / secrets manager | API server only |
| `DATABASE_URL` | `.env` / secrets manager | API server only |
| `ADMIN_API_KEY` | `.env` / secrets manager | API server only |

**Rules:**
- Zero secrets in frontend code
- Zero secrets in git
- Zero private keys transmitted to browser
- All env vars must be in `.env.example` with descriptions (but no real values)

---

## AI Output Security

AI is treated as an **untrusted external service**. Its output can be:
- Malformed JSON
- Incorrect field types
- Excessively long strings
- Unexpected fields (injection attempt)

**Every AI response MUST pass through Zod schema validation before:**
- Being stored in the database
- Being shown in the review UI
- Being used to generate a canonical credential

See `validateCredentialMetadata()` in `packages/utils/src/schema.ts`.

---

## File Upload Security

- MIME type whitelist enforced server-side (PDF, JPEG, PNG, WebP, CSV, XLSX)
- Max file size: 10 MB (configurable via `MAX_UPLOAD_SIZE`)
- Files stored in **memory buffer only** — never written to disk in the extraction path
- File contents are passed to Gemini API and immediately discarded from memory
- No user-controlled filenames ever reach the filesystem

---

## On-Chain Privacy (§11)

**Never stored on-chain:**
- Holder full name
- Email or phone
- Raw participation data
- Full certificate content

**Stored on-chain:**
- `credentialHash` — SHA-256 (no PII recoverable)
- `issuer` and `holder` EVM addresses
- `credentialType` (category string)
- `metadataURI` (pointer to off-chain JSON)
- `issuedAt` / `revokedAt` timestamps
- `revoked` boolean

---

## Smart Contract Authorization

Three layers prevent unauthorized issuance:

1. **Admin registration:** only admin can add issuers to the registry
2. **Verification gate:** issuers must be marked `isVerified=true` to issue
3. **Revocation gate:** only the original issuing address (`credential.issuer`) can revoke

---

## Rate Limiting

| Endpoint group | Limit |
|---------------|-------|
| All routes | 100 req / 15 min |
| `/api/v1/auth/*` | 20 req / 15 min |
| `/api/v1/ai/*` | 20 req / hour |

Implemented via `express-rate-limit`. In production, use Redis store for multi-instance consistency.

---

## Duplicate Credential Prevention

Enforced at two levels (defense in depth):

1. **Database:** `credential_hash` field has a unique index — insertion fails on duplicate hash
2. **Smart contract:** `CredentialAlreadyExists` error — `issueCredential()` reverts if ID already exists

---

## Revocation Immutability

A revoked credential:
- Cannot be un-revoked (no un-revoke function exists in the contract)
- Remains in the database and on-chain (history is part of the proof)
- Shows `REVOKED` immediately on the public verification page
- The revocation reason is stored in the `revocations` table

---

## Input Validation

All API inputs are validated with Zod schemas in middleware before reaching service layer.
See `apps/api/src/middleware/validate.ts` and `packages/utils/src/schema.ts`.

---

## CORS

Allowed origins configured via `CORS_ORIGINS` env var. Default: `http://localhost:5173` (dev only). Production must set explicit domain(s).

---

## Dependency Updates

Use `pnpm audit` regularly. OpenZeppelin contracts are pinned to a specific version and should only be updated after reviewing the changelog for breaking security changes.
