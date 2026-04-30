import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MasteryEngine, type EngineEdge } from './MasteryEngine';
import { project, unproject } from '../../invariant-core/inv02-viewport/src/index.ts';
import type { Viewport, Point } from '../../invariant-core/inv02-viewport/src/index.ts';
import { Node } from '../../invariant-core/inv01-model/src/index.ts';
import { Shield, Search, Eye, Layout, Database, Activity, X, Terminal, Info, Cpu, Edit2, ExternalLink, ChevronRight, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MAX_NODES = 1000;
const BOUNDARY = { width: 10000, height: 10000 };
const WORLD_CENTER = { x: 5000, y: 5000 };

const getInitialZoom = () => {
  if (typeof window === 'undefined') return 0.4;
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.min(w / 4000, h / 3000, 0.4);
};

const TypeIcon = React.memo(({ type, color }: { type: string, color: string }) => {
  const props = { size: 12, style: { color } };
  if (type === 'GATEWAY') return <Shield {...props} />;
  if (type === 'SERVICE') return <Cpu {...props} />;
  if (type === 'DATABASE') return <Database {...props} />;
  return <Cpu {...props} />;
});

const calculatePath = (sourceNode: any, targetNode: any, effectiveSummaryView: boolean) => {
  // L7 FEATURE: Port-Based Fanning
  // We use a deterministic hash based on the IDs for stable fanning
  const targetIdx = parseInt(targetNode.id.replace(/\D/g, '')) || 0;
  const srcYOffset = sourceNode.data.type === 'GATEWAY' ? (targetIdx % 3 - 1) * 30 : 0;

  const nodeWidth = effectiveSummaryView ? 40 : sourceNode.data.width;
  const nodeHeight = effectiveSummaryView ? 40 : sourceNode.data.height;
  const targetWidth = effectiveSummaryView ? 40 : targetNode.data.width;
  const targetHeight = effectiveSummaryView ? 40 : targetNode.data.height;

  const srcPos = {
    x: sourceNode.position.x + nodeWidth,
    y: sourceNode.position.y + (nodeHeight / 2) + srcYOffset
  };
  const tgtPos = {
    x: targetNode.position.x,
    y: targetNode.position.y + (targetHeight / 2)
  };

  const dx = tgtPos.x - srcPos.x;
  const cp1x = srcPos.x + dx * 0.4;
  const cp2x = srcPos.x + dx * 0.6;
  return `M ${srcPos.x} ${srcPos.y} C ${cp1x} ${srcPos.y}, ${cp2x} ${tgtPos.y}, ${tgtPos.x} ${tgtPos.y}`;
};

const MemoizedEdge = React.memo(({ edge, sourceNode, targetNode, isPathHovered, isBlueprint, isSummaryView, zoom, isAnyNodeHovered }: any) => {
  if (!sourceNode || !targetNode) return null;

  const effectiveSummaryView = isSummaryView && zoom < 0.7;
  const path = calculatePath(sourceNode, targetNode, effectiveSummaryView);

  // L7 FEATURE: Tactical Edge Coloring
  const isSourceError = sourceNode.data.status === 'CRITICAL';
  const isTargetError = targetNode.data.status === 'CRITICAL';

  let strokeColor = isBlueprint ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.15)";
  if (isPathHovered) strokeColor = "rgba(255,255,255,0.8)";
  if (isSourceError || isTargetError) strokeColor = "rgba(244,63,94,0.4)";

  let strokeWidth = isPathHovered ? 2.5 : 1.5;
  const isDimmed = isAnyNodeHovered && !isPathHovered;

  return (
    <g style={{ color: strokeColor }} className={cn("transition-opacity duration-300", isDimmed ? "opacity-10" : "opacity-100")}>
      {/* Base Connector */}
      <path
        id={`edge-path-${edge.id}`}
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        markerEnd="url(#arrowhead)"
        className="transition-all duration-300"
      />

      {/* Traffic Pulse (Only on Hover or Error + High Zoom) */}
      {(isPathHovered || isSourceError || isTargetError) && zoom > 0.5 && (
        <path
          id={`edge-pulse-${edge.id}`}
          d={path}
          fill="none"
          stroke={isSourceError || isTargetError ? "#f43f5e" : "#60a5fa"}
          strokeWidth={strokeWidth * 0.8}
          strokeDasharray="8, 12"
          className="animate-flow"
          style={{ opacity: isPathHovered ? 1 : 0.4 }}
        />
      )}
    </g>
  );
});

const MemoizedNode = React.memo(({ node, isSelected, zoom, onSelect, isSummaryView, isHovered, isAnyHovered }: any) => {
  const color = node.data.color;
  const isError = node.data.status === 'CRITICAL';
  const isDimmed = isAnyHovered && !isHovered && !isSelected;

  // L7 FEATURE: Auto-LOD Transition
  // If we are zoomed in enough, force 'Full View' even if 'Summary' is toggled.
  const effectiveSummaryView = isSummaryView && zoom < 0.7;

  return (
    <div
      id={`node-${node.id}`}
      className={cn("absolute pointer-events-auto group transition-opacity duration-300", isDimmed ? "opacity-20" : "opacity-100")}
      style={{
        transform: `translate3d(${node.position.x}px, ${node.position.y}px, 0)`,
        width: effectiveSummaryView ? 40 : node.data.width,
        height: effectiveSummaryView ? 40 : node.data.height,
        zIndex: isSelected ? 100 : 10,
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
      onMouseDown={(e) => onSelect(node.id)}
    >
      {effectiveSummaryView ? (
        <div className={cn(
          "w-full h-full rounded-md border-2 transition-all duration-300",
          isSelected ? "border-white scale-125" : "border-white/20",
          // L7 AGGRESSIVE SHADOW LOD: Kill all blur filters at low zoom
          isError && (zoom > 0.4 ? "border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]" : "border-rose-500 bg-rose-500/40")
        )} style={{ backgroundColor: color }} />
      ) : (
        <div className={cn(
          "relative h-full w-full flex flex-col bg-[#030712] border rounded-lg overflow-hidden transition-all duration-300 shadow-2xl",
          isSelected ? "border-white/60 ring-1 ring-white/30" : "border-white/20",
          // L7 AGGRESSIVE SHADOW LOD: Kill all blur filters at low zoom
          isError && (zoom > 0.4 ? "border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.3)]" : "border-rose-500 border-2"),
          "group-hover:border-white/40 group-hover:-translate-y-1"
        )}>
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.07] border-b border-white/10">
            <div className="flex items-center gap-2">
              <TypeIcon type={node.data.type} color={color} />
              <span className="text-[8px] font-black text-white/80 uppercase">{node.data.type}</span>
            </div>
            {isError && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
          </div>
          <div className="flex-1 px-3 pt-3.5 pb-6">
            <span className="text-[13px] font-bold text-white leading-tight tracking-tight">{node.data.label}</span>
            {zoom > 0.45 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-4">
                <div className="flex flex-col">
                  <span className="text-[7px] text-white/50 uppercase font-black tracking-widest">Latency</span>
                  <span className={cn("text-[11px] font-mono font-bold", isError ? "text-rose-400" : "text-white/90")}>{node.data.telemetry.latency}ms</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] text-white/50 uppercase font-black tracking-widest">Error Rate</span>
                  <span className={cn("text-[11px] font-mono font-bold", isError ? "text-rose-400" : "text-white/80")}>{node.data.telemetry.errorRate}%</span>
                </div>
              </div>
            )}
          </div>
          <div className="h-[2.5px] w-full" style={{ backgroundColor: color }} />
        </div>
      )}
    </div>
  );
});

const ZONES = [
  { id: 'Z01', name: 'INGRESS', x: 4400, color: '#f59e0b' },
  { id: 'Z02', name: 'ROUTING', x: 4700, color: '#0ea5e9' },
  { id: 'Z03', name: 'SERVICES', x: 5000, color: '#818cf8' },
  { id: 'Z04', name: 'PERSISTENCE', x: 5300, color: '#34d399' }
];

const Breadcrumbs = () => (
  <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/30 uppercase tracking-tighter mt-0.5">
    <span>Global</span>
    <ChevronRight size={8} />
    <span className="text-white/50">US-CENTRAL1</span>
    <ChevronRight size={8} />
    <span className="text-amber-500/60 font-black">Mesh-Alpha</span>
  </div>
);

const StatHUD = React.memo(({ stats, isBlueprintMode, viewport, setIsBlueprint, setIsSummaryView, isSummaryView, isEventFeedVisible, setIsEventFeedVisible, isLegendVisible, setIsLegendVisible, resetView }: any) => {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    lastTime.current = performance.now();
    let animId: number;
    const loop = () => {
      frameCount.current++;
      const now = performance.now();
      if (now - lastTime.current >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastTime.current = now;
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-baseline gap-2">
        <h2 className="text-sm font-black text-white tracking-tight uppercase truncate">Cloud-Native Topology</h2>
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-4 mt-1.5">
        <div className="flex items-center gap-2">
          <span className={cn("text-[10px] font-mono font-bold", fps >= 60 ? "text-emerald-400" : "text-amber-400")}>{fps} FPS</span>
          <div className="w-px h-2 bg-white/10" />
          <span className="text-[10px] font-mono text-white/60 font-bold">{stats.totalNodes} Nodes</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-rose-500/80 font-bold">{stats.critical} Critical</span>
          <span className="text-[10px] font-mono text-amber-500/80 font-bold">{stats.degraded} Degraded</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-2 pointer-events-auto">
          <button onClick={() => setIsSummaryView(!isSummaryView)} className={cn("p-1.5 rounded-md border transition-all", isSummaryView ? "bg-white/20 border-white/40" : "bg-white/5 border-white/10")}>
            <Eye size={10} className="text-white" />
          </button>
          <button onClick={() => setIsBlueprint(!isBlueprintMode)} className={cn("p-1.5 rounded-md border transition-all", isBlueprintMode ? "bg-white/20 border-white/40" : "bg-white/5 border-white/10")}>
            <Layout size={10} className="text-white" />
          </button>
          <button onClick={() => setIsEventFeedVisible(!isEventFeedVisible)} className={cn("p-1.5 rounded-md border transition-all", isEventFeedVisible ? "bg-white/20 border-white/40" : "bg-white/5 border-white/10")}>
            <Activity size={10} className="text-white" />
          </button>
          <button onClick={() => setIsLegendVisible(!isLegendVisible)} className={cn("p-1.5 rounded-md border transition-all", isLegendVisible ? "bg-white/20 border-white/40" : "bg-white/5 border-white/10")}>
            <Info size={10} className="text-white" />
          </button>
          <button onClick={resetView} className="p-1.5 rounded-md border bg-white/5 border-white/10 hover:bg-white/10 transition-all">
            <Search size={10} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default function App() {
  const [viewport, setViewport] = useState<Viewport>(() => {
    const zoom = getInitialZoom();
    return {
      x: window.innerWidth / 2 - WORLD_CENTER.x * zoom,
      y: window.innerHeight / 2 - WORLD_CENTER.y * zoom,
      zoom
    };
  });

  // FORCE RE-INIT for HMR Safety
  const [engine] = useState(() => new MasteryEngine(MAX_NODES, BOUNDARY));

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isBlueprint, setIsBlueprint] = useState(() => localStorage.getItem('cntp-blueprint') === 'true');
  const [isSummaryView, setIsSummaryView] = useState(() => localStorage.getItem('cntp-summary') === 'true');
  const [isLegendVisible, setIsLegendVisible] = useState(false);
  const [isEventFeedVisible, setIsEventFeedVisible] = useState(true);

  // L7 STATS DAMPING: Decouple HUD from high-speed frame updates
  const [stats, setStats] = useState(() => engine.getStats());
  const lastStatsUpdate = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);

  const initialZoom = getInitialZoom();
  const viewportRef = useRef<Viewport>({
    x: window.innerWidth / 2 - WORLD_CENTER.x * initialZoom,
    y: window.innerHeight / 2 - WORLD_CENTER.y * initialZoom,
    zoom: initialZoom
  });

  const updateWorldTransform = () => {
    if (worldRef.current) {
      const v = viewportRef.current;
      // L7 GPU Isolation: translate3d + scale
      worldRef.current.style.transform = `translate3d(${v.x}px, ${v.y}px, 0) scale(${v.zoom})`;
    }
    if (radarRef.current) {
      const v = viewportRef.current;
      const r = radarRef.current;
      const x = ((-v.x / v.zoom) / 10000) * 160;
      const y = ((-v.y / v.zoom) / 10000) * 80;
      const w = ((window.innerWidth / v.zoom) / 10000) * 160;
      const h = ((window.innerHeight / v.zoom) / 10000) * 80;
      r.style.transform = `translate(${x}px, ${y}px)`;
      r.style.width = `${w}px`;
      r.style.height = `${h}px`;
    }
  };

  const resetView = () => {
    const zoom = getInitialZoom();
    const newViewport = {
      x: window.innerWidth / 2 - WORLD_CENTER.x * zoom,
      y: window.innerHeight / 2 - WORLD_CENTER.y * zoom,
      zoom
    };
    viewportRef.current = newViewport;
    setViewport(newViewport);
    updateWorldTransform();
  };

  useEffect(() => {
    updateWorldTransform();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const prev = viewportRef.current;

      // L7 Refined Constraints: Allow 'God View' but cap 'Infinite Emptiness'
      const minZoom = 0.15;
      const maxZoom = 4.0;
      const newZoom = Math.min(Math.max(prev.zoom * factor, minZoom), maxZoom);

      // Anchor the zoom to the mouse position
      const worldMouse = project({ x: e.clientX, y: e.clientY }, prev);
      const newScreenPos = unproject(worldMouse, { ...prev, zoom: newZoom });
      const dx = e.clientX - newScreenPos.x;
      const dy = e.clientY - newScreenPos.y;

      const newViewport = { x: prev.x + dx, y: prev.y + dy, zoom: newZoom };
      viewportRef.current = newViewport;
      updateWorldTransform();
      setViewport(newViewport);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    localStorage.setItem('cntp-blueprint', isBlueprint.toString());
  }, [isBlueprint]);

  useEffect(() => {
    localStorage.setItem('cntp-summary', isSummaryView.toString());
  }, [isSummaryView]);

  const [isPanning, setIsPanning] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const lastMousePos = useRef<Point>({ x: 0, y: 0 });
  const dragOffset = useRef<Point>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;

    // Check if we clicked a node first
    const point = project({ x: e.clientX, y: e.clientY }, viewport);
    const nodes = engine.getNodes();
    const hit = nodes.find((n: Node) => {
      const w = isSummaryView && viewport.zoom < 0.7 ? 40 : n.data.width;
      const h = isSummaryView && viewport.zoom < 0.7 ? 40 : n.data.height;
      return point.x >= n.position.x && point.x <= n.position.x + w &&
        point.y >= n.position.y && point.y <= n.position.y + h;
    });

    if (hit) {
      setDraggedNodeId(hit.id);
      setSelectedId(hit.id);
      dragOffset.current = {
        x: point.x - hit.position.x,
        y: point.y - hit.position.y
      };
      setIsPanning(false);
    } else {
      setIsPanning(true);
      setSelectedId(null);
    }

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const lastSyncTime = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const v = viewportRef.current;

    // L7 ZERO-LATENCY: Direct-DOM Node Drag
    if (draggedNodeId) {
      const point = project({ x: e.clientX, y: e.clientY }, v);
      let newX = point.x - dragOffset.current.x;
      let newY = point.y - dragOffset.current.y;

      // L7 MAGNETIC SNAPPING: 20px Grid
      const GRID_SIZE = 20;
      newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
      newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

      // Update engine state (Silent)
      engine.updateNodePosition(draggedNodeId, newX, newY);

      // Update Node DOM directly (Composite Layer)
      const nodeEl = document.getElementById(`node-${draggedNodeId}`);
      if (nodeEl) {
        nodeEl.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
      }

      // L7 THROTTLED SYNC: Ensure the virtualizer doesn't 'lose' the world
      const now = performance.now();
      if (now - lastSyncTime.current > 32) {
        setViewport({ ...v });
        lastSyncTime.current = now;
      }

      // Update connected edges DOM directly (O(1) lookup)
      const edges = engine.getConnectedEdges(draggedNodeId);

      edges.forEach((edge: any) => {
        const edgeEl = document.getElementById(`edge-path-${edge.id}`);
        const pulseEl = document.getElementById(`edge-pulse-${edge.id}`);

        const sourceNode = engine.getNodes().find(n => n.id === edge.source);
        const targetNode = engine.getNodes().find(n => n.id === edge.target);
        if (sourceNode && targetNode) {
          const path = calculatePath(sourceNode, targetNode, isSummaryView && v.zoom < 0.7);
          if (edgeEl) edgeEl.setAttribute('d', path);
          if (pulseEl) pulseEl.setAttribute('d', path);
        }
      });
      return;
    }

    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const newViewport = { ...v, x: v.x + dx, y: v.y + dy };
      viewportRef.current = newViewport;

      // Update World DOM directly
      if (worldRef.current) {
        worldRef.current.style.transform = `translate3d(${newViewport.x}px, ${newViewport.y}px, 0) scale(${newViewport.zoom})`;
      }

      // L7 THROTTLED SYNC: Prevent 'Vanishing World'
      const now = performance.now();
      if (now - lastSyncTime.current > 32) {
        setViewport(newViewport);
        lastSyncTime.current = now;
      }

      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const point = project({ x: e.clientX, y: e.clientY }, viewport);
    const nodes = engine.getNodes();
    const hit = nodes.find((n: Node) => {
      const w = isSummaryView ? 40 : n.data.width;
      const h = isSummaryView ? 40 : n.data.height;
      return point.x >= n.position.x && point.x <= n.position.x + w &&
        point.y >= n.position.y && point.y <= n.position.y + h;
    });
    const newId = hit ? hit.id : null;
    if (newId !== hoveredId) setHoveredId(newId);
  };

  const handleMouseUp = () => {
    if (isPanning || draggedNodeId) {
      setIsPanning(false);
      setDraggedNodeId(null);
      // L7 COMMIT: Finalize the spatial truth and update virtualizer
      engine.commitNodePositions();
      setViewport(viewportRef.current);
    }
  };

  const renderData = useMemo(() => {
    // L7 PHASE-LOCK: Synchronize the engine's internal truth BEFORE calculating visibility
    engine.setViewport(viewport);
    const data = engine.getRenderData();
    
    // L7 TELEMETRY DAMPING: Update HUD only at 10Hz to prevent flicker
    const now = performance.now();
    if (now - lastStatsUpdate.current > 100) {
      setStats(engine.getStats());
      lastStatsUpdate.current = now;
    }
    
    return data;
  }, [viewport, engine]);

  const canvasContent = useMemo(() => {
    const currentNodes = renderData.nodes;
    const currentEdges = renderData.edges;
    const freshNodeMap = new Map<string, Node>(engine.getNodes().map((n: Node) => [n.id, n]));

    return (
      <div
        ref={worldRef}
        className={cn("absolute inset-0 will-change-transform", isPanning && "pointer-events-none")}
        style={{ transformOrigin: '0 0' }}
      >
        <div className="absolute inset-[-10000px] pointer-events-none opacity-[0.05]" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: `100px 100px` }} />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {ZONES.map(zone => (
            <div key={zone.id} className="absolute flex flex-col items-center translate-z-0" style={{ left: zone.x, top: 4000, transform: `scale(${Math.max(viewport.zoom, 0.4)})`, opacity: Math.max(viewport.zoom, 0.2) }}>
              <div className="w-[2px] h-[3000px] bg-white/[0.08]" />
              <div className="mt-12 flex flex-col items-center gap-2">
                <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.5em]">{zone.id}</span>
                <span className="text-4xl font-black text-white/60 tracking-tighter">{zone.name}</span>
              </div>
            </div>
          ))}
        </div>

        <svg className="absolute inset-0 pointer-events-none overflow-visible z-0">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="currentColor" fillOpacity="0.6" />
            </marker>
          </defs>
          {currentEdges.map((edge: EngineEdge) => (
            <MemoizedEdge 
              key={edge.id}
              edge={edge}
              sourceNode={freshNodeMap.get(edge.source)}
              targetNode={freshNodeMap.get(edge.target)}
              isPathHovered={hoveredId === edge.source || hoveredId === edge.target}
              isBlueprint={isBlueprint}
              isSummaryView={isSummaryView}
              zoom={viewport.zoom}
              isAnyNodeHovered={!!hoveredId}
            />
          ))}
        </svg>

        <div className="absolute inset-0 pointer-events-none z-10">
          {currentNodes.map((node: Node) => (
            <MemoizedNode 
              key={node.id}
              node={node}
              isSelected={selectedId === node.id}
              zoom={viewport.zoom}
              onSelect={setSelectedId}
              isSummaryView={isSummaryView}
              isHovered={hoveredId === node.id}
              isAnyHovered={!!hoveredId}
            />
          ))}
        </div>
      </div>
    );
  }, [renderData, selectedId, hoveredId, isBlueprint, isSummaryView, viewport.zoom, isPanning, engine]);

  return (
    <div
      ref={containerRef}
      className={cn("w-screen h-screen relative overflow-hidden bg-[#020617] select-none", isPanning ? "cursor-grabbing" : "cursor-grab")}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={() => setSelectedId(null)}
    >
      {canvasContent}

      <div className="absolute inset-0 pointer-events-none z-[100]">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl pointer-events-auto min-w-[400px]">
            <Search size={14} className="text-white/40" />
            <input type="text" placeholder="Search service... (Ctrl+K)" className="bg-transparent border-none outline-none text-xs text-white/80 w-full font-mono" />
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            {['ALL', 'ERRORS', 'LATENCY', 'SECURE'].map(f => (
              <button key={f} className={cn("px-3 py-1 rounded-full border text-[9px] font-black", f === 'ALL' ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-white/40")}>{f}</button>
            ))}
          </div>
        </div>

        <div className="absolute top-8 right-8 pointer-events-none hidden lg:block">
          <div className="bg-[#0f172a]/60 backdrop-blur-md border border-white/5 rounded-lg p-1 w-40 h-20 pointer-events-auto relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: `10px 10px` }} />
            <div className="absolute inset-0 pointer-events-none flex justify-between px-2 opacity-20">
              {ZONES.map(z => (<div key={z.id} className="h-full w-px bg-white/40" style={{ left: `${(z.x / 10000) * 100}%` }} />))}
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-40">
              {engine.getNodes().map(node => (
                <div
                  key={node.id}
                  className="absolute w-1 h-1 rounded-full translate-z-0"
                  style={{
                    transform: `translate3d(${(node.position.x / 10000) * 160}px, ${(node.position.y / 10000) * 80}px, 0)`,
                    backgroundColor: node.data.color
                  }}
                />
              ))}
            </div>
            <div ref={radarRef} className="absolute border border-amber-500/50 bg-amber-500/10 transition-all duration-75 z-10">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-full h-px bg-amber-500" /><div className="h-full w-px bg-amber-500 absolute" />
              </div>
            </div>
            <span className="absolute bottom-1 right-1 text-[6px] font-mono text-white/20 uppercase tracking-[0.2em]">Radar</span>
          </div>
        </div>

        <div className="absolute top-8 left-8 pointer-events-none">
          <div className={cn("border border-white/10 px-5 py-4 rounded-xl bg-[#0f172a] shadow-2xl pointer-events-auto")}>
            <StatHUD stats={stats} isBlueprintMode={isBlueprint} viewport={viewport} setIsBlueprint={setIsBlueprint} setIsSummaryView={setIsSummaryView} isSummaryView={isSummaryView} isEventFeedVisible={isEventFeedVisible} setIsEventFeedVisible={setIsEventFeedVisible} isLegendVisible={isLegendVisible} setIsLegendVisible={setIsLegendVisible} resetView={resetView} />
          </div>
        </div>

        {isEventFeedVisible && (
          <div className="absolute bottom-8 left-8 w-64 hidden md:block">
            <div className="backdrop-blur-md border border-white/10 bg-[#0f172a]/80 rounded-lg p-3 shadow-2xl pointer-events-auto">
              <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-1.5 uppercase text-[8px] font-black text-white/40 tracking-widest">System Feed</div>
              <div className="flex flex-col gap-1.5 text-[9px] font-mono text-white/40 opacity-60">
                <div className="flex gap-2"><span>15:34:22</span><span className="truncate">Gateway: Optimal</span></div>
                <div className="flex gap-2"><span>15:34:10</span><span className="truncate">Service-8: Latency Spike</span></div>
              </div>
            </div>
          </div>
        )}

        {isLegendVisible && (
          <div className="absolute bottom-8 right-8 w-48">
            <div className="backdrop-blur-md border border-white/10 bg-[#0f172a]/80 rounded-lg p-3 shadow-2xl pointer-events-auto">
              <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-1.5 uppercase text-[8px] font-black text-white/40 tracking-widest text-center justify-center">Legend</div>
              <div className="flex flex-col gap-2 text-[9px] font-mono">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /> <span className="text-white/60 uppercase font-black">Healthy</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /> <span className="text-white/60 uppercase font-black">Degraded</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> <span className="text-white/60 uppercase font-black">Critical</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
