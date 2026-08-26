import { ethers } from "ethers";
import { logger } from "../utils/logger.js";

// CertifiedPassRegistry ABI
export const CERTIFIED_PASS_REGISTRY_ABI = [
  "function registerIssuer(address issuerAddress, string calldata name) external",
  "function setIssuerVerification(address issuerAddress, bool isVerified) external",
  "function deactivateIssuer(address issuerAddress) external",
  "function issueCredential(bytes32 credentialId, address holder, string calldata credentialType, bytes32 credentialHash, string calldata metadataURI) external",
  "function revokeCredential(bytes32 credentialId, string calldata reason) external",
  "function getCredential(bytes32 credentialId) external view returns (tuple(bytes32 credentialHash, address issuer, address holder, string credentialType, string metadataURI, uint64 issuedAt, uint64 revokedAt, bool revoked))",
  "function verifyCredential(bytes32 credentialId) external view returns (bytes32 credentialHash, address issuer, address holder, uint64 issuedAt, bool revoked, uint64 revokedAt)",
  "function credentialExists(bytes32 credentialId) external view returns (bool)",
  "function getIssuer(address issuerAddress) external view returns (tuple(address walletAddress, string name, bool isVerified, bool isActive, uint64 registeredAt))",
  "function isVerifiedIssuer(address issuerAddress) external view returns (bool)",
  "event IssuerRegistered(address indexed issuerAddress, string name, uint64 registeredAt)",
  "event IssuerVerificationUpdated(address indexed issuerAddress, bool isVerified)",
  "event CredentialIssued(bytes32 indexed credentialId, address indexed issuer, address indexed holder, string credentialType, bytes32 credentialHash, uint64 issuedAt)",
  "event CredentialRevoked(bytes32 indexed credentialId, address indexed revokedBy, uint64 revokedAt, string reason)",
];

export class BlockchainService {
  private static provider: ethers.JsonRpcProvider | null = null;
  private static signer: ethers.Wallet | null = null;

  static getProvider(): ethers.JsonRpcProvider {
    if (!this.provider) {
      const rpcUrl = process.env["RPC_URL"] ?? "https://rpc-amoy.polygon.technology";
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }
    return this.provider;
  }

  static getContractAddress(): string {
    return process.env["CONTRACT_ADDRESS"] ?? "0x0000000000000000000000000000000000000000";
  }

  static getContract(signerOrProvider?: ethers.Signer | ethers.Provider): ethers.Contract {
    const address = this.getContractAddress();
    const p = signerOrProvider ?? this.getProvider();
    return new ethers.Contract(address, CERTIFIED_PASS_REGISTRY_ABI, p);
  }

  static getSigner(): ethers.Wallet | null {
    if (this.signer) return this.signer;
    const privateKey = process.env["ISSUER_PRIVATE_KEY"] ?? process.env["DEPLOYER_PRIVATE_KEY"];
    if (!privateKey) {
      return null;
    }
    this.signer = new ethers.Wallet(privateKey, this.getProvider());
    return this.signer;
  }

  /**
   * Converts a UUID string to bytes32 format for smart contract indexing.
   */
  static uuidToBytes32(uuid: string): string {
    const cleanUuid = uuid.replace(/-/g, "");
    return "0x" + cleanUuid.padEnd(64, "0");
  }

  /**
   * Converts a SHA-256 hex string to bytes32 format.
   */
  static hashToBytes32(hash: string): string {
    if (hash.startsWith("0x")) return hash;
    return "0x" + hash;
  }

  /**
   * Submit an issueCredential transaction to the blockchain.
   */
  static async issueCredentialOnChain(params: {
    credentialId: string;
    holderAddress: string;
    credentialType: string;
    credentialHash: string;
    metadataURI: string;
  }): Promise<{ txHash: string; blockNumber: bigint; chainId: number }> {
    const signer = this.getSigner();
    const contractAddress = this.getContractAddress();

    if (!signer || contractAddress === "0x0000000000000000000000000000000000000000") {
      logger.warn("BlockchainService: No private key or contract address set. Simulating on-chain transaction.");
      const mockTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      return {
        txHash: mockTxHash,
        blockNumber: 8529301n,
        chainId: 80002, // Polygon Amoy
      };
    }

    const contract = this.getContract(signer);
    const idBytes32 = this.uuidToBytes32(params.credentialId);
    const hashBytes32 = this.hashToBytes32(params.credentialHash);

    const tx = await (contract.getFunction("issueCredential") as ethers.ContractMethod)(
      idBytes32,
      ethers.getAddress(params.holderAddress),
      params.credentialType,
      hashBytes32,
      params.metadataURI
    );

    logger.info(`Submitted issueCredential tx: ${tx.hash}`);
    const receipt = await tx.wait(1);

    return {
      txHash: receipt.hash,
      blockNumber: BigInt(receipt.blockNumber),
      chainId: 80002,
    };
  }

  /**
   * Query credential status directly on-chain.
   */
  static async verifyCredentialOnChain(credentialId: string): Promise<{
    credentialHash: string;
    issuer: string;
    holder: string;
    issuedAt: number;
    revoked: boolean;
    revokedAt: number;
  } | null> {
    try {
      const contract = this.getContract();
      const idBytes32 = this.uuidToBytes32(credentialId);

      const exists = await (contract.getFunction("credentialExists") as ethers.ContractMethod)(idBytes32);
      if (!exists) return null;

      const res = await (contract.getFunction("verifyCredential") as ethers.ContractMethod)(idBytes32);
      return {
        credentialHash: res[0],
        issuer: res[1],
        holder: res[2],
        issuedAt: Number(res[3]),
        revoked: res[4],
        revokedAt: Number(res[5]),
      };
    } catch (err) {
      logger.error("Error querying verifyCredential on chain", { err });
      return null;
    }
  }

  /**
   * Submit a revokeCredential transaction on-chain.
   */
  static async revokeCredentialOnChain(
    credentialId: string,
    reason: string
  ): Promise<{ txHash: string; blockNumber: bigint }> {
    const signer = this.getSigner();
    const contractAddress = this.getContractAddress();

    if (!signer || contractAddress === "0x0000000000000000000000000000000000000000") {
      logger.warn("BlockchainService: Simulating revocation on-chain.");
      const mockTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      return {
        txHash: mockTxHash,
        blockNumber: 8529342n,
      };
    }

    const contract = this.getContract(signer);
    const idBytes32 = this.uuidToBytes32(credentialId);

    const tx = await (contract.getFunction("revokeCredential") as ethers.ContractMethod)(idBytes32, reason);
    const receipt = await tx.wait(1);

    return {
      txHash: receipt.hash,
      blockNumber: BigInt(receipt.blockNumber),
    };
  }
}
