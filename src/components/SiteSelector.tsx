"use client";

import React, { useState, useRef, useEffect } from "react";
import { Site } from "@/types/analytics";
import { ChevronDown, Plus, Check, Copy, ExternalLink, Globe } from "lucide-react";

interface SiteSelectorProps {
  activeSite: Site;
  sites: Site[];
  onSelectSite: (site: Site) => void;
  onOpenAddModal: () => void;
  className?: string;
}

export function SiteSelector({
  activeSite,
  sites,
  onSelectSite,
  onOpenAddModal,
  className = "",
}: SiteSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown en cliquant à l'extérieur ou via la touche Échap
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyTrackingId = (e: React.MouseEvent, trackingId: string) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(trackingId);
      setCopiedId(trackingId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bouton Trigger (Visible sur desktop ET mobile) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-2 bg-[#0E131F] hover:bg-[#151D2F] border border-white/[0.08] hover:border-white/20 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs transition cursor-pointer min-h-[38px] sm:min-h-[42px] max-w-[200px] sm:max-w-xs text-left"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>

        <div className="flex flex-col overflow-hidden">
          <span className="font-bold text-slate-100 truncate text-[11px] sm:text-xs leading-tight">
            {activeSite.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono truncate hidden xs:inline sm:inline">
            {activeSite.domain}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 ml-auto shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-emerald-400" : ""
          }`}
        />
      </button>

      {/* Menu Déroulant */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 sm:w-80 bg-[#0D111A] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 p-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* En-tête */}
          <div className="px-3 py-1.5 flex items-center justify-between border-b border-white/[0.06] text-[11px]">
            <span className="font-semibold text-slate-400 uppercase tracking-wider">
              Mes SaaS ({sites.length})
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">Actif : {activeSite.currency}</span>
          </div>

          {/* Liste des sites */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-0.5">
            {sites.map((site) => {
              const isActive = site.id === activeSite.id;
              const isCopied = copiedId === site.trackingId;

              return (
                <div
                  key={site.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onSelectSite(site);
                    setIsOpen(false);
                  }}
                  className={`group flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer min-h-[44px] ${
                    isActive
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-[#05070B]/60 border-white/[0.04] hover:bg-white/[0.04] hover:border-white/10 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                        isActive
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-white/[0.05] text-slate-400"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white truncate">
                          {site.name}
                        </span>
                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        {site.domain}
                      </p>
                    </div>
                  </div>

                  {/* Actions Rapides */}
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      title="Copier le Tracking ID"
                      onClick={(e) => handleCopyTrackingId(e, site.trackingId)}
                      className={`p-1.5 rounded-lg border text-[10px] font-mono flex items-center gap-1 transition ${
                        isCopied
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span className="hidden sm:inline">Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="hidden sm:inline">ID</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bouton Ajouter un site */}
          <div className="pt-1 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenAddModal();
              }}
              className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ajouter un site</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
