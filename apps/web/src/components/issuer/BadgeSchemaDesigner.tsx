import React, { useState } from 'react';
import { Palette, Sparkles, Plus, Trash2, Layers, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Custom 3D Badge & Schema Designer
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Visual Studio
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Design custom dynamic holographic shaders, metadata schemas, and custom verification attributes.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg px-2">✕</button>
        </div>

        {/* Studio Body */}
        <div className="p-6 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Credential Schema Title</label>
              <input
                type="text"
                value={schemaName}
                onChange={(e) => setSchemaName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Foil Effect Choice */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Holographic 3D Foil Finish</label>
              <div className="grid grid-cols-5 gap-2">
                {(['cosmic', 'gold', 'silver', 'emerald', 'obsidian'] as const).map((foil) => (
                  <button
                    key={foil}
                    onClick={() => setFoilStyle(foil)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs capitalize ${
                      foilStyle === foil
                        ? 'border-pink-500 bg-pink-500/10 text-white shadow-lg shadow-pink-500/10'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${foilGradients[foil]} shadow-sm`} />
                    <span className="text-[10px] font-medium">{foil}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Glow Intensity & Shape */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Badge Shape</label>
                <select
                  value={badgeShape}
                  onChange={(e: any) => setBadgeShape(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="card">Standard 3D Card</option>
                  <option value="hexagon">EVM Hexagon Token</option>
                  <option value="shield">Verifiable Shield</option>
                  <option value="seal">Cryptographic Seal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Prism Shader Glow</label>
                <select
                  value={glowIntensity}
                  onChange={(e: any) => setGlowIntensity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="low">Subtle (20% Opacity)</option>
                  <option value="medium">Balanced (50% Opacity)</option>
                  <option value="high">Intense Neon (100% Prism)</option>
                </select>
              </div>
            </div>

            {/* Dynamic Metadata Fields */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-pink-400" />
                  Custom Schema Attributes
                </label>
                <button
                  onClick={addField}
                  className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Attribute
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                {customFields.map((field) => (
                  <div key={field.id} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => updateField(field.id, { name: e.target.value })}
                      placeholder="Attribute Name"
                      className="flex-1 bg-transparent text-xs text-white font-mono focus:outline-none border-b border-transparent focus:border-pink-500"
                    />
                    <select
                      value={field.type}
                      onChange={(e: any) => updateField(field.id, { type: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="date">Timestamp</option>
                      <option value="boolean">Boolean</option>
                      <option value="url">URL</option>
                    </select>
                    <button
                      onClick={() => removeField(field.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time 3D Card Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800 relative overflow-hidden">
            <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider mb-4 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Holographic Canvas
            </span>

            {/* Preview Card */}
            <div className={`w-64 h-80 rounded-2xl p-5 relative flex flex-col justify-between shadow-2xl border transition-all duration-500 ${
              badgeShape === 'hexagon' ? 'rounded-[2.5rem]' : ''
            } bg-gradient-to-br from-slate-900 via-slate-950 to-black border-slate-700`}>
              {/* Foil Overlay */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${foilGradients[foilStyle]} opacity-${
                glowIntensity === 'high' ? '25' : glowIntensity === 'medium' ? '15' : '10'
              } pointer-events-none`} />

              {/* Holographic Watermark Badge */}
              <div className="flex justify-between items-start z-10">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-black text-white border border-white/20">
                  CP
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20">
                  ERC-5192 SBT
                </span>
              </div>

              {/* Title & Issuer Info */}
              <div className="z-10 my-auto">
                <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight">{schemaName}</h4>
                <p className="text-[10px] text-slate-400 mt-1">Verified Sovereign Credential</p>

                <div className="mt-4 pt-3 border-t border-white/10 space-y-1">
                  {customFields.slice(0, 2).map(f => (
                    <div key={f.id} className="flex justify-between text-[10px]">
                      <span className="text-slate-400">{f.name}:</span>
                      <span className="text-white font-mono">{f.value || 'Dynamic'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Chip */}
              <div className="z-10 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                <span>POLYGON PoS</span>
                <span>AUTHENTIC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-950/60">
          <p className="text-xs text-slate-400">
            Schema complies with <span className="text-pink-300 font-mono">W3C Verifiable Credentials v2.0</span>
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 flex items-center gap-2 shadow-lg shadow-pink-900/30 transition"
            >
              <Check className="w-3.5 h-3.5" /> Save & Apply Schema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
