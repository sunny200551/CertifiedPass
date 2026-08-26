// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ICertifiedPassRegistry
 * @author CertifiedPass
 * @notice Interface for the CertifiedPass credential registry smart contract.
 *
 * This interface defines the complete public API of CertifiedPassRegistry.
 * All function signatures, events, and custom errors are specified here.
 * Implementing contracts must conform to this interface exactly.
 *
 * @dev Security model:
 *   - Only admin can register/revoke issuers.
 *   - Only verified issuers can issue credentials.
 *   - Only the original issuing organization can revoke its own credentials.
 *   - Credential IDs are unique — duplicate issuance reverts.
 *   - Revocation is irreversible — a revoked credential can never be un-revoked.
 *   - No PII is stored on-chain — only hashes, addresses, types, URIs, timestamps.
 */
interface ICertifiedPassRegistry {
    // =========================================================================
    // Structs
    // =========================================================================

    /**
     * @notice Represents an on-chain credential record.
     * @dev Only the hash and metadata URI go on-chain; full credential data
     *      is stored off-chain and referenced via metadataURI.
     *
     * @param credentialHash SHA-256 hash of the canonical credential JSON (bytes32)
     * @param issuer         EVM address of the issuing organization
     * @param holder         EVM address of the credential holder
     * @param credentialType Category string (e.g. "hackathon", "internship")
     * @param metadataURI    Off-chain URI pointing to the full credential JSON
     * @param issuedAt       Unix timestamp (seconds) of issuance
     * @param revokedAt      Unix timestamp (seconds) of revocation; 0 if active
     * @param revoked        True if this credential has been revoked
     */
    struct Credential {
        bytes32 credentialHash;
        address issuer;
        address holder;
        string  credentialType;
        string  metadataURI;
        uint64  issuedAt;
        uint64  revokedAt;
        bool    revoked;
    }

    /**
     * @notice Represents an authorized issuer organization.
     * @param walletAddress  The issuer's EVM address
     * @param name           Human-readable organization name
     * @param isVerified     Whether the issuer is platform-verified
     * @param isActive       Whether the issuer account is active (false = suspended)
     * @param registeredAt   Unix timestamp of issuer registration
     */
    struct Issuer {
        address walletAddress;
        string  name;
        bool    isVerified;
        bool    isActive;
        uint64  registeredAt;
    }

    // =========================================================================
    // Events
    // =========================================================================

    /**
     * @notice Emitted when a new issuer is registered.
     * @param issuerAddress  The wallet address of the new issuer
     * @param name           The organization name
     * @param registeredAt   Unix timestamp of registration
     */
    event IssuerRegistered(
        address indexed issuerAddress,
        string  name,
        uint64  registeredAt
    );

    /**
     * @notice Emitted when an issuer's verification status is updated.
     * @param issuerAddress  The issuer's wallet address
     * @param isVerified     New verification status
     */
    event IssuerVerificationUpdated(
        address indexed issuerAddress,
        bool    isVerified
    );

    /**
     * @notice Emitted when a credential is successfully issued.
     * @param credentialId   The unique credential ID (bytes32 from UUID)
     * @param issuer         The issuing organization's wallet address
     * @param holder         The holder's wallet address
     * @param credentialType The credential category string
     * @param credentialHash The SHA-256 hash of the canonical credential JSON
     * @param issuedAt       Unix timestamp of issuance
     */
    event CredentialIssued(
        bytes32 indexed credentialId,
        address indexed issuer,
        address indexed holder,
        string  credentialType,
        bytes32 credentialHash,
        uint64  issuedAt
    );

    /**
     * @notice Emitted when a credential is revoked.
     * @param credentialId  The credential that was revoked
     * @param revokedBy     The issuer that performed the revocation
     * @param revokedAt     Unix timestamp of revocation
     * @param reason        Human-readable revocation reason (stored off-chain)
     */
    event CredentialRevoked(
        bytes32 indexed credentialId,
        address indexed revokedBy,
        uint64  revokedAt,
        string  reason
    );

    // =========================================================================
    // Custom Errors
    // =========================================================================

    /// @notice Caller is not the contract admin
    error NotAdmin();

    /// @notice Caller is not a verified issuer
    error NotVerifiedIssuer();

    /// @notice Caller is not the issuer of the target credential
    error NotCredentialIssuer();

    /// @notice Issuer address is already registered
    error IssuerAlreadyRegistered(address issuerAddress);

    /// @notice Issuer address not found in registry
    error IssuerNotFound(address issuerAddress);

    /// @notice Credential ID already exists — prevents duplicates
    error CredentialAlreadyExists(bytes32 credentialId);

    /// @notice Credential ID not found in registry
    error CredentialNotFound(bytes32 credentialId);

    /// @notice Credential has already been revoked
    error CredentialAlreadyRevoked(bytes32 credentialId);

    /// @notice Zero address provided where a valid address is required
    error ZeroAddress();

    /// @notice Empty string provided where content is required
    error EmptyString();

    /// @notice Credential hash is zero (invalid)
    error InvalidCredentialHash();

    // =========================================================================
    // Issuer Management (admin only)
    // =========================================================================

    /**
     * @notice Register a new issuer organization.
     * @dev Only callable by admin. Emits IssuerRegistered.
     * @param issuerAddress  The wallet address of the issuer
     * @param name           The organization's display name
     */
    function registerIssuer(address issuerAddress, string calldata name) external;

    /**
     * @notice Update an issuer's verification status.
     * @dev Only callable by admin. Emits IssuerVerificationUpdated.
     * @param issuerAddress  The issuer to update
     * @param isVerified     New verification status
     */
    function setIssuerVerification(address issuerAddress, bool isVerified) external;

    /**
     * @notice Deactivate an issuer (prevents future credential issuance).
     * @dev Only callable by admin. Does NOT revoke existing credentials.
     * @param issuerAddress  The issuer to deactivate
     */
    function deactivateIssuer(address issuerAddress) external;

    // =========================================================================
    // Credential Issuance
    // =========================================================================

    /**
     * @notice Issue a new credential.
     * @dev Only callable by verified issuers. Reverts if credentialId already exists.
     *      Emits CredentialIssued.
     *
     * @param credentialId   Unique ID for this credential (bytes32 from UUID v4)
     * @param holder         Wallet address of the credential holder
     * @param credentialType Category string (must be a known type)
     * @param credentialHash SHA-256 hash of the canonical credential JSON
     * @param metadataURI    Off-chain URI to the full credential JSON
     */
    function issueCredential(
        bytes32        credentialId,
        address        holder,
        string calldata credentialType,
        bytes32        credentialHash,
        string calldata metadataURI
    ) external;

    // =========================================================================
    // Credential Revocation
    // =========================================================================

    /**
     * @notice Revoke a credential.
     * @dev Only callable by the original issuer of the credential.
     *      Revocation is IRREVERSIBLE. Emits CredentialRevoked.
     *
     * @param credentialId  The credential to revoke
     * @param reason        Human-readable reason for revocation
     */
    function revokeCredential(bytes32 credentialId, string calldata reason) external;

    // =========================================================================
    // Read Functions (public view)
    // =========================================================================

    /**
     * @notice Retrieve a credential record by ID.
     * @param credentialId  The credential to look up
     * @return              The full Credential struct
     */
    function getCredential(bytes32 credentialId)
        external
        view
        returns (Credential memory);

    /**
     * @notice Verify a credential on-chain.
     * @dev Returns the stored hash for comparison against the calculated hash.
     *      Does NOT perform hash comparison — that is the API's responsibility.
     *
     * @param credentialId  The credential to verify
     * @return credentialHash  The stored SHA-256 hash
     * @return issuer          The issuing organization's address
     * @return holder          The holder's address
     * @return issuedAt        Unix timestamp of issuance
     * @return revoked         True if the credential has been revoked
     * @return revokedAt       Unix timestamp of revocation (0 if not revoked)
     */
    function verifyCredential(bytes32 credentialId)
        external
        view
        returns (
            bytes32 credentialHash,
            address issuer,
            address holder,
            uint64  issuedAt,
            bool    revoked,
            uint64  revokedAt
        );

    /**
     * @notice Check if a credential ID exists in the registry.
     * @param credentialId  The credential ID to check
     * @return              True if the credential exists
     */
    function credentialExists(bytes32 credentialId) external view returns (bool);

    /**
     * @notice Retrieve an issuer record by address.
     * @param issuerAddress  The issuer's wallet address
     * @return               The full Issuer struct
     */
    function getIssuer(address issuerAddress) external view returns (Issuer memory);

    /**
     * @notice Check if an address is a verified, active issuer.
     * @param issuerAddress  The address to check
     * @return               True if the address belongs to a verified active issuer
     */
    function isVerifiedIssuer(address issuerAddress) external view returns (bool);
}
