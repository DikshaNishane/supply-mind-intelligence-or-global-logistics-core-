import { motion, AnimatePresence } from 'motion/react';
import { Info, X, Zap, Target, Rocket, AlertCircle } from 'lucide-react';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectInfoModal({ isOpen, onClose }: ProjectInfoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#020c14] border border-[#1a2b3b] rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#00f2ff10] to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00f2ff10] rounded-lg">
                  <Info className="w-5 h-5 text-[#00f2ff]" />
                </div>
                <h2 className="text-lg font-bold text-white uppercase tracking-widest">SupplyMind AI: Project Overview</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#5e748d]" />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <section className="space-y-3">
                <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Problem Statement
                </h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  Global supply chains are increasingly vulnerable to "Regime Shifts" — rapid, high-impact disruptions like the **Hormuz Crisis**, Red Sea volatility, and climate-driven port failures. Traditional logistics systems are reactive, opaque, and fail to quantify the multi-dimensional risks (financial, operational, and geopolitical) in real-time.
                </p>
              </section>

              <div className="grid grid-cols-2 gap-6">
                <section className="space-y-3">
                  <h3 className="text-xs font-black text-[#00f2ff] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Aim & Objective
                  </h3>
                  <p className="text-[13px] text-[#94a3b8] leading-relaxed">
                    To build an autonomous **Logistics Intelligence Engine** that leverages XGBoost and LSTM neural networks to predict disruptions before they manifest.
                    <br /><br />
                    - **Real-time Digital Twin**: Visualize the global fleet in 3D.<br />
                    - **Risk Quantification**: Assign financial "War-Risk" scores to every shipment.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Rocket className="w-4 h-4" />
                    Future Scope
                  </h3>
                  <p className="text-[13px] text-[#94a3b8] leading-relaxed">
                    Integration with **Blockchain smart contracts** for automated Force Majeure claims, and **Quantum-Annealing** for sub-second global route optimization during total choke-point failures.
                  </p>
                </section>
              </div>

              <div className="p-4 bg-[#00f2ff05] border border-[#00f2ff20] rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#00f2ff40] flex items-center justify-center animate-spin-slow">
                    <Zap className="w-6 h-6 text-[#00f2ff]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase mb-1">May 11, 2026 Readiness</h4>
                    <p className="text-[11px] text-[#5e748d]">System synchronized with Hormuz Regime-Shift telemetry.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#01080e] border-t border-white/5 flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-[#00f2ff] text-[#020c14] text-xs font-bold uppercase tracking-widest rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#00f2ff20]"
              >
                Acknowledge
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
