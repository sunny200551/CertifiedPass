/**
 * CertifiedPass — Blockchain / Smart Contract Type Definitions
 *
 * These types mirror the on-chain Solidity structs from CertifiedPassRegistry.sol.
 * Keep these in sync with the contract ABI.
 */

// ---------------------------------------------------------------------------
// On-chain data structures (mirror Solidity structs)
// ---------------------------------------------------------------------------

/**
 * Mirrors the Solidity `Credential` struct in CertifiedPassRegistry.sol.
 * IMPORTANT: Only non-PII fields are stored on-chain (§11 compliance).
 */
export interface OnChainCredential {
  /** SHA-256 hash of the canonical credential JSON */
  credentialHash: string; // bytes32 as hex string
  /** EVM address of the issuing organization */
  issuer: string;
  /** EVM address of the holder */
  holder: string;
  /** Credential category string (e.g. "hackathon") */
  credentialType: string;
  /** Off-chain metadata URI (points to JSON in IPFS/DB) */
  metadataURI: string;
  /** Unix timestamp (seconds) of issuance */
  issuedAt: bigint;
  /** Unix timestamp (seconds) of revocation — 0 if not revoked */
  revokedAt: bigint;
  /** Whether the credential has been revoked */
  revoked: boolean;
}

/**
 * Blockchain proof returned alongside a verification result.
 */
export interface BlockchainVerificationProof {
  /** The chain ID where the credential is anchored */
  chainId: number;
  /** Human-readable network name */
  networkName: string;
  /** Block explorer name */
  explorerName: string;
  /** Block explorer base URL */
  explorerUrl: string;
  /** Full link to the issuance transaction */
  txUrl: string;
  /** Transaction hash of the issuance */
  txHash: string;
  /** Block number in which the credential was issued */
  blockNumber: number;
  /** ISO 8601 timestamp of the block */
  blockTimestamp: string;
  /** The deployed contract address */
  contractAddress: string;
  /** Credential hash stored on-chain (bytes32 hex) */
  onChainHash: string;
}

// ---------------------------------------------------------------------------
// Supported chains configuration
// ---------------------------------------------------------------------------

export interface ChainConfig {
  chainId: number;
  name: string;
  shortName: string;
  rpcUrl: string;
  explorerUrl: string;
  explorerName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
  contractAddress: string;
}

// ---------------------------------------------------------------------------
// Auth / signature types
// ---------------------------------------------------------------------------

/** The message the user signs during wallet authentication */
export interface AuthNonce {
  walletAddress: string;
  nonce: string;
  /** ISO 8601 expiry timestamp */
  expiresAt: string;
  /** The exact string the user must sign (constructed from nonce) */
  message: string;
}

export interface AuthVerifyRequest {
  walletAddress: string;
  signature: string;
  nonce: string;
}

export interface AuthToken {
  token: string;
  expiresAt: string;
  walletAddress: string;
}
