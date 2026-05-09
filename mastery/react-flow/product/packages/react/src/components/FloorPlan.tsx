import { useMeshStore, Device, Detection, cn } from '@ostream/core';
import {
  Navigation,
  Map as MapIcon,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Info,
  ShieldCheck
} from 'lucide-react';
import { useState, useRef, useMemo } from 'react';

export const FloorPlan = () => {
  const {
    devices,
    activeCameras,
    setActiveCameras,
    setFocusedCamera,
    setActiveView,
    setActiveSite,
    detections
  } = useMeshStore();

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Interaction Handlers ────────────────────────────────────────────────

  const handleDeviceClick = (device: Device) => {
    // Route to live view and focus
    const newCams = [...activeCameras];
    if (!newCams.includes(device.id)) {
      newCams[0] = device.id; // Replace first slot for simplicity
      setActiveCameras(newCams);
    }
    setFocusedCamera(device.id);
    setActiveView('live');
  };

  // ─── Projection Logic ────────────────────────────────────────────────────

  const projectedObjects = useMemo(() => {
    const objects: { det: Detection; x: number; y: number; camId: string }[] = [];

    devices.forEach(device => {
      const activeDets = detections[device.id] || [];
      if (device.x === undefined || device.y === undefined) return;

      activeDets.forEach(det => {
        // Basic Perspective Projection: 
        // Map detX/detY from video to Floor Plan coordinates
        // detX (0-1) -> maps to angle offset from camera center
        // detY (0-1) -> maps to distance from camera (further down = further away)

        const camAngleRad = (device.angle || 0) * (Math.PI / 180);
        const fovRad = (device.fov || 90) * (Math.PI / 180);

        // Relative angle within FOV
        const relAngle = (det.x - 0.5) * fovRad;
        const finalAngle = camAngleRad + relAngle;

        // Distance mapping (approximate forensic depth)
        const distance = 50 + (det.y * 150);

        if (device.x !== undefined && device.y !== undefined) {
          const px = device.x * 1000 + Math.cos(finalAngle) * distance;
          const py = device.y * 1000 + Math.sin(finalAngle) * distance;
          objects.push({ det, x: px, y: py, camId: device.id });
        }
      });
    });

    return objects;
  }, [devices, detections]);

  // ─── Render Helpers ──────────────────────────────────────────────────────

  const renderFOVCone = (device: Device) => {
    if (device.x === undefined || device.y === undefined) return null;

    const angle = device.angle || 0;
    const fov = device.fov || 90;
    const radius = 120; // Visual radius

    // Calculate SVG path for cone
    const startAngle = (angle - fov / 2) * (Math.PI / 180);
    const endAngle = (angle + fov / 2) * (Math.PI / 180);

    const x1 = Math.cos(startAngle) * radius;
    const y1 = Math.sin(startAngle) * radius;
    const x2 = Math.cos(endAngle) * radius;
    const y2 = Math.sin(endAngle) * radius;

    const largeArcFlag = fov > 180 ? 1 : 0;

    const d = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return (
      <g transform={`translate(${device.x * 1000}, ${device.y * 1000})`}>
        <path
          d={d}
          className={cn(
            "transition-all duration-500",
            device.status === 'online'
              ? "fill-vms-accent/10 stroke-vms-accent/30"
              : "fill-white/5 stroke-white/10"
          )}
          style={{
            opacity: hoveredDevice === device.id ? 0.6 : 0.2,
            filter: device.status === 'online' ? 'blur(4px)' : 'none'
          }}
        />
        {/* Pulsing Core for Active Detection */}
        {device.status === 'online' && (
          <circle r="4" fill="currentColor" className="text-vms-accent animate-pulse" />
        )}
      </g>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020202] text-white/90 font-mono overflow-hidden select-none">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-white/[0.05] bg-[#080808] z-10">
        <div className="flex items-center gap-3">
          <MapIcon size={18} className="text-vms-accent" />
          <div className="flex flex-col">
            <h1 className="text-[12px] font-bold uppercase tracking-widest">
              Tactical Floor Plan <span className="text-white/20 ml-2 font-normal">Site: O_MESH_PRIMARY</span>
            </h1>
            <button
              onClick={() => setActiveSite('campus')}
              className="text-[9px] text-vms-accent hover:text-white transition-colors uppercase font-bold text-left flex items-center gap-1 mt-0.5"
            >
              <Navigation size={10} className="rotate-[-45deg]" /> Zoom Out to Global Campus
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-vms-emerald-500/10 border border-vms-emerald-500/20 rounded-full">
            <ShieldCheck size={12} className="text-vms-emerald-500" />
            <span className="text-[9px] text-vms-emerald-400 font-bold uppercase">Zone Perimeter Secure</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-1">
            <button className="p-2 text-white/40 hover:text-white transition-colors"><Layers size={16} /></button>
            <button className="p-2 text-white/40 hover:text-white transition-colors"><Navigation size={16} /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-grid-pattern">
        {/* Map Canvas (SVG based for sharp brutalist lines) */}
        <div
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)` }}
        >
          <svg
            viewBox="0 0 1000 1000"
            className="w-[800px] h-[800px] border border-white/5 bg-black/40 shadow-2xl"
          >
            <defs>
              {/* Grid Pattern Definition */}
              <pattern id="tactical-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
              </pattern>
              
              {/* Heatmap Gradients */}
              <radialGradient id="heat-lobby" cx="275" cy="225" r="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(0, 243, 255, 0.15)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="heat-server" cx="175" cy="675" r="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.1)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Tactical Grid Layer */}
            <rect width="1000" height="1000" fill="url(#tactical-grid)" />

            {/* 0.5. Analytics Layer (Heatmaps) */}
            <g className="opacity-60">
               <circle cx="275" cy="225" r="150" fill="url(#heat-lobby)" />
               <circle cx="175" cy="675" r="120" fill="url(#heat-server)" />
            </g>

            {/* 1. Structural Layer (Blueprint Lines) */}
            <g className="stroke-white/10 fill-none" strokeWidth="2">
              {/* Outer Walls */}
              <rect x="50" y="50" width="900" height="900" />
              {/* Internal Dividers */}
              <line x1="500" y1="50" x2="500" y2="400" />
              <line x1="50" y1="400" x2="950" y2="400" />
              <line x1="300" y1="400" x2="300" y2="950" />
              <line x1="700" y1="400" x2="700" y2="950" />

              {/* Zone Labels */}
              <text x="275" y="225" fill="currentColor" className="text-white/10 text-[24px] font-bold" textAnchor="middle">LOBBY_ZONE</text>
              <text x="725" y="225" fill="currentColor" className="text-white/10 text-[24px] font-bold" textAnchor="middle">PARKING_NORTH</text>
              <text x="175" y="675" fill="currentColor" className="text-white/10 text-[24px] font-bold" textAnchor="middle" transform="rotate(-90, 175, 675)">SERVER_RM</text>
            </g>

            {/* 1.5. Global Lockdown Fade (Dims the building when a threat is active) */}
            <rect
              x="0" y="0" width="1000" height="1000"
              className={cn(
                "fill-black/60 transition-opacity duration-1000 pointer-events-none",
                Object.values(detections).some(dets => dets.length > 0) ? "opacity-100" : "opacity-0"
              )}
            />

            {/* 1.6. Dynamic Pathfinding (Intervention Route) */}
            {Object.values(detections).some(dets => dets.length > 0) && (
              <g>
                {/* Laser Glow Path */}
                <path 
                  d="M 50 500 L 300 500 L 300 675 L 175 675" 
                  className="fill-none stroke-vms-accent/40 stroke-[6px]"
                  style={{ filter: 'blur(8px)' }}
                />
                <path 
                  d="M 50 500 L 300 500 L 300 675 L 175 675" 
                  className="fill-none stroke-vms-accent stroke-[2px]"
                  strokeDasharray="12 8"
                >
                   <animate attributeName="stroke-dashoffset" from="200" to="0" dur="3s" repeatCount="indefinite" />
                </path>
                
                {/* Tactical Node Point */}
                <circle cx="50" cy="500" r="4" fill="#00f3ff" />
                <rect x="60" y="485" width="140" height="20" className="fill-black/90 stroke-vms-accent/30" />
                <text x="70" y="499" className="fill-vms-accent text-[9px] font-black uppercase tracking-tighter">INTERVENTION_ROUTE_ACTIVE</text>
              </g>
            )}

            {/* 1.8. Lockdown Zone / Blast Radius */}
            <g>
              {devices.map(device => {
                if (device.x === undefined || device.y === undefined) return null;
                const hasThreat = (detections[device.id] || []).length > 0;
                if (!hasThreat) return null;

                return (
                  <g key={`threat-${device.id}`} transform={`translate(${device.x * 1000}, ${device.y * 1000})`}>
                    <circle r="180" className="fill-red-500/5 stroke-red-500/20 stroke-1 animate-ping" style={{ transformOrigin: 'center', animationDuration: '3s' }} />
                    <circle r="120" className="fill-transparent stroke-red-500/40 stroke-[2px] stroke-dash-array-[5,5]" strokeDasharray="10 10" />
                    
                    {/* Targeting Brackets */}
                    <path d="M -40 -40 L -20 -40 M -40 -40 L -40 -20" className="stroke-red-500 stroke-2" />
                    <path d="M 40 -40 L 20 -40 M 40 -40 L 40 -20" className="stroke-red-500 stroke-2" />
                    <path d="M -40 40 L -20 40 M -40 40 L -40 20" className="stroke-red-500 stroke-2" />
                    <path d="M 40 40 L 20 40 M 40 40 L 40 20" className="stroke-red-500 stroke-2" />
                    
                    <circle r="60" className="fill-red-500/20" />
                  </g>
                );
              })}
            </g>

            {/* 2. Intelligence Layer (FOVs) */}
            <g>
              {devices.map(device => {
                const hasThreat = (detections[device.id] || []).length > 0;
                return (
                  <g key={`fov-${device.id}`} className={cn(hasThreat && "text-red-500")}>
                    {renderFOVCone(device)}
                  </g>
                );
              })}
            </g>

            {/* 3. Projection Layer (Live Objects) */}
            <g>
              {projectedObjects.map((obj) => (
                <g key={`${obj.camId}-${obj.det.id}`} transform={`translate(${obj.x}, ${obj.y})`} className="transition-transform duration-300">
                  {/* Object Blip */}
                  <circle r="6" className="fill-vms-accent animate-ping opacity-20" />
                  <circle r="4" className={cn(
                    "stroke-1",
                    obj.det.cls === 'person' ? "fill-blue-500 stroke-blue-200" :
                      obj.det.cls === 'vehicle' ? "fill-amber-500 stroke-amber-200" :
                        "fill-red-500 stroke-red-200"
                  )} />

                  {/* Micro Classification Label */}
                  <g transform="translate(8, -8)">
                    <rect x="0" y="0" width="40" height="12" className="fill-black/80 stroke-white/10" />
                    <text x="4" y="9" className="fill-white text-[8px] font-bold uppercase">{obj.det.cls}</text>
                  </g>
                </g>
              ))}
            </g>

            {/* 4. Device Layer (Icons) */}
            <g>
              {devices.map(device => {
                if (device.x === undefined || device.y === undefined) return null;
                const isHovered = hoveredDevice === device.id;

                return (
                  <g
                    key={device.id}
                    transform={`translate(${device.x * 1000}, ${device.y * 1000})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDevice(device.id)}
                    onMouseLeave={() => setHoveredDevice(null)}
                    onClick={() => handleDeviceClick(device)}
                  >
                    {/* Interaction Target */}
                    <circle r="20" fill="transparent" />

                    {/* Device Icon Node */}
                    <circle
                      r={isHovered ? 12 : 10}
                      className={cn(
                        "transition-all stroke-2",
                        device.status === 'online'
                          ? "fill-black stroke-vms-accent shadow-[0_0_15px_rgba(0,243,255,0.5)]"
                          : "fill-black stroke-white/20"
                      )}
                    />

                    {/* Direction Arrow */}
                    <path
                      d="M -4 0 L 0 -8 L 4 0 Z"
                      transform={`rotate(${device.angle || 0}) translate(0, -12)`}
                      className={device.status === 'online' ? "fill-vms-accent" : "fill-white/20"}
                    />

                    {/* Label (Condensed) */}
                    {isHovered && (
                      <g transform="translate(18, 0)">
                        <rect x="0" y="-12" width="120" height="24" className="fill-black/80 stroke-white/10" />
                        <text x="8" y="4" className="fill-vms-accent text-[10px] font-bold uppercase tracking-widest">{device.label}</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* HUD Overlay Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="w-10 h-10 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-vms-accent transition-all">
            <ZoomIn size={18} />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="w-10 h-10 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-vms-accent transition-all">
            <ZoomOut size={18} />
          </button>
          <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="w-10 h-10 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-vms-accent transition-all">
            <Crosshair size={18} />
          </button>
        </div>

        {/* Legend / Status HUD */}
        <div className="absolute top-6 right-6 w-48 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 p-3 flex flex-col gap-3">
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 border-b border-white/5 pb-2 flex items-center gap-2">
            <Info size={12} /> Spatial Legend
          </span>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-white/60 uppercase">Cameras</span>
              <span className="text-[9px] font-bold text-white/90">{devices.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-white/60 uppercase">Live Tracks</span>
              <span className="text-[9px] font-bold text-vms-accent">{projectedObjects.length}</span>
            </div>
          </div>
          <div className="pt-2 mt-1 border-t border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
              <span className="text-[8px] text-white/40 uppercase">Person Identified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
              <span className="text-[8px] text-white/40 uppercase">Vehicle Detected</span>
            </div>
          </div>
        </div>

        {/* Footer Coordinate Ticker */}
        <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 border border-white/5 font-mono">
          <span className="text-[10px] text-vms-accent/60 tracking-widest uppercase">
            Projected Coordinate Engine Active // Tracking {projectedObjects.length} Entities
          </span>
        </div>
      </div>
    </div>
  );
};
