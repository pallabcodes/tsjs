import React, { useState, useMemo, useEffect } from 'react';
import { useJsApiLoader, GoogleMap, OverlayViewF, Polyline, Polygon, HeatmapLayer } from '@react-google-maps/api';
import { ShieldAlert, Camera, ChevronRight, Activity, Map as MapIcon, Layers, Terminal, PenTool, Trash2, CheckCircle2, Clock, Play, Pause, Flame, Navigation, Crosshair } from 'lucide-react';

const containerStyle = { width: '100%', height: '100%' };
const center = { lat: 22.5726, lng: 88.3639 };

const isPointInPolygon = (point: {lat: number, lng: number}, vs: {lat: number, lng: number}[]) => {
  const x = point.lat, y = point.lng;
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].lat, yi = vs[i].lng;
    const xj = vs[j].lat, yj = vs[j].lng;
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

// Sovereign Forensic Design System (SFDS) Tokens
const SFDS = {
  colors: {
    base: '#09090b',
    primary: '#6366f1', // Intelligence Indigo
    anomaly: '#ef4444', // Forensic Red
    history: '#f59e0b', // Tactical Amber
    silver: '#f8fafc',
    zinc800: '#27272a',
  },
  classes: {
    primaryText: 'text-indigo-400',
    primaryBg: 'bg-indigo-500',
    primaryShadow: 'shadow-[0_0_20px_rgba(99,102,241,0.3)]',
    historyText: 'text-amber-500',
    historyBg: 'bg-amber-500',
    anomalyText: 'text-red-500',
    anomalyBg: 'bg-red-500',
  }
};

const zincStandardStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: SFDS.colors.base }] },
  { elementType: "labels.text.stroke", stylers: [{ color: SFDS.colors.base }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#71717a" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#a1a1aa" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#18181b" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: SFDS.colors.zinc800 }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
];

const tacticalGrayscaleStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#121212" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#52525b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#121212" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#18181b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
];

const mapThemeConfig = {
  tactical: { bg: '#121212', styles: tacticalGrayscaleStyles },
  standard: { bg: '#09090b', styles: zincStandardStyles }
};

type CameraNode = { id: string; lat: number; lng: number; status: 'active' | 'anomaly' | 'offline'; heading: number; resolution: string; temp: string; bitrate: string; incidentTime: number; installTime: number };
type SecurityZone = { id: string; name: string; points: {lat: number, lng: number}[]; isBreached: boolean };

const mockCameras: CameraNode[] = [
  { id: 'CAM-42', lat: 22.5750, lng: 88.3600, status: 'active', heading: 45, resolution: '4K RAW', temp: '42°C', bitrate: '12.4 Mbps', incidentTime: 0, installTime: 0 },
  { id: 'CAM-89', lat: 22.5700, lng: 88.3700, status: 'anomaly', heading: 320, resolution: '1080p', temp: '51°C', bitrate: '8.1 Mbps', incidentTime: 70, installTime: 50 },
  { id: 'CAM-12', lat: 22.5680, lng: 88.3550, status: 'active', heading: 180, resolution: '4K RAW', temp: '38°C', bitrate: '11.9 Mbps', incidentTime: 0, installTime: 20 },
];

const mockResponseUnit = { id: 'UNIT-ALPHA', lat: 22.5600, lng: 88.3750, status: 'standby' };

const fullTrackingPath = [
  { lat: 22.5680, lng: 88.3550, time: 10 },
  { lat: 22.5700, lng: 88.3580, time: 30 },
  { lat: 22.5720, lng: 88.3620, time: 50 },
  { lat: 22.5710, lng: 88.3660, time: 70 },
  { lat: 22.5700, lng: 88.3700, time: 90 },
];

const libraries: ("visualization")[] = ["visualization"];

const SovereignSatLink = () => {
  const { isLoaded } = useJsApiLoader({ 
    id: 'google-map-script', 
    googleMapsApiKey: 'AIzaSyDiUURXjzbQxIiueXea_1AlhG82ghwxGYc',
    libraries: libraries
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapTheme, setMapTheme] = useState<'tactical' | 'standard'>('tactical');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [, setLineOffset] = useState(0);

  // Engine States
  const [currentTime, setCurrentTime] = useState(100);
  const [isLive, setIsLive] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isInterceptDeployed, setIsInterceptDeployed] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(14);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Drawing States
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<{lat: number, lng: number}[]>([]);
  const [activeZones, setActiveZones] = useState<SecurityZone[]>([]);

  // Apply Engine Options
  useEffect(() => {
    if (map) {
      map.setOptions({ 
        styles: mapThemeConfig[mapTheme].styles, 
        backgroundColor: mapThemeConfig[mapTheme].bg, 
        disableDefaultUI: true
      });
    }
  }, [map, mapTheme]);

  // Handle Zoom for Clustering
  const handleZoomChanged = () => {
    if (map) setCurrentZoom(map.getZoom() || 14);
  };

  // UI Immersion: Hide Audit Trail and Google Watermarks
  useEffect(() => {
    const auditTrail = (document.querySelector('.audit-trail-container') || document.evaluate("//span[contains(., 'Audit_Trail')]/ancestor::div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) as HTMLElement;
    if (auditTrail && auditTrail.style) {
      auditTrail.style.display = 'none';
    }

    // Inject styles to hide Google Watermarks
    const style = document.createElement('style');
    style.innerHTML = `
      .gm-style-cc, .gmnoprint, a[href*="google.com/maps"] { display: none !important; }
      .gm-style img[src*="google_white"], .gm-style img[src*="google_black"] { display: none !important; }
    `;
    document.head.appendChild(style);

    return () => { 
      if (auditTrail && auditTrail.style) auditTrail.style.display = 'flex'; 
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  // Marching Ants Animation Loop
  useEffect(() => {
    let frame: number;
    const animate = () => { setLineOffset(prev => (prev + 0.5) % 20); frame = requestAnimationFrame(animate); };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Auto-sync Live Mode
  useEffect(() => { if (isLive) setCurrentTime(100); }, [isLive]);

  // Spatial & Temporal Compute
  const visibleCameras = useMemo(() => mockCameras.filter(cam => cam.installTime <= currentTime), [currentTime]);

  const processedZones = useMemo(() => {
    return activeZones.map(zone => {
      let breached = false;
      visibleCameras.forEach(cam => {
        const isAnomalyActive = cam.incidentTime > 0 && currentTime >= cam.incidentTime;
        if (isAnomalyActive && isPointInPolygon({lat: cam.lat, lng: cam.lng}, zone.points)) breached = true;
      });
      return { ...zone, isBreached: breached };
    });
  }, [activeZones, visibleCameras, currentTime]);

  const visiblePath = useMemo(() => {
    return fullTrackingPath.filter(p => p.time <= currentTime).map(p => ({ lat: p.lat, lng: p.lng }));
  }, [currentTime]);

  const suspectCurrentLocation = visiblePath.length > 0 ? visiblePath[visiblePath.length - 1] : null;

  const interceptPath = useMemo(() => {
    if (!isInterceptDeployed || !suspectCurrentLocation) return [];
    return [
      { lat: mockResponseUnit.lat, lng: mockResponseUnit.lng },
      { lat: (mockResponseUnit.lat + suspectCurrentLocation.lat) / 2 + 0.002, lng: (mockResponseUnit.lng + suspectCurrentLocation.lng) / 2 },
      suspectCurrentLocation
    ];
  }, [isInterceptDeployed, suspectCurrentLocation]);

  const heatmapPoints = useMemo(() => {
    if (!isLoaded) return [];
    return visibleCameras.map(cam => {
      const isAnomalyActive = cam.incidentTime > 0 && currentTime >= cam.incidentTime;
      return { location: new google.maps.LatLng(cam.lat, cam.lng), weight: isAnomalyActive ? 5 : 1 };
    });
  }, [visibleCameras, currentTime, isLoaded]);

  // Clustering Logic (Triggered at Zoom <= 12)
  const isClustered = currentZoom <= 12;

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (isDrawingMode && e.latLng) setCurrentPoints([...currentPoints, { lat: e.latLng.lat(), lng: e.latLng.lng() }]);
  };

  const finishDrawing = () => {
    if (currentPoints.length > 2) setActiveZones([...activeZones, { id: `Z-${Date.now()}`, name: `Restricted Area ${activeZones.length + 1}`, points: currentPoints, isBreached: false }]);
    setCurrentPoints([]);
    setIsDrawingMode(false);
  };

  const panToNode = (lat: number, lng: number, id: string) => {
    if (map) { map.panTo({ lat, lng }); map.setZoom(16); setSelectedNodeId(id); }
  };

  if (!isLoaded) return (
    <div className="flex-1 bg-zinc-950 flex items-center justify-center font-sans text-zinc-400 text-sm">
      <div className="flex items-center gap-3"><Activity className="animate-pulse" size={16} /><span>Initializing Global Workspace...</span></div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-zinc-300 font-sans h-full overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT AREA: MAP CANVAS */}
        <div className="flex-1 relative flex flex-col border-r border-zinc-800">
          
          {/* Main Header Controls */}
          <div className="h-12 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-4 z-10 absolute top-0 left-0 right-0">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <Layers size={14} className="text-zinc-400" />
              <span className="hover:text-zinc-300 cursor-pointer">Video Forensics</span>
              <ChevronRight size={14} />
              <span className="text-indigo-400 font-bold tracking-tight">Command Center</span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Analytical Toggles */}
              <div className="flex items-center gap-2 pr-4 border-r border-zinc-800">
                 <button onClick={() => setShowHeatmap(!showHeatmap)} className={`px-3 py-1 text-[10px] font-bold uppercase rounded flex items-center gap-1.5 transition-all ${showHeatmap ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-indigo-500'}`}>
                   <Flame size={12} fill={showHeatmap ? "currentColor" : "none"} /> Patterns
                 </button>
                 <div className="w-px h-4 bg-zinc-800 mx-1" />
                 {isDrawingMode ? (
                  <button onClick={finishDrawing} className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold uppercase rounded flex items-center gap-1.5 animate-pulse"><CheckCircle2 size={12} /> Save Zone</button>
                ) : (
                  <button onClick={() => setIsDrawingMode(true)} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase rounded border border-zinc-700 hover:bg-zinc-700 flex items-center gap-1.5"><PenTool size={12} /> Draw Zone</button>
                )}
              </div>
              {/* Theme Toggles */}
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded p-1">
                <button onClick={() => setMapTheme('tactical')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded ${mapTheme === 'tactical' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Tactical</button>
                <button onClick={() => setMapTheme('standard')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded flex items-center gap-1 ${mapTheme === 'standard' ? 'bg-indigo-500 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}><MapIcon size={12} /> Standard</button>
              </div>
            </div>
          </div>

          <div className="flex-1 relative bg-black">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14} onLoad={setMap} onZoomChanged={handleZoomChanged} onClick={onMapClick} options={{ disableDefaultUI: true, gestureHandling: 'greedy' }}>
                
                {/* Analytical Overlays */}
                {showHeatmap && <HeatmapLayer data={heatmapPoints} options={{ radius: 30, opacity: 0.8 }} />}

                {processedZones.map(zone => (
                  <Polygon key={zone.id} paths={zone.points} options={{ fillColor: zone.isBreached ? '#ef4444' : '#f59e0b', fillOpacity: zone.isBreached ? 0.3 : 0.1, strokeColor: zone.isBreached ? '#ef4444' : '#f59e0b', strokeWeight: 2, strokeOpacity: 0.8 }} />
                ))}
                
                {/* Draw Zone Preview */}
                {isDrawingMode && currentPoints.length > 0 && (
                  <>
                    <Polyline path={currentPoints} options={{ strokeColor: '#a1a1aa', strokeOpacity: 0.8, strokeWeight: 2 }} />
                    {currentPoints.length > 2 && <Polygon paths={currentPoints} options={{ fillColor: '#a1a1aa', fillOpacity: 0.2, strokeOpacity: 0 }} />}
                  </>
                )}
                
                {/* Suspect Tracking Path */}
                {!showHeatmap && <Polyline path={visiblePath} options={{ strokeColor: 'transparent', icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, strokeColor: '#6366f1', strokeWeight: 3, scale: 3 }, offset: '0', repeat: '20px' }] }} />}
                
                {/* Active Intercept Routing Path */}
                {!showHeatmap && isInterceptDeployed && <Polyline path={interceptPath} options={{ strokeColor: 'transparent', icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, strokeColor: '#e4e4e7', strokeWeight: 4, scale: 3 }, offset: '0', repeat: '25px' }] }} />}

              {/* High-Density Clustering Engine */}
              {isClustered && !showHeatmap ? (
                 <OverlayViewF position={center} mapPaneName="overlayMouseTarget">
                   <div className="relative cursor-pointer transition-transform hover:scale-110" style={{ transform: 'translate(-50%, -50%)' }} onClick={() => map?.setZoom(14)}>
                      <div className="w-16 h-16 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full flex flex-col items-center justify-center shadow-2xl relative">
                        <div className="absolute inset-0 rounded-full border border-zinc-500/30 animate-ping opacity-20"></div>
                        <Layers size={18} className="text-zinc-400 mb-1" />
                        <span className="text-[10px] font-black tracking-widest text-white">{visibleCameras.length} NODES</span>
                      </div>
                   </div>
                 </OverlayViewF>
              ) : (
                /* Standard Granular Nodes */
                visibleCameras.map((cam) => {
                  const isSelected = selectedNodeId === cam.id;
                  const isAnomalyActive = cam.incidentTime > 0 && currentTime >= cam.incidentTime;
                  const displayStatus = isAnomalyActive ? 'anomaly' : 'active';
                  
                  if (showHeatmap && displayStatus !== 'anomaly') return null; // Clean up heatmap view

                  return (
                    <OverlayViewF key={cam.id} position={{ lat: cam.lat, lng: cam.lng }} mapPaneName="overlayMouseTarget">
                      <div className="relative" style={{ transform: 'translate(-50%, -100%)', opacity: showHeatmap ? 0.9 : 1 }}>
                          {!showHeatmap && (
                            <div className="absolute bottom-0 left-1/2 pointer-events-none transition-all duration-700" style={{ transform: `translate(-50%, 0) rotate(${cam.heading}deg) scale(${isSelected ? 1.3 : 1})`, transformOrigin: 'bottom center', zIndex: -1 }}>
                              <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
                                <defs>
                                  <linearGradient id={`fov-grad-${cam.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" stopColor={displayStatus === 'anomaly' ? '#ef4444' : '#6366f1'} stopOpacity={isSelected ? "0.6" : "0.2"} />
                                    <stop offset="100%" stopColor={displayStatus === 'anomaly' ? '#ef4444' : '#6366f1'} stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>
                                <path d="M100,200 L40,0 A100,100 0 0,1 160,0 Z" fill={`url(#fov-grad-${cam.id})`} />
                              </svg>
                            </div>
                          )}
                          <div className="flex flex-col items-center cursor-pointer" onClick={() => panToNode(cam.lat, cam.lng, cam.id)}>
                            <div className={`border shadow-xl rounded px-2 py-1 flex items-center gap-2 transition-all ${displayStatus === 'anomaly' ? 'bg-zinc-900 border-red-500 text-red-500 scale-110 z-10' : isSelected ? 'bg-indigo-500 border-emerald-400 text-white z-10' : 'bg-zinc-900 border-zinc-700 text-zinc-300'}`}>
                              {displayStatus === 'anomaly' ? <ShieldAlert size={14} /> : <Camera size={14} />}
                              <span className="text-[11px] font-bold tracking-wider">{cam.id}</span>
                            </div>
                            <div className={`w-px h-6 ${displayStatus === 'anomaly' ? 'bg-red-500' : isSelected ? 'bg-indigo-500' : 'bg-zinc-700'}`} />
                            <div className={`w-2 h-2 rounded-full ${displayStatus === 'anomaly' ? 'bg-red-500 animate-ping' : isSelected ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'bg-zinc-700'}`} />
                          </div>
                      </div>
                    </OverlayViewF>
                  );
                })
              )}

              {/* Response Unit Node */}
              {!showHeatmap && isInterceptDeployed && (
                 <OverlayViewF position={{ lat: mockResponseUnit.lat, lng: mockResponseUnit.lng }} mapPaneName="overlayMouseTarget">
                   <div className="relative" style={{ transform: 'translate(-50%, -50%)' }}>
                     <div className="flex items-center gap-2 px-2 py-1 bg-indigo-500 border-2 border-white rounded shadow-[0_0_20px_rgba(228,228,231,0.6)] text-zinc-900 font-bold text-[10px] tracking-wider uppercase">
                       <Navigation size={12} fill="currentColor" /> UNIT-ALPHA
                     </div>
                   </div>
                 </OverlayViewF>
              )}

            </GoogleMap>
            
            {/* Sidebar Open Trigger (Floating Tab) */}
            {isSidebarCollapsed && (
              <button 
                onClick={() => setIsSidebarCollapsed(false)}
                className="absolute top-1/2 -translate-y-1/2 right-0 w-6 h-24 bg-zinc-900 border border-r-0 border-zinc-700 rounded-l-lg flex items-center justify-center text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800 transition-all z-30 group"
              >
                <ChevronRight size={16} className="rotate-180 group-hover:scale-125 transition-transform" />
              </button>
            )}

            
            {/* Watermarks */}
            {!isLive && (
              <div className="absolute top-16 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/40 rounded backdrop-blur-md animate-pulse pointer-events-none">
                <Clock size={14} className="text-amber-500" />
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Historical Replay Mode</span>
              </div>
            )}
            
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className={`transition-[width] duration-500 ease-in-out border-l border-zinc-800 bg-zinc-950 flex flex-col z-20 overflow-hidden flex-shrink-0 ${isSidebarCollapsed ? 'w-0 border-l-0' : 'w-80'}`}>
          <div className="w-80 flex flex-col h-full">
            <div className="h-12 border-b border-zinc-800 flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-indigo-500" />
                <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-tighter">Forensic Control</h2>
              </div>
              <button onClick={() => setIsSidebarCollapsed(true)} className="p-1.5 hover:bg-zinc-800 rounded text-zinc-600 hover:text-zinc-300 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* Active Response Engine */}
              <div className="space-y-3">
                 <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Crosshair size={12} /> Active Response</h3>
                 <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">Target Trajectory:</span>
                      <span className={suspectCurrentLocation ? "text-indigo-400" : "text-zinc-600"}>{suspectCurrentLocation ? "ACQUIRED" : "WAITING"}</span>
                    </div>
                    
                    <button 
                      disabled={!suspectCurrentLocation}
                      onClick={() => setIsInterceptDeployed(!isInterceptDeployed)} 
                      className={`w-full py-2.5 rounded text-[10px] font-black tracking-[0.2em] uppercase transition-all flex justify-center items-center gap-2 ${isInterceptDeployed ? 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20' : suspectCurrentLocation ? 'bg-indigo-500 text-zinc-900 shadow-[0_0_20px_rgba(228,228,231,0.2)] hover:bg-white' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                    >
                      {isInterceptDeployed ? 'ABORT INTERCEPT' : 'DEPLOY UNIT ALPHA'}
                      {isInterceptDeployed && <Navigation size={12} className="animate-spin" />}
                    </button>
                    {isInterceptDeployed && <p className="text-[9px] text-zinc-500 italic text-center">Routing unit via dynamically calculated intercept path.</p>}
                 </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">Temporal Status <span className={`px-2 py-0.5 rounded text-[9px] font-black ${isLive ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-500 animate-pulse'}`}>{isLive ? 'LIVE FEED' : 'HISTORICAL REPLAY'}</span></h3>
                {!isLive && <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded text-[10px] text-amber-200/70 italic flex items-center gap-2"><Clock size={12} /> Investigating historical logs from T-minus {100 - currentTime}h</div>}
              </div>

              {showHeatmap && (
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Sector Density Report</h4>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[11px]">
                       <span className="text-zinc-500">Kolkata Central</span>
                       <span className="text-amber-400 font-bold">HIGH RISK</span>
                     </div>
                     <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-500 w-[78%]" />
                     </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed italic">Multiple concurrent anomalies detected in central sector over past 24h cycle.</p>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Security Zones</h3>
                <div className="space-y-2">
                  {processedZones.map(zone => (
                    <div key={zone.id} className={`p-3 border rounded transition-all ${zone.isBreached ? 'bg-red-500/5 border-red-500/40' : 'bg-zinc-900 border-zinc-800'}`}>
                      <div className="flex justify-between items-start">
                        <span className={`text-xs font-bold ${zone.isBreached ? 'text-red-400' : 'text-indigo-500'}`}>{zone.name}</span>
                        <button onClick={() => setActiveZones(activeZones.filter(z => z.id !== zone.id))} className="text-zinc-600 hover:text-red-500"><Trash2 size={12} /></button>
                      </div>
                      {zone.isBreached && <div className="mt-2 flex items-center gap-1.5 text-red-500 font-bold text-[10px] animate-pulse"><ShieldAlert size={12} /> ZONE BREACH DETECTED</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex justify-between"><span>Forensic Link</span><span className="text-indigo-500 tracking-normal">● ENCRYPTED</span></div>
          </div>
        </div>
      </div>
      
      {/* FOOTER: TEMPORAL TIMELINE HUD */}
      <div className={`h-24 border-t flex items-center px-6 gap-8 transition-all duration-500 z-30 ${isLive ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-900 border-amber-500/30'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsLive(!isLive)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isLive ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-zinc-800 text-zinc-400'}`}>
            {isLive ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Temporal Scrub</span>
            <span className={`text-base font-mono font-black transition-colors ${isLive ? 'text-indigo-400' : 'text-amber-400'}`}>
              {isLive ? 'T-00:00:00 (LIVE)' : `T-0${Math.floor((100 - currentTime) / 4)}:00:00`}
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-4 relative px-2">
           <input type="range" min="0" max="100" value={currentTime} onChange={(e) => { setCurrentTime(parseInt(e.target.value)); setIsLive(false); }} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" style={{ background: `linear-gradient(to right, ${isLive ? '#6366f1' : '#f59e0b'} ${currentTime}%, #27272a ${currentTime}%)` }} />
           <div className="flex justify-between text-[9px] font-black text-zinc-600 uppercase tracking-widest">
             <span>T - 24 Hours</span><span>T - 18h</span><span>T - 12h</span><span>T - 6h</span><span className="text-indigo-400">Live feed</span>
           </div>
        </div>
        <button onClick={() => { setIsLive(true); setCurrentTime(100); }} className={`px-6 py-2.5 rounded text-[10px] font-black tracking-[0.2em] uppercase transition-all ${isLive ? 'bg-zinc-900 text-zinc-700' : 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'}`}>Sync to Live</button>
      </div>
    </div>
  );
};

export default React.memo(SovereignSatLink);
