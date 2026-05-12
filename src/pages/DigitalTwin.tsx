import { useState, useEffect, useRef, useMemo } from 'react';
import TopBar from '../components/layout/TopBar';
// @ts-ignore
import Globe from 'react-globe.gl';
import { 
  AlertOctagon, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  Play, 
  RotateCcw,
  Maximize2,
  Minimize2,
  ArrowRight,
  TrendingDown,
  Activity,
  Layers,
  Clock,
  Brain,
  ShieldCheck,
  ChevronRight,
  Anchor,
  CloudLightning,
  Sparkles,
  MapPin,
  ExternalLink,
  Fuel
} from 'lucide-react';
import GoogleMap3D from '../components/maps/GoogleMap3D';
import { cn } from '../lib/utils';
import { 
  shipments, 
  simulationKPIs, 
  simulationDemandData, 
  simulationRouteUtilization, 
  aiRecommendations 
} from '../lib/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { useSimulation } from '../hooks/useSimulation';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const scenarios = [
  { id: 'blockage', label: 'Port Blockage', icon: Anchor, description: 'What if a port closes? (e.g. Shanghai)', color: '#ff4b4b', zones: [
    { city: 'Shanghai', lat: 31.2, lng: 121.4, color: '#ff4b4b', r: 40 },
    { city: 'Busan', lat: 35.1, lng: 129.0, color: '#f59e0b', r: 20 },
  ]},
  { id: 'hormuz_blockade', label: 'Hormuz Blockade', icon: ShieldCheck, description: 'Total maritime closure in the Strait of Hormuz.', color: '#ef4444', zones: [
    { city: 'Strait of Hormuz', lat: 26.6, lng: 56.3, color: '#ef4444', r: 45 },
  ]},
  { id: 'typhoon', label: 'Weather Impact', icon: CloudLightning, description: 'What if major storms hit routes?', color: '#a855f7', zones: [
    { city: 'South China Sea', lat: 15.0, lng: 115.0, color: '#a855f7', r: 60 },
  ]},
  { id: 'surge', label: 'Demand Surge', icon: TrendingUp, description: 'What if demand increases suddenly?', color: '#00f2ff', zones: [
    { city: 'Tokyo', lat: 35.6, lng: 139.7, color: '#00f2ff', r: 28 },
  ]},
];

const statusColors = {
  in_transit: "#00f2ff",
  delayed: "#f59e0b",
  delivered: "#22c55e",
  at_risk: "#ff4b4b",
  rerouted: "#a855f7"
};

const HORMUZ_ZONE = [
  [25.0, 55.0], [27.0, 55.0], [28.0, 57.0], [26.0, 58.0], [25.0, 55.0]
];

const RED_SEA_ZONE = [
  [12.0, 43.0], [15.0, 40.0], [25.0, 35.0], [30.0, 32.0], [28.0, 35.0], [15.0, 44.0], [12.0, 43.0]
];

export default function DigitalTwin() {
  const globeEl = useRef<any>(null);
  const { state: simState, triggerScenario } = useSimulation();
  const [selectedScenario, setSelectedScenario] = useState('blockage');
  const [intensity, setIntensity] = useState(35);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [selectedVesselId, setSelectedVesselId] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [hoveredPointId, setHoveredPointId] = useState<number | null>(null);
  const [show3DDetail, setShow3DDetail] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 650 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const selectedVessel = useMemo(() => shipments.find(s => s.id === selectedVesselId), [selectedVesselId]);

  const toggleLocation = (locationName: string) => {
    if (selectedLocation === locationName) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(locationName);
      setSelectedVesselId(null);
    }
  };

  const currentScenario = scenarios.find(s => s.id === selectedScenario);

  const getSliderLabel = () => {
    switch(selectedScenario) {
      case 'blockage': return `Port Closure Duration: ${intensity} days`;
      case 'fuel': return `Price Increase: +${intensity}%`;
      case 'typhoon': return `Wind Intensity: Cat ${Math.ceil(intensity / 20)}`;
      case 'surge': return `Volume Increase: +${intensity}%`;
      default: return `Level: ${intensity}`;
    }
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    setHasResults(false);
    await triggerScenario(selectedScenario);
    setTimeout(() => {
      setIsSimulating(false);
      setHasResults(true);
    }, 1500);
  };

  // Dynamic Impact Metrics
  const impactStats = useMemo(() => {
    const factor = intensity / 100;
    if (selectedScenario === 'blockage') return { delay: 12.4 * factor, cost: 4.2 * factor, revenue: -8.5 * factor, fuel: 3.1 * factor };
    if (selectedScenario === 'hormuz_blockade') return { delay: 24.1 * factor, cost: 18.5 * factor, revenue: -22.4 * factor, fuel: 34.2 * factor };
    if (selectedScenario === 'typhoon') return { delay: 4.8 * factor, cost: 2.1 * factor, revenue: -3.5 * factor, fuel: 5.4 * factor };
    return { delay: 2.2 * factor, cost: 1.1 * factor, revenue: 14.5 * factor, fuel: 1.2 * factor };
  }, [selectedScenario, intensity]);

  // Convert shipments to Globe data
  const vesselMarkers = useMemo(() => (shipments || []).map(s => {
    if (!s) return null;
    const color = statusColors[(s.status || 'in_transit') as keyof typeof statusColors] || "#00f2ff";
    const isRelated = Boolean(selectedLocation && (s.origin === selectedLocation || s.destination === selectedLocation));
    const isSelected = selectedVesselId === s.id;
    const isInHormuz = s.origin === 'Dubai' || s.destination === 'Dubai';
    
    return {
      id: s?.id,
      name: s?.vessel_name || 'Vessel',
      lat: (s?.origin_lat || 0) + ((s?.dest_lat || 0) - (s?.origin_lat || 0)) * 0.4, 
      lng: (s?.origin_lng || 0) + ((s?.dest_lng || 0) - (s?.origin_lng || 0)) * 0.4,
      color: color,
      status: s?.status || 'in_transit',
      origin: s?.origin || 'Unknown',
      destination: s?.destination || 'Unknown',
      size: isSelected || isRelated ? 32 : 24,
      isRelated,
      warning: isInHormuz ? "DANGER: SEIZURE RISK" : null
    };
  }).filter(Boolean), [selectedVesselId, selectedLocation]);

  const labelsData = useMemo(() => {
    // Collect unique origins and destinations
    const locations = new Map();
    (shipments || []).forEach(s => {
      if (s?.origin) locations.set(s.origin, { lat: s?.origin_lat || 0, lng: s?.origin_lng || 0, name: s.origin, type: 'port' });
      if (s?.destination) locations.set(s.destination, { lat: s?.dest_lat || 0, lng: s?.dest_lng || 0, name: s.destination, type: 'port' });
    });
    
    // Add "Problem" hotspots based on current scenario
    if (currentScenario?.zones) {
      currentScenario.zones.forEach((z, i) => {
        locations.set(`problem-${i}`, { 
          lat: z?.lat || 0, 
          lng: z?.lng || 0, 
          name: `ALERT: ${currentScenario?.label || 'Scenario'}`, 
          type: 'alert',
          color: z?.color || '#ff4b4b'
        });
      });
    }
    
    return Array.from(locations.values());
  }, [currentScenario]);

  const arcData = useMemo(() => {
    const arcs = (shipments || []).map(s => {
      if (!s) return null;
      const isSelectedVessel = selectedVesselId === s.id;
      const isRelatedToLocation = selectedLocation && (s.origin === selectedLocation || s.destination === selectedLocation);
      const isHighlighted = isSelectedVessel || isRelatedToLocation;

      // Simulate rerouting via Cape for Asia-Europe
      const isAsiaEurope = (s.origin === 'Shanghai' || s.origin === 'Singapore') && (s.destination === 'Rotterdam' || s.destination === 'Hamburg');
      
      let endLat = s.dest_lat || 0;
      let endLng = s.dest_lng || 0;
      let path = null;

      if (isAsiaEurope) {
        // Cape of Good Hope Path (simplified)
        path = [
          [s.origin_lat || 0, s.origin_lng || 0],
          [-34.3, 18.5], // Cape of Good Hope
          [s.dest_lat || 0, s.dest_lng || 0]
        ];
      }

      return {
        id: s.id,
        startLat: s.origin_lat || 0,
        startLng: s.origin_lng || 0,
        endLat: endLat,
        endLng: endLng,
        color: isHighlighted ? ['#00f2ff', '#ffffff'] : isAsiaEurope ? ['#f59e0b', '#f59e0b33'] : ['#00f2ff33', '#00f2ff11'],
        stroke: isHighlighted ? 1.4 : 0.4,
        dashLength: 0.4,
        dashGap: 2,
        dashAnimateTime: isHighlighted ? 1500 : 3000,
        altitude: isAsiaEurope ? 0.3 : 0.1 + (s.id * 0.05)
      };
    }).filter(Boolean);

    // Add Saudi Land-Bridge
    arcs.push({
      id: 999,
      startLat: 21.5, startLng: 39.2, // Jeddah
      endLat: 26.4, endLng: 50.1, // Dammam
      color: ['#22c55e', '#22c55e'],
      stroke: 1.0,
      dashLength: 0.1,
      dashGap: 0.1,
      dashAnimateTime: 1000,
      altitude: 0.02
    } as any);

    return arcs;
  }, [selectedVesselId, selectedLocation]);

  const ringData = useMemo(() => {
    if (!currentScenario) return [];
    return currentScenario.zones.map(z => ({
      lat: z.lat,
      lng: z.lng,
      maxR: hasResults ? z.r * 0.3 : z.r * 0.1,
      propagationSpeed: 0.5,
      repeatPeriod: 2000,
      color: z.color
    }));
  }, [currentScenario, hasResults]);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.05;
      globeEl.current.pointOfView({ lat: 20, lng: 110, altitude: 2 }, 1000);
    }
  }, []);

  // Center on selected vessel
  useEffect(() => {
    if (selectedVessel && globeEl.current) {
      globeEl.current.pointOfView({ 
        lat: selectedVessel.origin_lat, 
        lng: selectedVessel.origin_lng, 
        altitude: 1.5 
      }, 1000);
    }
  }, [selectedVessel]);

  return (
    <div className="flex flex-col h-full bg-[#030508] text-[#e0f7fa] overflow-y-auto overflow-x-hidden">
      <TopBar 
        title="Digital Twin Simulation" 
        subtitle="Virtual copy of global logistics. RL-powered autonomous stress-testing & scenario simulation." 
      />

      <div className="p-6 space-y-6">
        {/* Scenario Selection */}
        <div className="grid grid-cols-4 gap-4">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSelectedScenario(s.id); setHasResults(false); }}
              className={cn(
                "p-5 rounded-xl border text-left transition-all relative group bg-glass",
                selectedScenario === s.id 
                  ? "border-[#ff4b4b40] shadow-[0_0_20px_#ff4b4b20]" 
                  : "border-white/5 hover:border-white/10"
              )}
              style={selectedScenario === s.id ? { borderColor: `${s.color}60`, boxShadow: `0 0 20px ${s.color}15` } : {}}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <s.icon className="w-5 h-5 text-[#94a3b8]" style={selectedScenario === s.id ? { color: s.color } : {}} />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest mb-1" style={selectedScenario === s.id ? { color: s.color } : {}}>{s.label}</h3>
                  <p className="text-[10px] text-[#5e748d] leading-tight">{s.description}</p>
                </div>
              </div>
              {selectedScenario === s.id && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: s.color }} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Simulation Controls & Map Container */}
        <div className="bg-glass rounded-xl p-6 space-y-6 shadow-xl border border-white/5">
          <div className="flex items-center gap-10">
            <div className="flex-1">
              <div className="flex justify-between items-end mb-3">
                <div className="space-y-1">
                  <span className="text-[14px] font-black text-white uppercase tracking-tighter block">{getSliderLabel()}</span>
                </div>
                <span className="text-[11px] font-mono text-[#5e748d] font-bold">{intensity}% Intensity</span>
              </div>
              <div className="relative h-2 bg-white/5 rounded-full">
                <div 
                  className="absolute h-full bg-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.6)] rounded-full transition-all duration-300" 
                  style={{ width: `${intensity}%` }}
                />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={intensity} 
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer accent-[#00f2ff] z-10"
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold text-[#5e748d] uppercase tracking-widest">
                <span>Low impact</span>
                <span>Maximum impact</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={runSimulation}
                disabled={isSimulating}
                className="px-8 py-3 bg-[#00f2ff] text-[#0b0e14] font-black uppercase tracking-[0.1em] text-[13px] rounded-lg flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 h-12 shadow-[0_0_30px_rgba(0,242,255,0.2)]"
              >
                {isSimulating ? <Activity className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                {isSimulating ? "ANALYZING..." : "Run Simulation"}
              </button>
              <button 
                onClick={() => { setHasResults(false); setIntensity(35); }}
                className="px-5 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[11px] rounded-lg hover:bg-white/10 transition-all h-12 group"
              >
                <RotateCcw className="w-4 h-4 group-hover:rotate-[-180deg] transition-all duration-500" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
              <h4 className="text-[13px] font-black text-[#e0f7fa] flex items-center gap-3 uppercase tracking-widest">
                <span className="w-2 h-5 bg-cyan-400 rounded-full inline-block"></span>
                Simulation Environment — <span className="text-cyan-400">{currentScenario?.label}</span>
              </h4>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-[#5e748d] uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">Reactive 3D View</span>
              </div>
            </div>

            {/* Globe/3D Container */}
            <div className="relative h-[650px] flex gap-4">
              <div ref={containerRef} className={cn("relative transition-all duration-700 h-full rounded-3xl overflow-hidden border border-white/5 bg-[#030508] shadow-2xl flex items-center justify-center", show3DDetail ? "w-1/2" : "w-full")}>
                <div className="absolute inset-0">
                  <Globe
                    ref={globeEl}
                    width={dimensions.width}
                    height={dimensions.height}
                    backgroundColor="rgba(0,0,0,0)"
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                    
                    arcsData={arcData}
                    arcColor={(d: any) => d?.color || '#00f2ff'}
                    arcStroke={(d: any) => d?.stroke || 0.4}
                    arcAltitude={(d: any) => d?.altitude || 0.1}
                    arcDashLength={(d: any) => d?.dashLength || 0.4}
                    arcDashGap={(d: any) => d?.dashGap || 4}
                    arcDashAnimateTime={(d: any) => d?.dashAnimateTime || 2000}
                    
                    htmlElementsData={vesselMarkers}
                    htmlElement={(d: any) => {
                      const el = document.createElement('div');
                      if (!d) return el;
                      el.innerHTML = `
                        <div class="relative flex flex-col items-center group">
                          ${d.warning ? `<div class="absolute bottom-[calc(100%+30px)] mb-1 text-[10px] font-black text-white bg-red-600 px-2 py-0.5 rounded shadow-lg animate-pulse whitespace-nowrap">${d.warning}</div>` : ''}
                          <div class="absolute bottom-full mb-1 text-[18px] font-black text-white uppercase tracking-tighter whitespace-nowrap pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
                            ${d.name || 'VESSEL'}
                          </div>
                          <div class="pin ${d.status === 'at_risk' || d.warning ? 'animate-bounce' : ''}" style="background-color: ${d.warning ? '#ef4444' : (d.color || '#00f2ff')}; border: 2.5px solid ${d.warning ? '#ef4444' : (d.color || '#00f2ff')}; box-shadow: 0 0 15px ${d.warning ? '#ef4444' : (d.color || '#00f2ff')}; width: ${d.size || 24}px; height: ${d.size || 24}px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;">
                            <svg class="w-full h-full p-1.5 text-white" viewBox="0 0 24 24" fill="currentColor" style="transform: rotate(45deg); filter: drop-shadow(0 0 3px rgba(0,0,0,0.5));">
                              <path d="M12 1L15.39 8.26L23.36 9.41L17.59 15.04L18.95 23L12 19L5.05 23L6.41 15.04L0.64 9.41L8.61 8.26L12 1Z" />
                            </svg>
                          </div>
                          <div class="w-2 h-2 bg-white/50 rounded-full mt-[-3px] blur-[1px]"></div>
                        </div>
                      `;
                      el.style.pointerEvents = 'auto';
                      el.onclick = () => {
                        if (d?.id) {
                          setSelectedVesselId(d.id);
                          setSelectedLocation(null);
                        }
                      };
                      return el;
                    }}
                    
                    labelsData={labelsData}
                    labelLat={(d: any) => d?.lat || 0}
                    labelLng={(d: any) => d?.lng || 0}
                    labelText={(d: any) => d?.name || ''}
                    labelSize={(d: any) => d?.type === 'alert' ? 4.0 : 1.8}
                    labelDotRadius={(d: any) => d?.type === 'alert' ? 0.4 : 0.2}
                    labelColor={(d: any) => d?.type === 'alert' ? '#ff4b4b' : '#00f2ff'}
                    labelResolution={2}
                    onLabelClick={(d: any) => d?.name && toggleLocation(d.name)}

                    ringsData={ringData}
                    ringColor={(d: any) => d?.color || '#00f2ff'}
                    ringMaxRadius={(d: any) => d?.maxR || 10}
                    ringPropagationSpeed={0.5}
                    ringRepeatPeriod={2000}

                    polygonsData={[
                      { id: 'hormuz', coords: HORMUZ_ZONE, color: 'rgba(255, 0, 0, 0.4)', name: 'HORMUZ SEIZURE RISK' },
                      { id: 'red-sea', coords: RED_SEA_ZONE, color: 'rgba(245, 158, 11, 0.3)', name: 'RED SEA: AMBER ZONE' }
                    ]}
                    polygonCapColor={(d: any) => d?.color || 'transparent'}
                    polygonSideColor={() => 'rgba(255, 255, 255, 0.05)'}
                    polygonAltitude={0.01}
                    polygonLabel={(d: any) => `
                      <div class="bg-black/80 border border-white/20 p-2 rounded text-[10px] font-black text-white uppercase tracking-widest">
                        ${d?.name || 'ZONE'}
                      </div>
                    `}
                  />

                  {/* Vessel Detail Panel (Slide-in) */}
                  <AnimatePresence>
                    {selectedVessel && !show3DDetail && (
                      <motion.div 
                        initial={{ x: -400 }}
                        animate={{ x: 0 }}
                        exit={{ x: -400 }}
                        className="absolute top-4 left-4 bottom-4 w-80 z-[11] bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-y-auto shadow-2xl"
                      >
                        <button 
                          onClick={() => setSelectedVesselId(null)}
                          className="absolute top-4 right-4 text-[#5e748d] hover:text-white"
                        >
                          <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        
                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Active Vessel</p>
                            <h3 className="text-xl font-bold leading-tight tracking-tight">{selectedVessel.vessel_name}</h3>
                            <p className="text-[10px] font-mono text-[#5e748d]">{selectedVessel.tracking_id}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                               <p className="text-[8px] font-bold text-[#5e748d] uppercase mb-1">Status</p>
                               <p className="text-[10px] font-bold text-green-400 uppercase">{selectedVessel.status.replace('_', ' ')}</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                               <p className="text-[8px] font-bold text-[#5e748d] uppercase mb-1">Risk</p>
                               <p className={cn("text-[10px] font-bold", selectedVessel.risk_score > 50 ? "text-red-400" : "text-cyan-400")}>{selectedVessel.risk_score}/100</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                <div>
                                   <p className="text-[8px] font-bold text-[#5e748d] uppercase">Departure</p>
                                   <p className="text-[11px] font-bold">{selectedVessel.origin}</p>
                                </div>
                             </div>
                             <div className="h-4 border-l border-dashed border-white/20 ml-[3px]"></div>
                             <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                <div>
                                   <p className="text-[8px] font-bold text-[#5e748d] uppercase">Destination</p>
                                   <p className="text-[11px] font-bold">{selectedVessel.destination}</p>
                                </div>
                             </div>
                          </div>

                          <div className="p-3 bg-[#00f2ff10] border border-[#00f2ff20] rounded-xl flex flex-col gap-3">
                            <div>
                               <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                 <MapPin className="w-3 h-3" /> Routing Identified
                               </p>
                               <p className="text-[10px] text-[#e0f7fa]">Route visibility enabled for current asset.</p>
                            </div>
                            
                            <button 
                              onClick={() => setShow3DDetail(true)}
                              className="w-full flex items-center justify-center gap-2 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-[10px] font-bold text-cyan-400 hover:bg-cyan-500/20 transition-all uppercase tracking-widest"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Advanced 3D Mapping
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Location Detail Panel (Slide-in) */}
                  <AnimatePresence>
                    {selectedLocation && (
                      <motion.div 
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        className="absolute top-4 left-4 bottom-4 w-80 z-[11] bg-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 overflow-y-auto shadow-2xl"
                      >
                        <div className="space-y-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Focus Location</p>
                              <h3 className="text-xl font-bold uppercase tracking-tighter">{selectedLocation}</h3>
                            </div>
                            <button 
                              onClick={() => setSelectedLocation(null)}
                              className="text-[#5e748d] hover:text-white"
                            >
                              <ChevronRight className="w-5 h-5 rotate-180" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-[9px] font-bold rounded uppercase">Strategic Port</span>
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[9px] font-bold rounded uppercase">Active</span>
                          </div>

                          <div className="pt-4 border-t border-white/10">
                            <p className="text-[10px] font-bold text-[#5e748d] uppercase mb-4 tracking-widest">Connected Routes ({(shipments || []).filter(s => s?.origin === selectedLocation || s?.destination === selectedLocation).length})</p>
                            <div className="space-y-3">
                               {(shipments || []).filter(s => s?.origin === selectedLocation || s?.destination === selectedLocation).map(s => (
                                 <button 
                                   key={s?.id || Math.random()}
                                   onClick={() => {
                                     if (s?.id) {
                                       setSelectedVesselId(s.id);
                                       setSelectedLocation(null);
                                     }
                                   }}
                                   className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-left transition-all group"
                                 >
                                   <div className="flex justify-between items-start mb-1">
                                     <p className="text-[10px] font-bold group-hover:text-cyan-400 transition-colors uppercase">{s?.vessel_name || 'Vessel'}</p>
                                     <ArrowRight className="w-3 h-3 text-[#5e748d]" />
                                   </div>
                                   <p className="text-[9px] font-mono text-[#5e748d]">{s?.origin || 'Unknown'} &rarr; {s?.destination || 'Unknown'}</p>
                                 </button>
                               ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Status indicator on globe */}
                  <div className="absolute top-6 left-6 flex items-center gap-4">
                     {selectedLocation && (
                       <div className="bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 px-4 py-2 rounded-xl flex items-center gap-3">
                          <div className="p-1.5 bg-cyan-400 rounded-lg">
                            <MapPin className="w-4 h-4 text-black" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-cyan-400 uppercase leading-none mb-1">Focus Location</p>
                            <p className="text-sm font-bold text-white uppercase">{selectedLocation}</p>
                          </div>
                          <button onClick={() => setSelectedLocation(null)} className="ml-2 text-white/40 hover:text-white">&times;</button>
                       </div>
                     )}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {show3DDetail && selectedVessel && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="w-1/2 h-full relative"
                  >
                    <GoogleMap3D 
                      lat={selectedVessel.origin_lat} 
                      lng={selectedVessel.origin_lng} 
                      onClose={() => setShow3DDetail(false)} 
                    />
                    <div className="absolute top-6 left-6 pointer-events-none">
                      <div className="bg-black/80 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-2xl">
                          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Photorealistic 3D Environment</p>
                          <h2 className="text-xl font-bold text-white uppercase tracking-tighter tracking-tight mb-2">{selectedVessel.vessel_name}</h2>
                          <div className="flex items-center gap-3">
                             <p className="text-[11px] text-[#94a3b8] font-mono">{selectedVessel.origin}</p>
                             <ArrowRight className="w-3 h-3 text-[#5e748d]" />
                             <p className="text-[11px] text-[#94a3b8] font-mono">{selectedVessel.destination}</p>
                          </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-6 mt-4 text-[10px] font-mono text-[#5e748d] font-bold uppercase tracking-widest">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]"></div>
                 <span>Global Vessels</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]"></div>
                 <span>Geo-Risk Hotspots</span>
               </div>
               <div className="flex items-center gap-3 text-red-500">
                 <div className="w-3 h-3 rounded-full bg-[#ff4b4b] shadow-[0_0_8px_#ff4b4b]"></div>
                 <span>Critical Impact Zones</span>
               </div>
            </div>
          </div>
        </div>
        {/* Results Section */}
        <AnimatePresence>
          {hasResults && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 pb-10"
            >
              <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                <h2 className="text-sm font-bold uppercase tracking-[0.2em]">AI Impact Analysis Results</h2>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-5 gap-4">
                {simulationKPIs.map((kpi, idx) => (
                  <div key={idx} className="bg-glass p-5 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] font-bold text-[#5e748d] uppercase tracking-widest mb-2">{kpi.label}</p>
                    <div className="text-2xl font-bold font-mono tracking-tighter" style={{ color: kpi.color }}>
                      {kpi.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-glass rounded-xl p-6 border border-white/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-[#e0f7fa]">Demand Forecast: Baseline vs Simulated</h4>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={simulationDemandData}>
                        <defs>
                          <linearGradient id="baselineColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="simulatedColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff4b4b" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#ff4b4b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#5e748d', fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#5e748d', fontSize: 10}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0b0e14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        />
                        <Area isAnimationActive={true} animationDuration={1500} type="monotone" dataKey="baseline" name="Baseline" stroke="#00f2ff" fill="url(#baselineColor)" strokeWidth={2} dot={false} />
                        <Area isAnimationActive={true} animationDuration={2000} type="monotone" dataKey="simulated" name="Simulated" stroke="#ff4b4b" strokeDasharray="4 4" fill="url(#simulatedColor)" strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-1 bg-[#00f2ff] rounded"></div>
                       <span className="text-[9px] font-mono text-[#5e748d] uppercase">Baseline</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-1 bg-[#ff4b4b] border-t border-dashed rounded"></div>
                       <span className="text-[9px] font-mono text-[#5e748d] uppercase">Simulated</span>
                    </div>
                  </div>
                </div>

                <div className="bg-glass rounded-xl p-6 border border-white/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-[#e0f7fa]">Route Utilization Under Stress</h4>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={simulationRouteUtilization}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5e748d', fontSize: 9}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#5e748d', fontSize: 10}} />
                        <Tooltip />
                        <Bar isAnimationActive={true} animationDuration={1500} dataKey="baseline" name="Baseline" fill="#00f2ff" radius={[4, 4, 0, 0]} />
                        <Bar isAnimationActive={true} animationDuration={1800} dataKey="simulated" name="Simulated" fill="#ff4b4b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-[#00f2ff] rounded-sm"></div>
                       <span className="text-[9px] font-mono text-[#5e748d] uppercase">Baseline</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-[#ff4b4b] rounded-sm"></div>
                       <span className="text-[9px] font-mono text-[#5e748d] uppercase">Simulated</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-glass rounded-xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-1.5 bg-[#22c55e15] rounded-md">
                    <Brain className="w-4 h-4 text-[#22c55e]" />
                  </div>
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e0f7fa]">AI Autonomous Recommendations</h4>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {aiRecommendations.map((rec) => (
                    <div key={rec.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#00f2ff30] transition-all group">
                      <span className="text-[8px] font-mono text-[#5e748d] uppercase mb-4 block">{rec.step}</span>
                      <h5 className="text-[11px] font-bold leading-relaxed mb-4 group-hover:text-[#00f2ff]">{rec.title}</h5>
                      <div className="text-[10px] font-mono text-[#22c55e]">
                        {rec.benefit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!hasResults && !isSimulating && (
          <div className="h-[300px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-white/[0.02]">
            <Sparkles className="w-8 h-8 text-[#1a2b3b] mb-6" />
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-[#5e748d] mb-3">Configure intensity and run simulation</h3>
          </div>
        )}
      </div>
    </div>
  );
}
