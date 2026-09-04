import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  Leaf, 
  ShieldAlert, 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Zap, 
  Sparkles,
  Droplets,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface LifecycleStage {
  id: number;
  stageNumber: string;
  daysRange: string;
  title: string;
  subTitle: string;
  icon: React.ElementType;
  description: string;
  recommendedInputs: string[];
  yieldMetricLabel: string;
  yieldMetricValue: string;
  progressPercent: number;
  image: string;
  ctaText: string;
  ctaLink: string;
  accentColor: string;
  badgeBg: string;
}

const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    id: 1,
    stageNumber: '01',
    daysRange: 'Days 0 - 15',
    title: 'Seed Sowing & Root Foundation',
    subTitle: 'Soil Preparation & Early Sprout Activation',
    icon: Sprout,
    description: 'Ensure maximum germination rate and robust early root depth. Bio-activators condition soil pH and stimulate beneficial microbial flora.',
    recommendedInputs: ['Bio-Vita Organic Root Activator', 'Pusa Certified Seeds', 'Chelated Zinc EDTA'],
    yieldMetricLabel: 'Germination & Root Depth',
    yieldMetricValue: '+42% Faster Roots',
    progressPercent: 25,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    ctaText: 'Explore Seed & Soil Inputs',
    ctaLink: '/products?category=organic-bio-fertilizers',
    accentColor: 'from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  },
  {
    id: 2,
    stageNumber: '02',
    daysRange: 'Days 15 - 45',
    title: 'Vegetative Canopy & Tillering Boost',
    subTitle: 'Foliar NPK Spray & Chlorophyll Synthesis',
    icon: Leaf,
    description: 'Rapid leaf expansion and high tiller density. Water-soluble NPK 19:19:19 ensures uniform nutrient absorption without root burning.',
    recommendedInputs: ['NPK 19:19:19 Soluble Fertilizer', 'Plant Growth Promoter', 'Liquid Nitrogen Supplement'],
    yieldMetricLabel: 'Leaf Chlorophyll & Tiller Density',
    yieldMetricValue: '+38% Canopy Cover',
    progressPercent: 50,
    image: '/images/products/npk_19_19_19.png',
    ctaText: 'Shop Growth Solubles',
    ctaLink: '/products?category=chemical-fertilizers',
    accentColor: 'from-teal-500 to-cyan-500',
    badgeBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
  },
  {
    id: 3,
    stageNumber: '03',
    daysRange: 'Days 45 - 75',
    title: 'Flowering & Pest Shield Defense',
    subTitle: 'Fungal Blight & Sucking Pest Eradication',
    icon: ShieldAlert,
    description: 'Prevent flower drop and stem borer attacks. Targeted systemic fungicide and insecticide sprays protect developing bolls and pods.',
    recommendedInputs: ['Saaf Bio-Fungicide Spray', 'Confidor Insecticide', 'Boron Micronutrient'],
    yieldMetricLabel: 'Disease Cure & Fruit Retention',
    yieldMetricValue: '99.4% Blight Free',
    progressPercent: 75,
    image: '/images/products/saaf_fungicide.png',
    ctaText: 'View Protection Sprays',
    ctaLink: '/products?category=pesticides-insecticides',
    accentColor: 'from-amber-500 to-orange-500',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },
  {
    id: 4,
    stageNumber: '04',
    daysRange: 'Days 75 - 120',
    title: 'Grain Filling & Bumper Harvest',
    subTitle: 'Potassium Boost & High Grain Weight',
    icon: Trophy,
    description: 'Maximize test weight, grain shining, and harvest tonnage. Potassium Solubilizers mobilize nutrients into heavy pods and golden panicles.',
    recommendedInputs: ['NPK 0:0:50 Sulphate of Potash', 'Bio-Stimulant Grain Tonic', 'Crop Dryer Shield'],
    yieldMetricLabel: 'Final Grain Tonnage Gain',
    yieldMetricValue: '+32% Market Value',
    progressPercent: 100,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800',
    ctaText: 'Get Harvest Tonics',
    ctaLink: '/products',
    accentColor: 'from-emerald-500 to-yellow-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  }
];

export const LifecycleJourney: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<number>(1);

  const activeStage = LIFECYCLE_STAGES.find(s => s.id === activeStageId) || LIFECYCLE_STAGES[0];

  return (
    <section className="w-full py-16 sm:py-24 bg-emerald-50/80 dark:bg-emerald-950/90 text-slate-900 dark:text-emerald-50 transition-colors duration-300 relative overflow-hidden">
      
      {/* Subtle Background Mesh & Glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-10 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/20">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Precision Ag Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Sticky Precision Lifecycle Journey
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            Track your crop from seed germination to harvest. Select any stage to view tailored NPK schedules, disease prevention protocols, and verified yield boosts.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Interactive 4-Stage Vertical Timeline Cards (7 Cols on Desktop) */}
          <div className="lg:col-span-7 space-y-4 relative">
            {/* Timeline Connecting Bar */}
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-slate-200 dark:bg-emerald-900/60 hidden sm:block pointer-events-none" />

            {LIFECYCLE_STAGES.map((stage) => {
              const Icon = stage.icon;
              const isActive = activeStageId === stage.id;

              return (
                <motion.div
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  whileHover={{ x: 4 }}
                  className={`relative p-5 sm:p-6 rounded-3xl cursor-pointer transition-all duration-300 border backdrop-blur-xl ${
                    isActive
                      ? 'bg-white dark:bg-slate-900/90 border-emerald-500 shadow-2xl ring-2 ring-emerald-500/30'
                      : 'bg-white/60 dark:bg-slate-900/50 border-slate-200/80 dark:border-emerald-800/30 hover:border-emerald-400/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Stage Number & Icon Badge */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-md transition-colors ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${stage.badgeBg}`}>
                          Stage {stage.stageNumber} • {stage.daysRange}
                        </span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" /> {stage.yieldMetricValue}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white pt-1">
                        {stage.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {stage.subTitle}
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 pt-2 leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Recommended Products Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-3">
                        {stage.recommendedInputs.map((input, i) => (
                          <span 
                            key={i} 
                            className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            {input}
                          </span>
                        ))}
                      </div>

                      {/* Mobile Inline CTA for small viewports */}
                      <div className="block lg:hidden pt-4">
                        <Link
                          to={stage.ctaLink}
                          className="inline-flex items-center gap-2 text-xs font-black bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl shadow-md"
                        >
                          <span>{stage.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Side: STICKY Preview Card (5 Cols on Desktop) */}
          <div className="lg:col-span-5 hidden lg:block sticky top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="bg-slate-900 text-white rounded-3xl border-2 border-emerald-500/40 p-6 shadow-2xl space-y-6 backdrop-blur-xl relative overflow-hidden"
              >
                {/* Image & Stage Header Overlay */}
                <div className="relative h-56 rounded-2xl overflow-hidden border border-emerald-500/30">
                  <img 
                    src={activeStage.image} 
                    alt={activeStage.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Floating Metric Badge */}
                  <div className="absolute top-4 left-4 bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{activeStage.daysRange}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">ACTIVE STAGE PREVIEW</span>
                    <h4 className="text-lg font-black text-white">{activeStage.title}</h4>
                  </div>
                </div>

                {/* Progress Fill Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Lifecycle Growth Progress</span>
                    <span className="text-emerald-400 font-mono font-black">{activeStage.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${activeStage.progressPercent}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${activeStage.accentColor}`}
                    />
                  </div>
                </div>

                {/* Metric Impact Highlight */}
                <div className="bg-slate-950/80 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black block">{activeStage.yieldMetricLabel}</span>
                    <span className="text-lg font-black text-emerald-400">{activeStage.yieldMetricValue}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>

                {/* Direct Action CTA */}
                <Link
                  to={activeStage.ctaLink}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all duration-200 group"
                >
                  <span>{activeStage.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
