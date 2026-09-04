import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Award,
  ShieldCheck
} from 'lucide-react';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  subValue: string;
  description: string;
  icon: React.ElementType;
  progressPercent: number;
  colSpan: string; // e.g. "md:col-span-6 lg:col-span-4"
  gradient: string;
  borderColor: string;
  accentColor: string;
}

const BENTO_METRICS: MetricCard[] = [
  {
    id: 'farmers',
    title: 'Verified Farmer Community',
    value: '50,000+',
    subValue: 'Active Growers Across 18 States',
    description: 'Empowering smallholders & commercial growers with direct factory prices and instant crop advisory.',
    icon: Users,
    progressPercent: 95,
    colSpan: 'md:col-span-6 lg:col-span-4',
    gradient: 'from-emerald-950 via-slate-900 to-emerald-950',
    borderColor: 'border-emerald-500/30',
    accentColor: 'text-emerald-400'
  },
  {
    id: 'savings',
    title: 'Total Farmer Cost Savings',
    value: '₹4.2 Cr+',
    subValue: 'Zero Middleman Commission Saved',
    description: 'Direct dispatch from licensed chemical & bio-fertilizer plants saves up to 35% on every acre.',
    icon: IndianRupee,
    progressPercent: 88,
    colSpan: 'md:col-span-6 lg:col-span-4',
    gradient: 'from-teal-950 via-slate-900 to-teal-950',
    borderColor: 'border-teal-500/30',
    accentColor: 'text-teal-400'
  },
  {
    id: 'yield',
    title: 'Average Yield Boost',
    value: '+35%',
    subValue: 'Proven in PAU & Field Trials',
    description: 'Balanced NPK nutrition and bio-stimulants boost tiller count, grain shining, and harvest weight.',
    icon: TrendingUp,
    progressPercent: 92,
    colSpan: 'md:col-span-12 lg:col-span-4',
    gradient: 'from-amber-950 via-slate-900 to-amber-950',
    borderColor: 'border-amber-500/30',
    accentColor: 'text-amber-400'
  },
  {
    id: 'pincodes',
    title: 'Doorstep Delivery Coverage',
    value: '15,000+',
    subValue: 'Pin Codes Served in 48-72 Hours',
    description: 'Robust logisitic network with real-time SMS tracking and cash-on-delivery options.',
    icon: MapPin,
    progressPercent: 98,
    colSpan: 'md:col-span-6 lg:col-span-6',
    gradient: 'from-slate-900 via-emerald-950 to-slate-900',
    borderColor: 'border-emerald-500/30',
    accentColor: 'text-emerald-300'
  },
  {
    id: 'ai-accuracy',
    title: 'AI Pest Scan Precision',
    value: '98.6%',
    subValue: 'Validated by ICAR Agronomists',
    description: 'Deep neural models analyze crop leaf symptoms to diagnose diseases in under 3 seconds.',
    icon: Sparkles,
    progressPercent: 98.6,
    colSpan: 'md:col-span-6 lg:col-span-6',
    gradient: 'from-emerald-950 via-slate-900 to-teal-950',
    borderColor: 'border-teal-500/40',
    accentColor: 'text-teal-300'
  }
];

export const BentoMetricCounters: React.FC = () => {
  return (
    <section className="w-full py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-white relative overflow-hidden transition-colors duration-300">
      {/* Background Radial Lights */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-10 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/20 backdrop-blur-md"
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Proven Real-World Impact</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white"
          >
            Scroll-Triggered Bento Metric Counters
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base text-slate-300 font-medium"
          >
            Verifiable statistics built on transparent field trials, government quality certifications, and direct-to-farm supply chain speed.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {BENTO_METRICS.map((metric, idx) => {
            const Icon = metric.icon;

            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 35, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className={`${metric.colSpan} bg-gradient-to-br ${metric.gradient} border ${metric.borderColor} rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group`}
              >
                {/* Glow Overlay on Hover */}
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      {metric.title}
                    </span>
                    <span className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${metric.accentColor} block font-mono`}>
                      {metric.value}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Subtitle & Description */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {metric.subValue}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {metric.description}
                  </p>
                </div>

                {/* Scroll-Triggered Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[10px] font-mono font-extrabold text-slate-400">
                    <span>Performance Target</span>
                    <span className={metric.accentColor}>{metric.progressPercent}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${metric.progressPercent}%` }}
                      viewport={{ once: false }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
                      className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 rounded-full shadow-[0_0_10px_#10b981]"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
