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

  type FoilKey = 'gold' | 'silver' | 'cosmic' | 'emerald' | 'obsidian';

  interface FoilTheme {
    name: string;
    borderGradient: string;
    glowColor: string;
    accentText: string;
    accentBadge: string;
    chipBg: string;
    chipBorder: string;
    dotColor: string;
  }

  const foilConfig: Record<FoilKey, FoilTheme> = {
    cosmic: {
      name: 'Cosmic Hologram',
      borderGradient: 'from-purple-500 via-sky-400 to-pink-500',
      glowColor: 'rgba(168, 85, 247, 0.25)',
      accentText: 'text-purple-300',
      accentBadge: 'bg-purple-950/90 text-purple-200 border-purple-400/40',
      chipBg: 'bg-gradient-to-br from-purple-500/25 to-pink-500/25',
      chipBorder: 'border-purple-300/50',
      dotColor: 'bg-purple-400',
    },
    gold: {
      name: '24k Sovereign Gold',
      borderGradient: 'from-amber-300 via-yellow-200 to-amber-600',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      accentText: 'text-amber-300',
      accentBadge: 'bg-amber-950/90 text-amber-200 border-amber-400/40',
      chipBg: 'bg-gradient-to-br from-amber-500/25 to-yellow-500/25',
      chipBorder: 'border-amber-300/50',
      dotColor: 'bg-amber-400',
    },
    silver: {
      name: 'Platinum Titanium',
      borderGradient: 'from-slate-200 via-white to-slate-400',
      glowColor: 'rgba(226, 232, 240, 0.25)',
      accentText: 'text-slate-200',
      accentBadge: 'bg-slate-900/90 text-slate-100 border-slate-300/50',
      chipBg: 'bg-gradient-to-br from-slate-200/25 to-slate-400/25',
      chipBorder: 'border-slate-200/60',
      dotColor: 'bg-slate-200',
    },
    emerald: {
      name: 'Cyber Jade Emerald',
      borderGradient: 'from-emerald-400 via-teal-200 to-emerald-600',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      accentText: 'text-emerald-300',
      accentBadge: 'bg-emerald-950/90 text-emerald-200 border-emerald-400/40',
      chipBg: 'bg-gradient-to-br from-emerald-500/25 to-teal-500/25',
      chipBorder: 'border-emerald-300/50',
      dotColor: 'bg-emerald-400',
    },
    obsidian: {
      name: 'Obsidian Carbon',
      borderGradient: 'from-indigo-400 via-purple-300 to-slate-600',
      glowColor: 'rgba(99, 102, 241, 0.25)',
      accentText: 'text-indigo-300',
      accentBadge: 'bg-indigo-950/90 text-indigo-200 border-indigo-400/40',
      chipBg: 'bg-gradient-to-br from-indigo-500/25 to-purple-500/25',
      chipBorder: 'border-indigo-300/50',
      dotColor: 'bg-indigo-400',
    }
  };

  const foilGradients: Record<FoilKey, string> = {
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

  const currentFoil: FoilTheme = foilConfig[foilStyle] ?? foilConfig.cosmic;

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
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)] relative overflow-hidden min-h-[420px]">
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] uppercase font-black text-pink-600 dark:text-pink-400 tracking-wider flex items-center gap-1 font-display">
                <Sparkles className="w-3 h-3 animate-pulse" /> Live Holographic Canvas
              </span>
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-[var(--surface-bg)] border border-[var(--neo-outline)] text-[var(--text-secondary)]">
                {badgeShape} • {foilStyle}
              </span>
            </div>

            {/* ========================================================================= */}
            {/* 1. STANDARD 3D CARD SHAPE                                                 */}
            {/* ========================================================================= */}
            {badgeShape === 'card' && (
              <div className={`w-[270px] sm:w-[285px] h-[375px] rounded-[22px] p-[2px] bg-gradient-to-br ${currentFoil.borderGradient} shadow-2xl transition-all duration-300 relative group`}>
                {/* Core Obsidian Dark Canvas with Holographic Sheen */}
                <div className="w-full h-full rounded-[20px] bg-gradient-to-b from-[#0e1322] via-[#090c17] to-[#04060c] p-4 flex flex-col justify-between relative overflow-hidden text-left border border-white/10">
                  {/* Holographic dynamic luster */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_50%_0%,var(--glow),transparent_70%)]"
                    style={{ '--glow': currentFoil.glowColor } as any}
                  />

                  {/* Top Security Header */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl ${currentFoil.chipBg} border ${currentFoil.chipBorder} flex items-center justify-center font-cinzel font-black text-xs text-white shadow-inner`}>
                        CP
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-bold">SOVEREIGN</span>
                        <span className="text-[10px] font-black text-white leading-none font-jakarta tracking-tight">CERTIFIEDPASS</span>
                      </div>
                    </div>
                    <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full border ${currentFoil.accentBadge} shadow-sm`}>
                      ERC-5192 SBT
                    </span>
                  </div>

                  {/* Main Attestation Content */}
                  <div className="z-10 my-auto py-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${currentFoil.dotColor} animate-ping`} />
                      <span className="text-[8.5px] font-mono uppercase tracking-[0.22em] text-slate-300 font-bold">
                        VERIFIED ATTESTATION
                      </span>
                    </div>

                    <h4 className="text-[15px] font-black font-syne text-white leading-snug tracking-tight drop-shadow-md line-clamp-2">
                      {schemaName || 'Web3 Certified Attestation'}
                    </h4>

                    {/* Metadata Attribute Capsule */}
                    <div className="mt-3 p-2.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-sm space-y-1.5">
                      {customFields.slice(0, 2).map((f) => (
                        <div key={f.id} className="flex justify-between items-center text-[9.5px]">
                          <span className="text-slate-400 font-medium tracking-wide truncate max-w-[120px]">{f.name}:</span>
                          <span className="font-mono font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 truncate max-w-[100px]">
                            {f.value || 'Dynamic'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Verification Seal */}
                  <div className="z-10 pt-2 border-t border-white/10 flex justify-between items-center text-[9px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1 font-semibold">
                      <span className="text-white">◈</span> POLYGON PoS
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      <Check className="w-2.5 h-2.5 stroke-[3]" /> AUTHENTIC
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. EVM HEXAGON SHAPE                                                      */}
            {/* ========================================================================= */}
            {badgeShape === 'hexagon' && (
              <div
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
                className={`w-[275px] sm:w-[290px] h-[360px] p-[2px] bg-gradient-to-br ${currentFoil.borderGradient} shadow-2xl transition-all duration-300 relative flex items-center justify-center`}
              >
                {/* Inner Hexagon Core */}
                <div
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  }}
                  className="w-full h-full bg-gradient-to-b from-[#0e1322] via-[#090c17] to-[#04060c] px-5 py-6 flex flex-col justify-between items-center text-center relative overflow-hidden"
                >
                  {/* Holographic luster */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_15%,var(--glow),transparent_70%)]"
                    style={{ '--glow': currentFoil.glowColor } as any}
                  />

                  {/* Top Apex Badge */}
                  <div className="z-10 pt-1">
                    <span className={`text-[8.5px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${currentFoil.accentBadge} shadow-sm`}>
                      EVM HEX • ERC-5192
                    </span>
                  </div>

                  {/* Center Emblem & Title */}
                  <div className="z-10 my-auto w-full px-2">
                    <div className={`w-9 h-9 rounded-xl ${currentFoil.chipBg} border ${currentFoil.chipBorder} mx-auto flex items-center justify-center font-cinzel font-black text-sm text-white shadow-inner mb-2`}>
                      CP
                    </div>

                    <h4 className="text-[14px] font-black font-syne text-white leading-snug tracking-tight drop-shadow-md line-clamp-2">
                      {schemaName || 'Hexagonal Verifiable Credential'}
                    </h4>
                    <p className="text-[8.5px] font-mono uppercase tracking-[0.2em] text-slate-300 font-bold mt-1">
                      SOVEREIGN PROOF
                    </p>

                    {/* Centered Attributes */}
                    <div className="mt-2.5 p-2 rounded-xl bg-black/70 border border-white/10 backdrop-blur-sm space-y-1 text-left">
                      {customFields.slice(0, 2).map((f) => (
                        <div key={f.id} className="flex justify-between items-center text-[9px]">
                          <span className="text-slate-400 font-medium truncate max-w-[110px]">{f.name}:</span>
                          <span className="font-mono font-bold text-emerald-300 bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-500/20 truncate max-w-[90px]">
                            {f.value || 'Dynamic'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Apex Tag */}
                  <div className="z-10 pb-1">
                    <span className="text-[8.5px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                      <Check className="w-2.5 h-2.5 stroke-[3]" /> HEX ANCHORED
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. VERIFIABLE SHIELD SHAPE                                                */}
            {/* ========================================================================= */}
            {badgeShape === 'shield' && (
              <div
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)',
                }}
                className={`w-[270px] sm:w-[285px] h-[375px] p-[2px] bg-gradient-to-br ${currentFoil.borderGradient} shadow-2xl transition-all duration-300 relative flex items-center justify-center`}
              >
                {/* Inner Shield Core */}
                <div
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)',
                  }}
                  className="w-full h-full bg-gradient-to-b from-[#0e1322] via-[#090c17] to-[#04060c] pt-5 pb-8 px-5 flex flex-col justify-between items-center text-center relative overflow-hidden"
                >
                  {/* Holographic luster */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_15%,var(--glow),transparent_70%)]"
                    style={{ '--glow': currentFoil.glowColor } as any}
                  />

                  {/* Shield Top Header */}
                  <div className="flex items-center justify-between w-full z-10 px-1">
                    <div className={`w-7 h-7 rounded-lg ${currentFoil.chipBg} border ${currentFoil.chipBorder} flex items-center justify-center font-cinzel font-black text-[11px] text-white`}>
                      CP
                    </div>
                    <span className={`text-[8.5px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${currentFoil.accentBadge} shadow-sm`}>
                      SHIELD PROOF
                    </span>
                  </div>

                  {/* Shield Chest Content */}
                  <div className="z-10 my-auto w-full px-1">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Shield className="w-3 h-3 text-white" />
                      <span className="text-[8.5px] font-mono uppercase tracking-[0.2em] text-slate-300 font-bold">
                        CRYPTOGRAPHIC AEGIS
                      </span>
                    </div>

                    <h4 className="text-[14px] font-black font-cinzel text-white leading-snug tracking-normal drop-shadow-md line-clamp-2">
                      {schemaName || 'Shield Verifiable Credential'}
                    </h4>

                    {/* Metadata Attribute Capsule */}
                    <div className="mt-3 p-2 rounded-xl bg-black/70 border border-white/10 backdrop-blur-sm space-y-1 text-left">
                      {customFields.slice(0, 2).map((f) => (
                        <div key={f.id} className="flex justify-between items-center text-[9px]">
                          <span className="text-slate-400 font-medium truncate max-w-[110px]">{f.name}:</span>
                          <span className="font-mono font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/20 truncate max-w-[90px]">
                            {f.value || 'Dynamic'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shield Bottom Apex Badge */}
                  <div className="z-10 mb-2">
                    <span className="text-[8.5px] font-mono font-bold text-emerald-400 bg-emerald-950/70 px-3 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                      <Check className="w-2.5 h-2.5 stroke-[3]" /> POLYGON VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. CRYPTO SEAL SHAPE                                                      */}
            {/* ========================================================================= */}
            {badgeShape === 'seal' && (
              <div className={`w-[290px] h-[290px] rounded-full p-[3px] bg-gradient-to-br ${currentFoil.borderGradient} shadow-2xl transition-all duration-300 relative flex items-center justify-center`}>
                {/* Inner Concentric Circle with Dashed Security Ring */}
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0e1322] via-[#090c17] to-[#04060c] p-5 flex flex-col justify-between items-center text-center relative overflow-hidden border-2 border-dashed border-white/20">
                  {/* Holographic Radial Sheen */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_50%,var(--glow),transparent_70%)]"
                    style={{ '--glow': currentFoil.glowColor } as any}
                  />

                  {/* Top Seal Arc */}
                  <div className="z-10 pt-1">
                    <span className={`text-[8px] font-mono uppercase tracking-[0.25em] font-bold px-3 py-0.5 rounded-full border ${currentFoil.accentBadge}`}>
                      ★ PROTOCOL SEAL ★
                    </span>
                  </div>

                  {/* Center Medallion Crest & Title */}
                  <div className="z-10 my-auto px-4 max-w-[230px]">
                    <div className={`w-8 h-8 rounded-full ${currentFoil.chipBg} border ${currentFoil.chipBorder} mx-auto flex items-center justify-center font-cinzel font-black text-xs text-white shadow-inner mb-1.5`}>
                      CP
                    </div>
                    <h4 className="text-[13px] font-black font-syne text-white leading-tight tracking-tight drop-shadow-md line-clamp-2">
                      {schemaName || 'Sovereign Protocol Seal'}
                    </h4>
                    <p className="text-[8.5px] font-mono text-slate-300 font-bold uppercase tracking-widest mt-0.5">
                      SOVEREIGN SBT
                    </p>
                  </div>

                  {/* Bottom Seal Footer */}
                  <div className="z-10 pb-1 flex items-center gap-1 text-[8.5px] text-emerald-400 font-mono font-bold bg-emerald-950/70 px-3 py-0.5 rounded-full border border-emerald-500/40 shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" /> POLYGON PoS SEALED
                  </div>
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
