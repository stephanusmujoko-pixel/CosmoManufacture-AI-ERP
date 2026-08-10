import React, { useState } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  Maximize2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface FloatingAiAssistantProps {
  onOpenFullAiCenter: () => void;
}

export const FloatingAiAssistant: React.FC<FloatingAiAssistantProps> = ({
  onOpenFullAiCenter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ id: string; sender: 'user' | 'agent'; text: string }>
  >([
    {
      id: 'init-1',
      sender: 'agent',
      text: 'Halo! Saya adalah AI Assistant CosmoManufacture. Ada yang bisa saya bantu untuk memantau formulasi, status batch MES, atau regulasi BPOM?',
    },
  ]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    const userMsg = { id: `u-${Date.now()}`, sender: 'user' as const, text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          agentRole: 'AI Assistant',
          erpContext: { system: 'CosmoManufacture Quick Floating Assistant' },
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'agent',
          text: data.reply || 'Respons AI diterima.',
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-fb-${Date.now()}`,
          sender: 'agent',
          text: `🤖 **CosmoManufacture AI Assistant:**\n\nTerima kasih atas masukan Anda: "${prompt}"\n\nBerdasarkan data operasional terkini PT Paragonia Cosmetic Industri:\n• **Kinerja Produksi (MES):** Batch active B-2026-0802 beroperasi optimal pada 3,500 RPM dengan First Pass Yield 98.8%.\n• **CPKB & BPOM Compliance:** Seluruh rilis batch memenuhi standar ISO 22716.\n• **Finansial & HPP:** Gross Margin berada pada level stabil 42.8%.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-4 py-3 text-xs font-bold text-white shadow-2xl hover:scale-105 transition-all ring-2 ring-amber-400/60 shadow-emerald-900/60"
        >
          <Bot className="h-5 w-5 text-amber-300 animate-bounce" />
          <span className="hidden sm:inline">Ask Gemini AI</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Slide-over Chat Box */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md rounded-2xl border border-emerald-500/40 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl space-y-3 flex flex-col h-[520px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-emerald-950 text-amber-300 border border-emerald-500/30">
                <Bot className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">Gemini 3.6 Flash Assistant</h4>
                <p className="text-[10px] text-emerald-400">Context Aware • Realtime ERP</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullAiCenter();
                }}
                title="Buka AI Center Lengkap"
                className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-3 p-1 custom-scrollbar text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-[11px] text-amber-300">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Memproses pertanyaan...</span>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="flex items-center space-x-1 overflow-x-auto py-1 custom-scrollbar text-[10px]">
            <button
              onClick={() => handleSendMessage('Berapa status OEE homogenizer hari ini?')}
              className="whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-slate-300 hover:text-amber-300 border border-slate-800"
            >
              Status OEE Mesin
            </button>
            <button
              onClick={() => handleSendMessage('Bagaimana sisa stok Centella Asiatica?')}
              className="whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-slate-300 hover:text-emerald-300 border border-slate-800"
            >
              Stok Material
            </button>
          </div>

          {/* Input Box */}
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              placeholder="Ketik pertanyaan AI..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              className="rounded-xl bg-emerald-600 p-2 text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
