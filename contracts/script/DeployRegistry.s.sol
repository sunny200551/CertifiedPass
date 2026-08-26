// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import { CertifiedPassRegistry } from "../src/CertifiedPassRegistry.sol";

interface Vm {
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function envUint(string calldata name) external view returns (uint256);
    function envAddress(string calldata name) external view returns (address);
}

contract DeployRegistryScript {
    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function run() external returns (CertifiedPassRegistry registry) {
        uint256 deployerPrivateKey;
        address adminAddress;

        try vm.envUint("DEPLOYER_PRIVATE_KEY") returns (uint256 key) {
            deployerPrivateKey = key;
        } catch {
            deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        }

        try vm.envAddress("ADMIN_ADDRESS") returns (address admin) {
            adminAddress = admin;
        } catch {
            adminAddress = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        }

        vm.startBroadcast(deployerPrivateKey);

        registry = new CertifiedPassRegistry(adminAddress);

        vm.stopBroadcast();
    }
}
