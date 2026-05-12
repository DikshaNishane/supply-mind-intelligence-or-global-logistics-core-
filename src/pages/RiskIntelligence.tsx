import TopBar from '../components/layout/TopBar';
import { riskEvents, radarData, routes } from '../lib/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { useSimulation } from '../hooks/useSimulation';
import { 
  AlertTriangle, 
  CloudLightning, 
  Globe2, 
  Package, 
  Fuel, 
  Users, 
  Shield, 
  Wifi,
  MapPin,
  TrendingDown,
  Brain,
  Zap,
  Activity
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  Tooltip 
} from 'recharts';

const typeIcons = {
  weather: CloudLightning,
  geopolitical: Globe2,
  port_congestion: Package,
  supplier_failure: Shield,
  fuel_spike: Fuel,
  labor_strike: Users,
  cyber_attack: Wifi,
};

const severityConfig = {
  low: { color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", dot: "bg-cyan-400", bar: "bg-cyan-400" },
  medium: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400", bar: "bg-amber-400" },
  high: { color: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-400", bar: "bg-orange-400" },
  critical: { color: "bg-red-500/10 text-red-500 border-red-500/20", dot: "bg-red-500", bar: "bg-red-500" },
};

const congestionConfig: Record<string, string> = {
  Low: "bg-green-500",
  Moderate: "bg-amber-400",
  High: "bg-orange-400",
  Critical: "bg-red-500"
};

const routeRiskConfig: Record<string, string> = {
  low: "text-green-500",
  medium: "text-amber-400",
  high: "text-orange-400",
  critical: "text-red-500"
};

const radarDataFormatted = (radarData || []).map(d => ({
  subject: d?.subject || 'N/A',
  A: d?.value || 0
}));

export default function RiskIntelligence() {
  const { state: simState } = useSimulation();
  
  const criticalCount = (riskEvents || []).filter(r => r?.severity === "critical").length + (simState.scenario !== 'normal' ? 2 : 0);
  const totalImpact = (riskEvents || []).reduce((acc, r) => acc + (r?.estimated_impact_usd || 0), 0) * (1 + simState.threatLevel / 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#020c14] text-[#e0f7fa] selection:bg-cyan-500/30">
      <TopBar
        title="AI Risk Intelligence"
        subtitle="AI-powered early warning system. Global threat detection & route risk scoring."
      />

      <div className="p-6 space-y-6 pb-20">
        {/* Summary strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Threats", value: (riskEvents || []).length, color: "text-red-500", bg: "bg-red-500/5", border: "border-red-500/20" },
            { label: "Critical Alerts", value: criticalCount, color: "text-red-500", bg: "bg-red-500/5", border: "border-red-500/20" },
            { label: "Affected Routes", value: 32, color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/20" },
            { label: "Est. Impact", value: `$${((totalImpact || 0) / 1000000).toFixed(1)}M`, color: "text-cyan-400", bg: "bg-cyan-500/5", border: "border-cyan-500/20" },
          ].map((item, idx) => (
            <motion.div 
              key={item.label}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`${item.bg} border ${item.border} rounded-xl p-6 backdrop-blur-sm relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield className="w-12 h-12" />
              </div>
              <p className="text-[10px] font-black text-[#64748b] mb-1 uppercase tracking-[0.2em]">{item.label}</p>
              <p className={`text-4xl font-bold tracking-tighter ${item.color}`}>{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Risk Events Feed */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black text-[#64748b] uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              Live Threat Feed
            </h3>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 h-[calc(100vh-340px)] overflow-y-auto pr-2 custom-scrollbar"
            >
              <AnimatePresence mode="popLayout">
                {(riskEvents || []).map((risk, idx) => {
                  if (!risk) return null;
                  const Icon = (risk?.type && typeIcons[(risk.type as keyof typeof typeIcons)]) ? typeIcons[risk.type as keyof typeof typeIcons] : AlertTriangle;
                  const sc = severityConfig[(risk?.severity as keyof typeof severityConfig) || 'medium'] || severityConfig.medium;
                  return (
                    <motion.div 
                      key={risk?.id || idx} 
                      variants={itemVariants}
                      layout
                      className="bg-[#010c14] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all shadow-xl group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-20" style={{ color: sc?.dot?.replace('bg-', '') }} />
                      
                      <div className="flex items-start gap-5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sc?.color}`}>
                          <motion.div
                            animate={risk?.severity === 'critical' || risk?.severity === 'high' ? {
                              scale: [1, 1.1, 1],
                              rotate: [0, -5, 5, 0]
                            } : {}}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <h4 className="font-bold text-sm text-white tracking-tight">{risk?.title || 'Unknown Threat'}</h4>
                            <div className={`px-2 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${sc?.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc?.dot} animate-pulse`} />
                              {risk?.severity || 'medium'}
                            </div>
                          </div>
                          
                          <p className="text-[11px] text-[#94a3b8] mb-4 leading-relaxed line-clamp-2">
                            {risk?.description || 'No description available.'}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-red-500/60" />
                              <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-wider truncate">{risk?.region || 'Global'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="w-3 h-3 text-cyan-500/60" />
                              <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-wider">Routes: <span className="text-white">4</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingDown className="w-3 h-3 text-red-500/60" />
                              <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-wider">Impact: <span className="text-red-500">${((risk?.estimated_impact_usd || 0) / 1000000).toFixed(1)}M</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                              <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-wider">AI Prob: <span className="text-amber-400">{((risk?.probability || 0) * 100).toFixed(0)}%</span></span>
                            </div>
                          </div>

                          {/* Confidence Bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em]">
                              <span className="text-[#64748b]">Neural Confidence Matrix</span>
                              <span className="text-white">{((risk?.probability || 0) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-[2px]">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(risk?.probability || 0) * 100}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className={`h-full ${sc?.bar} rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]`} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Panels */}
          <div className="space-y-6">
            {/* 2026 AI Model Training Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#010c14] border border-cyan-500/10 rounded-xl p-6 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-cyan-500/5 animate-pulse pointer-events-none" />
              <div className="relative">
                <h3 className="text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Predictive Features (v2.6)
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Autonomous Route Opt.", weight: "Critical", impact: "Safe Pathing", status: "Active" },
                    { name: "War-Risk Premiums", weight: "High", impact: "+500%", status: "Active" },
                    { name: "Naval Escort Sync", weight: "Critical", impact: "-40% Delay", status: "Enabled" },
                    { name: "Hormuz Ripple Effect", weight: "High", impact: "+25d Congest.", status: "Tracking" },
                  ].map((f) => (
                    <div key={f.name} className="flex flex-col gap-1 p-2 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-white uppercase tracking-tight">{f.name}</span>
                        <span className="text-[8px] font-mono font-bold text-[#00f2ff] px-1.5 py-0.5 rounded bg-[#00f2ff10]">{f.status}</span>
                      </div>
                      <div className="flex justify-between items-center text-[8px] uppercase font-bold">
                        <span className="text-white/40">Weight: <span className="text-white/60">{f.weight}</span></span>
                        <span className="text-cyan-400/80">Impact: {f.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Risk Radar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#010c14] border border-white/5 rounded-xl p-6 shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Wifi className="w-12 h-12" />
              </div>
              <h3 className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.3em] mb-8">Risk Category Radar</h3>
              <div className="h-[200px] w-full relative">
                <div className="absolute inset-0 bg-red-500/5 rounded-full blur-3xl opacity-20" />
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarDataFormatted}>
                    <PolarGrid stroke="#1e293b" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#64748b", fontWeight: 700 }} />
                    <Radar 
                      name="Risk Score" 
                      dataKey="A" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.4} 
                      strokeWidth={2}
                      isAnimationActive={true}
                      animationDuration={2000}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Route Congestion */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#010c14] border border-white/5 rounded-xl p-6 shadow-2xl overflow-hidden"
            >
              <h3 className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.3em] mb-6">Route Congestion Index</h3>
              <div className="space-y-5">
                {(routes || []).slice(0, 7).map((r, idx) => (
                  <div key={r?.id || idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white uppercase tracking-tight">{r?.name?.split(' (')[0] || 'Unknown'}</span>
                      <span className={`text-[9px] font-black uppercase tracking-wider ${routeRiskConfig[r?.congestion_level?.toLowerCase() || 'low'] || 'text-cyan-400'}`}>
                        {r?.congestion_level || 'Low'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: r?.congestion_level === "Critical" ? "95%" : r?.congestion_level === "High" ? "75%" : r?.congestion_level === "Moderate" ? "50%" : "25%" }}
                        transition={{ duration: 1, delay: 0.2 + idx * 0.05 }}
                        className={`h-full rounded-full ${congestionConfig[r?.congestion_level || 'Low'] || 'bg-cyan-500'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Supplier Risk */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#010c14] border border-white/5 rounded-xl p-6 shadow-2xl"
            >
              <h3 className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.3em] mb-6">Supplier Failure Probability</h3>
              <div className="space-y-5">
                {[
                  { name: "Fujian Semiconductors", prob: 0.91, region: "China" },
                  { name: "TSMC Secondary", prob: 0.34, region: "Taiwan" },
                  { name: "Maruti Auto Parts", prob: 0.28, region: "India" },
                  { name: "BASF Chemicals", prob: 0.19, region: "Germany" },
                  { name: "Vale Mining", prob: 0.12, region: "Brazil" },
                ].map((s, idx) => (
                  <div key={s.name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-white truncate uppercase tracking-tight">{s.name}</p>
                        <p className="text-[8px] text-[#64748b] uppercase font-black">{s.region}</p>
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${s.prob > 0.7 ? "text-red-500" : s.prob > 0.4 ? "text-amber-400" : "text-cyan-400"}`}>
                        {(s.prob * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.prob * 100}%` }}
                        transition={{ duration: 1.2, delay: 0.4 + idx * 0.05 }}
                        className={`h-full rounded-full ${s.prob > 0.7 ? "bg-red-500" : s.prob > 0.4 ? "bg-amber-400" : "bg-cyan-500"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
