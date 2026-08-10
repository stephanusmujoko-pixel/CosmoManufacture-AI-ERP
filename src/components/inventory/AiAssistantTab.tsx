import React, { useState } from 'react';
import { Bot, Sparkles, AlertCircle, ArrowRight, CheckCircle2, Zap, Send } from 'lucide-react';
import { InventoryItem } from '../../types/inventory';

interface AiAssistantTabProps {
  items: InventoryItem[];
  onTriggerEmergencyPo: (item: InventoryItem) => void;
}

export const AiAssistantTab: React.FC<AiAssistantTabProps> = ({ items, onTriggerEmergencyPo }) => {
  const [promptText, setPromptText] = useState('');
  const [messages, setMessages] = useState<
    Array<{ sender: 'ai' | 'user'; text: string; actionItem?: InventoryItem }>
  >([
    {
      sender: 'ai',
      text: 'Halo! Saya AI Inventory Optimizer Agent (Gemini 3.6). Saya telah menganalisis saldo stok realtime Anda. Ada 2 temuan kritis:',
    },
    {
      sender: 'ai',
      text: '1. Centella Asiatica Extract diproyeksikan stock-out dalam 12 hari kerja akibat lonjakan Work Order serum. Disarankan terbitkan PO Darurat 200 Kg.\n2. Jojoba Oil 800 Kg terdeteksi slow-moving (tidak mengalami mutasi 60 hari). Disarankan alokasi ke formula body oil.',
      actionItem: items.find((i) => i.sku === 'RM-ACT-002'),
    },
  ]);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    const userMsg = promptText;
    setPromptText('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Berdasarkan kalkulasi kuantitatif untuk "${userMsg}":\n• Safety stock disesuaikan berdasarkan variansi lead time supplier.\n• Seluruh parameter Reorder Point (ROP) telah di-sinkronisasi dengan modul MES & PPIC.`,
        },
      ]);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* AI Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-950 to-indigo-950 p-6 border border-indigo-500/30 shadow-2xl space-y-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-black shadow-lg">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">AI Inventory Intelligence & Prescriptive Optimizer</h2>
            <p className="text-xs text-slate-300">
              Analisis Prediktif Stockout, Deteksi Dead Stock, Optimasi EOQ & Safety Stock secara Autonomos
            </p>
          </div>
        </div>
      </div>

      {/* Chat / Assistant Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Quick Action Cards */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Rekomendasi AI Realtime:
          </span>

          <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3 text-xs shadow-lg">
            <div className="flex items-center space-x-2 text-amber-300 font-bold">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Peringatan Critical Stock-Out</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-mono">
              Centella Asiatica Extract (RM-ACT-002) sisa stok 60 Kg. Proyeksi habis dalam <strong>12 Hari</strong>.
            </p>
            {items.find((i) => i.sku === 'RM-ACT-002') && (
              <button
                onClick={() => onTriggerEmergencyPo(items.find((i) => i.sku === 'RM-ACT-002')!)}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow hover:brightness-110"
              >
                Otorisasi Terbitkan PO Darurat (200 Kg) →
              </button>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3 text-xs shadow-lg">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Analisis Slow-Moving & Dead Stock</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-mono">
              800 Kg Jojoba Oil idle selama 60 hari. Potensi akumulasi holding cost IDR 256.000.000.
            </p>
            <button
              onClick={() => alert('Jadwal redistribusi stok dikirimkan ke PPIC Lab!')}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow"
            >
              Kirim Rekomendasi ke PPIC Lab →
            </button>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between min-h-[450px] shadow-2xl">
          <div className="space-y-4 overflow-y-auto max-h-[380px] custom-scrollbar pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl text-xs space-y-2 font-mono ${
                  m.sender === 'ai'
                    ? 'bg-slate-900 border border-indigo-500/30 text-slate-200'
                    : 'bg-indigo-600 text-white ml-auto max-w-md'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                  <span className="font-bold text-amber-300">
                    {m.sender === 'ai' ? '🤖 AI Inventory Agent' : '👤 User'}
                  </span>
                </div>
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                {m.actionItem && (
                  <button
                    onClick={() => onTriggerEmergencyPo(m.actionItem!)}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px] shadow hover:bg-amber-300"
                  >
                    Otorisasi Terbitkan PO Darurat ({m.actionItem.eoqKg} {m.actionItem.primaryUom}) →
                  </button>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendQuery} className="pt-4 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Tanyakan ke AI Inventory Agent (e.g. 'Berapa EOQ Niacinamide jika demand naik 30%?')..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
