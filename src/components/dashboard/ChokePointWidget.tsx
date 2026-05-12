import React from 'react';
import { Anchor, AlertCircle, Ship } from 'lucide-react';

interface ChokePoint {
  name: string;
  status: string;
  intensity: 'critical' | 'high' | 'moderate' | 'low';
  description: string;
}

const chokePoints: ChokePoint[] = [
  { 
    name: 'Strait of Hormuz', 
    status: 'Effectively Closed', 
    intensity: 'critical', 
    description: 'Military blockade in effect. Cargo seizure risk at 95%.' 
  },
  { 
    name: 'Panama Canal', 
    status: 'Draft Restricted', 
    intensity: 'high', 
    description: 'Extreme El Niño drought. Draft limited to 44ft.' 
  },
  { 
    name: 'Suez Canal', 
    status: 'High Volatility', 
    intensity: 'high', 
    description: 'Ongoing security alerts. Insurance premiums +500%.' 
  }
];

const severityColors = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  moderate: 'bg-yellow-500',
  low: 'bg-green-500'
};

const ChokePointWidget = () => {
  return (
    <div className="bg-glass rounded-xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#e0f7fa] flex items-center gap-2">
          <Anchor className="w-4 h-4 text-[#00f2ff]" />
          Global Choke Point Status (May 2026)
        </h4>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#ff4b4b20] border border-[#ff4b4b40] rounded-full">
          <AlertCircle className="w-3 h-3 text-[#ff4b4b]" />
          <span className="text-[9px] font-black text-[#ff4b4b] uppercase">Global Siege Mode</span>
        </div>
      </div>

      <div className="space-y-6">
        {chokePoints.map((point) => (
          <div key={point.name} className="space-y-2">
            <div className="flex justify-between items-end">
              <div className="space-y-0.5">
                <span className="text-xs font-black text-white uppercase tracking-tighter">{point.name}</span>
                <p className="text-[9px] text-white/50 leading-tight">{point.description}</p>
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                point.intensity === 'critical' ? 'text-red-500' : 'text-orange-500'
              }`}>
                {point.status}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${severityColors[point.intensity]} transition-all duration-1000 shadow-[0_0_8px_currentColor]`}
                style={{ width: point.intensity === 'critical' ? '100%' : '75%' }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ship className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[10px] font-mono text-white/40 italic">70% reduction in Gulf traffic detected</span>
        </div>
        <button className="text-[10px] font-black text-[#00f2ff] uppercase hover:underline">Full Analysis</button>
      </div>
    </div>
  );
};

export default ChokePointWidget;
