import { useEffect, useState, useRef, useMemo } from 'react';
// @ts-ignore
import Globe from 'react-globe.gl';
import { shipments } from '../../lib/mockData';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Ship, ExternalLink } from 'lucide-react';
import GoogleMap3D from '../maps/GoogleMap3D';

const statusColors = {
  in_transit: "#00f2ff",
  delayed: "#f59e0b",
  delivered: "#22c55e",
  at_risk: "#ff4b4b",
  rerouted: "#a855f7"
};

export default function WorldMap() {
  const globeEl = useRef<any>(null);
  const [selectedVesselId, setSelectedVesselId] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [show3DDetail, setShow3DDetail] = useState(false);
  const [viewingLocationIn3D, setViewingLocationIn3D] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 440 });

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

  const toggleLocation = (locationName: string) => {
    if (selectedLocation === locationName) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(locationName);
      setSelectedVesselId(null);
    }
  };

  const vesselMarkers = useMemo(() => (shipments || []).map(s => {
    if (!s) return null;
    const color = statusColors[(s.status || 'in_transit') as keyof typeof statusColors] || "#00f2ff";
    const isRelated = selectedLocation && (s.origin === selectedLocation || s.destination === selectedLocation);
    const isSelected = selectedVesselId === s.id;
    return {
      id: s.id,
      name: s.vessel_name,
      lat: (s.origin_lat || 0) + ((s.dest_lat || 0) - (s.origin_lat || 0)) * 0.4,
      lng: (s.origin_lng || 0) + ((s.dest_lng || 0) - (s.origin_lng || 0)) * 0.4,
      color: color,
      status: s.status,
      origin: s.origin,
      destination: s.destination,
      size: isSelected || isRelated ? 28 : 22
    };
  }).filter(Boolean), [selectedVesselId, selectedLocation]);

  const labelsData = useMemo(() => {
    const locations = new Map();
    (shipments || []).forEach(s => {
      if (s) {
        locations.set(s.origin, { lat: s.origin_lat, lng: s.origin_lng, name: s.origin });
        locations.set(s.destination, { lat: s.dest_lat, lng: s.dest_lng, name: s.destination });
      }
    });
    return Array.from(locations.values());
  }, []);

  const arcData = useMemo(() => {
    return (shipments || []).map(s => {
      if (!s) return null;
      const color = statusColors[(s.status || 'in_transit') as keyof typeof statusColors] || "#00f2ff";
      const isSelectedVessel = selectedVesselId === s.id;
      const isRelatedToLocation = selectedLocation && (s.origin === selectedLocation || s.destination === selectedLocation);
      const isHighlighted = isSelectedVessel || isRelatedToLocation;

      return {
        startLat: s.origin_lat || 0,
        startLng: s.origin_lng || 0,
        endLat: s.dest_lat || 0,
        endLng: s.dest_lng || 0,
        color: isHighlighted ? [color, '#ffffff'] : [color + '44', color + '22'],
        stroke: isHighlighted ? 0.8 : 0.4,
        altitude: 0.1 + (s.id * 0.02),
        dashLength: 0.4,
        dashGap: 2,
        dashAnimateTime: isHighlighted ? 1500 : 3000
      };
    }).filter(Boolean);
  }, [selectedVesselId, selectedLocation]);

  const selectedVessel = useMemo(() => shipments.find(s => s.id === selectedVesselId), [selectedVesselId]);

  const detailRoutes = useMemo(() => {
    if (viewingLocationIn3D && selectedLocation) {
      return (shipments || [])
        .filter(s => s?.origin === selectedLocation || s?.destination === selectedLocation)
        .map(s => {
          if (!s) return null;
          const midLat = ((s.origin_lat || 0) + (s.dest_lat || 0)) / 2 + 5; // Offset for curve
          const midLng = ((s.origin_lng || 0) + (s.dest_lng || 0)) / 2 + 5;
          return {
            id: s.id,
            origin: { lat: s.origin_lat, lng: s.origin_lng },
            destination: { lat: s.dest_lat, lng: s.dest_lng },
            current: { 
              lat: (s.origin_lat || 0) + ((s.dest_lat || 0) - (s.origin_lat || 0)) * 0.4, 
              lng: (s.origin_lng || 0) + ((s.dest_lng || 0) - (s.origin_lng || 0)) * 0.4 
            },
            optimizedPoints: [
              { lat: s.origin_lat || 0, lng: s.origin_lng || 0, altitude: 0 },
              { lat: midLat, lng: midLng, altitude: 0 },
              { lat: s.dest_lat || 0, lng: s.dest_lng || 0, altitude: 0 }
            ],
            color: statusColors[(s?.status || 'in_transit') as keyof typeof statusColors],
            name: s?.vessel_name || 'Vessel'
          };
        }).filter(Boolean);
    }
    if (selectedVessel) {
      const midLat = ((selectedVessel.origin_lat || 0) + (selectedVessel.dest_lat || 0)) / 2 + 5;
      const midLng = ((selectedVessel.origin_lng || 0) + (selectedVessel.dest_lng || 0)) / 2 + 5;
      return [{
        id: selectedVessel.id,
        origin: { lat: selectedVessel.origin_lat || 0, lng: selectedVessel.origin_lng || 0 },
        destination: { lat: selectedVessel.dest_lat || 0, lng: selectedVessel.dest_lng || 0 },
        current: { 
          lat: (selectedVessel.origin_lat || 0) + ((selectedVessel.dest_lat || 0) - (selectedVessel.origin_lat || 0)) * 0.4, 
          lng: (selectedVessel.origin_lng || 0) + ((selectedVessel.dest_lng || 0) - (selectedVessel.origin_lng || 0)) * 0.4 
        },
        optimizedPoints: [
          { lat: selectedVessel.origin_lat || 0, lng: selectedVessel.origin_lng || 0, altitude: 0 },
          { lat: midLat, lng: midLng, altitude: 0 },
          { lat: selectedVessel.dest_lat || 0, lng: selectedVessel.dest_lng || 0, altitude: 0 }
        ],
        color: statusColors[(selectedVessel.status || 'in_transit') as keyof typeof statusColors],
        name: selectedVessel.vessel_name
      }];
    }
    return [];
  }, [selectedVessel, selectedLocation, viewingLocationIn3D]);

  const detailCenter = useMemo(() => {
    if (viewingLocationIn3D && selectedLocation) {
      const loc = labelsData.find(l => l.name === selectedLocation);
      return loc ? { lat: loc.lat || 0, lng: loc.lng || 0 } : { lat: 0, lng: 0 };
    }
    return selectedVessel ? { lat: selectedVessel.origin_lat || 0, lng: selectedVessel.origin_lng || 0 } : { lat: 0, lng: 0 };
  }, [selectedVessel, selectedLocation, viewingLocationIn3D, labelsData]);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.05;
      globeEl.current.pointOfView({ lat: 20, lng: 30, altitude: 2.2 });
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[440px] overflow-hidden bg-[#030508] flex items-center justify-center">
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
          const isAtRisk = d.status === 'at_risk';
          el.innerHTML = `
            <div class="relative flex flex-col items-center group">
              <div class="absolute bottom-full mb-1 text-[18px] font-black text-white uppercase tracking-tighter whitespace-nowrap pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
                ${d.name || 'VESSEL'}
              </div>
              <div class="pin ${isAtRisk ? 'animate-bounce' : ''}" style="background-color: ${d.color || '#00f2ff'}; border: 2.5px solid ${d.color || '#00f2ff'}; box-shadow: 0 0 15px ${d.color || '#00f2ff'}; width: ${d.size || 22}px; height: ${d.size || 22}px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;">
                 <svg class="w-full h-full p-1.5 text-white" viewBox="0 0 24 24" fill="currentColor" style="transform: rotate(45deg); filter: drop-shadow(0 0 3px rgba(0,0,0,0.5));">
                   <path d="M12 1L15.39 8.26L23.36 9.41L17.59 15.04L18.95 23L12 19L5.05 23L6.41 15.04L0.64 9.41L8.61 8.26L12 1Z" />
                 </svg>
              </div>
              <div class="w-2 h-2 bg-white/50 rounded-full mt-[-3px] blur-[1px]"></div>
            </div>
          `;
          el.style.pointerEvents = 'auto';
          el.onclick = () => d?.id && setSelectedVesselId(d.id);
          return el;
        }}
        
        labelsData={labelsData}
        labelLat={(d: any) => d?.lat || 0}
        labelLng={(d: any) => d?.lng || 0}
        labelText={(d: any) => d?.name || ''}
        labelSize={1.5}
        labelDotRadius={0.2}
        labelColor={() => 'rgba(255, 255, 255, 0.8)'}
        onLabelClick={(d: any) => d?.name && toggleLocation(d.name)}
      />

      <AnimatePresence>
        {selectedLocation && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-6 right-6 z-[1002] w-64 bg-[#020c14ee] border border-cyan-500/50 p-5 rounded-xl shadow-[0_0_50px_rgba(0,242,255,0.2)] backdrop-blur-md pointer-events-auto"
          >
            <button 
              onClick={() => setSelectedLocation(null)}
              className="absolute top-3 right-3 text-[#5e748d] hover:text-white"
            >
              &times;
            </button>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Focus Location</p>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold leading-tight uppercase">{selectedLocation}</h3>
                  <button 
                    onClick={() => {
                      setViewingLocationIn3D(true);
                      setShow3DDetail(true);
                    }}
                    className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 hover:bg-cyan-500/20 transition-all"
                    title="View Location in 3D"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <p className="text-[9px] font-black text-[#5e748d] uppercase mb-2">Connected Routes</p>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                  {shipments.filter(s => s.origin === selectedLocation || s.destination === selectedLocation).map(s => (
                    <button 
                      key={s.id}
                      onClick={() => {
                        setSelectedVesselId(s.id);
                        setSelectedLocation(null);
                      }}
                      className="w-full p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-left transition-all"
                    >
                      <p className="text-[9px] font-bold uppercase truncate">{s.vessel_name}</p>
                      <p className="text-[8px] text-[#5e748d] truncate">{s.origin} &rarr; {s.destination}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedVessel && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-6 right-6 z-[1002] w-64 bg-[#020c14ee] border border-[#00f2ff50] p-5 rounded-xl shadow-[0_0_50px_rgba(0,242,255,0.2)] backdrop-blur-md pointer-events-auto"
          >
            <button 
              onClick={() => setSelectedVesselId(null)}
              className="absolute top-3 right-3 text-[#5e748d] hover:text-white"
            >
              &times;
            </button>
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <div className="p-1.5 bg-cyan-500/20 rounded-md">
                   <Ship className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                   <h4 className="font-bold text-xs uppercase tracking-tight truncate leading-none mb-1">{selectedVessel.vessel_name}</h4>
                   <p className="text-[8px] font-mono text-[#5e748d] uppercase">{selectedVessel.tracking_id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div>
                  <p className="text-[#94a3b8] uppercase text-[8px] font-bold mb-0.5">Origin</p>
                  <p className="truncate font-mono text-[#e0f7fa]">{selectedVessel.origin}</p>
                </div>
                <div>
                  <p className="text-[#94a3b8] uppercase text-[8px] font-bold mb-0.5">Destination</p>
                  <p className="truncate font-mono text-[#e0f7fa]">{selectedVessel.destination}</p>
                </div>
              </div>
              <div className="pt-3 flex flex-col gap-3 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-cyan-400 font-mono italic text-[9px]">LIVE TELEMETRY</span>
                  <span className={cn("px-2 py-0.5 rounded text-[9px] uppercase", 
                    selectedVessel.status === 'at_risk' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                  )}>
                    {selectedVessel.status.replace('_', ' ')}
                  </span>
                </div>
                
                <button 
                  onClick={() => setShow3DDetail(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-[10px] font-bold text-cyan-400 hover:bg-cyan-500/20 transition-all uppercase tracking-widest"
                >
                  <ExternalLink className="w-3 h-3" />
                  View 3D Terrain
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show3DDetail && (detailRoutes.length > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-2xl p-4 md:p-10 flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="w-full h-full max-w-6xl max-h-[90vh] relative">
               <GoogleMap3D 
                 lat={detailCenter.lat} 
                 lng={detailCenter.lng}
                 routes={detailRoutes}
                 range={viewingLocationIn3D ? 5000 : 1000}
                 onClose={() => {
                   setShow3DDetail(false);
                   setViewingLocationIn3D(false);
                 }} 
               />
               <div className="absolute top-6 left-6 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                      <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Photorealistic 3D Inspection</p>
                      <h2 className="text-xl font-bold text-white uppercase tracking-tighter">
                        {viewingLocationIn3D ? selectedLocation : selectedVessel?.vessel_name}
                      </h2>
                      <p className="text-xs text-[#94a3b8] font-mono">
                        {viewingLocationIn3D 
                          ? `${detailRoutes.length} Connected Routes Detected` 
                          : `${selectedVessel?.origin} → ${selectedVessel?.destination}`
                        }
                      </p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-6 z-[100] bg-[#020c14cc] backdrop-blur-md border border-[#1a2b3b] p-3 rounded-xl shadow-2xl pointer-events-none">
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2 font-mono">Globe Connectivity Index</p>
        <div className="flex gap-4">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: color }} />
              <span className="text-[8px] uppercase font-bold text-[#94a3b8] font-mono">{status.replace('in_', '').replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
