import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronsLeftRight, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Sliders,
  TrendingUp,
  Leaf
} from 'lucide-react';

interface ComparisonScenario {
  id: string;
  cropName: string;
  title: string;
  badgeText: string;
  beforeImg: string;
  afterImg: string;
  beforeDesc: string;
  afterDesc: string;
  yieldGain: string;
  daysToResult: string;
  recommendedProduct: string;
  productLink: string;
}

const COMPARISON_SCENARIOS: ComparisonScenario[] = [
  {
    id: 'tomato-blight',
    cropName: 'Tomato Farm',
    title: 'Fungal Blight & Nutrient Deficiency Eradication',
    badgeText: 'Proven Field Trial • Karnal, Haryana',
    beforeImg: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1000&auto=format&fit=crop&q=80&sat=-50',
    afterImg: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1000&auto=format&fit=crop&q=80',
    beforeDesc: 'Severe leaf yellowing, early blight spots, low flower drop count.',
    afterDesc: 'Lush dark green foliage, 100% blight cure, 35% higher fruit set.',
    yieldGain: '+38% Harvest Yield',
    daysToResult: '10-14 Days',
    recommendedProduct: 'Saaf Fungicide + NPK 19:19:19',
    productLink: '/products?category=pesticides-insecticides'
  },
  {
    id: 'paddy-growth',
    cropName: 'Paddy / Rice Field',
    title: 'Bio-Organic Root Activation & Tillering Boost',
    badgeText: 'Pau Certified • Ludhiana, Punjab',
    beforeImg: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=1000&auto=format&fit=crop&q=80&sat=-60',
    afterImg: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=1000&auto=format&fit=crop&q=80',
    beforeDesc: 'Weak root system, pale tillers, nitrogen deficiency.',
    afterDesc: 'Deep root penetration, dense tiller formation, vibrant canopy.',
    yieldGain: '+42% Tiller Density',
    daysToResult: '12 Days',
    recommendedProduct: 'Bio-Vita Organic Growth Stimulant + Urea',
    productLink: '/products?category=organic-bio-fertilizers'
  },
  {
    id: 'cotton-pest',
    cropName: 'Cotton Crop',
    title: 'Pink Bollworm & Sucking Pest Eradication',
    badgeText: 'Field Tested • Bathinda, Punjab',
    beforeImg: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=1000&auto=format&fit=crop&q=80&sat=-40',
    afterImg: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=1000&auto=format&fit=crop&q=80',
    beforeDesc: 'Boll damage, thrips attack, stunted vegetative growth.',
    afterDesc: 'Clean boll formation, full canopy expansion, zero pest damage.',
    yieldGain: '+29% Premium Lint',
    daysToResult: '7 Days',
    recommendedProduct: 'Confidor Insecticide + Chelated Zinc',
    productLink: '/products?category=pesticides-insecticides'
  }
];

export const BeforeAfterComparisonSlider: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('tomato-blight');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeScenario = COMPARISON_SCENARIOS.find(s => s.id === activeScenarioId) || COMPARISON_SCENARIOS[0];

  // Calculate position from mouse or touch event
  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches.length > 0) {
      updateSliderPosition(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      updateSliderPosition(clientX);
    };

    const handleGlobalEnd = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalEnd);
      window.addEventListener('touchmove', handleGlobalMove);
      window.addEventListener('touchend', handleGlobalEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, updateSliderPosition]);

  return (
    <section id="proof" className="w-full py-12 sm:py-16 bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 text-white relative overflow-hidden transition-colors duration-300">
      {/* Background Ambient Glow Blobs */}
      <div className="absolute top-10 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-10 space-y-6 sm:space-y-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-emerald-500/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Visual Proof &amp; Real Field Results</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Interactive Crop Transformation Inspector
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              Drag the interactive slider handle or tap quick presets below to visually compare untreated crops vs fields treated with our bio-fertilizers and sprays.
            </p>
          </div>

          {/* Scenario Selector Tabs - Touch Friendly Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x max-w-full">
            {COMPARISON_SCENARIOS.map((scen) => (
              <button
                key={scen.id}
                onClick={() => {
                  setActiveScenarioId(scen.id);
                  setSliderPosition(50);
                }}
                className={`snap-start px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border shrink-0 ${
                  activeScenarioId === scen.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 font-black'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700/80'
                }`}
              >
                {scen.cropName}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Quick Buttons & Impact Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 shrink-0">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Presets:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSliderPosition(0)}
                className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-black transition-all ${
                  sliderPosition === 0 
                    ? 'bg-rose-500 text-white shadow-md' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Before (0%)
              </button>
              <button
                onClick={() => setSliderPosition(50)}
                className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-black transition-all ${
                  sliderPosition === 50 
                    ? 'bg-emerald-500 text-slate-950 shadow-md' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                50/50 Split
              </button>
              <button
                onClick={() => setSliderPosition(100)}
                className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-black transition-all ${
                  sliderPosition === 100 
                    ? 'bg-teal-400 text-slate-950 shadow-md' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                After (100%)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 overflow-x-auto scrollbar-none">
            <span className="flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shrink-0 text-[11px] sm:text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> {activeScenario.yieldGain}
            </span>
            <span className="flex items-center gap-1 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20 shrink-0 text-[11px] sm:text-xs">
              <Leaf className="w-3.5 h-3.5 text-teal-400" /> Results in {activeScenario.daysToResult}
            </span>
          </div>
        </div>

        {/* ── INTERACTIVE SPLIT COMPARISON CARD CONTAINER ── */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl select-none cursor-ew-resize group touch-none"
        >
          {/* 1. AFTER IMAGE (Base / Background layer) */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={activeScenario.afterImg} 
              alt={`${activeScenario.cropName} After Treatment`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* After Label Badge */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-2 max-w-[45%] sm:max-w-xs">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-400 block tracking-wider">AFTER</span>
                <span className="text-[10px] sm:text-xs font-bold text-white block truncate sm:whitespace-normal">{activeScenario.afterDesc}</span>
              </div>
            </div>
          </div>

          {/* 2. BEFORE IMAGE (Clipped Foreground Layer using clip-path for 60fps GPU acceleration) */}
          <div 
            className="absolute inset-0 w-full h-full will-change-[clip-path]"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
            }}
          >
            <img 
              src={activeScenario.beforeImg} 
              alt={`${activeScenario.cropName} Before Treatment`}
              className="w-full h-full object-cover filter contrast-125 brightness-90"
              loading="eager"
            />
            {/* Before Label Badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-slate-950/90 text-rose-300 border border-rose-500/40 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-2 max-w-[45%] sm:max-w-xs">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
              <div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-rose-400 block tracking-wider">BEFORE</span>
                <span className="text-[10px] sm:text-xs font-bold text-white block truncate sm:whitespace-normal">{activeScenario.beforeDesc}</span>
              </div>
            </div>
          </div>

          {/* 3. INTERACTIVE SLIDER DIVIDER LINE & HANDLE */}
          <div 
            className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Center Slider Knob Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-slate-950 border-2 border-emerald-400 rounded-full shadow-2xl flex items-center justify-center pointer-events-auto transform hover:scale-110 active:scale-95 transition-transform duration-150">
              <ChevronsLeftRight className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-pulse" />
              {/* Percentage Indicator Tag */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                {Math.round(sliderPosition)}%
              </div>
            </div>
          </div>

          {/* Drag instruction overlay */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-slate-950/80 text-slate-300 border border-slate-700/60 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-md shadow-lg pointer-events-none flex items-center gap-1.5 whitespace-nowrap">
            <ChevronsLeftRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Drag slider handle to compare</span>
          </div>
        </div>

        {/* Recommended Product CTA Box */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
              Recommended Solution
            </span>
            <h4 className="text-sm sm:text-base font-black text-white">
              Achieve These Results with {activeScenario.recommendedProduct}
            </h4>
            <p className="text-xs text-slate-300">
              Government-certified formulation tested across Indian soil zones with guaranteed 100% water solubility.
            </p>
          </div>

          <a
            href={activeScenario.productLink}
            className="w-full sm:w-auto shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-200"
          >
            <span>Order Recommended Inputs</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
