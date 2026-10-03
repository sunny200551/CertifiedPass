import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Play, Download, Trash2 } from 'lucide-react';

export interface BatchItem {
  id: string;
  recipientName: string;
  recipientAddress: string;
  credentialTitle: string;
  category: string;
  skills: string[];
  expirationDate?: string | undefined;
  status: 'valid' | 'invalid' | 'minted' | 'pending';
  error?: string | undefined;
}

interface BatchIssuanceEngineProps {
  onBatchComplete?: (items: BatchItem[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const BatchIssuanceEngine: React.FC<BatchIssuanceEngineProps> = ({
  onBatchComplete,
  isOpen,
  onClose
}) => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = (event.target?.result as string) || '';
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          const formatted: BatchItem[] = Array.isArray(parsed) ? parsed.map((row: any, index: number) => ({
            id: `batch-${Date.now()}-${index}`,
            recipientName: row.recipientName || row.name || 'Recipient',
            recipientAddress: row.recipientAddress || row.address || '',
            credentialTitle: row.credentialTitle || row.title || 'Certified Credential',
            category: row.category || 'Development',
            skills: Array.isArray(row.skills) ? row.skills : (row.skills ? String(row.skills).split(',').map((s: string) => s.trim()) : ['Solidity', 'Web3']),
            expirationDate: row.expirationDate || undefined,
            status: row.recipientAddress && typeof row.recipientAddress === 'string' && row.recipientAddress.startsWith('0x') ? 'valid' : 'invalid',
            error: !row.recipientAddress ? 'Missing wallet address' : (!String(row.recipientAddress).startsWith('0x') ? 'Invalid 0x address' : undefined)
          })) : [];
          setItems(formatted);
        } else {
          // CSV parsing
          const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          if (lines.length < 1) return;
          const firstLine = lines[0] || '';
          const headers = firstLine.split(',').map(h => h.trim().toLowerCase());
          const rows: BatchItem[] = [];

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            if (values.length < 2) continue;

            const nameIdx = headers.findIndex(h => h.includes('name'));
            const addrIdx = headers.findIndex(h => h.includes('address') || h.includes('wallet'));
            const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('cert'));
            const catIdx = headers.findIndex(h => h.includes('cat'));
            const skillsIdx = headers.findIndex(h => h.includes('skill'));

            const recipientName: string = (nameIdx >= 0 && values[nameIdx]) ? values[nameIdx]! : `Recipient #${i}`;
            const recipientAddress: string = (addrIdx >= 0 && values[addrIdx]) ? values[addrIdx]! : values[1] || '';
            const credentialTitle: string = (titleIdx >= 0 && values[titleIdx]) ? values[titleIdx]! : 'Certified Achievement';
            const category: string = (catIdx >= 0 && values[catIdx]) ? values[catIdx]! : 'Engineering';
            const rawSkill: string = (skillsIdx >= 0 && values[skillsIdx]) ? values[skillsIdx]! : 'Verified Skills';
            const skills: string[] = rawSkill.split(';').map(s => s.trim());

            const isValid = Boolean(recipientAddress && recipientAddress.startsWith('0x') && recipientAddress.length === 42);

            rows.push({
              id: `batch-csv-${Date.now()}-${i}`,
              recipientName,
              recipientAddress,
              credentialTitle,
              category,
              skills,
              status: isValid ? 'valid' : 'invalid',
              error: isValid ? undefined : 'Invalid Ethereum 0x hex address (must be 42 chars)'
            });
          }
          setItems(rows);
        }
      } catch (err) {
        alert('Failed to parse uploaded file. Please verify CSV/JSON formatting.');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const sampleCsv = `recipientName,recipientAddress,credentialTitle,category,skills\nAlice Johnson,0xce1376c2272E5a56f64249a5Ffc5D2a56994781A,Full-Stack Web3 Architect,Smart Contracts,Rust;Solidity;TypeScript\nBob Vance,0xeeacc05a99a224a0d9124483ca893b8214fa3559,Smart Contract Security Auditor,Auditing,Slither;Foundry;EVM Audit`;
    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certifiedpass_bulk_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartBatchMint = async () => {
    const validItems = items.filter(i => i.status === 'valid');
    if (validItems.length === 0) {
      alert('No valid items found to mint.');
      return;
    }

    setProcessing(true);
    setProgress(0);

    for (let i = 0; i < validItems.length; i++) {
      const current = validItems[i];
      if (!current) continue;
      await new Promise(r => setTimeout(r, 400));
      const targetId = current.id;
      setItems(prev => prev.map(item => item.id === targetId ? { ...item, status: 'minted' } : item));
      setProgress(Math.round(((i + 1) / validItems.length) * 100));
    }

    setProcessing(false);
    if (onBatchComplete) {
      onBatchComplete(items);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Bulk & Batch Issuance Engine
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ERC-5192 Multi-Mint
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Upload CSV/JSON spreadsheets to batch mint up to 1,000 sovereign soulbound credentials in a single pipeline.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg px-2">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {items.length === 0 ? (
            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center hover:border-purple-500/50 transition bg-slate-950/40">
              <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4 animate-bounce" />
              <h3 className="text-base font-semibold text-white mb-1">Upload CSV or JSON Batch Manifest</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                Columns supported: <code className="text-purple-400">recipientName</code>, <code className="text-purple-400">recipientAddress</code>, <code className="text-purple-400">credentialTitle</code>, <code className="text-purple-400">category</code>, <code className="text-purple-400">skills</code>
              </p>

              <div className="flex items-center justify-center gap-4">
                <label className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg transition">
                  Browse Files
                  <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="hidden" />
                </label>
                <button
                  onClick={handleDownloadSample}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" /> Download Sample CSV
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Valid: {items.filter(i => i.status === 'valid' || i.status === 'minted').length}
                  </span>
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Invalid: {items.filter(i => i.status === 'invalid').length}
                  </span>
                  <span className="text-purple-400">Total: {items.length}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setItems([])}
                    disabled={processing}
                    className="px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-1 border border-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                  <label className="cursor-pointer px-3 py-1.5 text-xs text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 rounded-lg flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Replace File
                    <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Progress bar if processing */}
              {processing && (
                <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-2">
                  <div className="flex justify-between text-xs text-slate-300 font-mono">
                    <span>Batch Minting Engine Active...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Status</th>
                      <th className="p-3">Recipient</th>
                      <th className="p-3">Address</th>
                      <th className="p-3">Credential Title</th>
                      <th className="p-3">Skills</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        <td className="p-3">
                          {item.status === 'minted' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">MINTED</span>
                          ) : item.status === 'valid' ? (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">READY</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold" title={item.error}>
                              ERROR
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-medium text-white">{item.recipientName}</td>
                        <td className="p-3 font-mono text-slate-400 truncate max-w-[140px]">{item.recipientAddress || '—'}</td>
                        <td className="p-3 text-slate-200">{item.credentialTitle}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {item.skills.slice(0, 2).map((s, idx) => (
                              <span key={idx} className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">{s}</span>
                            ))}
                            {item.skills.length > 2 && (
                              <span className="text-slate-500 text-[10px]">+{item.skills.length - 2}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-950/60">
          <p className="text-xs text-slate-400">
            Smart contract gas estimation: <span className="font-mono text-purple-300">~0.0042 POL / mint</span>
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition">
              Cancel
            </button>
            <button
              onClick={handleStartBatchMint}
              disabled={processing || items.filter(i => i.status === 'valid').length === 0}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-900/30 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {processing ? 'Processing Batch...' : `Mint ${items.filter(i => i.status === 'valid').length} Credentials`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
