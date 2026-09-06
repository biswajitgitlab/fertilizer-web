import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { ArrowUp, Sprout, Sparkles, Layers, Star, ShoppingBag, Stethoscope } from 'lucide-react';

export const FloatingScrollDock: React.FC = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const unsubscribeY = scrollY.on('change', (latest) => {
      setIsVisible(latest > 300);
    });

    const unsubscribeProgress = scrollYProgress.on('change', (latest) => {
      setScrollPercent(Math.round(latest * 100));
    });

    // Detect active section based on scroll position
    const handleScroll = () => {
      const sections = ['hero', 'categories', 'featured', 'how-it-works', 'reviews'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      unsubscribeY();
      unsubscribeProgress();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollY, scrollYProgress]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'categories', label: 'Categories', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'featured', label: 'Fertilizers', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'how-it-works', label: 'Precision Tech', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'reviews', label: 'Stories', icon: <Star className="w-3.5 h-3.5" /> }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-1.5 p-1.5 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl text-white shadow-emerald-950/40"
        >
          {/* Quick jump tabs (Mobile horizontal touch scrollable, desktop full pills) */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[65vw] sm:max-w-none scrollbar-none px-1 py-0.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span className="text-[11px] sm:text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-white/20 my-auto mx-0.5 shrink-0" />

          {/* Quick AI Diagnosis Shortcut */}
          <button
            onClick={() => {
              const el = document.getElementById('how-it-works') || document.getElementById('ai-clinic');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1 sm:gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] sm:text-xs">AI Clinic</span>
          </button>

          {/* Scroll to top button with circular progress indicator */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="relative w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer shrink-0 ml-0.5"
            title={`Scrolled ${scrollPercent}% - Click to top`}
          >
            {/* SVG Circular Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-100"
                strokeDasharray={`${scrollPercent}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <ArrowUp className="w-3.5 h-3.5 text-emerald-300" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
