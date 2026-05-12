import TopBar from '../components/layout/TopBar';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Brain, 
  Ship, 
  ShieldAlert, 
  Settings, 
  MessageSquare, 
  Globe, 
  Target,
  Zap,
  Layers,
  Database,
  Cloud,
  ChevronRight
} from 'lucide-react';

export default function ProjectInfo() {
  const sections = [
    {
      title: "SupplyMind AI — The AI Brain for Global Logistics",
      content: "Imagine companies like Amazon, FedEx, or Maersk transporting products across countries. This project acts as the central intelligence system that tracks, predicts, and optimizes these massive movements.",
      icon: Brain,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10"
    },
    {
      title: "1. Global Shipment Tracking",
      content: "Shows where shipments are moving on a live 3D world map. From ships in the Indian Ocean to trucks moving through European ports, everything is visible in real-time.",
      icon: Ship,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      title: "2. Predictive Delay Analytics",
      content: "The AI checks weather, port traffic, historical data, and fuel prices to predict delays before they happen. It warns: 'This shipment may get delayed by 3 days.'",
      icon: Target,
      color: "text-amber-400",
      bg: "bg-amber-400/10"
    },
    {
      title: "3. Autonomous Route Optimization",
      content: "If a route becomes risky (storm, congestion, war zone), the AI automatically suggests better alternatives, finding the safest and most cost-effective path.",
      icon: Zap,
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    },
    {
      title: "4. Digital Twin Simulation",
      content: "A virtual copy of the entire supply chain. Test scenarios like 'What if a port closes?' or 'What if fuel prices rise?' to see the impact before it happens in real life.",
      icon: Layers,
      color: "text-green-400",
      bg: "bg-green-400/10"
    }
  ];

  const dashboardPages = [
    { title: "Command Center", subtitle: "NASA mission control but for logistics.", desc: "Live map, KPI dashboards, fuel costs, and port traffic." },
    { title: "Risk Intelligence", subtitle: "Early warning system.", desc: "Calculates risk scores for each route based on real-world threats." },
    { title: "Digital Twin", subtitle: "The simulation engine.", desc: "Stress-test the supply chain with custom variables." },
    { title: "AI Copilot", subtitle: "Conversational intelligence.", desc: "Ask the AI for advice on routes and risk mitigation." }
  ];

  const stack = [
    { name: "FastAPI / Node.js", role: "Backend APIs", icon: Database },
    { name: "Kafka", role: "Real-time streaming", icon: Zap },
    { name: "DuckDB / PostgreSQL", role: "Databases & Analytics", icon: Database },
    { name: "Docker / K8s", role: "Deployment & Orchestration", icon: Cloud },
    { name: "Neural Intel Engine", role: "AI & ML Models", icon: Brain }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b0e14] text-[#e0f7fa] overflow-y-auto">
      <TopBar 
        title="Project Documentation" 
        subtitle="SupplyMind AI: Technical Overview and Core Principles" 
      />

      <div className="p-8 max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-block p-3 bg-cyan-400/20 rounded-2xl mb-4 border border-cyan-400/30">
            <BookOpen className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-4">SupplyMind AI</h1>
          <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Building the virtual nervous system for the world's most complex supply chains through real-time telemetry and predictive simulation.
          </p>
        </motion.div>

        {/* The "What" Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-glass border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
            >
              <div className={`p-2 w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-4`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-3">{s.title}</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed italic border-l-2 border-white/10 pl-4">
                {s.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Breakdown */}
        <div className="space-y-6 pt-10">
          <h2 className="text-xl font-bold uppercase tracking-widest text-[#e0f7fa] flex items-center gap-3">
            <span className="w-1 h-6 bg-cyan-400 rounded-full"></span>
            System Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardPages.map((page, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-5 hover:bg-white/[0.08] transition-all">
                <h4 className="text-[12px] font-black text-cyan-400 uppercase tracking-widest mb-1">{page.title}</h4>
                <p className="text-[10px] font-bold text-white uppercase mb-2 opacity-60 tracking-tight">{page.subtitle}</p>
                <p className="text-[10px] text-[#94a3b8] leading-relaxed">{page.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-6 pt-10 pb-20">
          <h2 className="text-xl font-bold uppercase tracking-widest text-[#e0f7fa] flex items-center gap-3">
            <span className="w-1 h-6 bg-[#f59e0b] rounded-full"></span>
            Technical Architecture
          </h2>
          <div className="flex flex-wrap gap-4">
            {stack.map((t, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-glass border border-white/5 px-6 py-4 rounded-xl flex-1 min-w-[200px]">
                <div className="p-2 bg-white/5 rounded-lg text-white/40">
                  <t.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">{t.name}</h4>
                  <p className="text-[9px] text-[#5e748d] uppercase font-mono">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
