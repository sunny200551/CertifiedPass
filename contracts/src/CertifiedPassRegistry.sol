// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ICertifiedPassRegistry} from "./ICertifiedPassRegistry.sol";

/**
 * @title CertifiedPassRegistry
 * @author CertifiedPass
 * @notice On-chain registry for verifiable credentials issued on the
 *         CertifiedPass platform. Anchors credential integrity via SHA-256
 *         hashes; never stores PII.
 *
 * @dev Implementation of {ICertifiedPassRegistry}.
 *
 * Access control model:
 *   - ADMIN: can register/verify/deactivate issuers
 *   - VERIFIED_ISSUER: can issue credentials for themselves
 *   - CREDENTIAL_ISSUER: can revoke only their own credentials
 *
 * State machine:
 *   Issued -> Active -> Revoked (terminal, irreversible)
 */
contract CertifiedPassRegistry is ICertifiedPassRegistry {
    // =========================================================================
    // Storage
    // =========================================================================

    /// @dev The contract administrator address
    address private _admin;

    /// @dev Mapping from issuer wallet address => Issuer record
    mapping(address => Issuer) private _issuers;

    /// @dev Mapping from credential ID (bytes32) => Credential record
    mapping(bytes32 => Credential) private _credentials;

    /// @dev Track credential IDs per holder for enumeration
    mapping(address => bytes32[]) private _holderCredentials;

    /// @dev Track credential IDs per issuer for analytics
    mapping(address => bytes32[]) private _issuerCredentials;

    // =========================================================================
    // Modifiers
    // =========================================================================

    modifier onlyAdmin() {
        if (msg.sender != _admin) revert NotAdmin();
        _;
    }

    modifier onlyVerifiedIssuer() {
        if (!_issuers[msg.sender].isVerified || !_issuers[msg.sender].isActive) {
            revert NotVerifiedIssuer();
        }
        _;
    }

    modifier credentialMustExist(bytes32 credentialId) {
        if (_credentials[credentialId].issuer == address(0)) {
            revert CredentialNotFound(credentialId);
        }
        _;
    }

    // =========================================================================
    // Constructor
    // =========================================================================

    /**
     * @notice Initializes the registry setting the deployer/specified address as admin.
     * @param adminAddress The contract administrator address
     */
    constructor(address adminAddress) {
        if (adminAddress == address(0)) revert ZeroAddress();
        _admin = adminAddress;
        _issuers[adminAddress] = Issuer({
            walletAddress: adminAddress,
            name: "CertifiedPass Platform Admin",
            isVerified: true,
            isActive: true,
            registeredAt: uint64(block.timestamp)
        });
        emit IssuerRegistered(adminAddress, "CertifiedPass Platform Admin", uint64(block.timestamp));
        emit IssuerVerificationUpdated(adminAddress, true);
    }

    // =========================================================================
    // Issuer Management (Admin Only)
    // =========================================================================

    /// @inheritdoc ICertifiedPassRegistry
    function registerIssuer(address issuerAddress, string calldata name) external override onlyAdmin {
        if (issuerAddress == address(0)) revert ZeroAddress();
        if (bytes(name).length == 0) revert EmptyString();
        if (_issuers[issuerAddress].walletAddress != address(0)) {
            revert IssuerAlreadyRegistered(issuerAddress);
        }

        _issuers[issuerAddress] = Issuer({
            walletAddress: issuerAddress,
            name: name,
            isVerified: false,
            isActive: true,
            registeredAt: uint64(block.timestamp)
        });

        emit IssuerRegistered(issuerAddress, name, uint64(block.timestamp));
    }

    /// @inheritdoc ICertifiedPassRegistry
    function setIssuerVerification(address issuerAddress, bool isVerified) external override onlyAdmin {
        if (_issuers[issuerAddress].walletAddress == address(0)) {
            revert IssuerNotFound(issuerAddress);
        }

        _issuers[issuerAddress].isVerified = isVerified;
        emit IssuerVerificationUpdated(issuerAddress, isVerified);
    }

    /// @inheritdoc ICertifiedPassRegistry
    function deactivateIssuer(address issuerAddress) external override onlyAdmin {
        if (_issuers[issuerAddress].walletAddress == address(0)) {
            revert IssuerNotFound(issuerAddress);
        }

        _issuers[issuerAddress].isActive = false;
    }

    // =========================================================================
    // Credential Issuance
    // =========================================================================

    /// @inheritdoc ICertifiedPassRegistry
    function issueCredential(
        bytes32         credentialId,
        address         holder,
        string calldata credentialType,
        bytes32         credentialHash,
        string calldata metadataURI
    ) external override onlyVerifiedIssuer {
        if (_credentials[credentialId].issuer != address(0)) {
            revert CredentialAlreadyExists(credentialId);
        }
        if (holder == address(0)) revert ZeroAddress();
        if (credentialHash == bytes32(0)) revert InvalidCredentialHash();
        if (bytes(credentialType).length == 0 || bytes(metadataURI).length == 0) {
            revert EmptyString();
        }

        uint64 nowTs = uint64(block.timestamp);

        _credentials[credentialId] = Credential({
            credentialHash: credentialHash,
            issuer: msg.sender,
            holder: holder,
            credentialType: credentialType,
            metadataURI: metadataURI,
            issuedAt: nowTs,
            revokedAt: 0,
            revoked: false
        });

        _holderCredentials[holder].push(credentialId);
        _issuerCredentials[msg.sender].push(credentialId);

        emit CredentialIssued(
            credentialId,
            msg.sender,
            holder,
            credentialType,
            credentialHash,
            nowTs
        );
    }

    // =========================================================================
    // Credential Revocation
    // =========================================================================

    /// @inheritdoc ICertifiedPassRegistry
    function revokeCredential(bytes32 credentialId, string calldata reason)
        external
        override
        credentialMustExist(credentialId)
    {
        Credential storage cred = _credentials[credentialId];

        if (msg.sender != cred.issuer) {
            revert NotCredentialIssuer();
        }
        if (cred.revoked) {
            revert CredentialAlreadyRevoked(credentialId);
        }

        uint64 nowTs = uint64(block.timestamp);
        cred.revoked = true;
        cred.revokedAt = nowTs;

        emit CredentialRevoked(credentialId, msg.sender, nowTs, reason);
    }

    // =========================================================================
    // Read Functions (Public View)
    // =========================================================================

    /// @inheritdoc ICertifiedPassRegistry
    function getCredential(bytes32 credentialId)
        external
        view
        override
        credentialMustExist(credentialId)
        returns (Credential memory)
    {
        return _credentials[credentialId];
    }

    /// @inheritdoc ICertifiedPassRegistry
    function verifyCredential(bytes32 credentialId)
        external
        view
        override
        credentialMustExist(credentialId)
        returns (
            bytes32 credentialHash,
            address issuer,
            address holder,
            uint64  issuedAt,
            bool    revoked,
            uint64  revokedAt
        )
    {
        Credential memory cred = _credentials[credentialId];
        return (
            cred.credentialHash,
            cred.issuer,
            cred.holder,
            cred.issuedAt,
            cred.revoked,
            cred.revokedAt
        );
    }

    /// @inheritdoc ICertifiedPassRegistry
    function credentialExists(bytes32 credentialId) external view override returns (bool) {
        return _credentials[credentialId].issuer != address(0);
    }

    /// @inheritdoc ICertifiedPassRegistry
    function getIssuer(address issuerAddress) external view override returns (Issuer memory) {
        if (_issuers[issuerAddress].walletAddress == address(0)) {
            revert IssuerNotFound(issuerAddress);
        }
        return _issuers[issuerAddress];
    }

    /// @inheritdoc ICertifiedPassRegistry
    function isVerifiedIssuer(address issuerAddress) external view override returns (bool) {
        return _issuers[issuerAddress].isVerified && _issuers[issuerAddress].isActive;
    }

    /**
     * @notice Get all credential IDs associated with a holder.
     * @param holder Holder wallet address
     */
    function getHolderCredentials(address holder) external view returns (bytes32[] memory) {
        return _holderCredentials[holder];
    }

    /**
     * @notice Get all credential IDs issued by an issuer address.
     * @param issuer Issuer wallet address
     */
    function getIssuerCredentials(address issuer) external view returns (bytes32[] memory) {
        return _issuerCredentials[issuer];
    }

    /**
     * @notice Get the contract administrator address.
     */
    function admin() external view returns (address) {
        return _admin;
    }
}
