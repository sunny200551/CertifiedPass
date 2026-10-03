import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Plus, Trash2, Layers, Check, X, Shield, Hexagon, CreditCard, Award } from 'lucide-react';

export interface CustomField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'url';
  required: boolean;
  value?: string;
}

export interface SchemaDesign {
  schemaName: string;
  foilStyle: 'gold' | 'silver' | 'cosmic' | 'emerald' | 'obsidian';
  badgeShape: 'shield' | 'hexagon' | 'card' | 'seal';
  glowIntensity: 'low' | 'medium' | 'high';
  customFields: CustomField[];
}

interface BadgeSchemaDesignerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSchema?: (schema: SchemaDesign) => void;
}

export const BadgeSchemaDesigner: React.FC<BadgeSchemaDesignerProps> = ({
  isOpen,
  onClose,
  onSaveSchema
}) => {
  const [schemaName, setSchemaName] = useState('Senior Web3 Engineer Attestation');
  const [foilStyle, setFoilStyle] = useState<'gold' | 'silver' | 'cosmic' | 'emerald' | 'obsidian'>('cosmic');
  const [badgeShape, setBadgeShape] = useState<'shield' | 'hexagon' | 'card' | 'seal'>('card');
  const [glowIntensity, setGlowIntensity] = useState<'low' | 'medium' | 'high'>('high');
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { id: '1', name: 'ContractSecurityScore', type: 'number', required: true, value: '98/100' },
    { id: '2', name: 'AuditingEntity', type: 'string', required: true, value: 'CertifiedPass Protocol' },
    { id: '3', name: 'EVMChainSupport', type: 'string', required: false, value: 'Polygon PoS, Arbitrum, Base' }
  ]);

  // Lock body scroll and trigger modal hiding for navbar
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-active-modal');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('has-active-modal');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('has-active-modal');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const addField = () => {
    setCustomFields([
      ...customFields,
      {
        id: String(Date.now()),
        name: `CustomAttribute_${customFields.length + 1}`,
        type: 'string',
        required: false,
        value: ''
      }
    ]);
  };

  const removeField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(customFields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const foilGradients: Record<string, string> = {
    gold: 'from-amber-400 via-yellow-200 to-amber-600',
    silver: 'from-slate-300 via-gray-100 to-slate-400',
    cosmic: 'from-purple-500 via-indigo-400 to-pink-500',
    emerald: 'from-emerald-400 via-teal-200 to-emerald-600',
    obsidian: 'from-slate-900 via-purple-950 to-slate-900'
  };

  const shapes = [
    { id: 'card', label: 'Standard 3D Card', icon: CreditCard },
    { id: 'hexagon', label: 'EVM Hexagon', icon: Hexagon },
    { id: 'shield', label: 'Verifiable Shield', icon: Shield },
    { id: 'seal', label: 'Crypto Seal', icon: Award },
  ] as const;

  const glowOptions = [
    { id: 'low', label: 'Subtle (20%)' },
    { id: 'medium', label: 'Balanced (50%)' },
    { id: 'high', label: 'Intense (100%)' },
  ] as const;

  const fieldTypes = ['string', 'number', 'date', 'boolean', 'url'] as const;

  const handleSave = () => {
    if (onSaveSchema) {
      onSaveSchema({
        schemaName,
        foilStyle,
        badgeShape,
        glowIntensity,
        customFields
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto w-screen h-screen">
      <div className="bg-[var(--surface-bg)] border-2 border-[var(--neo-outline)] rounded-[24px] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden neo-raised text-[var(--text-primary)] my-auto animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-[var(--neo-outline)]/40 flex items-center justify-between bg-[var(--surface-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neo-raised-sm bg-[var(--surface-bg)] text-pink-500 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2 font-display">
                <span>Custom 3D Badge & Schema Designer</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 font-mono font-bold">
                  Visual Studio
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Design custom dynamic holographic shaders, metadata schemas, and custom verification attributes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-indigo-bg)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Body */}
        <div className="p-6 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-1.5 font-display">
                Credential Schema Title
              </label>
              <input
                type="text"
                value={schemaName}
                onChange={(e) => setSchemaName(e.target.value)}
                className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] px-3.5 py-2.5 text-xs font-bold text-[var(--text-primary)] border border-[var(--neo-outline)]/60 focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Foil Effect Choice */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-2 font-display">
                Holographic 3D Foil Finish
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(['cosmic', 'gold', 'silver', 'emerald', 'obsidian'] as const).map((foil) => (
                  <button
                    key={foil}
                    onClick={() => setFoilStyle(foil)}
                    className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition text-xs capitalize ${
                      foilStyle === foil
                        ? 'border-pink-500 neo-inset bg-[var(--surface-bg)] text-pink-600 dark:text-pink-400 font-bold scale-[0.98]'
                        : 'border-[var(--neo-outline)] neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${foilGradients[foil]} shadow-sm`} />
                    <span className="text-[10px] font-bold">{foil}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Custom CertifiedPass Options */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-2 font-display">
                Badge Shape Form-Factor
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {shapes.map((s) => {
                  const ShapeIcon = s.icon;
                  const isSel = badgeShape === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setBadgeShape(s.id)}
                      className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1.5 text-center transition ${
                        isSel
                          ? 'border-pink-500 neo-inset bg-[var(--surface-bg)] text-pink-600 dark:text-pink-400 font-bold'
                          : 'border-[var(--neo-outline)] neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <ShapeIcon className="w-4 h-4" />
                      <span className="text-[11px] font-bold">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prism Shader Glow Custom Options */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-2 font-display">
                Prism Shader Intensity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {glowOptions.map((g) => {
                  const isSel = glowIntensity === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGlowIntensity(g.id)}
                      className={`py-2 px-3 rounded-xl border-2 text-xs font-bold transition text-center ${
                        isSel
                          ? 'border-pink-500 neo-inset bg-[var(--surface-bg)] text-pink-600 dark:text-pink-400'
                          : 'border-[var(--neo-outline)] neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Metadata Fields */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5 font-display">
                  <Layers className="w-3.5 h-3.5 text-pink-500" />
                  Custom Schema Attributes
                </label>
                <button
                  onClick={addField}
                  className="text-xs text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Attribute
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                {customFields.map((field) => (
                  <div key={field.id} className="flex items-center gap-2 p-2.5 rounded-xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => updateField(field.id, { name: e.target.value })}
                      placeholder="Attribute Name"
                      className="flex-1 bg-transparent text-xs text-[var(--text-primary)] font-bold focus:outline-none"
                    />
                    <div className="flex items-center gap-1">
                      {fieldTypes.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => updateField(field.id, { type: t })}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold capitalize transition ${
                            field.type === t
                              ? 'bg-pink-600 text-white shadow-sm'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-bg)]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => removeField(field.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time 3D Card Preview Canvas (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)] relative overflow-hidden min-h-[380px]">
            <span className="text-[10px] uppercase font-bold text-pink-500 tracking-wider mb-4 flex items-center gap-1 font-display">
              <Sparkles className="w-3 h-3" /> Live Holographic Canvas ({badgeShape.toUpperCase()})
            </span>

            {/* 1. Standard 3D Card Shape */}
            {badgeShape === 'card' && (
              <div className="w-64 h-80 rounded-2xl p-5 relative flex flex-col justify-between shadow-2xl border-2 transition-all duration-300 bg-gradient-to-br from-slate-900 via-indigo-950 to-black border-slate-700">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${foilGradients[foilStyle]} opacity-${
                  glowIntensity === 'high' ? '25' : glowIntensity === 'medium' ? '15' : '10'
                } pointer-events-none`} />

                <div className="flex justify-between items-start z-10">
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-black text-white border border-white/20">
                    CP
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20">
                    ERC-5192 SBT
                  </span>
                </div>

                <div className="z-10 my-auto">
                  <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight">{schemaName}</h4>
                  <p className="text-[10px] text-slate-300 mt-1 font-medium">Verified Sovereign Credential</p>

                  <div className="mt-4 pt-3 border-t border-white/10 space-y-1">
                    {customFields.slice(0, 2).map(f => (
                      <div key={f.id} className="flex justify-between text-[10px]">
                        <span className="text-slate-300">{f.name}:</span>
                        <span className="text-white font-mono">{f.value || 'Dynamic'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="z-10 flex justify-between items-center text-[9px] text-slate-300 font-mono">
                  <span>POLYGON PoS</span>
                  <span className="text-emerald-400 font-bold">AUTHENTIC</span>
                </div>
              </div>
            )}

            {/* 2. EVM Hexagon Shape */}
            {badgeShape === 'hexagon' && (
              <div
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
                className="w-68 h-80 px-6 py-8 relative flex flex-col justify-between shadow-2xl transition-all duration-300 bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-center border-2 border-indigo-500/60"
              >
                <div className={`absolute inset-0 bg-gradient-to-tr ${foilGradients[foilStyle]} opacity-${
                  glowIntensity === 'high' ? '25' : glowIntensity === 'medium' ? '15' : '10'
                } pointer-events-none`} />

                <div className="flex justify-center items-center z-10 gap-2">
                  <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20">
                    EVM HEXAGON • ERC-5192
                  </span>
                </div>

                <div className="z-10 my-auto px-2">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-300 mx-auto flex items-center justify-center font-black text-xs mb-1 border border-pink-400/30">
                    CP
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">{schemaName}</h4>
                  <p className="text-[9px] text-slate-300 mt-0.5">Sovereign Polygon Proof</p>

                  <div className="mt-2 pt-2 border-t border-white/10 space-y-0.5 text-left">
                    {customFields.slice(0, 2).map(f => (
                      <div key={f.id} className="flex justify-between text-[9px]">
                        <span className="text-slate-300">{f.name}:</span>
                        <span className="text-white font-mono">{f.value || 'Dynamic'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="z-10 flex justify-center items-center text-[9px] text-emerald-400 font-mono font-bold">
                  <span>HEX-PROOF ANCHORED</span>
                </div>
              </div>
            )}

            {/* 3. Verifiable Shield Shape */}
            {badgeShape === 'shield' && (
              <div
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)',
                }}
                className="w-64 h-84 pt-6 pb-9 px-5 relative flex flex-col justify-between shadow-2xl transition-all duration-300 bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-tr ${foilGradients[foilStyle]} opacity-${
                  glowIntensity === 'high' ? '25' : glowIntensity === 'medium' ? '15' : '10'
                } pointer-events-none`} />

                <div className="flex justify-between items-center z-10">
                  <div className="w-7 h-7 rounded-md bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px] font-black text-white border border-white/20">
                    CP
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20">
                    SHIELD PROOF
                  </span>
                </div>

                <div className="z-10 my-auto px-1">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">{schemaName}</h4>
                  <p className="text-[9px] text-slate-300 mt-1">Cryptographic Verifiable Shield</p>

                  <div className="mt-3 pt-2 border-t border-white/10 space-y-1 text-left">
                    {customFields.slice(0, 2).map(f => (
                      <div key={f.id} className="flex justify-between text-[9px]">
                        <span className="text-slate-300">{f.name}:</span>
                        <span className="text-white font-mono">{f.value || 'Dynamic'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="z-10 flex justify-center items-center text-[9px] text-emerald-400 font-mono font-bold">
                  <span>POLYGON VERIFIED SHIELD</span>
                </div>
              </div>
            )}

            {/* 4. Crypto Seal Shape */}
            {badgeShape === 'seal' && (
              <div className="w-72 h-72 rounded-full p-6 relative flex flex-col items-center justify-between shadow-2xl border-4 border-dashed border-pink-400/50 transition-all duration-300 bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-center">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${foilGradients[foilStyle]} opacity-${
                  glowIntensity === 'high' ? '25' : glowIntensity === 'medium' ? '15' : '10'
                } pointer-events-none`} />

                <div className="z-10 mt-1">
                  <span className="text-[8px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 uppercase tracking-widest">
                    ★ CRYPTO SEAL ★
                  </span>
                </div>

                <div className="z-10 my-auto px-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 mx-auto flex items-center justify-center font-black text-xs text-white mb-1 border border-white/20">
                    CP
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">{schemaName}</h4>
                  <p className="text-[9px] text-slate-300 mt-0.5">Official Protocol Seal</p>
                </div>

                <div className="z-10 mb-1 flex items-center gap-1 text-[9px] text-emerald-400 font-mono font-bold">
                  <span>POLYGON PoS SEALED</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--neo-outline)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface-bg)]">
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Schema complies with <span className="text-pink-600 dark:text-pink-400 font-mono font-bold">W3C Verifiable Credentials v2.0</span>
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 flex items-center gap-2 shadow-lg shadow-pink-900/30 transition"
            >
              <Check className="w-3.5 h-3.5" /> Save & Apply Schema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
