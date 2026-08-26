// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { CertifiedPassRegistry } from "../src/CertifiedPassRegistry.sol";
import { ICertifiedPassRegistry } from "../src/ICertifiedPassRegistry.sol";

interface Vm {
    function prank(address) external;
    function startPrank(address) external;
    function stopPrank() external;
    function expectRevert(bytes calldata) external;
}

abstract contract Test {
    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function assertEq(address a, address b) internal pure {
        require(a == b, "assertEq(address) failed");
    }

    function assertEq(bytes32 a, bytes32 b) internal pure {
        require(a == b, "assertEq(bytes32) failed");
    }

    function assertEq(uint256 a, uint256 b) internal pure {
        require(a == b, "assertEq(uint256) failed");
    }

    function assertEq(string memory a, string memory b) internal pure {
        require(keccak256(bytes(a)) == keccak256(bytes(b)), "assertEq(string) failed");
    }

    function assertTrue(bool a) internal pure {
        require(a, "assertTrue failed");
    }

    function assertFalse(bool a) internal pure {
        require(!a, "assertFalse failed");
    }
}

contract CertifiedPassRegistryTest is Test {
    CertifiedPassRegistry internal registry;

    address internal admin = address(0xAD01);
    address internal issuer = address(0x15501);
    address internal holder = address(0x401D01);
    address internal outsider = address(0x9999);

    bytes32 internal testCredId = keccak256(abi.encodePacked("cred-001"));
    bytes32 internal testCredHash = keccak256(abi.encodePacked("canonical-payload-sha256"));
    string internal testCredType = "hackathon";
    string internal testMetadataUri = "ipfs://QmTestCredentialHash";

    function setUp() public {
        registry = new CertifiedPassRegistry(admin);

        // Register and verify the test issuer
        vm.prank(admin);
        registry.registerIssuer(issuer, "ETHSF & Polygon Labs", "ipfs://QmIssuerMetadata");
    }

    function test_InitialDeployment() public view {
        assertEq(registry.admin(), admin);
        assertEq(registry.totalCredentialsIssued(), 0);
    }

    function test_RegisterIssuer_Success() public {
        address newIssuer = address(0x2222);
        vm.prank(admin);
        registry.registerIssuer(newIssuer, "ConsenSys", "ipfs://QmConsenSys");

        (string memory name, string memory uri, bool isVerified, uint256 count) = registry.getIssuer(newIssuer);
        assertEq(name, "ConsenSys");
        assertEq(uri, "ipfs://QmConsenSys");
        assertTrue(isVerified);
        assertEq(count, 0);
    }

    function test_IssueCredential_Success() public {
        vm.prank(issuer);
        registry.issueCredential(
            testCredId,
            holder,
            testCredHash,
            testCredType,
            testMetadataUri
        );

        (
            bytes32 hash,
            address issuerAddr,
            address holderAddr,
            uint256 issuedAt,
            string memory credType,
            string memory uri,
            bool isRevoked,
            uint256 revokedAt,
            string memory reason
        ) = registry.getCredential(testCredId);

        assertEq(hash, testCredHash);
        assertEq(issuerAddr, issuer);
        assertEq(holderAddr, holder);
        assertTrue(issuedAt > 0);
        assertEq(credType, testCredType);
        assertEq(uri, testMetadataUri);
        assertFalse(isRevoked);
        assertEq(revokedAt, 0);
        assertEq(reason, "");

        // Verify function check
        (bool exists, bytes32 onChainHash, address onChainIssuer, bool revoked) = registry.verifyCredential(testCredId);
        assertTrue(exists);
        assertEq(onChainHash, testCredHash);
        assertEq(onChainIssuer, issuer);
        assertFalse(revoked);

        assertEq(registry.totalCredentialsIssued(), 1);
    }

    function test_RevokeCredential_Success() public {
        vm.prank(issuer);
        registry.issueCredential(
            testCredId,
            holder,
            testCredHash,
            testCredType,
            testMetadataUri
        );

        vm.prank(issuer);
        registry.revokeCredential(testCredId, "Disqualified for rules violation");

        (
            ,
            ,
            ,
            ,
            ,
            ,
            bool isRevoked,
            uint256 revokedAt,
            string memory reason
        ) = registry.getCredential(testCredId);

        assertTrue(isRevoked);
        assertTrue(revokedAt > 0);
        assertEq(reason, "Disqualified for rules violation");

        (,, , bool revoked) = registry.verifyCredential(testCredId);
        assertTrue(revoked);
    }

    function test_BatchIssueCredentials_Success() public {
        bytes32[] memory ids = new bytes32[](2);
        address[] memory holders = new address[](2);
        bytes32[] memory hashes = new bytes32[](2);
        string[] memory types = new string[](2);
        string[] memory uris = new string[](2);

        ids[0] = keccak256(abi.encodePacked("batch-1"));
        ids[1] = keccak256(abi.encodePacked("batch-2"));
        holders[0] = holder;
        holders[1] = address(0x5555);
        hashes[0] = keccak256(abi.encodePacked("hash-1"));
        hashes[1] = keccak256(abi.encodePacked("hash-2"));
        types[0] = "hackathon";
        types[1] = "internship";
        uris[0] = "ipfs://batch1";
        uris[1] = "ipfs://batch2";

        vm.prank(issuer);
        registry.batchIssueCredentials(ids, holders, hashes, types, uris);

        assertEq(registry.totalCredentialsIssued(), 2);
    }

    function test_HolderCredentialsLookup() public {
        vm.prank(issuer);
        registry.issueCredential(
            testCredId,
            holder,
            testCredHash,
            testCredType,
            testMetadataUri
        );

        bytes32[] memory holderCreds = registry.getCredentialsByHolder(holder);
        assertEq(holderCreds.length, 1);
        assertEq(holderCreds[0], testCredId);
    }
}
