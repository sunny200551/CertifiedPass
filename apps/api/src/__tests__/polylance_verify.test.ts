import { describe, it, expect } from "vitest";
import { parseCertificateId } from "@certifiedpass/utils";
import { PolyLanceVerificationService } from "../services/PolyLanceVerificationService.js";

describe("PolyLance Certificate & Audit Verification Module", () => {
  describe("Intelligent QR & URL Parser", () => {
    it("extracts certId from full PolyLance attestation URL", () => {
      const url = "https://polylance.app/#/jobs/101/attestation?certId=PL-SBT-JOB-101-0x42F8";
      expect(parseCertificateId(url)).toBe("PL-SBT-JOB-101-0x42F8");
    });

    it("extracts certId from full PolyLance audit URL", () => {
      const url = "https://polylance.app/#/audit/0x1234?certId=PL-AUD-0x1234";
      expect(parseCertificateId(url)).toBe("PL-AUD-0x1234");
    });

    it("extracts certId from query parameter in standard URL", () => {
      const url = "https://certifiedpass.app/verify?certId=PL-SBT-JOB-0xeeacc05a99a2-0xeeac";
      expect(parseCertificateId(url)).toBe("PL-SBT-JOB-0xeeacc05a99a2-0xeeac");
    });

    it("returns raw ID when provided directly", () => {
      expect(parseCertificateId("PL-SBT-JOB-101-0x42F8")).toBe("PL-SBT-JOB-101-0x42F8");
      expect(parseCertificateId("PL-AUD-0x42F8")).toBe("PL-AUD-0x42F8");
      expect(parseCertificateId("cp-hackathon-2026-ethsf")).toBe("cp-hackathon-2026-ethsf");
    });
  });

  describe("Verification Service against PostgreSQL Audit Database", () => {
    it("verifies authentic PolyLance SBT record", async () => {
      const result = await PolyLanceVerificationService.verifyCertificate(
        "PL-SBT-JOB-0xeeacc05a99a2-0xeeac"
      );

      expect(result.verified).toBe(true);
      expect(result.status).toBe("VERIFIED");
      expect(result.displayStatus).toBe("VERIFIED & AUTHENTIC");
      expect(result.recordType).toBe("SOULBOUND_ATTESTATION");
      expect(result.details).toBeDefined();
      expect(result.details?.recipient.address).toBeDefined();
      expect(result.details?.sponsor?.address).toBeDefined();
      expect(result.details?.oracleSignature).toBeDefined();
      expect(result.details?.networkChainId).toBe(137);
    });

    it("verifies when passed via full attestation URL", async () => {
      const fullUrl =
        "https://polylance.app/#/jobs/0xce1376c2272E/attestation?certId=PL-SBT-JOB-0xce1376c2272E-0xce13";
      const result = await PolyLanceVerificationService.verifyCertificate(fullUrl);

      expect(result.verified).toBe(true);
      expect(result.status).toBe("VERIFIED");
      expect(result.certId).toBe("PL-SBT-JOB-0xce1376c2272E-0xce13");
      expect(result.details?.settledAmountUsdc).toContain("15.00");
    });

    it("handles non-existent certificate gracefully with UNVERIFIED status", async () => {
      const result = await PolyLanceVerificationService.verifyCertificate(
        "PL-SBT-JOB-NON-EXISTENT-999"
      );

      expect(result.verified).toBe(false);
      expect(result.status).toBe("UNVERIFIED");
      expect(result.displayStatus).toBe("UNVERIFIED / RECORD NOT FOUND");
      expect(result.message).toContain("could not be verified against the PolyLance Sovereign Ledger");
    });
  });
});
