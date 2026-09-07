import React, { useState, useRef, useEffect } from "react";
import { User, ExternalLink, Globe } from "lucide-react";

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
      {/* Profile Button right below Language button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-xl bg-white/95 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all flex items-center justify-center cursor-pointer active:scale-95 group"
        title="Developer Portfolios"
        aria-label="Profile Portfolios"
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <User className="w-4 h-4 stroke-[2.2]" />
        </div>
      </button>

      {/* Popover Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
          <div className="px-2.5 py-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-100 mb-1 flex items-center justify-between">
            <span>Portfolios</span>
            <Globe className="w-3 h-3 text-emerald-500" />
          </div>

          <a
            href="https://mhmahin.rf.gd/?i=1"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full px-3 py-2 rounded-xl text-xs font-extrabold text-slate-800 hover:text-emerald-950 hover:bg-emerald-50/90 transition-all flex items-center justify-between group cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:animate-ping"></span>
              <span>Portfolio¹</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
          </a>

          <a
            href="https://mhxmahin.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full px-3 py-2 rounded-xl text-xs font-extrabold text-slate-800 hover:text-emerald-950 hover:bg-emerald-50/90 transition-all flex items-center justify-between group cursor-pointer mt-0.5"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 group-hover:animate-ping"></span>
              <span>Portfolio²</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
          </a>
        </div>
      )}
    </div>
  );
}
