"use client";

import React, { useState, useEffect } from "react";
import { PlanType, PaymentGatewayType, ProLicense } from "@/types/analytics";
import { generateProLicenseKey, saveProLicense } from "@/lib/storage";
import { PaymentGatewayLogo } from "@/components/PaymentLogos";
import {
  X,
  Sparkles,
  Check,
  Lock,
  Copy,
  RefreshCw,
  CheckCircle2,
  Smartphone,
  CreditCard,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Zap,
} from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (license: ProLicense) => void;
  onOpenLicenseModal?: () => void;
  defaultPlan?: PlanType;
}

const COUNTRY_CODES = [
  { code: "+221", country: "Sénégal 🇸🇳" },
  { code: "+225", country: "Côte d'Ivoire 🇨🇮" },
  { code: "+229", country: "Bénin 🇧🇯" },
  { code: "+237", country: "Cameroun 🇨🇲" },
  { code: "+223", country: "Mali 🇲🇱" },
  { code: "+226", country: "Burkina Faso 🇧🇫" },
  { code: "+228", country: "Togo 🇹🇬" },
  { code: "+242", country: "Congo 🇨🇬" },
  { code: "+33", country: "France 🇫🇷" },
];

export function PaywallModal({
  isOpen,
  onClose,
  onSuccess,
  onOpenLicenseModal,
  defaultPlan = "founder_annual",
}: PaywallModalProps) {
  // Sélection du plan
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(defaultPlan);
  // Order bump
  const [orderBump, setOrderBump] = useState(true);
  // Passerelle de paiement
  const [gateway, setGateway] = useState<PaymentGatewayType>("wave");

  // Champs de saisie contextuels
  const [countryCode, setCountryCode] = useState("+221");
  const [phoneNumber, setPhoneNumber] = useState("77 845 12 34");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("892");

  // Simulation état de paiement
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPhase, setProcessingPhase] = useState<1 | 2 | 3>(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedPlan(defaultPlan);
      setOrderBump(true);
      setGateway("wave");
      setIsProcessing(false);
      setIsSuccess(false);
      setProcessingPhase(1);
      setCopiedKey(false);
    }
  }, [isOpen, defaultPlan]);

  if (!isOpen) return null;

  // Calcul dynamique des prix
  const getBasePrice = (): number => {
    switch (selectedPlan) {
      case "founder_annual":
        return 39000;
      case "founder_monthly":
        return 4900;
      case "starter":
        return 0;
      default:
        return 39000;
    }
  };

  const bumpPrice = orderBump ? 9900 : 0;
  const totalPrice = getBasePrice() + bumpPrice;

  // Lancement de la simulation de paiement en 3 étapes animées
  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    setProcessingPhase(1);

    // Phase 1 : Initiation API
    setTimeout(() => {
      setProcessingPhase(2);
    }, 600);

    // Phase 2 : Envoi push USSD / 3D Secure
    setTimeout(() => {
      setProcessingPhase(3);
    }, 1200);

    // Phase 3 : Validation et génération de clé PRO
    setTimeout(() => {
      const newKey = generateProLicenseKey();
      setGeneratedKey(newKey);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1800);
  };

  const handleCopyKey = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(generatedKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleActivateAndClose = () => {
    const license: ProLicense = {
      key: generatedKey,
      plan: selectedPlan,
      orderBump,
      amountPaid: totalPrice,
      currency: "FCFA",
      paymentMethod: gateway,
      payerContact: gateway === "stripe" ? cardNumber : `${countryCode} ${phoneNumber}`,
      activatedAt: new Date().toISOString(),
    };

    saveProLicense(license);
    onSuccess(license);
    onClose();
  };

  const gatewayName =
    gateway === "wave"
      ? "Wave"
      : gateway === "orange_money"
      ? "Orange Money"
      : gateway === "mtn"
      ? "MTN MoMo"
      : "Carte / Stripe";

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Conteneur principal */}
      <div className="bg-[#0D111A] border-t sm:border-2 border-emerald-500/40 rounded-t-3xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-6 shadow-2xl relative animate-in slide-in-from-bottom-4 sm:fade-in duration-200">
        
        {/* Poignée mobile */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto sm:hidden mb-1"></div>

        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition min-h-[44px] min-w-[44px] flex items-center justify-center z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            {/* Header du modal */}
            <div className="space-y-1.5 pr-8">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                  2026 EDITION • ACCÈS IMMÉDIAT
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Simulateur Paywall IziAnalytics
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Débloquez votre licence PRO à vie ou annuelle avec Wave, Orange Money, MTN ou Carte.
              </p>
            </div>

            <form onSubmit={handleStartPayment} className="space-y-5">
              {/* 1. Sélection du Plan */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  1. Choisissez votre formule
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Founder Pro Annuel (Mis en avant) */}
                  <div
                    onClick={() => setSelectedPlan("founder_annual")}
                    className={`relative p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
                      selectedPlan === "founder_annual"
                        ? "bg-gradient-to-b from-[#132035] to-[#0E1526] border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500"
                        : "bg-[#05070B] border-white/[0.08] hover:border-white/20 opacity-80"
                    }`}
                  >
                    <div className="absolute -top-2.5 right-3 bg-emerald-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                      -50% RECOMMANDÉ
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-white block">Founder Pro Annuel</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        39 000 <span className="text-[10px] font-normal text-slate-400">FCFA/an</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Soit 3 250 F/mois</span>
                  </div>

                  {/* Founder Pro Mensuel */}
                  <div
                    onClick={() => setSelectedPlan("founder_monthly")}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
                      selectedPlan === "founder_monthly"
                        ? "bg-gradient-to-b from-[#132035] to-[#0E1526] border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500"
                        : "bg-[#05070B] border-white/[0.08] hover:border-white/20 opacity-80"
                    }`}
                  >
                    <div>
                      <span className="text-[11px] font-bold text-white block">Founder Mensuel</span>
                      <span className="text-lg font-black text-white font-mono">
                        4 900 <span className="text-[10px] font-normal text-slate-400">FCFA/m</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Sans engagement</span>
                  </div>

                  {/* Starter Gratuit */}
                  <div
                    onClick={() => setSelectedPlan("starter")}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
                      selectedPlan === "starter"
                        ? "bg-[#05070B] border-emerald-500/60 ring-1 ring-emerald-500/60"
                        : "bg-[#05070B] border-white/[0.08] hover:border-white/20 opacity-70"
                    }`}
                  >
                    <div>
                      <span className="text-[11px] font-bold text-slate-300 block">Starter Test</span>
                      <span className="text-lg font-black text-white font-mono">0 FCFA</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">1 000 vues/mois</span>
                  </div>
                </div>
              </div>

              {/* 2. Order Bump Interactif (+9 900 FCFA) */}
              <label className="flex items-start gap-3 p-3.5 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl cursor-pointer hover:border-amber-500/60 transition group min-h-[50px]">
                <input
                  type="checkbox"
                  checked={orderBump}
                  onChange={(e) => setOrderBump(e.target.checked)}
                  className="mt-1 rounded text-emerald-500 focus:ring-0 w-4 h-4 accent-emerald-500 shrink-0 cursor-pointer"
                />
                <div className="text-xs space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-white text-xs sm:text-[13px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      Pack de 10 Templates Landing Page Haute Conversion
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                      +9 900 FCFA (~15 €)
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    +25% de ventes constatées. Templates prêts à copier-coller pour TikTok Ads et trafic Mobile Money.
                  </p>
                </div>
              </label>

              {/* 3. Choix de la Passerelle */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  2. Moyen de paiement
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "wave" as const, name: "Wave" },
                    { id: "orange_money" as const, name: "Orange Money" },
                    { id: "mtn" as const, name: "MTN MoMo" },
                    { id: "stripe" as const, name: "Stripe / CB" },
                  ].map((gw) => {
                    const isSelected = gateway === gw.id;
                    return (
                      <button
                        type="button"
                        key={gw.id}
                        onClick={() => setGateway(gw.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition min-h-[56px] cursor-pointer ${
                          isSelected
                            ? "bg-white/[0.08] border-emerald-400 ring-1 ring-emerald-400 text-white font-bold"
                            : "bg-[#05070B] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        <PaymentGatewayLogo gateway={gw.id} className="w-6 h-6" />
                        <span className="text-[11px] font-semibold">{gw.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Formulaire Contextuel */}
              <div className="p-4 bg-[#05070B] border border-white/[0.08] rounded-2xl space-y-3">
                {gateway !== "stripe" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                      <span>Numéro Mobile Money ({gatewayName})</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Push USSD Instantané</span>
                    </label>

                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-[#0D111A] border border-white/10 text-white rounded-xl px-2.5 py-2.5 text-xs outline-none focus:border-emerald-500 min-h-[44px]"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} ({c.country})
                          </option>
                        ))}
                      </select>

                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="77 123 45 67"
                        className="flex-1 bg-[#0D111A] border border-white/10 text-white rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none focus:border-emerald-500 min-h-[44px]"
                        required
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Une notification de débit sera envoyée directement sur votre téléphone.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                      <span>Carte bancaire (Visa / Mastercard via Stripe)</span>
                      <span className="text-[10px] text-slate-400 font-mono">Chiffrement 256-bit</span>
                    </label>

                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Numéro de carte"
                      className="w-full bg-[#0D111A] border border-white/10 text-white rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none focus:border-emerald-500 min-h-[44px]"
                      required
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="bg-[#0D111A] border border-white/10 text-white rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none focus:border-emerald-500 min-h-[44px]"
                        required
                      />
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="bg-[#0D111A] border border-white/10 text-white rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none focus:border-emerald-500 min-h-[44px]"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Récapitulatif Total & Bouton Payer */}
              <div className="pt-2 border-t border-white/[0.08] space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 font-mono uppercase">Montant Total à régler :</span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                      {totalPrice.toLocaleString()} FCFA
                    </span>
                    {orderBump && (
                      <p className="text-[10px] text-slate-400">
                        (Inclut l&apos;accès Pro + le Pack 10 Templates)
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold text-sm py-4 rounded-xl transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>
                        {processingPhase === 1 && "1/3 : Connexion sécurisée à " + gatewayName + "..."}
                        {processingPhase === 2 && "2/3 : Envoi du push USSD / Validation 3DS..."}
                        {processingPhase === 3 && "3/3 : Déblocage immédiat de la clé PRO..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Payer {totalPrice.toLocaleString()} FCFA avec {gatewayName}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Lien vers saisie manuelle de clé de licence */}
              {onOpenLicenseModal && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLicenseModal();
                    }}
                    className="text-xs text-slate-400 hover:text-emerald-400 underline transition inline-flex items-center gap-1.5 min-h-[40px]"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Déjà une clé de licence ? Entrez-la pour débloquer</span>
                  </button>
                </div>
              )}
            </form>
          </>
        ) : (
          /* Écran de Succès et Célébration */
          <div className="text-center py-4 sm:py-6 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Icône de fête */}
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-2xl shadow-emerald-500/30">
              🎉
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-widest">
                TRANSACTION CONFIRMÉE • PRO DÉBLOQUÉ
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Félicitations, vous êtes PRO !
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Votre paiement de <strong>{totalPrice.toLocaleString()} FCFA</strong> via <strong>{gatewayName}</strong> a été validé.
              </p>
            </div>

            {/* Carte de la Clé de Licence PRO */}
            <div className="bg-[#05070B] border-2 border-emerald-500/40 p-5 rounded-2xl max-w-md mx-auto space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Votre Clé de Licence PRO
                </span>
                <span className="text-emerald-400 font-bold font-mono">À VIE</span>
              </div>

              <div className="bg-black/60 border border-white/10 p-3 rounded-xl flex items-center justify-between gap-2">
                <code className="text-sm sm:text-base font-mono font-extrabold text-emerald-300 tracking-wider select-all break-all">
                  {generatedKey}
                </code>

                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black p-2 rounded-lg font-bold text-xs flex items-center gap-1 transition shrink-0 min-h-[36px]"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? "Copié !" : "Copier"}</span>
                </button>
              </div>

              {orderBump && (
                <p className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg font-medium">
                  ✨ Le Pack de 10 Templates de Landing Pages a également été crédité sur votre compte.
                </p>
              )}
            </div>

            {/* Bouton d'action final */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleActivateAndClose}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm px-8 py-4 rounded-xl transition shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 mx-auto cursor-pointer min-h-[48px]"
              >
                <span>Activer mon Dashboard PRO</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
