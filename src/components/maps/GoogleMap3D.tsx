import React, { useEffect, useRef, useState } from 'react';

const API_KEY = ((import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY) || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface RouteData {
  id: string | number;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  current?: { lat: number; lng: number };
  color?: string;
  name?: string;
  optimizedPoints?: { lat: number; lng: number }[];
}

interface GoogleMap3DProps {
  lat: number;
  lng: number;
  routes?: RouteData[];
  range?: number;
  tilt?: number;
  heading?: number;
  onClose?: () => void;
}

export default function GoogleMap3D({ 
  lat, 
  lng, 
  routes = [], 
  range = 1000, 
  tilt = 45, 
  heading = 0, 
  onClose 
}: GoogleMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const map3dRef = useRef<any>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [showOptimization, setShowOptimization] = useState(false);

  useEffect(() => {
    if (!hasValidKey) return;

    const scriptId = 'google-maps-3d-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=alpha&libraries=maps3d`;
      script.async = true;
      script.onload = () => setIsApiLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsApiLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isApiLoaded || !containerRef.current) return;

    // Use the custom element once the API is loaded
    const map3dElement = document.createElement('gmp-map-3d') as any;
    map3dElement.setAttribute('center', `${lat},${lng},0`);
    map3dElement.setAttribute('range', range.toString());
    map3dElement.setAttribute('tilt', tilt.toString());
    map3dElement.setAttribute('heading', heading.toString());
    map3dElement.style.width = '100%';
    map3dElement.style.height = '100%';

    // Add routes as polylines
    routes.forEach(route => {
      // Base Route Path
      if (!showOptimization) {
        const polyline = document.createElement('gmp-polyline-3d') as any;
        polyline.setAttribute('stroke-color', route.color || '#00f2ff');
        polyline.setAttribute('stroke-width', '4');
        polyline.setAttribute('altitude-mode', 'clamp-to-ground');
        
        polyline.coordinates = [
          { lat: route.origin.lat, lng: route.origin.lng, altitude: 0 },
          { lat: route.destination.lat, lng: route.destination.lng, altitude: 0 }
        ];
        map3dElement.appendChild(polyline);
      }

      // Optimized AI Path
      if (showOptimization && route.optimizedPoints) {
        const optPolyline = document.createElement('gmp-polyline-3d') as any;
        optPolyline.setAttribute('stroke-color', '#22c55e'); // Green for optimized
        optPolyline.setAttribute('stroke-width', '6');
        optPolyline.setAttribute('altitude-mode', 'clamp-to-ground');
        optPolyline.coordinates = route.optimizedPoints;
        map3dElement.appendChild(optPolyline);
      }

      // Current position marker
      if (route.current) {
        const vesselMarker = document.createElement('gmp-marker-3d') as any;
        vesselMarker.setAttribute('position', `${route.current.lat},${route.current.lng},50`);
        vesselMarker.setAttribute('altitude-mode', 'relative-to-ground');
        map3dElement.appendChild(vesselMarker);
      }

      // Origin and destination markers
      const originMarker = document.createElement('gmp-marker-3d') as any;
      originMarker.setAttribute('position', `${route.origin.lat},${route.origin.lng},0`);
      map3dElement.appendChild(originMarker);

      const destMarker = document.createElement('gmp-marker-3d') as any;
      destMarker.setAttribute('position', `${route.destination.lat},${route.destination.lng},0`);
      map3dElement.appendChild(destMarker);
    });

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(map3dElement);
    map3dRef.current = map3dElement;

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [isApiLoaded, lat, lng, range, tilt, heading, routes, showOptimization]);

  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0b0e14] border border-white/10 rounded-2xl p-8 text-center">
        <div className="max-w-md">
          <h2 className="text-xl font-bold text-cyan-400 mb-4 uppercase tracking-widest leading-none">3D Mapping Error</h2>
          <p className="text-[10px] text-[#5e748d] leading-relaxed mb-6 font-mono">
            Invalid or missing GOOGLE_MAPS_PLATFORM_KEY. Please add your key to the project secrets.
          </p>
          <div className="text-left space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-[10px] font-bold text-white uppercase font-mono">Integration Guide</p>
            <p className="text-[9px] text-[#5e748d]">1. Enable "Maps JavaScript API"</p>
            <p className="text-[9px] text-[#5e748d]">2. Enable "Map Tiles API" (for 3D buildings)</p>
            <p className="text-[9px] text-[#5e748d]">3. Ensure your API Key is unrestricted for these services.</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold text-[#5e748d] hover:text-white hover:bg-white/10 transition-all font-mono">
              [ Dismiss View ]
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Zoom controls */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 flex flex-col gap-3 z-10">
        <button 
          onClick={() => {
            const currentRange = parseFloat(map3dRef.current?.getAttribute('range') || '1000');
            map3dRef.current?.setAttribute('range', Math.max(100, currentRange * 0.8).toString());
          }}
          className="w-8 h-8 bg-black/60 backdrop-blur-md border border-white/20 rounded flex items-center justify-center text-cyan-400 hover:bg-cyan-500/40 transition-all font-bold text-lg shadow-lg"
        >
          +
        </button>
        <button 
          onClick={() => {
            const currentRange = parseFloat(map3dRef.current?.getAttribute('range') || '1000');
            map3dRef.current?.setAttribute('range', (currentRange * 1.2).toString());
          }}
          className="w-8 h-8 bg-black/60 backdrop-blur-md border border-white/20 rounded flex items-center justify-center text-cyan-400 hover:bg-cyan-500/40 transition-all font-bold text-lg shadow-lg"
        >
          -
        </button>
      </div>

      {/* Optimization Toggles */}
      <div className="absolute top-6 left-6 right-20 flex gap-3 z-10 pointer-events-none">
        <div className="flex gap-2 p-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl pointer-events-auto">
          <button 
            onClick={() => setShowOptimization(!showOptimization)}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
              showOptimization 
                ? 'bg-[#22c55e] text-white shadow-[0_0_15px_#22c55e40]' 
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            {showOptimization ? 'AI Optimization ON' : 'AI Route Optimizer'}
          </button>
          
          {showOptimization && (
            <div className="flex items-center px-3 border-l border-white/10 gap-2">
              <div className="flex flex-col">
                <span className="text-[8px] text-[#22c55e] font-black leading-none">IMPACT PREDICTION</span>
                <span className="text-[10px] text-white font-mono leading-none mt-1">SAVE $12.4K | -2.1 TON CO₂</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-red-500/40 transition-all shadow-lg pointer-events-auto"
          title="Exit 3D View"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}

      <div className="absolute bottom-6 left-6 right-6 flex justify-center pointer-events-none">
        <div className="px-4 py-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded font-mono text-[8px] text-[#5e748d] uppercase tracking-[0.2em]">
          Photorealistic 3D Hybrid Control • Alpha V9
        </div>
      </div>
    </div>
  );
}
