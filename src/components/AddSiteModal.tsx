"use client";

import React, { useState, useEffect } from "react";
import { Site } from "@/types/analytics";
import { generateTrackingId, sanitizeDomain, addStoredSite } from "@/lib/storage";
import { X, Globe, Copy, Check, Plus, Code2, Sparkles, ArrowRight } from "lucide-react";

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSiteCreated: (site: Site) => void;
}

export function AddSiteModal({ isOpen, onClose, onSiteCreated }: AddSiteModalProps) {
  const [siteName, setSiteName] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [currency, setCurrency] = useState("FCFA");
  const [trackingId, setTrackingId] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Régénère un tracking ID à l'ouverture de la modale
  useEffect(() => {
    if (isOpen) {
      setTrackingId(generateTrackingId());
      setSiteName("");
      setDomainInput("");
      setCurrency("FCFA");
      setError(null);
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sanitizedDomain = sanitizeDomain(domainInput);
  const snippet = `<script defer src="https://izianalytics.app/script.js" data-site="${trackingId}"></script>`;

  const handleCopySnippet = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim()) {
      setError("Veuillez renseigner le nom de votre SaaS ou site.");
      return;
    }
    if (!domainInput.trim() || !sanitizedDomain || sanitizedDomain.length < 3 || !sanitizedDomain.includes(".")) {
      setError("Veuillez renseigner un nom de domaine valide (ex: monsaas.com).");
      return;
    }

    try {
      const created = addStoredSite({
        name: siteName.trim(),
        domain: sanitizedDomain,
        currency,
        trackingId,
      });

      onSiteCreated(created);
      onClose();
    } catch {
      setError("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Conteneur Modale / Bottom-sheet */}
      <div className="bg-[#0D111A] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 space-y-5 shadow-2xl relative animate-in slide-in-from-bottom-4 sm:fade-in duration-200">
        
        {/* Poignée mobile */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto sm:hidden mb-2"></div>

        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ajouter un nouveau SaaS</h3>
              <p className="text-xs text-slate-400">Générez un script ultra-léger (&lt; 2 Ko) dédié à ce projet.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Erreur éventuelle */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom du SaaS */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 block">
              Nom du projet / SaaS <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: AfriStore, Dakar Pay, CalFood..."
              value={siteName}
              onChange={(e) => {
                setSiteName(e.target.value);
                if (error) setError(null);
              }}
              className="w-full bg-[#05070B] border border-white/10 focus:border-emerald-500/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-xs outline-none transition min-h-[44px]"
              required
            />
          </div>

          {/* Domaine & Devise */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 block">
                Nom de domaine <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: afristore.com ou app.mon-saas.co"
                value={domainInput}
                onChange={(e) => {
                  setDomainInput(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full bg-[#05070B] border border-white/10 focus:border-emerald-500/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-xs outline-none transition font-mono min-h-[44px]"
                required
              />
              {sanitizedDomain && sanitizedDomain !== domainInput && (
                <p className="text-[10px] text-slate-400 font-mono">
                  Nettoyé : <span className="text-emerald-400">{sanitizedDomain}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 block">
                Devise
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#05070B] border border-white/10 text-white rounded-xl px-3 py-3 text-xs outline-none focus:border-emerald-500/50 min-h-[44px]"
              >
                <option value="FCFA">FCFA (XOF)</option>
                <option value="EUR">Euros (€)</option>
                <option value="USD">Dollars ($)</option>
              </select>
            </div>
          </div>

          {/* Tracking ID & Snippet Preview */}
          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                Script de tracking auto-généré
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                ID : <strong className="text-emerald-400">{trackingId}</strong>
              </span>
            </div>

            <div className="bg-[#05070B] border border-white/10 rounded-xl p-3 relative group">
              <pre className="text-[11px] font-mono text-emerald-300/90 whitespace-pre-wrap break-all select-all">
                {snippet}
              </pre>

              <button
                type="button"
                onClick={handleCopySnippet}
                className="mt-2 w-full sm:w-auto sm:absolute sm:top-2.5 sm:right-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center justify-center gap-1.5 transition min-h-[36px]"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copier le script</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ajoutez simplement ce script dans le <code className="text-emerald-400 font-mono">&lt;head&gt;</code> de votre site. Aucun cookie ni bannière RGPD requis.
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="pt-3 border-t border-white/[0.08] flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
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
              <Plus className="w-4 h-4" />
              <span>Créer et activer le SaaS</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
