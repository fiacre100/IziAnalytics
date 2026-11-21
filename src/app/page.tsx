"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Smartphone,
  BarChart3,
  Check,
  Bot,
  Activity,
  DollarSign,
  HelpCircle,
  Lock,
  KeyRound,
  CreditCard
} from "lucide-react";
import { PaywallModal } from "@/components/PaywallModal";
import { LicenseKeyModal } from "@/components/LicenseKeyModal";
import { PlanType, ProLicense } from "@/types/analytics";
import { isProPlan, getProLicense } from "@/lib/storage";

export default function HomePage() {
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallPlan, setPaywallPlan] = useState<PlanType>("founder_annual");
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [activeLicense, setActiveLicense] = useState<ProLicense | null>(null);

  useEffect(() => {
    setIsPro(isProPlan());
    setActiveLicense(getProLicense());
  }, []);

  const openPaywall = (plan: PlanType = "founder_annual") => {
    setPaywallPlan(plan);
    setIsPaywallOpen(true);
  };

  const handlePaywallSuccess = (license: ProLicense) => {
    setIsPro(true);
    setActiveLicense(license);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black font-sans relative overflow-hidden">
      {/* Halos Lumineux Décoratifs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-emerald-500/15 via-indigo-500/5 to-transparent blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[400px] bg-indigo-500/5 blur-[120px] pointer-events-none -z-10"></div>

      {/* Navbar Executive */}
      <nav className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between border-b border-white/[0.06] bg-[#05070B]/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-emerald-500/20">
            ⚡
          </div>
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
            IziAnalytics
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              2026 EDITION
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link 
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-white transition font-medium hidden sm:block"
          >
            Démo en direct
          </Link>
          <a
            href="#tarifs"
            className="text-xs text-slate-400 hover:text-white transition font-medium hidden sm:block"
          >
            Tarifs
          </a>

          {/* Bouton Simulateur Paywall dans le header */}
          <button
            type="button"
            onClick={() => openPaywall("founder_annual")}
            className="text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-2 rounded-xl transition font-semibold hidden md:flex items-center gap-1.5 min-h-[38px] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Simulateur Paywall</span>
          </button>

          <Link
            href="/dashboard"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-3.5 sm:px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 min-h-[40px]"
          >
            <span>Ouvrir mon dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-20 sm:pb-24 text-center space-y-8 sm:space-y-10">
        
        {/* Badge Flottant & Trigger Simulateur */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 bg-[#0E131F] border border-white/[0.08] px-4 py-1.5 rounded-full shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-300">
              Zero-Cookie • Fait pour le trafic TikTok, Reels, WhatsApp & Mobile Money
            </span>
          </div>

          <button
            type="button"
            onClick={() => openPaywall("founder_annual")}
            className="inline-flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-bold transition cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Tester le Paywall (Wave/OM/Stripe)</span>
          </button>
        </div>

        {/* H1 Ultra-Percutante */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Sache en <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">10 secondes</span> d&apos;où viennent tes ventes. Pas en 30 minutes.
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
          Remplace l&apos;usine à gaz de Google Analytics par un tableau de bord ultra-épuré. 
          Un micro-script de moins de 2 Ko qui identifie instantanément tes ventes Wave, Orange Money et Stripe sans ralentir ton site.
        </p>

        {/* CTA Principaux */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <button
            type="button"
            onClick={() => openPaywall("starter")}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm px-7 py-3.5 sm:py-4 rounded-xl transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 group cursor-pointer min-h-[48px]"
          >
            <span>Installer le script gratuitement (&lt; 2 Ko)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-[#0E131F] hover:bg-slate-800 text-slate-200 border border-white/10 font-semibold text-sm px-6 py-3.5 sm:py-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            Tester la Démo Interactive
          </Link>
        </div>

        {/* 3 Promesses Chiffrées */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-8 max-w-3xl mx-auto text-left">
          <div className="bg-[#0D111A] border border-white/[0.06] p-4 rounded-xl">
            <span className="text-emerald-400 font-mono font-bold text-lg">&lt; 1.8 Ko</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">Impact Vitesse Zéro</p>
            <p className="text-[11px] text-slate-500 mt-0.5">25x plus léger que Google Analytics (45 Ko).</p>
          </div>
          <div className="bg-[#0D111A] border border-white/[0.06] p-4 rounded-xl">
            <span className="text-indigo-400 font-mono font-bold text-lg">0 Cookie</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">Zero Bannière RGPD</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Ne fais plus fuir 30% de tes visiteurs avec des popups.</p>
          </div>
          <div className="bg-[#0D111A] border border-white/[0.06] p-4 rounded-xl">
            <span className="text-pink-400 font-mono font-bold text-lg">100% Mobile</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">Suivi Wave & Orange</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Attribution native des paiements Mobile Money.</p>
          </div>
        </div>

        {/* Tableau Comparatif Anti-Google Analytics (Mobile horizontally scrollable min-w-[600px]) */}
        <div className="pt-14 sm:pt-16 max-w-3xl mx-auto text-left">
          <div className="text-center mb-6 sm:mb-8 px-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Pourquoi les créateurs de SaaS nous choisissent :</h2>
            <p className="text-xs text-slate-400 mt-1">La différence entre perdre son temps dans des rapports et piloter son cashflow.</p>
          </div>

          {/* Wrapper avec défilement horizontal fluide sur mobile */}
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] shadow-2xl pb-2">
            <div className="min-w-[600px] bg-[#0D111A] divide-y divide-white/[0.06]">
              <div className="grid grid-cols-3 p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-black/40">
                <span>Critère</span>
                <span>Google Analytics 4</span>
                <span className="text-emerald-400 font-bold">IziAnalytics</span>
              </div>

              <div className="grid grid-cols-3 p-4 text-xs items-center">
                <span className="font-medium text-slate-300">Temps pour comprendre ses stats</span>
                <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5 shrink-0" /> 15 à 30 minutes</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 10 secondes</span>
              </div>

              <div className="grid grid-cols-3 p-4 text-xs items-center">
                <span className="font-medium text-slate-300">Bandeau de cookies obligatoire</span>
                <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5 shrink-0" /> Oui (fait fuir le trafic)</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Non (Zero-Cookie)</span>
              </div>

              <div className="grid grid-cols-3 p-4 text-xs items-center">
                <span className="font-medium text-slate-300">Poids du script</span>
                <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5 shrink-0" /> ~45 Ko (ralentit la page)</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 1.8 Ko (instantané)</span>
              </div>

              <div className="grid grid-cols-3 p-4 text-xs items-center">
                <span className="font-medium text-slate-300">Suivi des ventes Mobile Money</span>
                <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5 shrink-0" /> Inexistant / Complexe</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Natif en 1 clic</span>
              </div>

              <div className="grid grid-cols-3 p-4 text-xs items-center">
                <span className="font-medium text-slate-300">Intégration via IA (Cursor/ChatGPT)</span>
                <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5 shrink-0" /> Documentation lourde</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 1 Prompt copié-collé</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-2 sm:hidden">
            👉 Faites défiler horizontalement pour comparer
          </p>
        </div>

        {/* Section Tarifs Chirurgicaux */}
        <section id="tarifs" className="pt-16 sm:pt-20 max-w-4xl mx-auto text-left">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">Tarification Simple & Directe</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Un investissement amorti dès ta 1ère vente</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Pas de mauvaise surprise ni de frais cachés. Encaissable en Mobile Money ou Carte.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Plan Gratuit Starter */}
            <div className="bg-[#0D111A] border border-white/[0.08] p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Starter Test</span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">0 FCFA</span>
                  <span className="text-xs text-slate-500">/ toujours</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Pour valider ton premier micro-SaaS ou tunnel.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Jusqu&apos;à 1 000 visites par mois</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 1 site web connecté</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Script ultra-léger &lt; 2 Ko</li>
                  <li className="flex items-center gap-2 text-slate-500"><XCircle className="w-4 h-4 shrink-0" /> Analyse Gemini AI Advisor</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openPaywall("starter")}
                className="mt-8 w-full bg-[#05070B] hover:bg-slate-800 text-white border border-white/10 text-center font-bold text-xs py-3.5 rounded-xl transition min-h-[44px] cursor-pointer"
              >
                Démarrer gratuitement
              </button>
            </div>

            {/* Plan Pro Annuel (Mis en avant par défaut) */}
            <div className="bg-gradient-to-b from-[#131B2E] via-[#0E1526] to-[#0D111A] border-2 border-emerald-500/40 p-6 sm:p-8 rounded-2xl flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10">
              <div className="absolute -top-3.5 right-6 bg-emerald-500 text-black text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-lg">
                Recommandé • Économise 50%
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Founder Pro Annuel</span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">39 000 FCFA</span>
                  <span className="text-xs text-slate-400">/ an (~59 €)</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Soit seulement 3 250 FCFA par mois (moins cher qu&apos;un repas).</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2 font-medium"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Trafic illimité</strong> (aucun bridage)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Jusqu&apos;à 10 SaaS / sites connectés</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Gemini AI Advisor :</strong> Débrief IA quotidien</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Suivi automatique Mobile Money (Wave, Orange, MTN) & Stripe</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Assistant d&apos;intégration automatique pour Cursor & Lovable</li>
                </ul>
              </div>

              <div className="mt-8 space-y-2">
                <button
                  type="button"
                  onClick={() => openPaywall("founder_annual")}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black text-center font-extrabold text-xs py-3.5 rounded-xl transition shadow-xl shadow-emerald-500/20 block cursor-pointer min-h-[44px]"
                >
                  Passer à Founder Pro (Wave, Orange, Carte)
                </button>
                <p className="text-[10px] text-center text-slate-500">Paiement sécurisé instantané. Garantie satisfait ou remboursé 14 jours.</p>
              </div>
            </div>
          </div>

          {/* Lien pour activer une clé de licence existante */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsLicenseModalOpen(true)}
              className="text-xs text-slate-400 hover:text-emerald-400 underline transition inline-flex items-center gap-1.5 min-h-[40px] cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Vous possédez déjà une clé de licence PRO ? Cliquez ici pour l&apos;activer</span>
            </button>
          </div>
        </section>

      </main>

      {/* Footer Minimaliste */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 IziAnalytics. Fait pour les fondateurs ambitieux qui pilotent des résultats réels.</p>
          <div className="flex gap-4 text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <a href="#tarifs" className="hover:text-white transition">Tarifs</a>
            <button
              type="button"
              onClick={() => setIsLicenseModalOpen(true)}
              className="hover:text-emerald-400 transition"
            >
              Activer licence
            </button>
          </div>
        </div>
      </footer>

      {/* Modale Simulateur de Paywall */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSuccess={handlePaywallSuccess}
        onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
        defaultPlan={paywallPlan}
      />

      {/* Modale Saisie de Clé de Licence */}
      <LicenseKeyModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        onSuccess={handlePaywallSuccess}
      />
    </div>
  );
}
