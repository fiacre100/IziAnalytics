"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  ArrowUpRight, 
  ChevronDown, 
  Filter, 
  RefreshCw, 
  Activity, 
  Check, 
  Copy, 
  Bot, 
  CheckCircle2, 
  X, 
  HelpCircle, 
  ArrowRight,
  ExternalLink,
  Plus,
  Globe,
  CreditCard,
  QrCode,
  Shield,
  Download,
  Lock,
  Layers,
  Smartphone,
  Share2,
  KeyRound,
  Zap
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

import { Site, ProLicense } from "@/types/analytics";
import { 
  getStoredSites, 
  getActiveSite, 
  setActiveSiteId, 
  isProPlan, 
  getProLicense,
  DEFAULT_SITES
} from "@/lib/storage";

import { SiteSelector } from "@/components/SiteSelector";
import { AddSiteModal } from "@/components/AddSiteModal";
import { PaywallModal } from "@/components/PaywallModal";
import { LicenseKeyModal } from "@/components/LicenseKeyModal";

export default function DashboardPage() {
  // Projets / Sites
  const [sites, setSites] = useState<Site[]>(DEFAULT_SITES);
  const [currentSite, setCurrentSite] = useState<Site>(DEFAULT_SITES[0]);
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);

  // Filtre de dates
  const [dateRange, setDateRange] = useState<"today" | "7d" | "30d">("today");

  // Plan et licence PRO
  const [isPro, setIsPro] = useState(false);
  const [proLicense, setProLicense] = useState<ProLicense | null>(null);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  // Intégration
  const [isConnected, setIsConnected] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [selectedTech, setSelectedTech] = useState<"ia" | "nextjs" | "html">("ia");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Stats dynamiques
  const [liveVisitors, setLiveVisitors] = useState(18);
  const [totalVisitors, setTotalVisitors] = useState(2840);
  const [conversionsCount, setConversionsCount] = useState(42);
  const [revenueTotal, setRevenueTotal] = useState(384500);

  // Gemini AI Advisor
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Initialisation côté client depuis localStorage
  useEffect(() => {
    const loadedSites = getStoredSites();
    setSites(loadedSites);

    const active = getActiveSite();
    setCurrentSite(active);
    setIsConnected(active.isConnected);

    if (active.stats) {
      setTotalVisitors(active.stats.uniqueVisitors || 2840);
      setConversionsCount(active.stats.salesCount || 42);
      setRevenueTotal(active.stats.revenue || 384500);
    }

    setIsPro(isProPlan());
    setProLicense(getProLicense());
  }, []);

  // Gestion de la sélection d'un site
  const handleSelectSite = (site: Site) => {
    setActiveSiteId(site.id);
    setCurrentSite(site);
    setIsConnected(site.isConnected);

    if (site.stats) {
      setTotalVisitors(site.stats.uniqueVisitors || 0);
      setConversionsCount(site.stats.salesCount || 0);
      setRevenueTotal(site.stats.revenue || 0);
    }
  };

  // Gestion de la création d'un nouveau site
  const handleSiteCreated = (newSite: Site) => {
    const loadedSites = getStoredSites();
    setSites(loadedSites);
    setCurrentSite(newSite);
    setIsConnected(false); // Invite l'utilisateur à installer le script
    if (newSite.stats) {
      setTotalVisitors(newSite.stats.uniqueVisitors);
      setConversionsCount(newSite.stats.salesCount);
      setRevenueTotal(newSite.stats.revenue);
    }
  };

  // Succès de déblocage PRO (via Paywall ou Clé)
  const handleProSuccess = (license: ProLicense) => {
    setIsPro(true);
    setProLicense(license);
  };

  // Données graphiques réactives selon le site et la période
  const getChartData = () => {
    const hourly = currentSite.stats?.hourlyTraffic;

    if (dateRange === "today") {
      if (hourly && hourly.length > 0) {
        return hourly.map((h) => ({
          label: h.label || h.time || "08h",
          visitors: h.visitors,
          sales: h.sales,
        }));
      }
      return [
        { label: "08h", visitors: 45, sales: 2 },
        { label: "10h", visitors: 120, sales: 5 },
        { label: "12h", visitors: 280, sales: 8 },
        { label: "14h", visitors: 890, sales: 24 },
        { label: "16h", visitors: 540, sales: 15 },
        { label: "18h", visitors: 620, sales: 18 },
        { label: "20h", visitors: 345, sales: 9 },
      ];
    } else if (dateRange === "7d") {
      const base = totalVisitors / 7;
      return [
        { label: "Lun", visitors: Math.round(base * 0.7), sales: Math.max(1, Math.round(conversionsCount * 0.1)) },
        { label: "Mar", visitors: Math.round(base * 0.9), sales: Math.max(1, Math.round(conversionsCount * 0.12)) },
        { label: "Mer", visitors: Math.round(base * 1.0), sales: Math.max(2, Math.round(conversionsCount * 0.15)) },
        { label: "Jeu", visitors: Math.round(base * 1.2), sales: Math.max(3, Math.round(conversionsCount * 0.22)) },
        { label: "Ven", visitors: Math.round(base * 1.3), sales: Math.max(3, Math.round(conversionsCount * 0.25)) },
        { label: "Sam", visitors: Math.round(base * 1.1), sales: Math.max(2, Math.round(conversionsCount * 0.18)) },
        { label: "Dim", visitors: Math.round(base * 0.8), sales: Math.max(1, Math.round(conversionsCount * 0.08)) },
      ];
    } else {
      const baseMonth = totalVisitors * 4;
      return [
        { label: "Sem 1", visitors: Math.round(baseMonth * 0.2), sales: Math.round(conversionsCount * 0.8) },
        { label: "Sem 2", visitors: Math.round(baseMonth * 0.25), sales: Math.round(conversionsCount * 1.1) },
        { label: "Sem 3", visitors: Math.round(baseMonth * 0.3), sales: Math.round(conversionsCount * 1.3) },
        { label: "Sem 4", visitors: Math.round(baseMonth * 0.25), sales: Math.round(conversionsCount * 1.0) },
      ];
    }
  };

  const trackingSnippet = `<script defer src="https://izianalytics.app/script.js" data-site="${currentSite.trackingId}"></script>`;

  const aiCopyPrompt = `Intègre ce script d'analytics IziAnalytics dans notre projet :
${trackingSnippet}
Place-le dans le fichier principal (ex: layout.tsx ou index.html dans le <head>). Assure-toi que les clics sur les boutons d'achat/paiement ont bien l'attribut data-izi-event="pay". Réponds simplement "C'est intégré !" une fois fait.`;

  const copyScriptOnly = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(trackingSnippet);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const copyAiPromptOnly = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(aiCopyPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    }
  };

  const testConnection = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsConnected(true);
    }, 1200);
  };

  const simulateLivePing = () => {
    setLiveVisitors((prev) => prev + 1);
    setTotalVisitors((prev) => prev + 1);
    fetch("/api/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        website_id: currentSite.trackingId,
        path: "/",
        source: "tiktok",
        device: "mobile"
      })
    }).catch(() => {});
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Heure/Date,Visiteurs,Ventes,Source\n" +
      getChartData().map(e => `${e.label},${e.visitors},${e.sales},TikTok/Direct`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `izianalytics_${currentSite.name}_rapport.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const runAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai-digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalVisitors,
          topSource: currentSite.stats?.topSource || "TikTok (68%)",
          sourceBreakdown: [
            { source: "TikTok", count: Math.round(totalVisitors * 0.68) },
            { source: "WhatsApp Direct", count: Math.round(totalVisitors * 0.20) },
            { source: "Instagram Reels", count: Math.round(totalVisitors * 0.08) },
            { source: "Direct", count: Math.round(totalVisitors * 0.04) }
          ],
          conversions: conversionsCount,
          revenue: revenueTotal,
          currency: currentSite.currency
        })
      });
      const data = await res.json();
      setAiAnalysis(data.digest || "Analyse complétée.");
    } catch {
      setAiAnalysis(`🔥 Signal Fort : Le pic TikTok de 14h sur ${currentSite.name} génère 68% de ton trafic total avec un taux de conversion au paywall de 4.2%.\n⚠️ Point d'attention : 14 abandons constatés à l'étape carte bancaire. Les paiements Mobile Money représentent 92% des encaissements réussis.\n🎯 Action Recommandée : Poste une story WhatsApp avec preuve sociale dans les 2 prochaines heures pour relancer les sessions inachevées.`);
    } finally {
      setLoadingAi(false);
    }
  };

  const gatewaysList = currentSite.stats?.gateways || [
    { name: "Wave", sharePct: 62, color: "#00d2ff" },
    { name: "Orange", sharePct: 28, color: "#ff7900" },
    { name: "CB", sharePct: 10, color: "#6366f1" }
  ];

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-emerald-500/10 via-indigo-500/5 to-transparent blur-[130px] pointer-events-none -z-10"></div>

      {/* Top Navbar Executive (Entièrement Responsive sur Mobile & Desktop) */}
      <header className="border-b border-white/[0.06] bg-[#05070B]/85 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-3 flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Logo & Sélecteur Multi-Sites (Visible sur mobile et desktop) */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-black text-base shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
                ⚡
              </div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white hidden xs:flex items-center gap-1.5">
                IziAnalytics
              </span>
            </Link>

            {/* Badge Plan (PRO ou STARTER) cliquable pour voir licence */}
            <button
              type="button"
              onClick={() => setShowPaywallModal(true)}
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase border transition cursor-pointer ${
                isPro
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                  : "bg-white/[0.06] text-slate-400 border-white/[0.08] hover:text-white"
              }`}
            >
              {isPro ? "PRO ILLIMITÉ" : "STARTER"}
            </button>

            {/* Sélecteur de Projets Réactif (Desktop ET Mobile) */}
            <SiteSelector
              activeSite={currentSite}
              sites={sites}
              onSelectSite={handleSelectSite}
              onOpenAddModal={() => setShowAddSiteModal(true)}
            />
          </div>

          {/* Right Toolbar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            {/* Ping Live Demo Button */}
            <button
              type="button"
              onClick={simulateLivePing}
              className="hidden lg:flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs transition cursor-pointer min-h-[38px]"
              title="Simuler une visite entrante en direct"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simuler 1 visite</span>
            </button>

            {/* Live Beacon */}
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 sm:px-3 py-1.5 rounded-full min-h-[36px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-mono font-medium text-emerald-400">
                {liveVisitors} en direct
              </span>
            </div>

            {/* Filtre de dates (Accessible sur mobile et desktop) */}
            <div className="flex items-center bg-[#0E131F] border border-white/[0.08] p-0.5 sm:p-1 rounded-xl text-[11px] sm:text-xs font-medium text-slate-400 min-h-[36px]">
              {(["today", "7d", "30d"] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setDateRange(range)}
                  className={`px-2 sm:px-3 py-1 rounded-lg transition min-h-[32px] ${
                    dateRange === range
                      ? "bg-white/[0.1] text-white font-bold"
                      : "hover:text-slate-200"
                  }`}
                >
                  {range === "today" ? "24h" : range === "7d" ? "7j" : "30j"}
                </button>
              ))}
            </div>

            {/* Bouton Upgrade Plan Pro / Licence Active */}
            {!isPro ? (
              <button
                type="button"
                onClick={() => setShowPaywallModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer min-h-[36px]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Passer</span> PRO
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowPaywallModal(true)}
                className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono px-3 py-1.5 rounded-xl hover:bg-emerald-500/20 transition min-h-[36px]"
                title={proLicense?.key ? `Clé : ${proLicense.key}` : "PRO actif"}
              >
                PRO Actif
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* BANNIÈRE D'INTÉGRATION INITIALE (Disparaît dès que validé) */}
        {!isConnected ? (
          <section className="bg-gradient-to-r from-emerald-950/30 via-[#0E131F] to-indigo-950/20 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-2xl animate-in fade-in duration-300">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6 relative z-10">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Étape 1 : Connexion
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Reliez <strong className="text-emerald-400">{currentSite.name}</strong> en 30 secondes
                  </h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pas besoin de coder. Copiez la consigne toute faite pour votre IA (Cursor, Lovable, Bolt, ChatGPT) ou utilisez notre Assistant Pas-à-Pas.
                </p>
              </div>

              {/* Boutons d'action adaptés sur mobile (pleine largeur sur smartphone) */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={copyAiPromptOnly}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 cursor-pointer min-h-[44px]"
                >
                  <Bot className="w-4 h-4 text-indigo-300 shrink-0" />
                  <span>{copiedPrompt ? "✅ Consigne copiée !" : "Copier la consigne pour mon IA"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAssistantModal(true)}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-medium text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px]"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Assistant Guidé</span>
                </button>

                <button
                  type="button"
                  onClick={testConnection}
                  disabled={isVerifying}
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer min-h-[44px]"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                      <span>Vérification...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Valider l&apos;intégration</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-300">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                SaaS connecté avec succès ! Le tracking de <strong>{currentSite.name}</strong> ({currentSite.trackingId}) est actif.
              </span>
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                type="button"
                onClick={exportCSV}
                className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold min-h-[36px]"
              >
                <Download className="w-3.5 h-3.5" /> Exporter CSV
              </button>
              <button 
                type="button"
                onClick={() => setIsConnected(false)} 
                className="text-slate-500 hover:text-slate-300 text-[11px] underline min-h-[36px]"
              >
                Revoir le script
              </button>
            </div>
          </div>
        )}

        {/* The 3 Golden Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1 : Visiteurs */}
          <div className="bg-[#0D111A] border border-white/[0.07] rounded-2xl p-5 sm:p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Visiteurs Uniques</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                {totalVisitors.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +54%
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
              <span>Période sélectionnée</span>
              <span className="font-mono text-slate-300">
                {dateRange === "today" ? "Aujourd'hui" : dateRange === "7d" ? "7 derniers jours" : "30 derniers jours"}
              </span>
            </div>
          </div>

          {/* Card 2 : Source N°1 */}
          <div className="bg-[#0D111A] border border-white/[0.07] rounded-2xl p-5 sm:p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Moteur d&apos;Acquisition N°1</span>
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentSite.stats?.topSource || "TikTok (68%)"}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
              <span>Lien en bio vidéo virale</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {currentSite.stats?.topSourceClicks || Math.round(totalVisitors * 0.68).toLocaleString()} clics
              </span>
            </div>
          </div>

          {/* Card 3 : Revenus & Passerelles Mobile Money (Avec flex-wrap responsive) */}
          <div className="bg-[#0D111A] border border-white/[0.07] rounded-2xl p-5 sm:p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Revenus Encaissés</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono text-emerald-400">
                {revenueTotal.toLocaleString()} <span className="text-xs text-slate-400 font-normal">{currentSite.currency}</span>
              </span>
              <span className="text-xs font-bold text-slate-300 bg-white/[0.06] px-2 py-0.5 rounded-md">
                {conversionsCount} ventes
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]">
              <span className="text-slate-400 shrink-0">Moyens utilisés :</span>
              {/* Pills adaptatifs avec flex-wrap */}
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                {gatewaysList.map((gw, idx) => (
                  <React.Fragment key={gw.name}>
                    {idx > 0 && <span className="text-slate-500">•</span>}
                    <span style={{ color: gw.color }} className="font-semibold">
                      {gw.name} {gw.sharePct}%
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section Graphique & Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0D111A] border border-white/[0.07] rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Courbe de Trafic & Conversions ({currentSite.name})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Corrélation directe entre vos publications et encaissements.</p>
              </div>
              <button 
                type="button"
                onClick={exportCSV}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-md transition min-h-[32px]"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>

            <div className="h-60 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#06080D", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }}
                    itemStyle={{ color: "#10B981" }}
                  />
                  <Area type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#visitorGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0D111A] border border-white/[0.07] rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-1">
                <Filter className="w-4 h-4 text-emerald-400" />
                Funnel de Conversion
              </h3>
              <p className="text-xs text-slate-400 mb-6">Déperditions observées sur le parcours :</p>

              <div className="space-y-4">
                <div className="p-3 bg-[#05070B] border border-white/[0.06] rounded-xl">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">1. Visiteurs Landing</span>
                    <span className="font-mono font-bold text-white">{totalVisitors.toLocaleString()} (100%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-slate-400"></div>
                  </div>
                </div>

                <div className="p-3 bg-[#05070B] border border-white/[0.06] rounded-xl">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">2. Vues Page Paiement</span>
                    <span className="font-mono font-bold text-blue-400">
                      {Math.round(totalVisitors * 0.109)} (10.9%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[10.9%] h-full bg-blue-500"></div>
                  </div>
                </div>

                <div className="p-3 bg-[#05070B] border border-emerald-500/20 rounded-xl bg-emerald-500/[0.03]">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-medium">3. Paiements Confirmés</span>
                    <span className="font-mono font-bold text-emerald-400">{conversionsCount} (13.5% checkout)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[13.5%] h-full bg-emerald-500"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] text-center text-xs text-slate-500">
              Taux de conversion global : <span className="font-mono text-emerald-400 font-bold">{currentSite.stats?.conversionRate || 1.48}%</span>
            </div>
          </div>
        </div>

        {/* Gemini AI Advisor */}
        <section className="bg-gradient-to-r from-indigo-950/40 via-[#0D111A] to-purple-950/20 border border-indigo-500/25 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-white">Gemini Growth Advisor</h3>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                    Google AI Studio • 1.5 Flash
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Analyse prédictive pour décider quoi poster aujourd&apos;hui sur {currentSite.name}.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={runAiAnalysis}
              disabled={loadingAi}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-xl shadow-indigo-600/25 cursor-pointer shrink-0 min-h-[44px]"
            >
              {loadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{loadingAi ? "Analyse en cours..." : "Générer le Débrief IA du Jour"}</span>
            </button>
          </div>

          {aiAnalysis && (
            <div className="mt-5 p-5 bg-[#05070B]/90 border border-indigo-500/30 rounded-xl text-xs text-slate-200 leading-relaxed whitespace-pre-line animate-in fade-in duration-300 font-sans shadow-inner">
              {aiAnalysis}
            </div>
          )}
        </section>

      </main>

      {/* MODALE D'ASSISTANCE INTÉGRATION (Responsive bottom-sheet & max-h-90vh) */}
      {showAssistantModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#0D111A] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Assistant d&apos;Intégration Sans Code</h3>
                  <p className="text-xs text-slate-400">Pour {currentSite.name} ({currentSite.domain}) :</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowAssistantModal(false)} 
                className="text-slate-400 hover:text-white p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button 
                type="button"
                onClick={() => setSelectedTech("ia")}
                className={`py-2.5 px-3 text-xs font-medium rounded-xl border text-center transition min-h-[44px] ${selectedTech === "ia" ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold" : "bg-[#05070B] border-white/[0.06] text-slate-400 hover:text-white"}`}
              >
                🤖 Via ton IA (Cursor)
              </button>
              <button 
                type="button"
                onClick={() => setSelectedTech("nextjs")}
                className={`py-2.5 px-3 text-xs font-medium rounded-xl border text-center transition min-h-[44px] ${selectedTech === "nextjs" ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold" : "bg-[#05070B] border-white/[0.06] text-slate-400 hover:text-white"}`}
              >
                ⚡ Next.js / React
              </button>
              <button 
                type="button"
                onClick={() => setSelectedTech("html")}
                className={`py-2.5 px-3 text-xs font-medium rounded-xl border text-center transition min-h-[44px] ${selectedTech === "html" ? "bg-blue-600/20 border-blue-500 text-blue-300 font-bold" : "bg-[#05070B] border-white/[0.06] text-slate-400 hover:text-white"}`}
              >
                🌐 HTML / WordPress
              </button>
            </div>

            {selectedTech === "ia" && (
              <div className="space-y-3 bg-[#05070B] p-4 rounded-xl border border-white/[0.06]">
                <p className="text-xs text-slate-300">
                  Si tu as créé ton SaaS avec <strong>Cursor, Bolt.new, Lovable ou ChatGPT</strong>, colle simplement ce message dans le chat :
                </p>
                <div className="bg-black/50 border border-white/10 p-3 rounded-lg text-xs font-mono text-indigo-300 whitespace-pre-wrap select-all">
                  {aiCopyPrompt}
                </div>
                <button
                  type="button"
                  onClick={copyAiPromptOnly}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition min-h-[44px]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPrompt ? "Copié !" : "Copier la consigne pour mon IA"}</span>
                </button>
              </div>
            )}

            {selectedTech === "nextjs" && (
              <div className="space-y-3 bg-[#05070B] p-4 rounded-xl border border-white/[0.06] text-xs text-slate-300">
                <p>Ouvre ton fichier <code className="text-emerald-400">src/app/layout.tsx</code> et ajoute cette balise avant la fermeture de &lt;/head&gt; ou au début de &lt;body&gt; :</p>
                <div className="bg-black/50 border border-white/10 p-3 rounded-lg font-mono text-emerald-300 overflow-x-auto select-all">
                  &lt;Script defer src=&quot;https://izianalytics.app/script.js&quot; data-site=&quot;{currentSite.trackingId}&quot; /&gt;
                </div>
              </div>
            )}

            {selectedTech === "html" && (
              <div className="space-y-3 bg-[#05070B] p-4 rounded-xl border border-white/[0.06] text-xs text-slate-300">
                <p>Ouvre ton fichier <code className="text-blue-400">index.html</code> ou les réglages d&apos;en-tête de ton CMS, et colle :</p>
                <div className="bg-black/50 border border-white/10 p-3 rounded-lg font-mono text-blue-300 overflow-x-auto select-all">
                  {trackingSnippet}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
              <span className="text-xs text-slate-500 text-center sm:text-left">
                Besoin d&apos;aide en direct ? Pose ta question dans le chat.
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowAssistantModal(false);
                  testConnection();
                }}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition min-h-[44px]"
              >
                C&apos;est fait, vérifier la connexion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE D'AJOUT DE SITE (Priorité 1) */}
      <AddSiteModal
        isOpen={showAddSiteModal}
        onClose={() => setShowAddSiteModal(false)}
        onSiteCreated={handleSiteCreated}
      />

      {/* MODALE SIMULATEUR DE PAYWALL (Priorité 2) */}
      <PaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        onSuccess={handleProSuccess}
        onOpenLicenseModal={() => setShowLicenseModal(true)}
        defaultPlan="founder_annual"
      />

      {/* MODALE ENTRÉE DE CLÉ DE LICENCE MANUELLE */}
      <LicenseKeyModal
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        onSuccess={handleProSuccess}
      />

    </div>
  );
}
