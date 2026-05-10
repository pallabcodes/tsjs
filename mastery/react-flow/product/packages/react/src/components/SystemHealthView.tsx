import { useMeshStore, cn } from '@ostream/core';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Network, 
  ShieldCheck, 
  Zap, 
  Database, 
  Server,
  AlertTriangle,
  RefreshCcw,
  Terminal,
  Lock
} from 'lucide-react';


export const SystemHealthView = () => {
  const { systemStats, devices } = useMeshStore();

  const statusItems = [
    { label: 'Inference Latency', value: `${systemStats.inferenceLatency.toFixed(1)}ms`, icon: Zap, status: 'nominal', sub: 'Edge Compute Node 01' },
    { label: 'Storage Throughput', value: `${systemStats.storageThroughput.toFixed(0)} MB/s`, icon: HardDrive, status: 'nominal', sub: 'RAID-6 NVMe Array' },
    { label: 'Network Jitter', value: `${systemStats.networkJitter.toFixed(2)}ms`, icon: Network, status: 'warning', sub: 'WAN Backbone 04' },
    { label: 'System Uptime', value: '14d 22h 12m', icon: Activity, status: 'nominal', sub: 'Last restart: 04/25' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#020202] text-white/90 font-mono overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-8 border-b border-white/[0.05] bg-[#050505]">
        <div className="flex items-center gap-4">
           <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded">
              <Server size={18} className="text-indigo-500" />
           </div>
           <div>
              <h1 className="text-[12px] font-bold uppercase tracking-widest">Infrastructure Observability</h1>
              <p className="text-[9px] text-white/30 uppercase tracking-tighter">Cluster: SOVEREIGN_NORTH_HUB // Node: L7_CORE_01</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <ShieldCheck size={12} className="text-indigo-500" />
              <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">Security Protocol: ZERO_TRUST_ACTIVE</span>
           </div>
           <button className="flex items-center gap-2 text-[10px] text-white/40 hover:text-white transition-colors uppercase">
              <RefreshCcw size={14} /> Full Diagnostics
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          
          {/* Top Level Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {statusItems.map((item, i) => (
               <div key={i} className="p-5 bg-white/[0.02] border border-white/[0.05] rounded-xl flex flex-col gap-4 group hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center justify-between">
                     <div className="p-2 bg-black/40 border border-white/5 rounded-lg text-white/40 group-hover:text-indigo-500 transition-colors">
                        <item.icon size={18} />
                     </div>
                     <div className={cn(
                       "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
                       item.status === 'nominal' ? "bg-indigo-500/10 text-indigo-500" : "bg-vms-amber-500/10 text-vms-amber-500"
                     )}>
                        {item.status}
                     </div>
                  </div>
                  <div>
                     <div className="text-2xl font-bold tracking-tighter tabular-nums">{item.value}</div>
                     <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-1">{item.label}</div>
                     <div className="text-[8px] text-white/20 uppercase mt-2 font-mono tracking-tighter">{item.sub}</div>
                  </div>
               </div>
             ))}
          </div>

          {/* Detailed Performance Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Compute Load */}
             <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                   <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-indigo-500" />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Compute Resource Allocation</span>
                   </div>
                   <span className="text-[9px] text-white/20 uppercase tracking-widest font-mono">Live Utilization</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] text-white/40 uppercase font-bold">CPU Core Load (32-Thread)</span>
                         <span className="text-[10px] font-mono text-indigo-500">{systemStats.cpuLoad.toFixed(1)}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${systemStats.cpuLoad}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[8px] text-white/20 font-mono">
                         <span>MIN: 12.4%</span>
                         <span>AVG: 42.1%</span>
                         <span>MAX: 88.9%</span>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] text-white/40 uppercase font-bold">GPU Tensor Cores (AI Inference)</span>
                         <span className="text-[10px] font-mono text-indigo-500">{systemStats.gpuLoad.toFixed(1)}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${systemStats.gpuLoad}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[8px] text-white/20 font-mono">
                         <span>VRAM: 8.4GB / 24GB</span>
                         <span>TEMP: 62°C</span>
                         <span>FPS: 58/60</span>
                      </div>
                   </div>
                </div>

                {/* Simulated Waveform for Network */}
                <div className="mt-4 p-6 bg-[#030303] border border-white/5 rounded-xl h-48 relative overflow-hidden flex items-center justify-center group">
                   <div className="absolute inset-0 opacity-10 flex items-center justify-around px-8">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1 bg-indigo-500 rounded-full transition-all duration-300" 
                          style={{ height: `${20 + Math.random() * 60}%` }} 
                        />
                      ))}
                   </div>
                   <div className="relative z-10 flex flex-col items-center gap-2">
                      <TrendingUp size={24} className="text-indigo-500/40 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Real-Time Telemetry Stream</span>
                   </div>
                   <div className="absolute top-2 right-2 flex items-center gap-2 px-2 py-0.5 bg-black/40 border border-white/5 rounded text-[8px] text-white/40 font-mono">
                      <span>PACKETS_IN: 12.4k/s</span>
                      <span>PACKETS_OUT: 8.2k/s</span>
                   </div>
                </div>
             </div>

             {/* Right Sidebar Status */}
             <div className="flex flex-col gap-6">
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-xl flex flex-col gap-6">
                   <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                      <Database size={16} className="text-indigo-500" />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Storage Cluster Health</span>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold">
                         <span className="text-white/40">Archive Vault A</span>
                         <span className="text-indigo-500">Nominal</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold">
                         <span className="text-white/40">Hot Storage B</span>
                         <span className="text-indigo-500">Nominal</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold">
                         <span className="text-white/40">Metadata Cache</span>
                         <span className="text-indigo-500">Indexing...</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold">
                         <span className="text-white/40">Backup Target</span>
                         <span className="text-red-500 flex items-center gap-1"><AlertTriangle size={12} /> Offline</span>
                      </div>
                   </div>
                   <div className="pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] text-white/20 uppercase font-bold">Total Capacity</span>
                         <span className="text-[10px] text-white/60 font-mono uppercase">1.2 PB / 4.0 PB</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 opacity-60" style={{ width: '30%' }} />
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex flex-col gap-4">
                   <div className="flex items-center gap-2">
                      <Lock size={16} className="text-indigo-500" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">Security Matrix</span>
                   </div>
                   <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                         <span className="text-[9px] text-white/60 uppercase">AES-256-GCM Encryption Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                         <span className="text-[9px] text-white/60 uppercase">Mutual TLS Authentication Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                         <span className="text-[9px] text-white/60 uppercase">Firmware Hash Verification Pass</span>
                      </div>
                   </div>
                </div>
             </div>

          </div>

          {/* Node Fleet Status */}
          <div className="flex flex-col gap-4 pb-20">
             <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                   <Terminal size={16} className="text-indigo-500" />
                   <span className="text-[11px] font-bold uppercase tracking-widest">Active Device Inventory & Node Fleet</span>
                </div>
                <span className="text-[9px] text-white/20 uppercase font-mono tracking-widest">{devices.length} Nodes Discovered</span>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {devices.map(device => (
                  <div key={device.id} className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg flex flex-col gap-2 group hover:border-indigo-500/30 transition-all">
                     <div className="flex items-center justify-between">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          device.status === 'online' ? "bg-indigo-500 animate-pulse" : "bg-red-500"
                        )} />
                        <span className="text-[7px] text-white/20 font-mono tracking-widest uppercase">ID: {device.id.split('-')[1]}</span>
                     </div>
                     <span className="text-[9px] font-bold text-white/60 uppercase group-hover:text-indigo-500 transition-colors truncate">{device.label}</span>
                     <div className="flex items-center justify-between">
                        <span className="text-[8px] text-white/20 font-mono">{device.status === 'online' ? '1.4 Gbps' : '0.0 Gbps'}</span>
                        <span className="text-[8px] text-white/20 font-mono">{device.status === 'online' ? '41°C' : '--'}</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>

      {/* Footer Diagnostic Ticker */}
      <div className="h-10 border-t border-white/5 bg-[#050505] flex items-center justify-between px-8 shrink-0">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
               <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Sovereign OS Kernel v1.4.2-STABLE</span>
            </div>
            <span className="text-[9px] text-white/10 uppercase tracking-tighter">SECURE_TUNNEL: ESTABLISHED // HEARTBEAT: NOMINAL</span>
         </div>
         <span className="text-[9px] text-white/10 font-mono tracking-tighter uppercase">DIAGNOSTIC_TOKEN: {Math.random().toString(36).substring(7).toUpperCase()}</span>
      </div>
    </div>
  );
};

const TrendingUp = ({ size, className }: { size: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
