export interface ParsedVerificationInput {
  raw: string;
  cleanKey: string;
  inferredType: 'SBT_JOB' | 'AUDIT_REPORT' | 'UNKNOWN';
  targetIdOrAddress: string;
}

export function parsePolyLanceInput(input: string): ParsedVerificationInput {
  if (!input) {
    return { raw: '', cleanKey: '', inferredType: 'UNKNOWN', targetIdOrAddress: '' };
  }

  const str = decodeURIComponent(input.trim());

  // 1. Check if input is a URL
  if (str.includes('http://') || str.includes('https://') || str.includes('#/')) {
    try {
      const urlObj = new URL(str.replace('#/', ''));
      const certParam = urlObj.searchParams.get('certId') || urlObj.searchParams.get('id');
      if (certParam) {
        return {
          raw: str,
          cleanKey: certParam.trim(),
          inferredType: certParam.startsWith('PL-AUD') ? 'AUDIT_REPORT' : 'SBT_JOB',
          targetIdOrAddress: certParam.trim(),
        };
      }
    } catch {}

    // Extract from path: /jobs/:id/attestation
    const matchJob = str.match(/jobs\/([^\/\?#]+)/i) || str.match(/attestation\/([^\/\?#]+)/i);
    if (matchJob && matchJob[1]) {
      return {
        raw: str,
        cleanKey: matchJob[1].trim(),
        inferredType: 'SBT_JOB',
        targetIdOrAddress: matchJob[1].trim(),
      };
    }

    // Extract from path: /audit/:address
    const matchAudit = str.match(/audit\/([^\/\?#]+)/i) || str.match(/audit-report\/([^\/\?#]+)/i);
    if (matchAudit && matchAudit[1]) {
      return {
        raw: str,
        cleanKey: matchAudit[1].trim(),
        inferredType: 'AUDIT_REPORT',
        targetIdOrAddress: matchAudit[1].trim(),
      };
    }
  }

  // 2. Check if raw wallet address (0x...)
  if (str.startsWith('0x') && str.length === 42) {
    return {
      raw: str,
      cleanKey: str.toLowerCase(),
      inferredType: 'AUDIT_REPORT',
      targetIdOrAddress: str.toLowerCase(),
    };
  }

  // 3. Check if standard ID prefix
  if (str.startsWith('PL-AUD-')) {
    return {
      raw: str,
      cleanKey: str,
      inferredType: 'AUDIT_REPORT',
      targetIdOrAddress: str,
    };
  }

  return {
    raw: str,
    cleanKey: str,
    inferredType: 'SBT_JOB',
    targetIdOrAddress: str,
  };
}
