import React, { useState } from 'react';
import { 
  Scan, 
  Calculator, 
  ArrowRight, 
  Cpu,
  Sparkles,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const InteractiveFeatureGrid: React.FC = () => {
  // Interactive State for AI Scanner simulation
  const [activeScanCrop, setActiveScanCrop] = useState<'leaf-blight' | 'healthy-wheat' | 'root-rot'>('leaf-blight');
  const [isScanning, setIsScanning] = useState(false);

  // Interactive State for Soil NPK Calculator
  const [nitrogen, setNitrogen] = useState(40);
  const [phosphorus, setPhosphorus] = useState(25);
  const [potassium, setPotassium] = useState(35);

  const handleRunScan = (crop: 'leaf-blight' | 'healthy-wheat' | 'root-rot') => {
    setActiveScanCrop(crop);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const setNpkPreset = (n: number, p: number, k: number) => {
    setNitrogen(n);
    setPhosphorus(p);
    setPotassium(k);
  };

  return (
    <section id="engine" className="w-full py-10 sm:py-20 bg-gradient-to-b from-emerald-50 via-green-50/50 to-emerald-100/70 dark:from-emerald-950 dark:via-slate-900 dark:to-emerald-950 text-slate-900 dark:text-emerald-50 transition-colors duration-300 relative overflow-hidden">
      
      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-10 space-y-6 sm:space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
            <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>AI-Powered Precision Ag</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Next-Gen Agricultural Intelligence Engine
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 font-medium px-2">
            Instant AI plant diagnosis, dynamic NPK soil formulation, and scientific crop guidance engineered for mobile access.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Card 1: Interactive AI Crop Doctor Diagnostic Simulator */}
          <div className="md:col-span-7 bg-white dark:bg-slate-900/90 rounded-3xl border border-emerald-200/80 dark:border-emerald-800/40 p-4 sm:p-8 shadow-xl space-y-4 sm:space-y-5 backdrop-blur-xl relative overflow-hidden group">
            
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                  <Scan className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">AI DIAGNOSTIC SCANNER</span>
                  <h3 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">AI Crop Disease Doctor</h3>
                </div>
              </div>

              <Link to="/diagnose" className="self-start xs:self-center inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/20 shrink-0 transition-colors">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Launch Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Interactive Image Preview with Scanner Beam */}
            <div className="relative h-48 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-emerald-800/60 bg-slate-950">
              <img 
                src={
                  activeScanCrop === 'leaf-blight' 
                    ? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80' 
                    : activeScanCrop === 'healthy-wheat' 
                    ? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=800&auto=format&fit=crop&q=80'
                }
                alt="AI Scan Crop Sample"
                className={`w-full h-full object-cover transition-all duration-300 ${isScanning ? 'brightness-75 blur-[1px]' : 'brightness-100'}`}
              />

              {/* Laser Scanning Beam Line */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_15px_#10b981] animate-laser-scan z-20" />
              )}

              {/* AI Diagnostic Target Box Overlay */}
              <div className="absolute inset-3 sm:inset-8 border-2 border-dashed border-emerald-400/70 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between text-[8px] sm:text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded w-max backdrop-blur-md">
                  <span>[AI SCANNER ACTIVE]</span>
                </div>
                <div className="self-end text-[8px] sm:text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded backdrop-blur-md">
                  CONFIDENCE: 98.6%
                </div>
              </div>

              {/* Scan Results Card Overlay */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 bg-slate-950/90 border border-emerald-500/40 p-2.5 sm:p-3.5 rounded-xl text-white backdrop-blur-md z-10 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[8px] sm:text-[9px] text-emerald-400 font-extrabold uppercase block truncate">
                    {isScanning ? 'Analyzing Crop DNA...' : 'DIAGNOSIS COMPLETE'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-white block truncate">
                    {activeScanCrop === 'leaf-blight' 
                      ? 'Detected: Early Tomato Blight' 
                      : activeScanCrop === 'healthy-wheat'
                      ? 'Detected: Healthy Wheat Canopy'
                      : 'Detected: Paddy Stem Borer'}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-black px-2 py-1 rounded-lg bg-emerald-500 text-slate-950 shrink-0">
                  {activeScanCrop === 'leaf-blight' ? 'Saaf Rx' : activeScanCrop === 'healthy-wheat' ? 'Optimal' : 'Confidor Rx'}
                </span>
              </div>
            </div>

            {/* Mobile Touch Selector Buttons */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">Tap Sample Crop to Scan:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRunScan('leaf-blight')}
                  className={`px-2 py-2 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer text-center truncate ${
                    activeScanCrop === 'leaf-blight'
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  🍃 Leaf Blight
                </button>
                <button
                  type="button"
                  onClick={() => handleRunScan('healthy-wheat')}
                  className={`px-2 py-2 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer text-center truncate ${
                    activeScanCrop === 'healthy-wheat'
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  🌾 Wheat
                </button>
                <button
                  type="button"
                  onClick={() => handleRunScan('root-rot')}
                  className={`px-2 py-2 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer text-center truncate ${
                    activeScanCrop === 'root-rot'
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  🌱 Paddy Borer
                </button>
              </div>
            </div>

          </div>

          {/* Card 2: Interactive NPK Soil Nutrient Calculator */}
          <div className="md:col-span-5 bg-white dark:bg-slate-900/90 rounded-3xl border border-emerald-200/80 dark:border-emerald-800/40 p-4 sm:p-8 shadow-xl space-y-5 backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 shrink-0">
                  <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider">DYNAMIC NPK CALCULATOR</span>
                  <h3 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">Soil Nutrient Mixer</h3>
                </div>
              </div>

              {/* Quick Crop Presets for Mobile */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Quick Ratio Presets:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                  <button
                    type="button"
                    onClick={() => setNpkPreset(40, 25, 35)}
                    className="text-[10px] font-black bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                  >
                    19:19:19 Balanced
                  </button>
                  <button
                    type="button"
                    onClick={() => setNpkPreset(75, 20, 20)}
                    className="text-[10px] font-black bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                  >
                    High Nitrogen (Urea)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNpkPreset(20, 20, 70)}
                    className="text-[10px] font-black bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                  >
                    Potash Grain Boost
                  </button>
                </div>
              </div>

              {/* Touch-Friendly Slider Controls */}
              <div className="space-y-3 pt-1">
                
                {/* Nitrogen (N) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Nitrogen (N)
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black">{nitrogen} kg/acre</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={nitrogen} 
                    onChange={(e) => setNitrogen(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Phosphorus (P) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Phosphorus (P)
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-mono font-black">{phosphorus} kg/acre</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={phosphorus} 
                    onChange={(e) => setPhosphorus(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Potassium (K) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Potassium (K)
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono font-black">{potassium} kg/acre</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={potassium} 
                    onChange={(e) => setPotassium(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
                  />
                </div>

              </div>
            </div>

            {/* Mobile Responsive Calculated Recommendation Result */}
            <div className="bg-slate-950 text-white p-3.5 sm:p-4 rounded-2xl border border-emerald-500/30 space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span>Calculated Formula:</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">
                  {nitrogen}:{phosphorus}:{potassium} Ratio
                </span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-white">
                Recommended: {nitrogen > 50 ? 'NPK 19:19:19 Soluble Bags' : 'Organic Bio-Compost + Zinc EDTA'}
              </p>
              <Link 
                to="/products?category=chemical-fertilizers" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-black bg-emerald-500 text-slate-950 hover:bg-emerald-400 px-3.5 py-2 rounded-xl transition-all shadow-md mt-1"
              >
                <span>Add Formula to Cart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
