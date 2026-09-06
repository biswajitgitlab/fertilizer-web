import React from 'react';

interface QuickRepliesProps {
  onSelect: (query: string) => void;
  disabled?: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ onSelect, disabled = false }) => {
  const options = [
    "🌾 Paddy Fertilizer Dose",
    "🐛 Cotton Whitefly Pest Control",
    "🍃 Herbicide for Weeds",
    "📦 Track Order Status",
    "👨‍🌾 Talk to Human Expert"
  ];

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 px-3 no-scrollbar scroll-smooth">
      {options.map((opt, i) => (
        <button
          key={i}
          disabled={disabled}
          onClick={() => onSelect(opt)}
          className="shrink-0 text-[11px] sm:text-xs font-semibold bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 dark:hover:bg-emerald-900/80 border border-emerald-200/80 dark:border-emerald-700/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-3 py-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
        >
          {opt}
        </button>
      ))}
    </div>
  );
};
