import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext: string;
  trend: string;
  trendDir: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'amber';
  glow?: boolean;
}

const colorMap = {
  blue: {
    border: 'border-[#00e5ff15]',
    icon: 'bg-[#00e5ff15] border-[#00e5ff30] text-[#00e5ff]',
    glow: 'glow-cyan',
    accent: 'text-[#00e5ff]'
  },
  green: {
    border: 'border-[#22c55e15]',
    icon: 'bg-[#22c55e15] border-[#22c55e30] text-[#22c55e]',
    glow: 'glow-green',
    accent: 'text-[#22c55e]'
  },
  red: {
    border: 'border-[#ef444430] bg-gradient-to-br from-[#ef444405] to-transparent',
    icon: 'bg-[#ef444415] border-[#ef444430] text-[#ef4444]',
    glow: 'glow-red',
    accent: 'text-[#ef4444]'
  },
  amber: {
    border: 'border-[#f59e0b15]',
    icon: 'bg-[#f59e0b15] border-[#f59e0b30] text-[#f59e0b]',
    glow: 'glow-amber',
    accent: 'text-[#f59e0b]'
  }
};

export default function KPICard({ title, value, unit, subtext, trend, trendDir, icon: Icon, color, glow }: KPICardProps) {
  const styles = colorMap[color];
  const TrendIcon = trendDir === 'up' ? TrendingUp : trendDir === 'down' ? TrendingDown : Minus;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative rounded-xl p-4 border bg-[#010c14] overflow-hidden transition-all group hover:border-[#ffffff15]",
        styles.border,
        glow && styles.glow
      )}
    >
      {color === 'blue' && (
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#00e5ff] opacity-5 blur-2xl transition-opacity group-hover:opacity-10" />
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div className={cn("p-2 rounded-lg border", styles.icon)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className={cn("flex items-center gap-1 text-[10px] font-mono font-bold uppercase", trendDir === 'up' ? "text-[#22c55e]" : trendDir === 'down' ? "text-[#ef4444]" : "text-[#94a3b8]")}>
          {trendDir === 'up' && '+'}
          {trend}
        </div>
      </div>

      <div className="space-y-0.5">
        <h3 className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono tracking-tight text-[#e0f7fa]">
            {value}
          </span>
          {unit && <span className="text-xs font-mono text-[#94a3b8]">{unit}</span>}
        </div>
      </div>
      
      {subtext && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-0.5 bg-[#1a2b3b] rounded-full overflow-hidden">
            <div 
              className={cn("h-full", trendDir === 'up' ? "bg-[#22c55e]" : trendDir === 'down' ? "bg-[#ef4444]" : "bg-[#00e5ff]")} 
              style={{ width: '65%' }} 
            />
          </div>
          <span className="text-[9px] text-[#5e748d] font-mono whitespace-nowrap uppercase">{subtext}</span>
        </div>
      )}
    </motion.div>
  );
}
