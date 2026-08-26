# CertifiedPass — Credential Schema Reference

## Canonicalization & Hashing

### Why canonical serialization matters

JSON objects have no inherent field order. `{"a":1,"b":2}` and `{"b":2,"a":1}` are semantically identical but produce different SHA-256 hashes. CertifiedPass uses **deterministic canonicalization** to guarantee:

1. The same credential always produces the same hash, regardless of how the JSON was constructed.
2. Both the API (when issuing) and the verifier (when rechecking) produce identical byte sequences.
3. Any modification to any field produces a detectably different hash.

### Canonicalization algorithm

Implemented in [`packages/utils/src/hash.ts`](../packages/utils/src/hash.ts):

```
1. Extract fields in CANONICAL_FIELD_ORDER:
   [id, credentialType, issuerAddress, holderAddress, issuedAt, metadata, schemaVersion]

2. For the `metadata` field: recursively sort all object keys alphabetically.
   Arrays are NOT sorted — array order is semantically significant.

3. Serialize to compact JSON (no whitespace).

4. Compute SHA-256 of the UTF-8 encoded JSON string.

5. Return lowercase hex digest (64 chars).
```

### Example canonical credential

```json
{"id":"550e8400-e29b-41d4-a716-446655440000","credentialType":"hackathon","issuerAddress":"0xAbCd...","holderAddress":"0x1234...","issuedAt":"2026-10-31T00:00:00Z","metadata":{"achievement":"Winner","credentialType":"hackathon","eventName":"AI Hack Goa 2026","holderName":"Sunny Pasumarthi","issuedAt":"2026-10-31","issuerName":"AI Hack Goa","project":"CertifiedPass","rank":1,"team":"Team Alpha","title":"Hackathon Winner"},"schemaVersion":1}
```

Note: metadata keys sorted alphabetically (achievement < credentialType < eventName...).

SHA-256 of the above → `credentialHash` stored on-chain.

---

## Credential Types

### Hackathon

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| credentialType | `"hackathon"` | ✓ | Discriminant |
| title | string | ✓ | e.g. "Hackathon Winner" |
| holderName | string | ✓ | |
| issuerName | string | ✓ | |
| issuedAt | ISO date | ✓ | YYYY-MM-DD |
| eventName | string | ✓ | |
| achievement | string | ✓ | e.g. "Winner", "2nd Place" |
| rank | integer | ✗ | 1-indexed |
| team | string | ✗ | |
| project | string | ✗ | |
| organizer | string | ✗ | |
| description | string | ✗ | max 2000 chars |
| skills | string[] | ✗ | max 30 items |

### Internship

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| credentialType | `"internship"` | ✓ | |
| title | string | ✓ | |
| holderName | string | ✓ | |
| issuerName | string | ✓ | |
| issuedAt | ISO date | ✓ | |
| companyName | string | ✓ | |
| role | string | ✓ | |
| startDate | ISO date | ✓ | |
| endDate | ISO date | ✓ | |
| completionStatus | enum | ✓ | `completed` \| `ongoing` \| `terminated` |
| department | string | ✗ | |

### Open Source

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| credentialType | `"opensource"` | ✓ | |
| title | string | ✓ | |
| holderName | string | ✓ | |
| issuerName | string | ✓ | |
| issuedAt | ISO date | ✓ | |
| organizationName | string | ✓ | |
| repositoryName | string | ✓ | |
| contributionType | string | ✓ | e.g. "Feature", "Bug Fix" |
| periodStart | ISO date | ✓ | |
| periodEnd | ISO date | ✗ | |
| role | string | ✗ | |
| pullRequestRefs | string[] | ✗ | max 50 |
| issueRefs | string[] | ✗ | max 50 |

### Event

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| credentialType | `"event"` | ✓ | |
| title | string | ✓ | |
| holderName | string | ✓ | |
| issuerName | string | ✓ | |
| issuedAt | ISO date | ✓ | |
| eventName | string | ✓ | |
| role | string | ✓ | e.g. "Speaker", "Organizer" |
| date | ISO date | ✓ | |
| location | string | ✗ | |
| contribution | string | ✗ | |

### Workshop

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| credentialType | `"workshop"` | ✓ | |
| title | string | ✓ | |
| holderName | string | ✓ | |
| issuerName | string | ✓ | |
| issuedAt | ISO date | ✓ | |
| workshopName | string | ✓ | |
| organizer | string | ✓ | |
| topics | string[] | ✓ | min 1, max 20 |
| date | ISO date | ✓ | |
| completionStatus | enum | ✓ | `completed` \| `partial` |
| durationHours | number | ✗ | |

### Competition

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| credentialType | `"competition"` | ✓ | |
| title | string | ✓ | |
| holderName | string | ✓ | |
| issuerName | string | ✓ | |
| issuedAt | ISO date | ✓ | |
| competitionName | string | ✓ | |
| date | ISO date | ✓ | |
| rank | integer | ✗ | |
| prize | string | ✗ | |
| category | string | ✗ | |
| organizer | string | ✗ | |

---

## Adding a New Credential Type

1. Add the type string to `CREDENTIAL_TYPES` in `packages/types/src/credential.ts`
2. Define the `*Fields` interface extending `BaseCredentialFields`
3. Add it to the `CredentialMetadata` union type
4. Add a Zod schema in `packages/utils/src/schema.ts`
5. Add it to the `schemaMap` in `validateCredentialMetadata()`
6. Add the Prisma enum value to `CredentialType` in `schema.prisma`
7. **No smart contract changes required** — `credentialType` is stored as a string on-chain

---

## Credential Lifecycle State Machine

```
                ┌─────────┐
                │  DRAFT  │  ← AI generates, issuer reviews
                └────┬────┘
                     │ issuer approves
                     ▼
               ┌──────────┐
               │ APPROVED │  ← Ready for blockchain submission
               └────┬─────┘
                    │ API submits tx
                    ▼
                ┌────────┐
                │ ISSUED │  ← Tx submitted, awaiting confirmation
                └───┬────┘
                    │ tx confirmed
                    ▼
                ┌────────┐
                │ ACTIVE │  ← Live, verifiable
                └───┬────┘
                    │ issuer revokes
                    ▼
               ┌─────────┐
               │ REVOKED │  ← Terminal. Irreversible.
               └─────────┘
```

Both the smart contract and application logic enforce: REVOKED is a terminal state. There is no un-revoke.
