import { useState, useEffect, useRef, useMemo } from 'react';
import TopBar from '../components/layout/TopBar';
import { shipments, riskEvents, kpiData } from '../lib/mockData';
import { cn } from '../lib/utils';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  Zap, 
  Cpu, 
  BarChart2, 
  ArrowRight,
  TrendingDown,
  Globe,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSimulation } from '../hooks/useSimulation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const quickActions = [
  "Predict delay impact",
  "Reroute fleet away from Hormuz",
  "Fuel price analysis",
  "Risk assessment in Shanghai",
  "Optimize carbon footprint"
];

export default function AICopilot() {
  const { state: simState } = useSimulation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const systemInstruction = useMemo(() => `You are "SupplyMind AI", a world-class supply chain intelligence assistant.
You have access to a real-time global logistics fleet.

LIVE CORE STATE:
- Scenario: ${simState.scenario} (Threat level: ${simState.threatLevel.toFixed(1)}%)
- Active Neural Alerts: ${simState.activeAlerts}
- Fleet Overview: ${JSON.stringify(shipments.slice(0, 5))}...
- KPIs: Fuel Cost $${(kpiData.fuelCostM + simState.threatLevel * 0.1).toFixed(1)}M, Risk ${simState.threatLevel.toFixed(1)}/100.

GUIDELINES:
1. Be technical, futuristic, and precise.
2. If scenario is NOT "normal", prioritize tactical mitigations for that specific event (e.g. if Hormuz is blocked, discuss fuel surges and insurance premiums).
3. Use Markdown formatting.
4. Keep responses concise but information-dense.`, [simState]);

  useEffect(() => {
    setMessages([{
      id: 'init',
      role: 'assistant',
      content: "### Neural Core Initialized\nSupplyMind AI online. I'm currently monitoring global trade lanes with 91.8% predictive accuracy. How can I optimize your logistics network today?"
    }]);
  }, []);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }],
            })),
            { role: 'user', parts: [{ text }] }
          ],
          systemInstruction
        })
      });

      const data = await response.json();
      const aiContent = data.text || data.error || "Neural core timeout. Please retrying uplink.";
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: aiContent 
      }]);
    } catch (error) {
      console.error("Neural Error:", error);
      setMessages(prev => [...prev, { 
        id: 'err', 
        role: 'assistant', 
        content: "### Link Failure\nI've experienced a synchronization error with the satellite uplink. Please verify your priority access credentials." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-[#020c14] text-[#e0f7fa]"
    >
      <TopBar 
        title="AI Supply Chain Copilot" 
        subtitle="Autonomous conversational intelligence for logistics optimization." 
      />

      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full grid grid-cols-4 gap-6">
          
          {/* Chat Area */}
          <div className="col-span-3 flex flex-col rounded-xl border border-[#1a2b3b] bg-[#010c14cc] overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#00e5ff50] to-transparent" />
            
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-dot-pattern"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex items-start gap-4 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse text-right" : "text-left"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded shrink-0 border flex items-center justify-center",
                    msg.role === 'assistant' 
                      ? "bg-[#020c14] border-[#00e5ff30] text-[#00e5ff]" 
                      : "bg-[#1a2b3b] border-[#ffffff15] text-white"
                  )}>
                    {msg.role === 'assistant' ? <Bot size={16} /> : <div className="text-[10px] font-bold font-mono">USER</div>}
                  </div>
                  
                  <div className={cn(
                    "p-4 rounded-xl text-[13px] leading-relaxed relative",
                    msg.role === 'assistant' 
                      ? "bg-[#020c14] border border-[#1a2b3b] text-[#e0f7fa]" 
                      : "bg-[#00e5ff15] border border-[#00e5ff30] text-[#00e5ff] font-medium"
                  )}>
                    {msg.role === 'assistant' ? (
                      <div className="space-y-4 prose-compact">
                        {msg.content.split('\n\n').map((para, i) => (
                          <div key={i}>
                            {para.startsWith('###') ? (
                              <h4 className="text-[#00f2ff] font-bold uppercase tracking-widest text-[11px] mb-2 flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" /> {para.replace('### ', '')}
                              </h4>
                            ) : para.startsWith('*') || para.startsWith('-') ? (
                              <ul className="space-y-2">
                                {para.split('\n').map((li, j) => (
                                  <li key={j} className="flex gap-2.5 items-start text-[#94a3b8]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] mt-2 shrink-0 shadow-[0_0_5px_#00f2ff]" />
                                    <span>{li.replace(/^[*-] /, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-[#94a3b8]">{para.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                            )}
                          </div>
                        ))}
                        {msg.content.includes('Recommended Mitigations') && (
                          <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                            <button className="px-4 py-2 bg-[#00f2ff] text-[#0b0e14] text-[10px] font-bold uppercase tracking-widest rounded hover:glow-cyan transition-all flex items-center gap-2">
                              Execute Reroute
                              <ArrowRight className="w-3 h-3" />
                            </button>
                            <button className="px-4 py-2 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white/10 transition-all">
                              Simulate Impact
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-[#020c14] border border-[#00e5ff30] text-[#00e5ff] flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 px-4 rounded-xl bg-[#020c14] border border-[#1a2b3b] flex gap-1.5">
                    <div className="w-1 h-1 bg-[#00e5ff] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-1 h-1 bg-[#00e5ff] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-1 bg-[#00e5ff] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Row */}
            <div className="p-5 border-t border-[#1a2b3b] bg-[#01080ecc]">
              {messages.length < 2 && !isLoading && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickActions.map(action => (
                    <button 
                      key={action}
                      onClick={() => handleSend(action)}
                      className="px-3 py-1.5 rounded-full border border-[#1a2b3b] bg-[#020c14] hover:border-[#00e5ff] transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 text-[#94a3b8] hover:text-[#00e5ff]"
                    >
                      <Sparkles className="w-3 h-3" />
                      {action}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="QUERY FLEET INTELLIGENCE ENGINE..."
                  className="w-full bg-[#020c14] border border-[#1a2b3b] rounded-xl py-3.5 pl-5 pr-32 text-xs font-mono tracking-wider focus:outline-none focus:border-[#00e5ff30] transition-all placeholder:text-[#5e748d] placeholder:italic"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <span className="text-[9px] font-bold text-[#5e748d] bg-[#1a2b3b] px-1.5 py-0.5 rounded hidden sm:inline-block font-mono">ENTER</span>
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="p-2 bg-[#00e5ff] text-[#020c14] rounded-lg transition-all disabled:opacity-30 hover:glow-cyan shadow-lg shadow-[#00e5ff20]"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-[#1a2b3b] bg-[#010c14] p-4 flex flex-col gap-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#ef4444]" />
                Live Risk Stream
              </h3>
              <div className="space-y-2">
                {riskEvents.filter(e => e.active).slice(0, 3).map(e => (
                   <div key={e.id} className="p-3 bg-[#020c14] rounded-lg border border-[#1a2b3b] hover:border-[#ef444430] transition-all">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-bold text-[#e0f7fa]">{e.title}</span>
                        <div className={cn(
                          "px-1 py-0.5 rounded text-[8px] font-bold uppercase",
                          e.severity === 'critical' ? "bg-[#ef444415] text-[#ef4444]" : "bg-[#f59e0b15] text-[#f59e0b]"
                        )}>{e.severity}</div>
                      </div>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-[9px] text-[#5e748d] uppercase tracking-tighter">{e.region}</span>
                        <span className="text-[10px] font-bold text-[#ef4444]">-${(e.estimated_impact_usd / 1000000).toFixed(1)}M</span>
                      </div>
                   </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#1a2b3b] bg-[#010c14] p-4 flex flex-col gap-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#00e5ff]" />
                Engine Precision
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'XGBoost Risk', acc: 94.2, color: 'bg-[#00e5ff]' },
                  { name: 'LSTM Delay', acc: 91.8, color: 'bg-[#22c55e]' },
                  { name: 'RL Route Opt.', acc: 87.4, color: 'bg-[#f59e0b]' },
                  { name: 'Transformer', acc: 89.1, color: 'bg-[#00e5ff]' },
                ].map(model => (
                  <div key={model.name} className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold font-mono tracking-wider uppercase">
                      <span className="text-[#94a3b8]">{model.name}</span>
                      <span className="text-[#00e5ff]">{model.acc}%</span>
                    </div>
                    <div className="w-full bg-[#1a2b3b] h-0.5 rounded-full overflow-hidden">
                      <div className={cn("h-full transition-all duration-1000", model.color)} style={{ width: `${model.acc}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#00e5ff30] bg-[#00e5ff08] p-4 text-center border-dashed">
              <Globe className="w-6 h-6 text-[#00e5ff] mx-auto mb-2 opacity-30" />
              <p className="text-[9px] font-mono font-bold uppercase text-[#5e748d] tracking-widest leading-loose">
                System Core: 4.2.0-STABLE<br />
                Nodes: [ 1,120 ] Active
              </p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
