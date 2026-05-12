import { useState, useEffect } from 'react';
import { Bell, RefreshCw, Info } from 'lucide-react';
import ProjectInfoModal from './ProjectInfoModal';

export default function TopBar({ title, subtitle }: { title: string; subtitle: string }) {
  const [time, setTime] = useState(new Date());
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-white/10 bg-[#0b0e14cc] flex items-center justify-between px-6 shrink-0 sticky top-0 z-40 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <p className="text-xs text-[#94a3b8]">{subtitle}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-sm font-mono font-bold tracking-tighter">MAY 11, 2026</span>
            <div className="flex items-center gap-1.5 leading-none mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              <span className="text-[10px] text-[#ef4444] font-bold uppercase tracking-widest font-mono">CRISIS MODE ACTIVE</span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-[#1a2b3b]"></div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setShowInfo(true)}
              className="p-1.5 text-[#00f2ff] hover:text-white transition-colors bg-[#00f2ff10] rounded shadow-[0_0_10px_#00f2ff20]"
            >
              <Info className="w-5 h-5" />
            </button>
            <button className="relative p-1.5 text-[#94a3b8] hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020c14]" />
            </button>
            <button className="p-1.5 text-[#94a3b8] hover:text-white transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <ProjectInfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </>
  );
}
