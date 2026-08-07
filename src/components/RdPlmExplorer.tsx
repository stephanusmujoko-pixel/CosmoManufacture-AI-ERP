import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  FlaskConical,
  Factory,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Boxes,
  Microscope,
  Sparkles,
  TrendingUp,
  Search,
  Plus,
  RefreshCw,
  Download,
  Tag,
  Users,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Award,
  DollarSign,
  PackageCheck,
  Send,
  Eye,
  Check,
  X,
  FileCode2,
  Clock,
  ArrowRight,
  BarChart3,
  ListFilter,
  CheckSquare,
  QrCode,
  Sliders,
  Zap,
} from 'lucide-react';

export function RdPlmExplorer() {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'ideas'
    | 'projects'
    | 'experiments'
    | 'pilot'
    | 'packaging'
    | 'samples'
    | 'competitors'
    | 'plm-costing'
    | 'change-mgmt'
    | 'documents'
    | 'ai-assistant'
  >('overview');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Data Stores
  const [ideas, setIdeas] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [labTrials, setLabTrials] = useState<any[]>([]);
  const [pilotBatches, setPilotBatches] = useState<any[]>([]);
  const [packagingList, setPackagingList] = useState<any[]>([]);
  const [samples, setSamples] = useState<any[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [ecrEcoList, setEcrEcoList] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any>(null);

  // Modals
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDesc, setNewIdeaDesc] = useState('');
  const [newIdeaCategory, setNewIdeaCategory] = useState('Skincare');
  const [newIdeaCost, setNewIdeaCost] = useState(135000);

  // AI Assistant State
  const [aiPromptCategory, setAiPromptCategory] = useState('Sunscreen Mist');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Load Initial Data from Backend API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        rdRes,
        ideasRes,
        projectsRes,
        expRes,
        trialRes,
        pilotRes,
        pkgRes,
        smpRes,
        compRes,
        ecrRes,
        docRes,
      ] = await Promise.all([
        fetch('/api/rd').then((r) => r.json()),
        fetch('/api/ideas').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/formula-experiments').then((r) => r.json()),
        fetch('/api/laboratory-trials').then((r) => r.json()),
        fetch('/api/pilot-batches').then((r) => r.json()),
        fetch('/api/packaging').then((r) => r.json()),
        fetch('/api/samples').then((r) => r.json()),
        fetch('/api/competitors').then((r) => r.json()),
        fetch('/api/ecr').then((r) => r.json()),
        fetch('/api/rd-documents').then((r) => r.json()),
      ]);

      setKpiData(rdRes.kpis);
      setIdeas(ideasRes.ideas || []);
      setProjects(projectsRes.projects || []);
      setExperiments(expRes.experiments || []);
      setLabTrials(trialRes.trials || []);
      setPilotBatches(pilotRes.pilotBatches || []);
      setPackagingList(pkgRes.packagingList || []);
      setSamples(smpRes.samples || []);
      setCompetitors(compRes.competitors || []);
      setEcrEcoList(ecrRes.changeRequests || []);
      setDocuments(docRes.documents || []);
    } catch (err) {
      console.error('Failed to load R&D data from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Submit New Idea
  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitle) return;

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newIdeaTitle,
          description: newIdeaDesc,
          category: newIdeaCategory,
          businessValue: 'High',
          priority: 'High',
          targetMarket: 'Cosmetic & Skincare Market',
          createdBy: 'R&D Formulator',
          estimatedTargetCostPerKg: newIdeaCost,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Idea "${data.idea.title}" submitted successfully!`);
        setShowNewIdeaModal(false);
        setNewIdeaTitle('');
        setNewIdeaDesc('');
        fetchData();
      }
    } catch (err) {
      console.error('Error creating idea:', err);
    }
  };

  // Approve Idea Status
  const handleApproveIdea = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/ideas/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, approvalBy: 'R&D Director' }),
      });
      if (res.ok) {
        showToast(`Idea status updated to ${status}`);
        fetchData();
      }
    } catch (err) {
      console.error('Error approving idea:', err);
    }
  };

  // Pilot Transfer to Production (MES & PPIC Integration)
  const handleTransferPilotToProduction = async (pilotId: string) => {
    try {
      const res = await fetch(`/api/pilot-batches/${pilotId}/transfer-production`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Success! ${data.message}`);
        fetchData();
      }
    } catch (err) {
      console.error('Error transferring pilot batch:', err);
    }
  };

  // Trigger AI R&D Formula Synthesizer
  const handleGenerateAiFormula = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai-rd-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'optimize-formula',
          targetCategory: aiPromptCategory,
        }),
      });
      const data = await res.json();
      setAiResponse(data.recommendation);
      showToast('AI Formula Recommendation generated!');
    } catch (err) {
      console.error('AI generation error:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-emerald-950 text-emerald-200 border border-emerald-500/50 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-6 md:p-8 border border-emerald-500/20 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Prompt 15 • R&D & PLM Enterprise
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI R&D Connected
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-amber-400 animate-pulse" />
              Research & Development (R&D) • Product Lifecycle (PLM)
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl">
              Innovation-driven product creation, lab experiments, pilot scale-up, packaging proofing, competitor analysis, and seamless tech-transfer to MES production.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowNewIdeaModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Product Idea
            </button>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> AI R&D Assistant
            </button>
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-sm scrollbar-thin">
        {[
          { id: 'overview', label: 'R&D Dashboard', icon: BarChart3 },
          { id: 'ideas', label: 'Idea Board', icon: Lightbulb, badge: ideas.length },
          { id: 'projects', label: 'NPD Projects', icon: Layers, badge: projects.length },
          { id: 'experiments', label: 'Formula & Trials', icon: FlaskConical, badge: labTrials.length },
          { id: 'pilot', label: 'Pilot Scale-Up', icon: Factory, badge: pilotBatches.length },
          { id: 'packaging', label: 'Packaging & Artwork', icon: Boxes, badge: packagingList.length },
          { id: 'samples', label: 'Sample Tracking', icon: PackageCheck, badge: samples.length },
          { id: 'competitors', label: 'Competitor Analysis', icon: TrendingUp },
          { id: 'plm-costing', label: 'PLM & COGM Costing', icon: DollarSign },
          { id: 'change-mgmt', label: 'Change (ECR/ECO)', icon: Sliders, badge: ecrEcoList.length },
          { id: 'documents', label: 'Document Vault', icon: FileText, badge: documents.length },
          { id: 'ai-assistant', label: 'AI R&D Synthesizer', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-xs rounded-full ${
                    isActive ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Ideas, Projects, Formulas, Competitors, ECR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <ListFilter className="w-3.5 h-3.5 text-slate-500" /> Category:
          </span>
          {['All', 'Skincare', 'Sunscreen', 'Haircare', 'Bodycare'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 1. OVERVIEW & R&D DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Ideas</span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Lightbulb className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{kpiData?.newIdeasCount || ideas.length}</span>
                <span className="text-xs text-amber-400 font-medium">Under Evaluation</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Innovation ideas in active pipeline</p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active NPD Projects</span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{kpiData?.activeProjectsCount || projects.length}</span>
                <span className="text-xs text-emerald-400 font-medium">Stage Gate Active</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Products in development phase</p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pilot Scale-Up</span>
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Factory className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{kpiData?.pilotBatchesCount || pilotBatches.length}</span>
                <span className="text-xs text-cyan-400 font-medium">100kg+ Batches</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Ready for MES Tech-Transfer</p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Innovation Score</span>
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{kpiData?.innovationScorePercent || 94.8}%</span>
                <span className="text-xs text-teal-400 font-medium">+4.2% YoY</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Speed-to-Market & Formula Quality</p>
            </div>
          </div>

          {/* Innovation Pipeline Stages Visual Flow */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> New Product Development (NPD) Innovation Pipeline
              </h3>
              <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                100% Traceable Architecture
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 text-center">
              {[
                { stage: 'Concept', count: 3, color: 'border-amber-500/50 bg-amber-500/10 text-amber-300' },
                { stage: 'Research', count: 2, color: 'border-blue-500/50 bg-blue-500/10 text-blue-300' },
                { stage: 'Formula Dev', count: 4, color: 'border-purple-500/50 bg-purple-500/10 text-purple-300' },
                { stage: 'Lab Trial', count: 2, color: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300' },
                { stage: 'Pilot Batch', count: 2, color: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' },
                { stage: 'Validation', count: 1, color: 'border-teal-500/50 bg-teal-500/10 text-teal-300' },
                { stage: 'BPOM Reg.', count: 2, color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' },
                { stage: 'Commercial', count: 1, color: 'border-green-500/50 bg-green-500/10 text-green-300' },
                { stage: 'Mass Prod', count: 5, color: 'border-emerald-400 bg-emerald-400/20 text-emerald-200' },
              ].map((s, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${s.color} space-y-1 relative`}>
                  <p className="text-xs font-semibold line-clamp-1">{s.stage}</p>
                  <p className="text-lg font-bold">{s.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Overview Split: Active Projects & AI R&D Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active NPD Projects List */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" /> Active NPD Projects
                </h3>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-xs text-emerald-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
                >
                  View All Projects <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {proj.projectCode}
                          </span>
                          <span className="text-sm font-semibold text-white">{proj.projectName}</span>
                        </div>
                        <p className="text-xs text-slate-400">Lead: {proj.projectManager} • Target: {proj.targetLaunchDate}</p>
                      </div>
                      <span className="text-xs font-medium bg-cyan-500/10 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/20">
                        {proj.stage}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Milestone Progress</span>
                        <span>{proj.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${proj.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation Widget */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/60 border border-teal-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" /> AI R&D Recommendations
                </h3>
                <span className="px-2 py-0.5 rounded text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Live Insights
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-teal-500/20 text-xs space-y-2">
                  <div className="flex items-center justify-between text-teal-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Sunscreen Spray Stability
                    </span>
                    <span>98.5% Score</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Replacing ethanol with Pentylene Glycol Natural maintains 22 cPs spray viscosity while passing 60-day stability tests.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-teal-500/20 text-xs space-y-2">
                  <div className="flex items-center justify-between text-cyan-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> HPP Optimization
                    </span>
                    <span>-14.2% Cost</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Local bio-fermented centella reduces raw material cost by Rp 24,000/kg without sacrificing anti-inflammatory efficacy.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('ai-assistant')}
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  <Sparkles className="w-4 h-4" /> Open AI Formula Synthesizer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. IDEA BOARD */}
      {activeTab === 'ideas' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" /> Idea Management & Innovation Pipeline
              </h2>
              <p className="text-xs text-slate-400">Capture, evaluate, and approve market-driven product concepts.</p>
            </div>
            <button
              onClick={() => setShowNewIdeaModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" /> Submit Product Idea
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas
              .filter((i) => filterCategory === 'All' || i.category === filterCategory)
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {item.ideaNumber}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          item.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.status === 'In Development'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{item.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block">Category</span>
                        <span className="font-medium text-slate-200">{item.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Business Value</span>
                        <span className="font-medium text-amber-400">{item.businessValue}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Target Cost/Kg</span>
                        <span className="font-medium text-emerald-400">Rp {item.estimatedTargetCostPerKg?.toLocaleString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Created By</span>
                        <span className="font-medium text-slate-300 line-clamp-1">{item.createdBy}</span>
                      </div>
                    </div>
                  </div>

                  {item.status === 'Submitted' || item.status === 'Under Review' ? (
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => handleApproveIdea(item.id, 'Approved')}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Idea
                      </button>
                      <button
                        onClick={() => handleApproveIdea(item.id, 'Rejected')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs flex items-center justify-center cursor-pointer"
                        title="Reject Idea"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 flex items-center gap-1 pt-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Approved by {item.approvalBy || 'R&D Committee'}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. NPD PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" /> New Product Development (NPD) Projects
              </h2>
              <p className="text-xs text-slate-400">Project management, timeline milestones, and stage gate validation.</p>
            </div>
          </div>

          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                        {proj.projectCode}
                      </span>
                      <h3 className="text-lg font-bold text-white">{proj.projectName}</h3>
                    </div>
                    <p className="text-xs text-slate-400">
                      Manager: <span className="text-slate-200">{proj.projectManager}</span> • Launch Target: <span className="text-slate-200">{proj.targetLaunchDate}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1 rounded-full font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Current Stage: {proj.stage}
                    </span>
                    <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer">
                      View Gate Checklist
                    </button>
                  </div>
                </div>

                {/* Milestones & Progress */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-slate-400 block">Milestones Completed</span>
                    <span className="text-xl font-bold text-white">
                      {proj.completedMilestones} / {proj.milestonesCount}
                    </span>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${(proj.completedMilestones / proj.milestonesCount) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-slate-400 block">Budget Allocation</span>
                    <span className="text-xl font-bold text-emerald-400">
                      Rp {proj.budgetSpent?.toLocaleString('id-ID')} / Rp {proj.budgetTotal?.toLocaleString('id-ID')}
                    </span>
                    <span className="text-slate-500 text-[11px]">R&D Budget Tracked</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-slate-400 block">Risk Rating</span>
                    <span
                      className={`text-sm font-bold ${
                        proj.riskLevel === 'Low' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {proj.riskLevel} Risk
                    </span>
                    <span className="text-slate-500 text-[11px]">Gate Review Passed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FORMULA & LAB TRIALS */}
      {activeTab === 'experiments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-400" /> Formula Experiments & Laboratory Trials
              </h2>
              <p className="text-xs text-slate-400">Variant adjustments, pH/viscosity predictions, and trial log results.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Experiments */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-cyan-400" /> Active Formula Experiments
              </h3>

              <div className="space-y-3">
                {experiments.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-400 font-bold">{exp.experimentCode}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                        {exp.status}
                      </span>
                    </div>
                    <p className="font-bold text-slate-200 text-sm">{exp.variantName}</p>
                    <p className="text-slate-400">{exp.notes}</p>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-slate-300">
                      <div>Target pH: <span className="font-bold text-white">{exp.predictedPh}</span></div>
                      <div>Viscosity: <span className="font-bold text-white">{exp.targetViscosity}</span></div>
                      <div>Cost/kg: <span className="font-bold text-emerald-400">Rp {exp.costPerKg?.toLocaleString('id-ID')}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Laboratory Trial Execution Logs */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Microscope className="w-4 h-4 text-teal-400" /> Executed Lab Trial Logs
              </h3>

              <div className="space-y-3">
                {labTrials.map((trial) => (
                  <div key={trial.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-teal-400 font-bold">{trial.trialCode}</span>
                      <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold">
                        {trial.status}
                      </span>
                    </div>
                    <p className="font-bold text-slate-200 text-sm">{trial.formulaName}</p>
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>Batch Size: <span className="font-bold text-white">{trial.batchSizeKg} Kg</span></div>
                      <div>pH Result: <span className="font-bold text-emerald-400">{trial.phResult}</span></div>
                      <div>Viscosity: <span className="font-bold text-white">{trial.viscosityResult}</span></div>
                      <div>Microbiology: <span className="font-bold text-emerald-400">{trial.microbiologyStatus}</span></div>
                    </div>
                    <p className="text-slate-400 italic">Appearance: "{trial.appearance}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PILOT BATCH SCALE-UP */}
      {activeTab === 'pilot' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Factory className="w-5 h-5 text-cyan-400" /> Pilot Batch & Technology Transfer (MES & PPIC)
              </h2>
              <p className="text-xs text-slate-400">Scale-up validation from lab (10kg) to industrial manufacturing (1,000kg).</p>
            </div>
          </div>

          <div className="space-y-4">
            {pilotBatches.map((pilot) => (
              <div key={pilot.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                        {pilot.pilotBatchNumber}
                      </span>
                      <h3 className="text-lg font-bold text-white">{pilot.projectName}</h3>
                    </div>
                    <p className="text-xs text-slate-400">
                      Formula: <span className="text-slate-200 font-mono">{pilot.formulaCode}</span> • Scale: <span className="text-cyan-300 font-bold">{pilot.scaleFactor}</span>
                    </p>
                  </div>

                  {pilot.transferredToMes ? (
                    <div className="flex items-center gap-2 bg-emerald-500/15 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-500/30 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Transferred to MES Production & PPIC MRP
                    </div>
                  ) : (
                    <button
                      onClick={() => handleTransferPilotToProduction(pilot.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <Factory className="w-4 h-4" /> Transfer Formula to MES Production & PPIC
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Planned / Actual Yield</span>
                    <span className="text-base font-bold text-white">{pilot.plannedYieldKg} Kg / {pilot.actualYieldKg} Kg</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Yield Efficiency</span>
                    <span className="text-base font-bold text-emerald-400">{pilot.yieldEfficiencyPercent}%</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">QC Result</span>
                    <span className="text-base font-bold text-teal-300">{pilot.qcResult}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Commercial Status</span>
                    <span className="text-xs font-bold text-amber-300">{pilot.commercialRecommendation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. PACKAGING & ARTWORK */}
      {activeTab === 'packaging' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-amber-400" /> Packaging Development & Artwork Management
              </h2>
              <p className="text-xs text-slate-400">Bottle, tube, jar, pump, artwork proofing, barcode & QR generation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packagingList.map((pkg) => (
              <div key={pkg.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-amber-400 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                    {pkg.packagingCode}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {pkg.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{pkg.productName}</h3>
                  <p className="text-xs text-slate-400">{pkg.containerType} ({pkg.capacityMl}ml) • Supplier: {pkg.supplierName}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Artwork Version:</span>
                    <span className="font-bold text-emerald-400">{pkg.artworkVersion}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Barcode (EAN-13):</span>
                    <span className="font-mono text-slate-200">{pkg.barcode}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Drop Test (1.2m):</span>
                    <span className="font-bold text-emerald-400">{pkg.dropTestResult}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold block">Label Claims:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.labelClaims?.map((claim: string, idx: number) => (
                      <span key={idx} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {claim}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SAMPLE TRACKING */}
      {activeTab === 'samples' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-teal-400" /> Sample Management System
              </h2>
              <p className="text-xs text-slate-400">Tracking customer samples, stability samples, retention samples, and client feedback.</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Product Name</th>
                  <th className="p-3.5">Recipient</th>
                  <th className="p-3.5">Dispatch Date</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {samples.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">{s.sampleCode}</td>
                    <td className="p-3.5 font-semibold text-slate-200">{s.sampleType}</td>
                    <td className="p-3.5 font-bold text-white">{s.productName}</td>
                    <td className="p-3.5">{s.recipient}</td>
                    <td className="p-3.5">{s.dispatchDate}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        {s.feedbackStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. COMPETITOR ANALYSIS */}
      {activeTab === 'competitors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Competitor Analysis & Market Intelligence
              </h2>
              <p className="text-xs text-slate-400">Benchmark retail prices, ingredient comparison, and formulation advantages.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitors.map((comp) => (
              <div key={comp.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{comp.competitorBrand}</span>
                  <span className="text-sm font-bold text-emerald-400">Rp {comp.retailPriceIdr?.toLocaleString('id-ID')} / {comp.packSizeMl}ml</span>
                </div>

                <h3 className="text-base font-bold text-white">{comp.productName}</h3>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div>
                    <span className="text-slate-400 block font-semibold">Key Ingredients:</span>
                    <span className="text-slate-200">{comp.keyIngredients?.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Strengths:</span>
                    <span className="text-slate-300">{comp.strengths}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Weaknesses:</span>
                    <span className="text-rose-300">{comp.weaknesses}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Our Formulation Advantage:
                  </span>
                  <p>{comp.ourAdvantage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. PLM & COGM COSTING */}
      {activeTab === 'plm-costing' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" /> PLM & Product Target Costing (COGM)
              </h2>
              <p className="text-xs text-slate-400">HPP breakdown: Raw materials, packaging, labor, machine & overhead.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Sunscreen Mist SPF 50 (100ml)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Raw Material Cost (100ml bulk)</span>
                  <span className="font-bold text-white">Rp 13,850</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Airless Pump Bottle + Box Packaging</span>
                  <span className="font-bold text-white">Rp 6,800</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Direct Cleanroom Labor</span>
                  <span className="font-bold text-white">Rp 1,200</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Homogenizer Machine Depreciation</span>
                  <span className="font-bold text-white">Rp 900</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Factory Overhead Placeholder</span>
                  <span className="font-bold text-white">Rp 1,100</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-bold pt-2">
                  <span className="text-emerald-400">Total HPP per Unit</span>
                  <span className="text-emerald-400">Rp 23,850</span>
                </div>
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Target Selling Price</span>
                  <span className="font-bold text-white">Rp 119,000</span>
                </div>
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-center">
                  <span className="text-xs text-emerald-300 font-bold">Estimated Gross Margin: 79.9% (Target Cost Met)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Biotic Calming Serum (30ml)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Raw Material Cost (30ml bulk)</span>
                  <span className="font-bold text-white">Rp 5,160</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Frosted Glass Bottle + Pipette</span>
                  <span className="font-bold text-white">Rp 8,500</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Direct Cleanroom Labor</span>
                  <span className="font-bold text-white">Rp 1,500</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Vacuum Emulsifier Depreciation</span>
                  <span className="font-bold text-white">Rp 1,100</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Factory Overhead Placeholder</span>
                  <span className="font-bold text-white">Rp 1,400</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-bold pt-2">
                  <span className="text-emerald-400">Total HPP per Unit</span>
                  <span className="text-emerald-400">Rp 17,660</span>
                </div>
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Target Selling Price</span>
                  <span className="font-bold text-white">Rp 149,000</span>
                </div>
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-center">
                  <span className="text-xs text-emerald-300 font-bold">Estimated Gross Margin: 88.1% (Target Cost Met)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. CHANGE MANAGEMENT (ECR/ECO) */}
      {activeTab === 'change-mgmt' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" /> Change Management (ECR & ECO)
              </h2>
              <p className="text-xs text-slate-400">Engineering Change Requests & Orders for formula or packaging revisions.</p>
            </div>
          </div>

          <div className="space-y-4">
            {ecrEcoList.map((item) => (
              <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-amber-400 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                    {item.changeNumber} ({item.type})
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-300">Product: <span className="text-emerald-400 font-semibold">{item.impactedProduct}</span> • Requested By: {item.requestedBy}</p>
                <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  Reason: {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. DOCUMENT VAULT */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" /> R&D Document Vault & Regulatory Dossier
              </h2>
              <p className="text-xs text-slate-400">Formula specs, COA standards, MSDS sheets, and BPOM approval documents.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-emerald-400 font-bold">{doc.documentNumber}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    v{doc.version}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{doc.title}</h3>
                <p className="text-xs text-slate-400">{doc.category} • {doc.fileSize}</p>
                <button
                  onClick={() => showToast(`Downloaded ${doc.title}`)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download Document
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. AI R&D ASSISTANT */}
      {activeTab === 'ai-assistant' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-teal-400" /> AI R&D Assistant & Formula Synthesizer
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                Leverage generative AI models to recommend optimal cosmetic ingredients, predict formulation stability, estimate pH/viscosity, and optimize target cost/kg.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Target product e.g., Sunscreen Mist SPF 50, Calming Serum..."
                value={aiPromptCategory}
                onChange={(e) => setAiPromptCategory(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
              />
              <button
                onClick={handleGenerateAiFormula}
                disabled={isAiGenerating}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isAiGenerating ? 'Synthesizing...' : 'Synthesize Formula'}
              </button>
            </div>

            {/* AI Generated Response Display */}
            {aiResponse && (
              <div className="bg-slate-950/90 border border-teal-500/30 rounded-xl p-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-teal-300 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-400" /> {aiResponse.title}
                  </h3>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Score: {aiResponse.predictedStabilityScore}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {aiResponse.aiInsights}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Predicted pH</span>
                    <span className="text-base font-bold text-white">{aiResponse.predictedPh}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Viscosity</span>
                    <span className="text-base font-bold text-white">{aiResponse.predictedViscosity}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Cost / Kg</span>
                    <span className="text-base font-bold text-emerald-400">Rp {aiResponse.estimatedCostPerKgIdr?.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">BPOM Compliance</span>
                    <span className="text-xs font-bold text-emerald-300">{aiResponse.bpomComplianceCheck}</span>
                  </div>
                </div>

                {/* Suggested Ingredients Table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Synthesized Ingredient Formulation:</span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="p-2.5">Phase</th>
                          <th className="p-2.5">Raw Material</th>
                          <th className="p-2.5">INCI Name</th>
                          <th className="p-2.5">Percentage (%)</th>
                          <th className="p-2.5">Function</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {aiResponse.suggestedIngredients?.map((ing: any, idx: number) => (
                          <tr key={idx}>
                            <td className="p-2.5 font-bold text-amber-400">{ing.phase}</td>
                            <td className="p-2.5 font-semibold text-white">{ing.name}</td>
                            <td className="p-2.5 italic text-slate-400">{ing.inciName}</td>
                            <td className="p-2.5 font-bold text-emerald-400">{ing.percentage}%</td>
                            <td className="p-2.5">{ing.function}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW IDEA MODAL */}
      {showNewIdeaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" /> Submit New Product Idea
              </h3>
              <button
                onClick={() => setShowNewIdeaModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Barrier Repair Cream with 5x Ceramides"
                  value={newIdeaTitle}
                  onChange={(e) => setNewIdeaTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Category</label>
                <select
                  value={newIdeaCategory}
                  onChange={(e) => setNewIdeaCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Skincare">Skincare</option>
                  <option value="Sunscreen">Sunscreen</option>
                  <option value="Haircare">Haircare</option>
                  <option value="Bodycare">Bodycare</option>
                  <option value="Decorative">Decorative</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Concept Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe key ingredients, target consumer benefits..."
                  value={newIdeaDesc}
                  onChange={(e) => setNewIdeaDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Target Cost / Kg (IDR)</label>
                <input
                  type="number"
                  value={newIdeaCost}
                  onChange={(e) => setNewIdeaCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewIdeaModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer"
                >
                  Submit Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
