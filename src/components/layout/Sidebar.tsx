import { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  AlertTriangle, 
  GitBranch, 
  MessageSquare, 
  Globe, 
  Cpu, 
  History,
  BookOpen
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const navItems = [
  { path: '/', icon: LayoutGrid, label: 'Command Center', desc: 'NASA mission control for logistics' },
  { path: '/risk-intelligence', icon: AlertTriangle, label: 'Risk Intelligence', desc: 'Early warning risk detection' },
  { path: '/digital-twin', icon: GitBranch, label: 'Digital Twin', desc: 'Virtual supply chain simulation' },
  { path: '/copilot', icon: MessageSquare, label: 'AI Copilot', desc: 'Chat with your fleet' },
  { path: '/about', icon: BookOpen, label: 'Project Info', desc: 'Technical documentation' },
];

const models = [
  { name: 'XGBoost Model', accuracy: '94.2%', status: 'green' },
  { name: 'LSTM Delay Pred.', accuracy: '91.8%', status: 'green' },
  { name: 'RL Route Optimizer', accuracy: '87.4%', status: 'amber', badge: 'Training' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-sidebar-background border-r border-[#1a2b3b] flex flex-col z-50">
      <div className="p-6 border-b border-white/5 bg-[#010c14]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded bg-[#00e5ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-transform hover:scale-110">
            <Globe className="w-5 h-5 text-[#020c14]" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight tracking-tight text-white uppercase">SupplyMind AI</h1>
            <p className="text-[9px] text-[#5e748d] font-bold uppercase tracking-tighter">Global Logistics Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#22c55e10] border border-[#22c55e30]">
          <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[10px] text-[#22c55e] font-mono font-bold tracking-widest uppercase">Live Tracking Active</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-[#00e5ff10] text-[#00e5ff] shadow-[inset_0_0_20px_rgba(0,229,255,0.05)] border border-[#00e5ff20]" 
                  : "text-[#94a3b8] hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "text-[#00e5ff]" : "text-[#94a3b8] group-hover:text-white group-hover:scale-110")} />
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                <span className="text-[9px] text-[#5e748d] font-medium leading-none mt-0.5">{item.desc}</span>
              </div>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#00e5ff]"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-5 bg-[#010c14] border-t border-white/5 space-y-5">
        <div className="flex items-center gap-2">
           <Cpu className="w-3 h-3 text-[#00e5ff]" />
           <span className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-widest">AI Engine Stats</span>
        </div>
        
        <div className="space-y-4">
          {models.map((model) => (
            <div key={model.name} className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-[#5e748d] uppercase tracking-tighter">{model.name}</span>
                <span className={cn("font-mono", model.status === 'amber' ? "text-[#f59e0b]" : "text-[#22c55e]")}>
                  {model.accuracy}
                </span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: model.accuracy }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className={cn("h-full", model.status === 'amber' ? "bg-[#f59e0b]" : "bg-[#22c55e]")} 
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
           <p className="text-[9px] text-[#22c55e] font-mono uppercase font-bold tracking-tighter">● Last inference: 2s ago</p>
           {models.some(m => m.badge) && (
             <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest border border-blue-500/30">
               {models.find(m => m.badge)?.badge}
             </span>
           )}
        </div>
      </div>
    </div>
  );
}
