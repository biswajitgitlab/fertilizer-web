import React from 'react';
import { motion } from 'motion/react';
import { Sprout, RefreshCw, Cpu } from 'lucide-react';
import { useSiteSettingsStore } from '../../store/siteSettingsStore';

interface LoaderProps {
  text?: string;
  subtext?: string;
  fullScreen?: boolean;
  variant?: 'fullscreen' | 'card' | 'table' | 'inline';
}

export const Loader: React.FC<LoaderProps> = ({
  text,
  subtext,
  fullScreen = false,
  variant = 'card'
}) => {
  const { appName } = useSiteSettingsStore();
  const title = text || `Loading ${appName}...`;
  const subtitle = subtext || 'Synchronizing real-time agricultural data';

  const isFullscreen = fullScreen || variant === 'fullscreen';

  const spinnerGraphic = (
    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
      {/* Outer Orbiting Gradient Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 border-r-teal-400 border-b-cyan-500"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      />

      {/* Inner Counter-Rotating Pulse Ring */}
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-transparent border-t-emerald-400/50 border-l-emerald-300"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
      />

      {/* Glowing Backdrop Ambient Light */}
      <div className="absolute inset-3 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-full blur-md animate-pulse" />

      {/* Center Icon Badge */}
      <div className="relative z-10 w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
        <motion.div
          animate={{ scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Sprout className="w-5 h-5 text-white" />
        </motion.div>
      </div>
    </div>
  );

  const loaderBody = (
    <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-sm mx-auto">
      {spinnerGraphic}

      <div className="space-y-1">
        <h4 className="text-sm font-black tracking-wide text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <span>{title}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {subtitle}
        </p>
      </div>

      {/* Micro-Progress Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-widest">
        <Cpu className="w-3 h-3 animate-spin text-emerald-500" />
        <span>Processing</span>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full">
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 animate-pulse" />
          {loaderBody}
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="py-12 px-4 flex items-center justify-center w-full">
        {loaderBody}
      </div>
    );
  }

  return loaderBody;
};
