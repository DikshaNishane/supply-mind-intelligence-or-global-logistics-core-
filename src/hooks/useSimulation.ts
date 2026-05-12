import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SimulationState {
  scenario: string;
  threatLevel: number;
  activeAlerts: number;
  timestamp: string;
}

export function useSimulation() {
  const [state, setState] = useState<SimulationState>({
    scenario: 'normal',
    threatLevel: 12,
    activeAlerts: 0,
    timestamp: new Date().toISOString(),
  });
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Attempt socket connection
    const s = io({
      reconnectionAttempts: 3,
      timeout: 5000
    });
    setSocket(s);

    s.on('neural_pulse', (data: SimulationState) => {
      setState(data);
    });

    s.on('simulation_update', (data: SimulationState) => {
      setState(data);
    });

    s.on('connect_error', () => {
      console.warn('Socket connection failed. Switching to local neural simulation.');
      s.disconnect();
    });

    // Local Simulation Fallback (Interval-based)
    const localInterval = setInterval(() => {
      if (!s.connected) {
        setState(prev => {
          const riskFluctuation = (Math.random() - 0.5) * 0.5;
          return {
            ...prev,
            threatLevel: Math.max(5, Math.min(95, prev.threatLevel + riskFluctuation)),
            timestamp: new Date().toISOString()
          };
        });
      }
    }, 3000);

    return () => {
      s.disconnect();
      clearInterval(localInterval);
    };
  }, []);

  const triggerScenario = useCallback(async (scenario: string) => {
    // Try server-side first
    try {
      const res = await fetch('/api/simulation/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Server trigger failed, applying local simulation state.');
    }

    // Local manual override
    setState(prev => {
      const isHormuz = scenario === 'hormuz_blockade';
      return {
        ...prev,
        scenario,
        threatLevel: isHormuz ? 92 : 15,
        activeAlerts: isHormuz ? 5 : 0,
        timestamp: new Date().toISOString()
      };
    });
  }, []);

  return { state, triggerScenario, isConnected: !!socket };
}
