import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { HeroCarousel } from './HeroCarousel';
import { DynamicCouponOfferBanner } from '../common/DynamicCouponOfferBanner';

export const ParallaxHero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  
  // Parallax Scroll calculation
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Multi-layer parallax depths
  const bgMeshY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const glowLightsY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const promptOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <section 
      ref={heroRef} 
      id="hero"
      className="w-full pt-4 sm:pt-8 pb-10 sm:pb-14 relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-white min-h-[70vh] sm:min-h-[85vh] flex flex-col justify-between"
    >
      {/* ── Layer 1: Background Radial Mesh (translates at 25% speed) ── */}
      <motion.div 
        style={{ y: bgMeshY }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-950/80 to-slate-950 pointer-events-none"
      />

      {/* ── Layer 2: Multi-Layer Ambient Glow Lights (translates at 35% speed) ── */}
      <motion.div 
        style={{ y: glowLightsY }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-teal-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px]" />
      </motion.div>

      {/* ── Layer 4: Hero Content Carousel & Coupon Banner ── */}
      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-10 space-y-4 relative z-10 w-full my-auto">
        <HeroCarousel />
        <DynamicCouponOfferBanner />
      </div>

      {/* ── Layer 5: Scroll To Explore Pill Indicator ── */}
      <motion.div 
        style={{ opacity: promptOpacity }}
        className="relative z-20 flex flex-col items-center gap-2 pt-6 text-emerald-400"
      >
        <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl px-4 py-1.5 rounded-full shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-300">
            Scroll down to explore
          </span>
        </div>
        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-emerald-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};
