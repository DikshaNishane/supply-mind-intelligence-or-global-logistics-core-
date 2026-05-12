import TopBar from '../components/layout/TopBar';
import KPICard from '../components/dashboard/KPICard';
import WorldMap from '../components/dashboard/WorldMap';
import ShipmentTable from '../components/dashboard/ShipmentTable';
import ChokePointWidget from '../components/dashboard/ChokePointWidget';
import { 
  Ship, 
  Target, 
  AlertTriangle, 
  Brain, 
  Leaf, 
  Fuel, 
  Clock, 
  TrendingUp,
  Anchor,
  CloudLightning,
  Flame,
  Zap,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { kpiData, throughputData, carbonData, fuelPriceData } from '../lib/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { useSimulation } from '../hooks/useSimulation';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#020c14ee] border border-[#1a2b3b] p-3 rounded-lg shadow-xl backdrop-blur-sm">
        <p className="text-[10px] font-bold text-[#94a3b8] uppercase mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <p className="text-xs font-mono font-bold text-[#e0f7fa]">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CommandCenter() {
  const { state: simState, triggerScenario } = useSimulation();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-[#0b0e14] text-[#e0f7fa]"
    >
      <TopBar 
        title="Executive Command Center" 
        subtitle="NASA mission control but for logistics. Global supply chain tracking & real-time predictive analytics." 
      />
      
      <div className="flex-1 p-6 space-y-6 overflow-auto bg-dot-pattern">
        {/* Intelligence Status Cluster */}
        <div className="grid grid-cols-12 gap-6 mb-2">
          <div className="col-span-8 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'demand', label: 'Demand Surge', icon: TrendingUp },
              { id: 'hormuz_blockade', label: 'Hormuz Blockade', icon: ShieldCheck },
              { id: 'blockage', label: 'Port Blockage', icon: Anchor },
              { id: 'typhoon', label: 'Typhoon Strike', icon: CloudLightning },
            ].map((sim) => (
              <button
                key={sim.id}
                onClick={() => triggerScenario(sim.id)}
                className={cn(
                  "flex-1 min-w-[160px] bg-glass p-3 rounded-lg flex items-center justify-between group transition-all cursor-pointer border",
                  simState.scenario === sim.id ? "border-[#00f2ff] bg-[#00f2ff0a]" : "border-white/5 hover:border-[#00f2ff50]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg group-hover:bg-[#00f2ff10]", simState.scenario === sim.id ? "bg-[#00f2ff20]" : "bg-white/5")}>
                    <sim.icon className={cn("w-4 h-4", simState.scenario === sim.id ? "text-[#00f2ff]" : "text-[#94a3b8]")} />
                  </div>
                  <span className="text-xs font-bold text-[#e0f7fa] uppercase tracking-wider">{sim.label}</span>
                </div>
                <div className={cn("w-2 h-2 rounded-full border transition-all", 
                  simState.scenario === sim.id ? "border-[#00f2ff] bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]" : "border-white/20"
                )} />
              </button>
            ))}
          </div>

          <div className="col-span-4 bg-[#00f2ff08] border border-[#00f2ff20] rounded-xl p-4 flex items-center gap-4">
             <div className="p-3 bg-[#00f2ff15] rounded-full">
                <Brain className="w-6 h-6 text-[#00f2ff] animate-pulse" />
             </div>
             <div>
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Explainable AI Insight</p>
                <p className="text-[11px] text-[#94a3b8] leading-snug">
                   {simState.scenario === 'normal' 
                     ? "Neural Core stable. Monitoring 1,120 active nodes with 98.4% uptime. No critical deviations detected."
                     : simState.scenario === 'hormuz_blockade' 
                     ? "CRITICAL: Correlating Hormuz closure with 18% Brent crude spike. Predicted 12-day lag in Rotterdam FIFO queues."
                     : "Scenario active. Recalculating global ETA models. Rerouting protocols engaged for 14 trade lanes."
                   }
                </p>
             </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-4 gap-4 shrink-0">
          <KPICard 
            title="Global Risk Index" 
            value={simState.threatLevel.toFixed(1)} 
            unit="%"
            subtext="Real-time threat level" 
            trend="+12.4%" 
            trendDir={simState.threatLevel > 20 ? "up" : "neutral"} 
            icon={Activity} 
            color={simState.threatLevel > 40 ? "red" : "blue"} 
            glow={simState.threatLevel > 50}
          />
          <KPICard 
            title="On-Time Rate" 
            value={simState.scenario === 'normal' ? kpiData.onTimeRate : (kpiData.onTimeRate - (simState.threatLevel * 0.2)).toFixed(1)} 
            unit="%"
            subtext="Target: 85%" 
            trend="-4.2%" 
            trendDir="down" 
            icon={Target} 
            color="amber" 
          />
          <KPICard 
            title="Fuel cost index" 
            value={(kpiData.fuelCostM + (simState.threatLevel * 0.1)).toFixed(1)} 
            unit="$M"
            subtext="Market exposure" 
            trend="+11.4% shock" 
            trendDir="up" 
            icon={Fuel} 
            color="amber" 
          />
          <KPICard 
            title="Active Alerts" 
            value={simState.scenario === 'normal' ? 0 : simState.activeAlerts + Math.floor(simState.threatLevel / 10)} 
            subtext="Neural core detection" 
            trend="Live" 
            trendDir="neutral" 
            icon={ShieldCheck} 
            color={simState.scenario === 'normal' ? "blue" : "red"} 
          />
        </div>

        {/* Tactical Map */}
        <div className="bg-[#0b0e14] rounded-xl border border-white/10 relative overflow-hidden group min-h-[440px] mb-6">
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0b0e14cc] border border-[#00f2ff40] rounded-full backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">LIVE DIGITAL TWIN</span>
            </div>
          </div>
          
          <WorldMap />

          <div className="absolute bottom-4 right-4 bg-[#0b0e14cc] border border-white/10 rounded-lg p-3 w-40 backdrop-blur-md z-10">
            <h4 className="text-[10px] font-bold text-[#94a3b8] mb-2 uppercase tracking-widest text-center border-b border-white/10 pb-1">Vessel Status</h4>
            <div className="space-y-1.5">
              {[
                { label: 'In Transit', color: '#00f2ff' },
                { label: 'Delayed', color: '#f59e0b' },
                { label: 'Delivered', color: '#22c55e' },
                { label: 'At Risk', color: '#ff4b4b' },
                { label: 'Rerouted', color: '#a855f7' }
              ].map(status => (
                <div key={status.label} className="flex items-center gap-2 text-[10px]">
                  <div className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: status.color, color: status.color }}></div>
                  <span className="text-[#e0f7fa] opacity-80">{status.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-12 gap-6 shrink-0">
          <div className="col-span-8 space-y-6 flex flex-col">
            <div className="rounded-xl border border-[#1a2b3b] bg-[#010c14] p-5 flex flex-col h-[320px]">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#e0f7fa] flex items-center gap-2">
                  Throughput: Actual vs AI Predicted
                </h4>
                <span className="text-[10px] text-[#5e748d] font-mono uppercase tracking-widest">Last 7 months</span>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={throughputData}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2b3b" vertical={false} opacity={0.5} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#5e748d', fontSize: 10, fontWeight: 500 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#5e748d', fontSize: 10, fontWeight: 500 }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      name="Actual"
                      type="monotone" 
                      dataKey="throughput" 
                      stroke="#00e5ff" 
                      fill="url(#colorActual)" 
                      strokeWidth={2} 
                      dot={false}
                    />
                    <Area 
                      name="AI Predicted"
                      type="monotone" 
                      dataKey="target" 
                      stroke="#22c55e" 
                      strokeDasharray="4 4"
                      fill="url(#colorPredicted)" 
                      strokeWidth={2} 
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-1 bg-[#00e5ff] rounded-sm"></div>
                  <span className="text-[10px] font-mono text-[#5e748d] uppercase">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-1 bg-[#22c55e] border-t border-dashed rounded-sm"></div>
                  <span className="text-[10px] font-mono text-[#5e748d] uppercase">AI Predicted</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4 h-full">
            <ChokePointWidget />
          </div>
        </div>

        {/* Fuel Trend Chart */}
        <div className="rounded-xl border border-[#1a2b3b] bg-[#010c14] p-5 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#e0f7fa]">
              Brent Crude Fuel Price Trend ($/MT)
            </h4>
            <div className="flex items-center gap-2 bg-[#f59e0b15] border border-[#f59e0b30] px-2 py-0.5 rounded">
              <span className="text-[10px] font-mono font-bold text-[#f59e0b] tracking-tighter">$728/MT ↑18%</span>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fuelPriceData} margin={{ left: -20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2b3b" vertical opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5e748d', fontSize: 9 }}
                  tickFormatter={(val, i) => `W-${8-i}`}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5e748d', fontSize: 9 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020c14', border: '1px solid #1a2b3b', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '10px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="brent" 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }} 
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  label={({ x, y, value, index }: any) => {
                    if (index === fuelPriceData.length - 1) return null;
                    return null;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-2 text-[9px] font-mono text-[#5e748d] uppercase px-4">
             <span>W-8</span>
             <span>W-7</span>
             <span>W-6</span>
             <span>W-5</span>
             <span>W-4</span>
             <span>W-3</span>
             <span>W-2</span>
             <span>W-1</span>
             <span>Now</span>
          </div>
        </div>

        {/* Table Section */}
        <ShipmentTable />
      </div>
    </motion.div>
  );
}
