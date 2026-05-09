import { useMeshStore, cn } from '@ostream/core';
import { 
  Globe, 
  ShieldAlert, 
  Navigation, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  Satellite, 
  Radio, 
  Layers, 
  Box
} from 'lucide-react';
import { useState, useMemo } from 'react';

export const CampusMap = () => {
  const { setActiveSite } = useMeshStore();
  const [zoom, setZoom] = useState(1);
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);

  // High-density urban grid simulation
  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 20; i++) {
      lines.push(<line key={`h-${i}`} x1="0" y1={i * 50} x2="2000" y2={i * 50} className="stroke-white/[0.03]" />);
      lines.push(<line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="1000" className="stroke-white/[0.03]" />);
    }
    return lines;
  }, []);

  const sites = [
    { id: 'hq-primary', label: 'HQ_NORTH_CAMPUS', x: 500, y: 350, status: 'critical', alarms: 2, sub: 'Sector 7G // Main Lab', buildings: 12 },
    { id: 'site-b', label: 'R&D_DATA_VAULT', x: 1200, y: 250, status: 'nominal', alarms: 0, sub: 'Sector 4A // Cold Storage', buildings: 4 },
    { id: 'site-c', label: 'LOGISTICS_ZONE_04', x: 1400, y: 650, status: 'nominal', alarms: 0, sub: 'Sector 9B // Distribution', buildings: 8 },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#020202] text-white/90 font-mono overflow-hidden select-none relative">
      {/* 1. TOP NAVIGATION & STATUS BAR */}
      <div className="h-16 flex items-center justify-between px-8 border-b border-white/[0.05] bg-[#050505] z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-vms-accent/10 border border-vms-accent/20 rounded">
                <Globe size={20} className="text-vms-accent" />
             </div>
             <div>
                <h1 className="text-[14px] font-black uppercase tracking-tighter italic">Sovereign <span className="text-vms-accent">GIS</span></h1>
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Global Site Observability // Site_01_HQ</p>
             </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-4">
             <div className="flex flex-col">
                <span className="text-[8px] text-white/20 uppercase font-bold">Inference Latency</span>
                <span className="text-[10px] text-vms-emerald-500 font-bold tabular-nums tracking-tighter">12.4ms // SYNCED</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[8px] text-white/20 uppercase font-bold">Active Satellites</span>
                <span className="text-[10px] text-white/60 font-bold tabular-nums tracking-tighter">OS_GEO_04, OS_GEO_09</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-md">
              <ShieldAlert size={14} className="text-red-500 animate-pulse" />
              <div className="flex flex-col">
                 <span className="text-[9px] text-red-400 font-black uppercase leading-none">2 ACTIVE ALARMS</span>
                 <span className="text-[7px] text-red-500/50 uppercase font-bold tracking-widest">Immediate Response Required</span>
              </div>
           </div>
           <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase hover:text-white transition-colors cursor-pointer">
              <Layers size={16} /> Vector Layers
           </div>
        </div>
      </div>

      {/* 2. MAP CANVAS AREA */}
      <div className="flex-1 relative overflow-hidden bg-[#030303]">
        {/* Background Urban Blueprint Simulation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <svg className="w-full h-full">
              {gridLines}
              {/* Complex Road Network Simulation */}
              <path d="M 200 0 L 200 1000 M 0 300 L 2000 300 M 0 700 L 2000 700 M 800 0 L 800 1000 M 1600 0 L 1600 1000" className="stroke-white/[0.05] fill-none" strokeWidth="2" />
              <path d="M 200 300 L 800 700 M 800 300 L 1600 700" className="stroke-white/[0.02] fill-none" strokeWidth="4" />
              
              {/* Urban Sector Outlines */}
              <rect x="250" y="50" width="300" height="200" className="fill-white/[0.01] stroke-white/[0.05]" />
              <rect x="900" y="400" width="400" height="250" className="fill-white/[0.01] stroke-white/[0.05]" />
              <rect x="1650" y="100" width="200" height="400" className="fill-white/[0.01] stroke-white/[0.05]" />
           </svg>
        </div>

        {/* Floating Coordinates Ticker */}
        <div className="absolute top-8 left-8 p-4 bg-black/80 backdrop-blur-md border border-white/5 rounded-lg z-20 pointer-events-none">
           <div className="flex items-center gap-2 mb-2 text-vms-accent">
              <Satellite size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">GPS_TELEMETRY</span>
           </div>
           <div className="space-y-1 font-mono">
              <div className="text-[10px] text-white/40 tabular-nums">LAT: 37.774929</div>
              <div className="text-[10px] text-white/40 tabular-nums">LON: -122.419416</div>
              <div className="text-[10px] text-vms-emerald-500 tabular-nums uppercase font-bold mt-2">LOCK_STATUS: VERIFIED</div>
           </div>
        </div>

        {/* THE INTERACTIVE LAYER */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out" 
          style={{ transform: `scale(${zoom})` }}
        >
          <svg viewBox="0 0 2000 1000" className="w-[2000px] h-[1000px]">
            {/* Global Flow Lines (Simulating Network Traffic) */}
            <path d="M 500 350 L 1200 250" className="stroke-vms-accent/10 fill-none" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 1200 250 L 1400 650" className="stroke-vms-accent/10 fill-none" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 1400 650 L 500 350" className="stroke-red-500/20 fill-none" strokeWidth="1" strokeDasharray="4 4" />

            {/* Sites */}
            {sites.map((site) => {
              const isActive = hoveredSite === site.id;

              return (
                <g 
                  key={site.id} 
                  transform={`translate(${site.x}, ${site.y})`} 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredSite(site.id)}
                  onMouseLeave={() => setHoveredSite(null)}
                  onClick={() => setActiveSite(site.id as any)}
                >
                   {/* Radial Pulse Areas */}
                   <circle r={isActive ? 120 : 80} className={cn(
                     "transition-all duration-500",
                     site.status === 'critical' ? "fill-red-500/5 stroke-red-500/10" : "fill-vms-accent/5 stroke-vms-accent/10"
                   )} />
                   {site.status === 'critical' && (
                     <circle r="100" className="fill-red-500/5 stroke-red-500/10 animate-ping" />
                   )}
                   
                   {/* Blueprint Building Shapes (Simulated footprints) */}
                   <g className="opacity-40 group-hover:opacity-80 transition-opacity">
                      <rect x="-40" y="-40" width="30" height="50" className="fill-black stroke-white/10" />
                      <rect x="10" y="-30" width="40" height="20" className="fill-black stroke-white/10" />
                      <rect x="-20" y="20" width="60" height="30" className="fill-black stroke-white/10" />
                   </g>

                   {/* Main Node Indicator */}
                   <g>
                      <circle r="16" className="fill-black stroke-white/20" />
                      <circle r="6" className={cn(
                        "transition-all duration-300",
                        site.status === 'critical' ? "fill-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" : "fill-vms-accent shadow-[0_0_15px_rgba(0,243,255,0.8)]"
                      )} />
                   </g>

                   {/* Floating Metadata Card */}
                   <g transform="translate(30, -80)" className={cn(
                     "transition-all duration-300 origin-bottom-left",
                     isActive ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
                   )}>
                      <rect width="220" height="110" className="fill-black/90 backdrop-blur-xl stroke-vms-accent/30" />
                      <path d="M 0 110 L -10 120 L 10 110" className="fill-black/90 stroke-vms-accent/30" />
                      
                      <text x="15" y="25" className="fill-white text-[12px] font-black uppercase tracking-widest">{site.label}</text>
                      <text x="15" y="42" className="fill-white/40 text-[9px] uppercase font-bold">{site.sub}</text>
                      
                      <line x1="15" y1="55" x2="205" y2="55" className="stroke-white/10" />
                      
                      <g transform="translate(15, 70)">
                         <text x="0" y="0" className="fill-white/30 text-[8px] uppercase font-bold">Involved Nodes</text>
                         <text x="0" y="15" className="fill-white text-[10px] font-mono">{site.buildings} SENSORS</text>
                      </g>
                      <g transform="translate(110, 70)">
                         <text x="0" y="0" className="fill-white/30 text-[8px] uppercase font-bold">Threat Level</text>
                         <text x="0" y="15" className={cn(
                           "text-[10px] font-mono uppercase font-bold",
                           site.status === 'critical' ? "fill-red-500" : "fill-vms-emerald-500"
                         )}>{site.status === 'critical' ? 'HIGH_VULN' : 'NOMINAL'}</text>
                      </g>

                      {/* Click to Deep Dive Action */}
                      <g transform="translate(150, 85)" className="animate-pulse">
                         <text x="0" y="0" className="fill-vms-accent text-[9px] font-black uppercase tracking-tighter cursor-pointer">DEPLOY_VIEW &gt;</text>
                      </g>
                   </g>

                   {/* Floating Severity Tag */}
                   {site.status === 'critical' && (
                     <g transform="translate(-15, -45)">
                        <rect width="30" height="16" rx="4" className="fill-red-600 shadow-2xl" />
                        <ShieldAlert size={10} className="text-white absolute translate-x-2.5 translate-y-3" />
                     </g>
                   )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* 3. HUD SIDEBAR - ANALYTICS OVERLAY */}
        <div className="absolute top-20 right-8 w-72 flex flex-col gap-4 z-20">
           <div className="p-6 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                 <div className="flex items-center gap-2">
                    <Radio size={16} className="text-vms-accent" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/80">Site Topology</span>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-vms-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
              </div>

              <div className="space-y-4">
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-white/30">
                       <span>Total Active Perimeter</span>
                       <span className="text-white/80">14.2 km</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-vms-accent w-[68%]" />
                    </div>
                 </div>

                 <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-white/30">
                       <span>Data Sovereignty Index</span>
                       <span className="text-vms-emerald-500">99.98%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-vms-emerald-500 w-[99%]" />
                    </div>
                 </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/[0.03] border border-white/5 rounded">
                       <Box size={14} className="text-vms-accent" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold uppercase text-white/80 tracking-tighter">Campus Blueprint v2.1</span>
                       <span className="text-[8px] text-white/20 uppercase font-mono">Last Index: 12m ago</span>
                    </div>
                 </div>
                 <button className="w-full py-2.5 bg-vms-accent text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg">
                    Full Sector Scan
                 </button>
              </div>
           </div>

           {/* Mini Legend */}
           <div className="p-4 bg-black/60 backdrop-blur-md border border-white/5 rounded-lg grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-vms-accent" />
                 <span className="text-[8px] text-white/40 uppercase font-bold">Secure Zone</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 <span className="text-[8px] text-white/40 uppercase font-bold">Active Alarm</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-white/20" />
                 <span className="text-[8px] text-white/40 uppercase font-bold">Neutral Zone</span>
              </div>
              <div className="flex items-center gap-2">
                 <Radio size={10} className="text-white/20" />
                 <span className="text-[8px] text-white/40 uppercase font-bold">Relay Node</span>
              </div>
           </div>
        </div>

        {/* 4. NAVIGATION TOOLS (BOTTOM RIGHT) */}
        <div className="absolute bottom-10 right-10 flex flex-col gap-2 z-30">
           <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="w-12 h-12 bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-vms-accent transition-all shadow-2xl group hover:border-vms-accent/50">
              <ZoomIn size={20} />
           </button>
           <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="w-12 h-12 bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-vms-accent transition-all shadow-2xl group hover:border-vms-accent/50">
              <ZoomOut size={20} />
           </button>
           <div className="h-4" />
           <button onClick={() => setZoom(1)} className="w-12 h-12 bg-vms-accent text-black flex items-center justify-center transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:bg-white active:scale-95">
              <Crosshair size={22} />
           </button>
        </div>

        {/* 5. FOOTER HUD TIPS */}
        <div className="absolute bottom-10 left-10 flex items-center gap-4 z-30 pointer-events-none">
           <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/5 flex items-center gap-3">
              <Navigation size={14} className="text-vms-accent animate-pulse" />
              <div className="flex flex-col">
                 <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">Macro Geospatial Context</span>
                 <span className="text-[10px] text-white/80 uppercase font-bold">Select Active Node for Deployment</span>
              </div>
           </div>
           <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/5 flex flex-col">
              <span className="text-[8px] text-white/20 uppercase font-bold">Map Projection</span>
              <span className="text-[10px] text-white/60 font-mono tracking-tighter uppercase">WGS-84 // MERCATOR_TACTICAL</span>
           </div>
        </div>

        {/* 6. TACTICAL RADAR SWEEP (SVG Instrumentation) */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-30">
           <svg className="w-full h-full">
              <defs>
                 <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(0, 243, 255, 0)" />
                    <stop offset="80%" stopColor="rgba(0, 243, 255, 0.05)" />
                    <stop offset="100%" stopColor="rgba(0, 243, 255, 0.2)" />
                 </radialGradient>
                 
                 <mask id="radar-mask">
                    <rect width="100%" height="100%" fill="black" />
                    <path d="M 1000 500 L 1000 0 A 1000 1000 0 0 1 1800 200 Z" fill="white">
                       <animateTransform 
                         attributeName="transform" 
                         type="rotate" 
                         from="0 1000 500" 
                         to="360 1000 500" 
                         dur="6s" 
                         repeatCount="indefinite" 
                       />
                    </path>
                 </mask>
              </defs>

              {/* Radar Circles */}
              <circle cx="1000" cy="500" r="200" fill="none" stroke="rgba(0, 243, 255, 0.05)" strokeWidth="1" />
              <circle cx="1000" cy="500" r="400" fill="none" stroke="rgba(0, 243, 255, 0.05)" strokeWidth="1" />
              <circle cx="1000" cy="500" r="600" fill="none" stroke="rgba(0, 243, 255, 0.05)" strokeWidth="1" />
              <circle cx="1000" cy="500" r="800" fill="none" stroke="rgba(0, 243, 255, 0.05)" strokeWidth="1" />

              {/* The Sweep */}
              <circle cx="1000" cy="500" r="1000" fill="url(#radar-gradient)" mask="url(#radar-mask)" />
              
              {/* Detection Blips (Mock) */}
              <g>
                 {[
                   { x: 450, y: 320, color: 'vms-accent' },
                   { x: 1250, y: 280, color: 'vms-accent' },
                   { x: 1380, y: 620, color: 'vms-accent' },
                   { x: 550, y: 400, color: 'red-500' }
                 ].map((blip, i) => (
                   <g key={i} transform={`translate(${blip.x}, ${blip.y})`}>
                      <circle r="3" className={`fill-${blip.color} animate-pulse`} />
                      <circle r="12" className={`stroke-${blip.color} fill-none animate-ping opacity-20`} />
                   </g>
                 ))}
              </g>
           </svg>
        </div>
      </div>
    </div>
  );
};
