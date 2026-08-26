/**
 * CertifiedPass — Supported Chain Configurations
 *
 * Add new chains here as the platform expands to multi-chain.
 * MVP default: Polygon Amoy (testnet).
 */

import type { ChainConfig } from "@certifiedpass/types";

/**
 * All supported networks.
 * CONTRACT_ADDRESS is populated from environment variables at runtime;
 * the placeholder allows type-safe access without runtime errors.
 */
export const CHAINS: Record<number, ChainConfig> = {
  // -------------------------------------------------------------------------
  // Testnets
  // -------------------------------------------------------------------------
  80002: {
    chainId: 80002,
    name: "Polygon Amoy Testnet",
    shortName: "amoy",
    rpcUrl: process.env["RPC_URL"] ?? "https://rpc-amoy.polygon.technology",
    explorerUrl: "https://www.oklink.com/amoy",
    explorerName: "OKLink",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    isTestnet: true,
    contractAddress: process.env["CONTRACT_ADDRESS"] ?? "",
  },
  11155111: {
    chainId: 11155111,
    name: "Ethereum Sepolia Testnet",
    shortName: "sepolia",
    rpcUrl: process.env["SEPOLIA_RPC_URL"] ?? "https://rpc.sepolia.org",
    explorerUrl: "https://sepolia.etherscan.io",
    explorerName: "Etherscan",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    isTestnet: true,
    contractAddress: "",
  },
  84532: {
    chainId: 84532,
    name: "Base Sepolia Testnet",
    shortName: "base-sepolia",
    rpcUrl: process.env["BASE_SEPOLIA_RPC_URL"] ?? "https://sepolia.base.org",
    explorerUrl: "https://sepolia.basescan.org",
    explorerName: "BaseScan",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    isTestnet: true,
    contractAddress: "",
  },
  // -------------------------------------------------------------------------
  // Mainnets (future)
  // -------------------------------------------------------------------------
  137: {
    chainId: 137,
    name: "Polygon Mainnet",
    shortName: "polygon",
    rpcUrl: process.env["POLYGON_RPC_URL"] ?? "https://polygon-rpc.com",
    explorerUrl: "https://polygonscan.com",
    explorerName: "Polygonscan",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    isTestnet: false,
    contractAddress: "",
  },
};

/** The chain ID used for the current environment */
export const DEFAULT_CHAIN_ID = parseInt(
  process.env["CHAIN_ID"] ?? "80002",
  10
);

/** Get the active chain config for the current environment */
export function getActiveChain(): ChainConfig {
  const chain = CHAINS[DEFAULT_CHAIN_ID];
  if (!chain) {
    throw new Error(
      `Unsupported chain ID: ${DEFAULT_CHAIN_ID}. Add it to packages/config/src/chains.ts`
    );
  }
  return chain;
}

/** Get a chain config by ID */
export function getChain(chainId: number): ChainConfig {
  const chain = CHAINS[chainId];
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return chain;
}

/** Build a block explorer transaction URL */
export function getTxUrl(chainId: number, txHash: string): string {
  const chain = getChain(chainId);
  return `${chain.explorerUrl}/tx/${txHash}`;
}

/** Build a block explorer address URL */
export function getAddressUrl(chainId: number, address: string): string {
  const chain = getChain(chainId);
  return `${chain.explorerUrl}/address/${address}`;
}

// ---------------------------------------------------------------------------
// Application constants
// ---------------------------------------------------------------------------

export const APP_CONSTANTS = {
  /** Current credential schema version — bump on breaking metadata changes */
  SCHEMA_VERSION: 1,

  /** Max file size for AI extraction uploads (10 MB) */
  MAX_UPLOAD_BYTES: 10 * 1024 * 1024,

  /** Max credentials per bulk AI generation request */
  MAX_BULK_CREDENTIALS: 500,

  /** JWT expiry default */
  JWT_DEFAULT_EXPIRY: "7d",

  /** Nonce expiry in seconds (5 minutes) */
  NONCE_EXPIRY_SECONDS: 300,

  /** Public verification URL pattern */
  CREDENTIAL_URL_PATTERN: "/c/:credentialId",

  /** Public profile URL pattern */
  PROFILE_URL_PATTERN: "/u/:username",
} as const;

/** The nonce message template — wallet must sign this exact string */
export function buildNonceMessage(walletAddress: string, nonce: string): string {
  return [
    "Welcome to CertifiedPass!",
    "",
    "Sign this message to authenticate your wallet.",
    "This request will not trigger any blockchain transaction or cost any gas.",
    "",
    `Wallet: ${walletAddress}`,
    `Nonce: ${nonce}`,
    "",
    "By signing, you agree to the CertifiedPass Terms of Service.",
  ].join("\n");
}
