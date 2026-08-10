import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Clock,
  RotateCcw,
} from 'lucide-react';

export const AiProductionAssistantTab: React.FC = () => {
  const [userQuery, setUserQuery] = useState('');
  const [messages, setMessages] = useState<
    { sender: 'ai' | 'user'; text: string; timestamp: string }[]
  >([
    {
      sender: 'ai',
      text: 'Halo! Saya AI Production Copilot MES Enterprise. Saya memantau data SCADA, OEE mesin, toleransi timbangan dispensing, serta histori batch EBR secara realtime. Ada yang bisa saya bantu hari ini?',
      timestamp: '10:00',
    },
  ]);

  const quickQuestions = [
    'Bagaimana cara optimasi yield bulk serum CosmoGlow?',
    'Prediksi risiko downtime pada High Shear Mixer Vessel-02?',
    'Rekomendasi urutan jadwal batch kosmetik minggu ini?',
    'Analisis deviasi suhu pada batch BATCH-2026-SRM-088?',
  ];

  const handleAskQuestion = (question: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: question, timestamp: time },
    ]);

    setTimeout(() => {
      let aiResponse =
        'Berdasarkan telemetri SCADA & data historis EBR: Mengurangi waktu pendinginan fase air sebesar 8 menit meningkatkan recovery rate bahan aktif sebesar +0.4% tanpa merubah viskositas target 3,450 cPs.';

      if (question.includes('downtime') || question.includes('Vessel-02')) {
        aiResponse =
          'Vessel-02 menunjukkan kenaikan getaran motor homogenizer 4.2% selama 3 jam terakhir. Direkomendasikan melakukan re-greasing bearing saat sesi CIP/SIP berikutnya untuk mencegah breakdown tak terencana.';
      } else if (question.includes('jadwal') || question.includes('urutan')) {
        aiResponse =
          'Rekomendasi urutan produksi terkecil risiko kontaminasi: (1) Liquid Serum BATCH-088 -> (2) Gel Cream HydroBarrier -> (3) Sunscreen Lotion. Urutan ini meminimalkan waktu CIP/SIP hingga 35 menit.';
      } else if (question.includes('deviasi') || question.includes('suhu')) {
        aiResponse =
          'Deviasi suhu 78.2°C pada BATCH-2026-SRM-088 telah diverifikasi oleh IPC. Degradasi Niacinamide < 0.05% (di bawah ambang batas toleransi 0.5%). Batch aman dirilis untuk pengisian.';
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiResponse, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    }, 600);
  };

  const handleSendMessage = () => {
    if (!userQuery.trim()) return;
    const q = userQuery;
    setUserQuery('');
    handleAskQuestion(q);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">AI MES Production Intelligence Copilot</h2>
            <p className="text-xs text-slate-400">
              Sistem Pakar Manufaktur Kosmetik: Prediksi OEE Mesin, Optimasi Yield Bulk, Penjadwalan Cerdas, & Peringatan Dini Anomali SCADA.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950 px-3 py-1 rounded-full border border-amber-500/40">
          Model: Gemini 2.5 Flash MES Engine
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive AI Chat Window */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-2xl flex flex-col h-[520px]">
          {/* Chat Logs */}
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 font-mono text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-amber-300" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-xl space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-70">
                    <span>{msg.sender === 'user' ? 'Operator' : 'AI Copilot'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Prompt Input & Quick Options */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Tanyakan analisis produksi, optimasi mixing, atau prediksi OEE..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
              />
              <button
                onClick={handleSendMessage}
                className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(q)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 whitespace-nowrap transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Key Predictive AI Insights */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-amber-300 border-b border-slate-800 pb-2 flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Prediksi AI Yield Bulk Kosmetik</span>
            </h3>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">CosmoGlow Serum 30ml</span>
              <p className="text-slate-300 text-[11px]">
                Target Yield: 98.5% | Proyeksi AI: <strong className="text-emerald-300">98.9% (+0.4%)</strong>. Akurasi penimbangan Phase B stabil.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-cyan-300 border-b border-slate-800 pb-2 flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>Optimasi CIP/SIP Changeover</span>
            </h3>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-cyan-300 font-bold block">Line A & Line B Swap</span>
              <p className="text-slate-300 text-[11px]">
                Mengatur urutan dari Serum Bening ke Gel Cream menghemat 45 L air WFI & memotong waktu sanitasi hingga 25 Menit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
