# CertifiedPass — Smart Contract Specification

## Contract: `CertifiedPassRegistry`

- **File:** [`contracts/src/CertifiedPassRegistry.sol`](../contracts/src/CertifiedPassRegistry.sol)
- **Interface:** [`contracts/src/ICertifiedPassRegistry.sol`](../contracts/src/ICertifiedPassRegistry.sol)
- **Solidity:** `^0.8.24`
- **Compiler:** Foundry with optimizer (200 runs), EVM target: paris
- **Dependencies:** OpenZeppelin Contracts

---

## Access Control Matrix

| Function | Who Can Call |
|----------|-------------|
| `registerIssuer` | Admin only |
| `setIssuerVerification` | Admin only |
| `deactivateIssuer` | Admin only |
| `issueCredential` | Verified + Active Issuers only |
| `revokeCredential` | The original issuing organization only |
| `getCredential` | Anyone (public view) |
| `verifyCredential` | Anyone (public view) |
| `credentialExists` | Anyone (public view) |
| `getIssuer` | Anyone (public view) |
| `isVerifiedIssuer` | Anyone (public view) |

---

## Data Structures

### `Credential` struct

```solidity
struct Credential {
    bytes32 credentialHash;  // SHA-256 of canonical credential JSON
    address issuer;          // EVM address of issuing org
    address holder;          // EVM address of holder
    string  credentialType;  // Category (e.g. "hackathon")
    string  metadataURI;     // Off-chain metadata pointer
    uint64  issuedAt;        // Unix timestamp (seconds)
    uint64  revokedAt;       // 0 if active; timestamp if revoked
    bool    revoked;         // True if revoked
}
```

### `Issuer` struct

```solidity
struct Issuer {
    address walletAddress;  // Must match msg.sender for issuance
    string  name;           // Human-readable org name
    bool    isVerified;     // Platform-verified status
    bool    isActive;       // False = suspended (cannot issue)
    uint64  registeredAt;   // Unix timestamp
}
```

---

## Events

### `IssuerRegistered(address indexed, string, uint64)`
Emitted when `registerIssuer()` succeeds.

### `IssuerVerificationUpdated(address indexed, bool)`
Emitted when `setIssuerVerification()` changes verification status.

### `CredentialIssued(bytes32 indexed credentialId, address indexed issuer, address indexed holder, string credentialType, bytes32 credentialHash, uint64 issuedAt)`
Emitted on successful credential issuance. The triple-indexed event allows efficient off-chain querying.

### `CredentialRevoked(bytes32 indexed credentialId, address indexed revokedBy, uint64 revokedAt, string reason)`
Emitted on revocation. Note: `reason` is stored in event log only — **not in contract state** (to limit on-chain storage).

---

## Custom Errors

| Error | When |
|-------|------|
| `NotAdmin()` | Caller is not admin |
| `NotVerifiedIssuer()` | Caller is not a verified, active issuer |
| `NotCredentialIssuer()` | Caller is not the original issuer of the credential |
| `IssuerAlreadyRegistered(address)` | Issuer address already in registry |
| `IssuerNotFound(address)` | Issuer address not in registry |
| `CredentialAlreadyExists(bytes32)` | Credential ID already used — prevents duplicates |
| `CredentialNotFound(bytes32)` | Credential ID not in registry |
| `CredentialAlreadyRevoked(bytes32)` | Attempting to revoke an already-revoked credential |
| `ZeroAddress()` | `address(0)` passed where real address required |
| `EmptyString()` | Empty string where content required |
| `InvalidCredentialHash()` | `bytes32(0)` hash passed |

---

## State Machine (Contract-Enforced)

```
Credential state is binary on-chain: Active (revoked=false) | Revoked (revoked=true)
The multi-step lifecycle (draft/approved/issued) is managed by the API layer.
Only ACTIVE credentials get issued to the contract.

revoked=false (active) → revokeCredential() → revoked=true (permanent)
There is NO un-revoke function. This is a hard architectural rule.
```

---

## Duplicate Prevention

Credential IDs are `bytes32` (UUID v4 converted to bytes32 via keccak256 or direct zero-padding). The mapping `_credentials[credentialId].issuer != address(0)` is the existence check. Attempting to issue with a duplicate ID reverts with `CredentialAlreadyExists`.

---

## On-Chain Privacy (§11 Compliance)

What IS stored on-chain:
- `credentialHash` — SHA-256 hash (no PII recoverable from hash alone)
- `issuer` address
- `holder` address
- `credentialType` — category string (e.g. "hackathon")
- `metadataURI` — pointer to off-chain JSON
- `issuedAt`, `revokedAt` timestamps
- `revoked` boolean

What is **NEVER** stored on-chain:
- Full name of holder
- Email, phone, or any contact information
- Full credential JSON
- Raw participation data

---

## Unit Test Plan (Phase 1)

| Test | Expected |
|------|----------|
| Deploy contract | Admin set correctly |
| `registerIssuer` — admin calls | Success, IssuerRegistered event |
| `registerIssuer` — non-admin calls | Reverts NotAdmin |
| `registerIssuer` — duplicate | Reverts IssuerAlreadyRegistered |
| `setIssuerVerification` — verify | Success, IssuerVerificationUpdated event |
| `issueCredential` — unverified issuer | Reverts NotVerifiedIssuer |
| `issueCredential` — verified issuer | Success, CredentialIssued event |
| `issueCredential` — duplicate ID | Reverts CredentialAlreadyExists |
| `verifyCredential` — valid credential | Returns correct hash, issuer, holder |
| `revokeCredential` — original issuer | Success, CredentialRevoked event |
| `revokeCredential` — different issuer | Reverts NotCredentialIssuer |
| `revokeCredential` — already revoked | Reverts CredentialAlreadyRevoked |
| `credentialExists` — existing | Returns true |
| `credentialExists` — nonexistent | Returns false |
