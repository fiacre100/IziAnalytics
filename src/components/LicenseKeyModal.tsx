"use client";

import React, { useState, useEffect } from "react";
import { ProLicense } from "@/types/analytics";
import { activateLicenseKey, validateLicenseKey } from "@/lib/storage";
import { X, KeyRound, Check, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

interface LicenseKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (license: ProLicense) => void;
}

export function LicenseKeyModal({ isOpen, onClose, onSuccess }: LicenseKeyModalProps) {
  const [keyValue, setKeyValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activatedLicense, setActivatedLicense] = useState<ProLicense | null>(null);

  useEffect(() => {
    if (isOpen) {
      setKeyValue("");
      setError(null);
      setIsSuccess(false);
      setActivatedLicense(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePaste = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          setKeyValue(text.trim());
          setError(null);
        }
      } catch {
        // Accès presse-papier non accordé
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyValue.trim()) {
      setError("Veuillez saisir votre clé de licence.");
      return;
    }

    const result = activateLicenseKey(keyValue.trim());
    if (result.success && result.license) {
      setIsSuccess(true);
      setActivatedLicense(result.license);
      onSuccess(result.license);
    } else {
      setError(result.error || "Clé de licence invalide.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Conteneur principal */}
      <div className="bg-[#0D111A] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 space-y-5 shadow-2xl relative animate-in slide-in-from-bottom-4 sm:fade-in duration-200">
        
        {/* Poignée mobile */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto sm:hidden mb-1"></div>

        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            {/* En-tête */}
            <div className="flex items-center gap-3 pr-8">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Activer une Clé PRO</h3>
                <p className="text-xs text-slate-400">Entrez votre clé pour débloquer toutes les fonctionnalités.</p>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-200">Format de clé attendu</label>
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="text-emerald-400 hover:underline font-mono text-[11px]"
                  >
                    Coller depuis le presse-papier
                  </button>
                </div>

                <input
                  type="text"
                  value={keyValue}
                  onChange={(e) => {
                    setKeyValue(e.target.value.toUpperCase());
                    if (error) setError(null);
                  }}
                  placeholder="IZI-PRO-XXXX-XXXX-2026"
                  className="w-full bg-[#05070B] border border-white/10 focus:border-emerald-500 text-emerald-400 placeholder-slate-500 rounded-xl px-4 py-3 text-sm font-mono tracking-wider outline-none transition min-h-[44px]"
                  required
                />

                <p className="text-[11px] text-slate-400">
                  Exemple : <code className="text-slate-300 font-mono">IZI-PRO-7A9B-44CF-2026</code>
                </p>
              </div>

              {/* Boutons d'action */}
              <div className="pt-2 border-t border-white/[0.08] flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto bg-[#05070B] hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 font-medium text-xs px-5 py-3 rounded-xl transition min-h-[44px]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Activer la licence</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Écran Succès */
          <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center text-2xl shadow-xl shadow-emerald-500/20">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Licence PRO Activée !</h3>
              <p className="text-xs text-slate-300">
                La clé <strong className="font-mono text-emerald-400">{activatedLicense?.key}</strong> a été enregistrée avec succès.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Accéder à mon Dashboard PRO</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
