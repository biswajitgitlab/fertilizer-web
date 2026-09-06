import React from 'react';
import { Sprout, X, Trash2, ChevronDown, Sparkles } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  onClear?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onClear }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-teal-950 text-white px-4 py-3 sm:px-4.5 sm:py-3.5 border-b border-emerald-800/40 shadow-sm relative select-none">
      {/* Mobile Drag Indicator Bar */}
      <div className="w-12 h-1 bg-white/25 rounded-full mx-auto mb-2.5 sm:hidden" />

      <div className="flex items-center justify-between">
        {/* Left: Avatar & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-emerald-500 p-0.5 shadow-md shadow-emerald-500/20">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            {/* Breathing Online Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 duration-1000" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black tracking-tight text-white truncate">
                KrishiMitra AI
              </h3>
              <span className="inline-flex items-center gap-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                PRO
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/90 font-medium truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Agronomist & Dosage Specialist
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="p-2 hover:bg-white/10 active:bg-white/15 text-emerald-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Clear Chat History"
              aria-label="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Minimize / Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 active:bg-white/15 text-emerald-300 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Close Assistant"
            aria-label="Close Assistant"
          >
            <ChevronDown className="w-5 h-5 sm:hidden" />
            <X className="w-4 h-4 hidden sm:block" />
          </button>
        </div>
      </div>
    </div>
  );
};
