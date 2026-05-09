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
import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';

// Generate custom SVG Icons for Leaflet
const createSiteIcon = (status: string) => {
  const isCritical = status === 'critical';
  const colorHex = isCritical ? '#ef4444' : '#00f3ff';
  const shadowHex = isCritical ? 'rgba(239,68,68,0.8)' : 'rgba(0,243,255,0.8)';
  
  const html = `
    <div style="position:relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(${isCritical ? '239,68,68' : '0,243,255'}, 0.05); border: 1px solid rgba(${isCritical ? '239,68,68' : '0,243,255'}, 0.1);">
      <div style="position:absolute; width: 16px; height: 16px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: black;"></div>
      <div style="position:absolute; width: 6px; height: 6px; border-radius: 50%; background: ${colorHex}; box-shadow: 0 0 10px ${shadowHex};"></div>
      ${isCritical ? '<div style="position:absolute; width: 32px; height: 32px; border-radius: 50%; background: transparent; border: 1px solid rgba(239,68,68,0.8); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
    </div>
  `;
  return divIcon({
    html,
    className: 'bg-transparent border-0',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const sites = [
  { id: 'hq-primary', label: 'KOLKATA_COMMAND', lat: 22.5726, lng: 88.3639, status: 'critical', alarms: 2, sub: 'Sector 7G // Main Lab', buildings: 12 },
  { id: 'site-b', label: 'R&D_DATA_VAULT_BLR', lat: 22.5750, lng: 88.3600, status: 'nominal', alarms: 0, sub: 'Sector 4A // Cold Storage', buildings: 4 },
  { id: 'site-c', label: 'LOGISTICS_ZONE_04', lat: 22.5700, lng: 88.3700, status: 'nominal', alarms: 0, sub: 'Sector 9B // Distribution', buildings: 8 },
];

// Helper to interact with the map from outer UI
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const TILE_LAYERS = {
  dark: {
    name: 'CARTODB DARK MATTER',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OSM contributors &copy; CARTO'
  },
  satellite: {
    name: 'ESRI SATELLITE',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri'
  },
  light: {
    name: 'OSM STANDARD',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap'
  }
};

export const CampusMap = () => {
  const { setActiveSite } = useMeshStore();
  const [zoomLevel, setZoomLevel] = useState(15);
  const [center, setCenter] = useState<[number, number]>([22.5726, 88.3639]);
  const [activeLayerId, setActiveLayerId] = useState<keyof typeof TILE_LAYERS>('dark');

  const handleZoomIn = useCallback(() => setZoomLevel(z => Math.min(z + 1, 18)), []);
  const handleZoomOut = useCallback(() => setZoomLevel(z => Math.max(z - 1, 10)), []);
  const handleRecenter = useCallback(() => {
    setCenter([22.5726, 88.3639]);
    setZoomLevel(15);
  }, []);

  const toggleLayer = () => {
    setActiveLayerId(current => {
      if (current === 'dark') return 'satellite';
      if (current === 'satellite') return 'light';
      return 'dark';
    });
  };

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
           <div 
             onClick={toggleLayer}
             className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase hover:text-white transition-colors cursor-pointer"
           >
              <Layers size={16} /> {TILE_LAYERS[activeLayerId].name}
           </div>
        </div>
      </div>

      {/* 2. LEAFLET MAP AREA */}
      <div className="flex-1 relative overflow-hidden bg-[#030303] z-0">
        <MapContainer 
          center={center} 
          zoom={zoomLevel} 
          zoomControl={false} 
          className="w-full h-full bg-[#030303]" 
          style={{ background: '#030303' }}
        >
          {/* Base Map */}
          <TileLayer
            url={TILE_LAYERS[activeLayerId].url}
            attribution={TILE_LAYERS[activeLayerId].attribution}
          />
          
          <MapController center={center} zoom={zoomLevel} />

          {/* Tactical Markers */}
          {sites.map(site => (
            <Marker 
              key={site.id} 
              position={[site.lat, site.lng]} 
              icon={createSiteIcon(site.status)}
              eventHandlers={{
                click: () => setActiveSite(site.id as any)
              }}
            >
              <Tooltip 
                direction="top" 
                offset={[0, -20]} 
                opacity={1} 
                className="custom-leaflet-tooltip"
              >
                <div className="bg-black/90 backdrop-blur-xl border border-vms-accent/30 w-56 p-0 rounded overflow-hidden">
                  <div className="p-3">
                    <div className="text-[12px] text-white font-black uppercase tracking-widest">{site.label}</div>
                    <div className="text-[9px] text-white/40 uppercase font-bold">{site.sub}</div>
                    <div className="h-px bg-white/10 my-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-white/30 uppercase font-bold">Involved Nodes</span>
                        <span className="text-[10px] text-white font-mono">{site.buildings} SENSORS</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[8px] text-white/30 uppercase font-bold">Threat Level</span>
                        <span className={cn(
                          "text-[10px] font-mono uppercase font-bold",
                          site.status === 'critical' ? "text-red-500" : "text-vms-emerald-500"
                        )}>{site.status === 'critical' ? 'HIGH_VULN' : 'NOMINAL'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-vms-accent/10 px-3 py-1.5 flex items-center justify-between border-t border-vms-accent/20 cursor-pointer hover:bg-vms-accent/20 transition-colors">
                    <span className="text-[9px] text-vms-accent font-black uppercase tracking-tighter">Deploy View</span>
                    <span className="text-[9px] text-vms-accent font-black uppercase">&gt;</span>
                  </div>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>

        {/* 6. TACTICAL RADAR SWEEP OVERLAY (Fixed to Viewport) */}
        <div className="absolute inset-0 pointer-events-none z-[400] overflow-hidden mix-blend-screen opacity-40">
           <svg className="w-full h-full" viewBox="0 0 2000 1000" preserveAspectRatio="xMidYMid slice">
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

              {/* Radar Rings */}
              <circle cx="1000" cy="500" r="200" fill="none" stroke="rgba(0, 243, 255, 0.05)" strokeWidth="1" />
              <circle cx="1000" cy="500" r="400" fill="none" stroke="rgba(0, 243, 255, 0.05)" strokeWidth="1" />
              <circle cx="1000" cy="500" r="600" fill="none" stroke="rgba(0, 243, 255, 0.05)" strokeWidth="1" />
              <circle cx="1000" cy="500" r="800" fill="none" stroke="rgba(0, 243, 255, 0.05)" strokeWidth="1" />

              {/* The Sweep */}
              <circle cx="1000" cy="500" r="1000" fill="url(#radar-gradient)" mask="url(#radar-mask)" />
              
              {/* Fake Crosshairs */}
              <line x1="1000" y1="480" x2="1000" y2="520" stroke="rgba(0, 243, 255, 0.3)" strokeWidth="1" />
              <line x1="980" y1="500" x2="1020" y2="500" stroke="rgba(0, 243, 255, 0.3)" strokeWidth="1" />
           </svg>
        </div>

        {/* Floating Coordinates Ticker */}
        <div className="absolute top-8 left-8 p-4 bg-black/80 backdrop-blur-md border border-white/5 rounded-lg z-[500] pointer-events-none">
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

        {/* 3. HUD SIDEBAR - ANALYTICS OVERLAY */}
        <div className="absolute top-20 right-8 w-72 flex flex-col gap-4 z-[500] pointer-events-none">
           <div className="p-6 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl space-y-6 shadow-2xl pointer-events-auto">
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
                       <span className="text-[10px] font-bold uppercase text-white/80 tracking-tighter">Campus Map v3.0</span>
                       <span className="text-[8px] text-white/20 uppercase font-mono">CartoDB Dark Matter</span>
                    </div>
                 </div>
                 <button className="w-full py-2.5 bg-vms-accent text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg pointer-events-auto">
                    Full Sector Scan
                 </button>
              </div>
           </div>

           {/* Mini Legend */}
           <div className="p-4 bg-black/60 backdrop-blur-md border border-white/5 rounded-lg grid grid-cols-2 gap-3 pointer-events-auto">
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
        <div className="absolute bottom-10 right-10 flex flex-col gap-2 z-[500]">
           <button onClick={handleZoomIn} className="w-12 h-12 bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-vms-accent transition-all shadow-2xl group hover:border-vms-accent/50 pointer-events-auto">
              <ZoomIn size={20} />
           </button>
           <button onClick={handleZoomOut} className="w-12 h-12 bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-vms-accent transition-all shadow-2xl group hover:border-vms-accent/50 pointer-events-auto">
              <ZoomOut size={20} />
           </button>
           <div className="h-4" />
           <button onClick={handleRecenter} className="w-12 h-12 bg-vms-accent text-black flex items-center justify-center transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:bg-white active:scale-95 pointer-events-auto">
              <Crosshair size={22} />
           </button>
        </div>

        {/* 5. FOOTER HUD TIPS */}
        <div className="absolute bottom-10 left-10 flex items-center gap-4 z-[500] pointer-events-none">
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

      </div>
    </div>
  );
};
