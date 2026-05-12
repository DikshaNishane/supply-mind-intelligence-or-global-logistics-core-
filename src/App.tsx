/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import CommandCenter from './pages/CommandCenter';
import RiskIntelligence from './pages/RiskIntelligence';
import DigitalTwin from './pages/DigitalTwin';
import AICopilot from './pages/AICopilot';
import ProjectInfo from './pages/ProjectInfo';
import { Globe } from 'lucide-react';

const queryClient = new QueryClient();

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#020c14] flex flex-col items-center justify-center space-y-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-50" />
        <div className="relative">
          <Globe className="w-16 h-16 text-[#00e5ff] animate-pulse" />
          <div className="absolute inset-0 bg-[#00e5ff20] blur-2xl rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-1.5 z-10">
          <h2 className="text-2xl font-bold font-mono tracking-widest text-[#00e5ff] animate-pulse uppercase">SupplyMind AI</h2>
          <p className="text-[10px] text-[#5e748d] font-mono tracking-[0.3em] uppercase">The AI Brain for Global Logistics</p>
        </div>
        <div className="w-64 h-[1px] bg-[#1a2b3b] relative overflow-hidden z-10">
          <div className="absolute inset-y-0 h-full bg-[#00e5ff] animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
        </div>
        
        <div className="absolute bottom-10 left-10 text-[9px] font-mono text-[#5e748d] flex flex-col gap-1 uppercase tracking-widest opacity-30">
          <span>Booting nodes... OK</span>
          <span>Syncing fleet... 94%</span>
          <span>AI Precision: 0.992</span>
        </div>

        <style>{`
          @keyframes loading {
            0% { transform: translateX(-250%); }
            100% { transform: translateX(250%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/risk-intelligence" element={<RiskIntelligence />} />
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/copilot" element={<AICopilot />} />
            <Route path="/about" element={<ProjectInfo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

