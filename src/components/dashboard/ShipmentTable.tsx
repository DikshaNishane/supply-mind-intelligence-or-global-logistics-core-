import { shipments } from '../../lib/mockData';
import { cn } from '../../lib/utils';
import { Clock, Ship, AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';

const statusConfig = {
  in_transit: { label: 'In Transit', icon: Ship, class: 'bg-[#22c55e15] text-[#22c55e] border-[#22c55e40]' },
  delayed: { label: 'Delayed', icon: Clock, class: 'bg-[#f59e0b15] text-[#f59e0b] border-[#f59e0b40]' },
  delivered: { label: 'Delivered', icon: CheckCircle2, class: 'bg-[#00e5ff15] text-[#00e5ff] border-[#00e5ff40]' },
  at_risk: { label: 'At Risk', icon: AlertCircle, class: 'bg-[#ef444415] text-[#ef4444] border-[#ef444440]' },
  rerouted: { label: 'Rerouted', icon: RotateCw, class: 'bg-purple-500/15 text-purple-400 border-purple-500/40' },
};

export default function ShipmentTable() {
  return (
    <div className="shrink-0 h-[320px] bg-[#010c14] border border-[#1a2b3b] rounded-xl overflow-hidden flex flex-col mt-4">
      <div className="p-3 border-b border-[#1a2b3b] flex justify-between items-center bg-[#020c14]">
        <h3 className="text-xs font-bold uppercase tracking-wider">High Priority Shipments</h3>
        <button className="text-[10px] text-[#00e5ff] border border-[#00e5ff40] px-2 py-1 rounded hover:bg-[#00e5ff10] transition-colors font-bold uppercase font-mono">
          View All Logs
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-[#0a1628] text-[#94a3b8] font-mono text-[10px] uppercase z-10">
            <tr className="border-b border-[#1a2b3b]">
              <th className="px-4 py-2 font-medium">Tracking ID</th>
              <th className="px-4 py-2 font-medium">Route</th>
              <th className="px-4 py-2 font-medium">Vessel</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">ETA & Schedule</th>
              <th className="px-4 py-2 font-medium">Risk Score</th>
              <th className="px-4 py-2 font-medium text-right">CO2 Footprint</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a2b3b]">
            {(shipments || []).map((s, idx) => {
              if (!s) return null;
              const config = statusConfig[(s?.status as keyof typeof statusConfig) || 'in_transit'] || statusConfig.in_transit;
              const StatusIcon = config.icon || Ship;
              
              return (
                <tr key={s?.id || idx} className="hover:bg-[#ffffff05] transition-colors group">
                  <td className="px-4 py-2.5 font-mono text-[#00e5ff]">
                    {s?.tracking_id || 'N/A'}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-[#e0f7fa]">{s?.origin || '---'} &rarr; {s?.destination || '---'}</span>
                      <span className="text-[9px] text-[#5e748d] font-mono">{s?.route_id || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                       <Ship className="w-3 h-3 text-[#94a3b8]" />
                       <span className="font-medium">{s?.vessel_name || 'Vessel'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase border", config.class)}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {config.label}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-col whitespace-nowrap">
                      <span className="font-medium font-mono">{s?.eta || 'TBD'}</span>
                      {(s?.delay_days || 0) > 0 ? (
                        <span className="text-[9px] text-[#ef4444] font-bold uppercase font-mono">Delayed: +{s.delay_days}d</span>
                      ) : (
                        <span className="text-[9px] text-[#22c55e] font-bold uppercase font-mono tracking-tighter">On Schedule</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 min-w-[120px]">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className={cn("font-bold", (s?.risk_score || 0) > 75 ? "text-[#ef4444]" : (s?.risk_score || 0) > 50 ? "text-[#f59e0b]" : "text-[#22c55e]")}>
                          Score: {s?.risk_score || 0}
                        </span>
                        <span className="text-[#5e748d]">Conf: 96%</span>
                      </div>
                      <div className="w-full h-1 bg-[#1a2b3b] rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-500", (s?.risk_score || 0) > 75 ? "bg-[#ef4444]" : (s?.risk_score || 0) > 50 ? "bg-[#f59e0b]" : "bg-[#22c55e]")}
                          style={{ width: `${s?.risk_score || 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-[#94a3b8]">
                    {(s?.carbon_kg || 0).toLocaleString()} <span className="text-[9px]">KG</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
