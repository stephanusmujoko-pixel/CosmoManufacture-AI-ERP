import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { AI_AGENTS } from '../data/mockErpData';
import { AiAgentConfig } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export const AiCenterModule: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AiAgentConfig>(AI_AGENTS[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'agent',
      text: `Halo! Saya adalah ${selectedAgent.name}. ${selectedAgent.description} Silakan tanyakan apapun terkait operasional manufaktur kosmetik dan skincare Anda.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectAgent = (agent: AiAgentConfig) => {
    setSelectedAgent(agent);
    setMessages([
      {
        id: `m-${Date.now()}`,
        sender: 'agent',
        text: `Halo! Saya adalah ${agent.name}. ${agent.description} Ada yang bisa saya bantu terkait ${agent.title}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          agentRole: selectedAgent.name,
          erpContext: {
            agentTitle: selectedAgent.title,
            currentSystem: 'CosmoManufacture AI ERP v2.4',
          },
        }),
      });

      const data = await response.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'agent',
        text: data.reply || 'Maaf, terjadi kesalahan pada layanan AI.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error in AI Chat:', error);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: 'Sistem mengalami gangguan saat menghubungi Gemini 3.6 Flash. Mohon periksa koneksi atau API Key.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-amber-300 border border-emerald-500/30">
              <Bot className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              AI Intelligence Center — 16 ERP Specialists
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Didukung oleh model Gemini 3.6 Flash. Membaca data realtime formulasi, MES batch, QC, BPOM, dan FEFO gudang.
          </p>
        </div>

        <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
          Gemini 3.6 Flash Server-Side Active
        </span>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Agent Selector List */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Pilih Spesialis Asisten AI
          </h3>

          <div className="space-y-1.5 max-h-[550px] overflow-y-auto custom-scrollbar">
            {AI_AGENTS.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => handleSelectAgent(agent)}
                  className={`w-full flex items-start space-x-3 rounded-xl p-3 text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600/90 to-teal-700/90 text-white shadow-md ring-1 ring-amber-400/40'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl">{agent.avatar}</span>
                  <div className="truncate">
                    <p className="font-bold text-xs truncate">{agent.name}</p>
                    <p className={`text-[10px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {agent.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <div className="lg:col-span-3 flex flex-col h-[580px] rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{selectedAgent.avatar}</span>
              <div>
                <h3 className="text-sm font-extrabold text-white">{selectedAgent.name}</h3>
                <p className="text-[11px] text-emerald-400">{selectedAgent.title}</p>
              </div>
            </div>

            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-mono text-slate-400 border border-slate-800">
              Live Realtime Context
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'agent' && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-950 text-amber-300 border border-emerald-500/30 flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none leading-relaxed'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className="mt-1 block text-[9px] opacity-60 text-right">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-bold flex-shrink-0">
                    PA
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-amber-300 font-semibold p-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>{selectedAgent.name} sedang menganalisis data ERP...</span>
              </div>
            )}
          </div>

          {/* Suggested Prompts Pill */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto custom-scrollbar">
            <span className="text-[10px] font-bold text-amber-400 whitespace-nowrap">Rekomendasi Pertanyaan:</span>
            {selectedAgent.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-300 hover:bg-slate-800 hover:text-emerald-300 border border-slate-800 transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder={`Tanyakan sesuatu kepada ${selectedAgent.name}...`}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 p-2.5 text-white hover:from-emerald-500 hover:to-teal-600 disabled:opacity-50 transition-all shadow-md"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
