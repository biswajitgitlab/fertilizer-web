import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const GlobalPreloader: React.FC = () => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(25);

    const timer1 = setTimeout(() => setProgress(70), 90);
    const timer2 = setTimeout(() => setProgress(100), 220);
    const timer3 = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 420);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div
        className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 via-cyan-400 to-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.9)] transition-all duration-300 ease-out relative"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      >
        {/* Leading Glowing Particle Head */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee] animate-ping" />
      </div>
    </div>
  );
};
