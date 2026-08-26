import { describe, it, expect, vi } from "vitest";
import { AuthService } from "../services/AuthService.js";
import { VerificationService } from "../services/VerificationService.js";

describe("API Backend Services", () => {
  describe("AuthService", () => {
    it("generates authentication nonce record with SIWE message", () => {
      const address = "0x71c845137f73612facb1c1e6e3e1a144e5904f2e";
      const nonceRecord = AuthService.generateNonce(address);

      expect(nonceRecord).toBeDefined();
      expect(nonceRecord.nonce).toBeDefined();
      expect(nonceRecord.message).toContain("Welcome to CertifiedPass!");
      expect(nonceRecord.message).toContain(`Nonce: ${nonceRecord.nonce}`);
      expect(nonceRecord.walletAddress.toLowerCase()).toBe(address.toLowerCase());
    });
  });

  describe("VerificationService", () => {
    it("VerificationService class is defined with static verify method", () => {
      expect(VerificationService).toBeDefined();
      expect(typeof VerificationService.verify).toBe("function");
    });
  });
});
