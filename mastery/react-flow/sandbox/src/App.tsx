import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MasteryEngine, type EngineEdge } from './MasteryEngine';
import { project, unproject } from '../../invariant-core/inv02-viewport/src/index.ts';
import type { Viewport, Point } from '../../invariant-core/inv02-viewport/src/index.ts';
import { Node } from '../../invariant-core/inv01-model/src/index.ts';
import { Shield, Search, Eye, Layout, Database, Activity, Cpu, ChevronRight, X, RotateCcw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MAX_NODES = 1000;
const BOUNDARY = { width: 10000, height: 10000 };
const WORLD_CENTER = { x: 5000, y: 5000 };

const getInitialZoom = () => {
  if (typeof window === 'undefined') return 0.35;
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.min(w / 4000, h / 3500, 0.38);
};

const TypeIcon = React.memo(({ type, color }: { type: string, color: string }) => {
  const props = { size: 12, style: { color } };
  if (type === 'GATEWAY') return <Shield {...props} />;
  if (type === 'SERVICE') return <Cpu {...props} />;
  if (type === 'DATABASE') return <Database {...props} />;
  return <Cpu {...props} />;
});

const calculatePath = (sourcePos: Point, targetPos: Point, sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number, targetIdx: number, isGateway: boolean) => {
  const sX = sourcePos.x + sourceWidth;
  const sY = sourcePos.y + (sourceHeight / 2);
  const tX = targetPos.x;
  const tY = targetPos.y + (targetHeight / 2);
  const dx = tX - sX;
  const curvature = dx * 0.4;
  return `M ${sX} ${sY} C ${sX + curvature} ${sY}, ${tX - curvature} ${tY}, ${tX} ${tY}`;
};

const MemoizedEdge = React.memo(({ edge, sourceNode, targetNode, isPathHovered, isBlueprint, isSummaryView, zoom, isAnyNodeHovered }: any) => {
  if (!sourceNode || !targetNode) return null;
  const effectiveSummaryView = isSummaryView && zoom < 0.3;
  const sW = effectiveSummaryView ? 40 : sourceNode.data?.width || 280;
  const sH = effectiveSummaryView ? 40 : sourceNode.data?.height || 160;
  const tW = effectiveSummaryView ? 40 : targetNode.data?.width || 280;
  const tH = effectiveSummaryView ? 40 : targetNode.data?.height || 160;
  const tIdx = parseInt(targetNode.id.replace(/\D/g, '')) || 0;
  const path = calculatePath(sourceNode.position, targetNode.position, sW, sH, tW, tH, tIdx, sourceNode.data?.type === 'GATEWAY');

  const isDimmed = isAnyNodeHovered && !isPathHovered;

  return (
    <g className="transition-opacity duration-500" style={{ opacity: isDimmed ? 0.2 : 1 }}>
      {/* Structural Baseline */}
      <path d={path} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={4} />
      {/* Data Flow Stroke */}
      <path
        id={`edge-path-${edge.id}`}
        d={path}
        fill="none"
        stroke={isPathHovered ? "rgba(255,255,255,1.0)" : isBlueprint ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.3)"}
        strokeWidth={isPathHovered ? 2.0 : 0.8 + (parseFloat(sourceNode.data.telemetry.cpu) / 120)}
        className={cn(
          "transition-all duration-300",
          (isPathHovered || parseFloat(sourceNode.data.telemetry.cpu) > 60) && "animate-flow"
        )}
        style={{
          animationDuration: `${Math.max(0.5, 4 - (parseFloat(sourceNode.data.telemetry.cpu) / 25))}s`,
          strokeDasharray: isBlueprint ? '4, 4' : (isPathHovered ? '10, 10' : 'none'),
          willChange: 'stroke, stroke-width, opacity'
        }}
      />
    </g>
  );
});

const MemoizedNode = React.memo(({ node, isSelected, zoom, onSelect, onInspect, isSummaryView, isHovered, isAnyHovered }: any) => {
  const isDimmed = isAnyHovered && !isHovered && !isSelected;
  const effectiveSummaryView = isSummaryView && zoom < 0.3;
  const isError = node.data?.status === 'CRITICAL';
  const color = node.data?.color || '#3b82f6';

  return (
    <div
      id={`node-${node.id}`}
      className={cn(
        "absolute pointer-events-auto group",
        isDimmed ? "opacity-30 scale-95" : "opacity-100 scale-100",
        node.data.status === 'CRITICAL' && node.data.telemetry.cpu > 90 && "stress-vibration",
        node.data.status === 'RESTARTING' && "recovery-glow"
      )}
      style={{
        transform: `translate3d(${node.position.x}px, ${node.position.y}px, 0)`,
        width: effectiveSummaryView ? 40 : node.data?.width || 280,
        height: effectiveSummaryView ? 40 : node.data?.height || 160,
        zIndex: isSelected ? 100 : 10,
        willChange: 'transform'
      }}
      onDoubleClick={() => onInspect(node.id)}
    >
      {effectiveSummaryView ? (
        <div className={cn(
          "w-full h-full rounded-xl border-2 glass-card flex items-center justify-center transition-opacity duration-300",
          isSelected ? "node-selected scale-125 border-white" : "border-white/10",
          isError && "border-rose-500 bg-rose-500/20"
        )} style={{ backgroundColor: isSelected ? color : `${color}33` }}>
          <TypeIcon type={node.data?.type || 'UNIT'} color={isSelected ? '#fff' : color} />
        </div>
      ) : (
        <div className={cn(
          "relative h-full w-full flex flex-col rounded-2xl overflow-hidden glass-card-premium transition-all duration-300 cursor-pointer",
          isSelected ? "node-selected ring-1 ring-white/30 shadow-[0_0_40px_rgba(255,255,255,0.1)]" : "border-white/10 shadow-2xl",
          isError && "bg-rose-500/[0.02] border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)]"
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
          <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <TypeIcon type={node.data?.type || 'UNIT'} color={color} />
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] font-mono">{node.data?.type || 'UNIT'}</span>
            </div>
            {isError && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[7px] font-black text-rose-500 uppercase">Alert</span>
              </div>
            )}
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-white/90 tracking-tight truncate uppercase leading-tight">{node.data?.label || 'Unknown Unit'}</h3>
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">ID: {node.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 border-t border-white/5 pt-3">
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Latency</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400/80 mt-0.5">{node.data?.telemetry?.latency || 0}ms</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Load</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500/40 rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${node.data?.telemetry?.cpu || 0}%` }} />
                  </div>
                  <span className="text-[8px] font-mono font-bold text-white/40">{node.data?.telemetry?.cpu || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const ZONES = [
  { id: 'Z01', name: 'INGRESS', x: 3800, nodeType: 'GATEWAY' },
  { id: 'Z02', name: 'ROUTING', x: 4400, nodeType: 'LOAD_BALANCER' },
  { id: 'Z03', name: 'SERVICES', x: 5000, nodeType: 'SERVICE' },
  { id: 'Z04', name: 'PERSISTENCE', x: 5600, nodeType: 'DATABASE' }
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

const StatHUD = React.memo(({ stats, engine, isBlueprintMode, setIsBlueprint, setIsSummaryView, isSummaryView, onReset }: any) => {
  const [fps, setFps] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
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

  const handleReset = () => {
    setIsResetting(true);
    onReset();
    setTimeout(() => setIsResetting(false), 800);
  };

  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)] animate-pulse" />
        <h2 className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] text-gradient">Infrastructure HLD</h2>
        <div className="w-px h-2 bg-white/10 mx-1" />
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-6 mt-3">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">Signal</span>
            <span className={cn("text-[10px] font-mono font-bold tabular-nums", fps >= 60 ? "text-emerald-400" : "text-amber-400")}>{fps} FPS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">Units</span>
            <span className="text-[10px] font-mono text-white/60 font-bold tabular-nums">{stats?.totalNodes || 0}</span>
          </div>
        </div>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[6px] font-black text-rose-500/30 uppercase tracking-widest">Crit</span>
            <span className="text-[10px] font-mono text-rose-500 font-bold tabular-nums">{stats?.critical || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] font-black text-amber-500/30 uppercase tracking-widest">Degr</span>
            <span className="text-[10px] font-mono text-amber-500 font-bold tabular-nums">{stats?.degraded || 0}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 ml-4">
          {[
            { icon: Eye, active: isSummaryView, onClick: () => setIsSummaryView(!isSummaryView), label: 'LOD' },
            { icon: Layout, active: isBlueprintMode, onClick: () => setIsBlueprint(!isBlueprintMode), label: 'MESH' },
            { icon: RotateCcw, active: isResetting, onClick: handleReset, label: 'RESET' }
          ].map((btn, i) => (
            <button 
              key={i}
              onClick={btn.onClick}
              className={cn(
                "p-1.5 rounded-lg border transition-all duration-300 group relative",
                btn.active ? "bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-rose-400",
                btn.label === 'RESET' && isResetting && "animate-pulse border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              )}
            >
              <btn.icon size={11} strokeWidth={2.5} className={cn(btn.label === 'RESET' && isResetting && "animate-spin")} />
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#0f172a] rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <span className="text-[6px] font-black tracking-widest uppercase">{btn.label}</span>
              </div>
            </button>
          ))}
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

  const [engine] = useState(() => {
    const instance = new MasteryEngine(MAX_NODES, BOUNDARY);
    const savedLayout = localStorage.getItem('cntp-topology-layout');
    if (savedLayout) {
      try {
        instance.hydratePositions(JSON.parse(savedLayout));
      } catch (e) {
        console.error("Failed to hydrate layout", e);
      }
    }
    return instance;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isBlueprint, setIsBlueprint] = useState(() => localStorage.getItem('cntp-blueprint') === 'true');
  const [isSummaryView, setIsSummaryView] = useState(() => localStorage.getItem('cntp-summary') === 'true');
  const [activeFilter, setActiveFilter] = useState<string>(() => localStorage.getItem('cntp-filter') || 'ALL');
  const [stats, setStats] = useState(() => engine.getStats());
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [telemetryTick, setTelemetryTick] = useState(0);
  const [inspectorTab, setInspectorTab] = useState<'OVERVIEW' | 'METRICS' | 'CONTROLS'>('OVERVIEW');

  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);
  const lastSyncTime = useRef(0);
  const lastMousePos = useRef<Point>({ x: 0, y: 0 });
  const dragOffset = useRef<Point>({ x: 0, y: 0 });
  const viewportRef = useRef<Viewport>(viewport);
  const [isPanning, setIsPanning] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const rafId = useRef<number>(0);
  const nextPos = useRef<Point | null>(null);
  const dragStartPos = useRef<Point>({ x: 0, y: 0 });
  const didDrag = useRef(false);

  const updateWorldTransform = () => {
    if (worldRef.current) {
      const v = viewportRef.current;
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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const prev = viewportRef.current;
      const newZoom = Math.min(Math.max(prev.zoom * factor, 0.15), 4.0);
      const worldMouse = project({ x: e.clientX, y: e.clientY }, prev);
      const newScreenPos = unproject(worldMouse, { ...prev, zoom: newZoom });
      const newViewport = { x: prev.x + (e.clientX - newScreenPos.x), y: prev.y + (e.clientY - newScreenPos.y), zoom: newZoom };
      viewportRef.current = newViewport;
      updateWorldTransform();
      setViewport(newViewport);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const v = viewportRef.current;
    const point = project({ x: e.clientX, y: e.clientY }, v);
    const nodes = engine.getNodes();
    const hit = nodes.find((n: Node) => {
      const w = isSummaryView && v.zoom < 0.7 ? 40 : n.data?.width || 280;
      const h = isSummaryView && v.zoom < 0.7 ? 40 : n.data?.height || 160;
      return point.x >= n.position.x && point.x <= n.position.x + w &&
             point.y >= n.position.y && point.y <= n.position.y + h;
    });

    if (hit) {
      setDraggedNodeId(hit.id);
      setSelectedId(hit.id); // L7: Instant selection highlight
      dragOffset.current = { x: point.x - hit.position.x, y: point.y - hit.position.y };
      setIsPanning(false);
      didDrag.current = false;
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      const nodeEl = document.getElementById(`node-${hit.id}`);
      if (nodeEl) nodeEl.classList.add('dragging');
    } else {
      setIsPanning(true);
      setSelectedId(null);
      didDrag.current = false;
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    }
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const v = viewportRef.current;
    if (draggedNodeId) {
      const point = project({ x: e.clientX, y: e.clientY }, v);
      nextPos.current = {
        x: Math.round((point.x - dragOffset.current.x) / 8) * 8,
        y: Math.round((point.y - dragOffset.current.y) / 8) * 8
      };
      didDrag.current = true;

      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          if (!draggedNodeId || !nextPos.current) {
            rafId.current = 0;
            return;
          }

          const id = draggedNodeId;
          const { x, y } = nextPos.current;
          
          engine.updateNodePosition(id, x, y);
          const nodeEl = document.getElementById(`node-${id}`);
          if (nodeEl) nodeEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;

          const edges = engine.getConnectedEdges(id);
          const isSum = isSummaryView && v.zoom < 0.7;
          const nodes = engine.getNodes();
          const nodeMap = new Map(nodes.map(n => [n.id, n]));

          edges.forEach((edge: any) => {
            const edgeEl = document.getElementById(`edge-path-${edge.id}`);
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (source && target && edgeEl) {
              const sW = isSum ? 40 : source.data?.width || 280;
              const sH = isSum ? 40 : source.data?.height || 160;
              const tW = isSum ? 40 : target.data?.width || 280;
              const tH = isSum ? 40 : target.data?.height || 160;
              const tIdx = parseInt(target.id.replace(/\D/g, '')) || 0;
              edgeEl.setAttribute('d', calculatePath(source.position, target.position, sW, sH, tW, tH, tIdx, source.data?.type === 'GATEWAY'));
            }
          });

          rafId.current = 0;
        });
      }
      return;
    }

    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const newViewport = { ...v, x: v.x + dx, y: v.y + dy };
      viewportRef.current = newViewport;
      updateWorldTransform();
      const now = performance.now();
      if (now - lastSyncTime.current > 16) {
        setViewport(newViewport);
        lastSyncTime.current = now;
      }
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const point = project({ x: e.clientX, y: e.clientY }, v);
    const hit = engine.getNodes().find((n: Node) => {
      const w = isSummaryView && v.zoom < 0.7 ? 40 : n.data?.width || 280;
      const h = isSummaryView && v.zoom < 0.7 ? 40 : n.data?.height || 160;
      return point.x >= n.position.x && point.x <= n.position.x + w &&
             point.y >= n.position.y && point.y <= n.position.y + h;
    });
    const newId = hit ? hit.id : null;
    if (newId !== hoveredId) setHoveredId(newId);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    const wasClick = Math.abs(dx) < 5 && Math.abs(dy) < 5;

    if (draggedNodeId) {
      const nodeEl = document.getElementById(`node-${draggedNodeId}`);
      if (nodeEl) nodeEl.classList.remove('dragging');
    } else if (isPanning && wasClick) {
      setSelectedId(null);
      setInspectedId(null);
    }

    setIsPanning(false);
    if (draggedNodeId) {
      const node = engine.getNodeById(draggedNodeId);
      if (node) {
        const layout = JSON.parse(localStorage.getItem('cntp-topology-layout') || '{}');
        layout[draggedNodeId] = { x: node.position.x, y: node.position.y };
        localStorage.setItem('cntp-topology-layout', JSON.stringify(layout));
      }
    }
    setDraggedNodeId(null);
    nextPos.current = null;
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    }
    engine.commitNodePositions();
    setViewport(viewportRef.current);
  };

  const renderData = useMemo(() => {
    engine.setViewport(viewport);
    return engine.getRenderData();
  }, [viewport, engine]);

  useEffect(() => {
    const statsTimer = setInterval(() => setStats(engine.getStats()), 500);
    const telemetryTimer = setInterval(() => {
      engine.tickTelemetry();
      setTelemetryTick(t => t + 1);
    }, 5000);
    return () => { clearInterval(statsTimer); clearInterval(telemetryTimer); };
  }, [engine]);

  const zoneHealth = useMemo(() => engine.getZoneHealth(), [stats]);

  const matchesFilter = (node: Node) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CRITICAL') return node.data?.status === 'CRITICAL';
    if (activeFilter === 'DEGRADED') return node.data?.status === 'DEGRADED';
    if (activeFilter === 'LATENCY') return parseFloat(node.data?.telemetry?.latency || '0') > 15;
    return true;
  };

  const canvasContent = useMemo(() => {
    const nodes = engine.getNodes();
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const activeHoveredId = draggedNodeId ? null : hoveredId;
    const isFiltering = activeFilter !== 'ALL';
    
    return (
      <div ref={worldRef} className={cn("absolute inset-0 will-change-transform", isPanning && "pointer-events-none")} style={{ transformOrigin: '0 0', transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.zoom})` }}>
        <div className="absolute inset-[-10000px] pointer-events-none opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: `100px 100px` }} />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {ZONES.map(zone => {
            const zh = zoneHealth[zone.nodeType] || { healthy: 0, degraded: 0, critical: 0, total: 0 };
            const dotColor = zh.critical > 0 ? '#f43f5e' : zh.degraded > 0 ? '#fbbf24' : '#10b981';
            return (
              <div key={zone.id} className="absolute flex flex-col items-center translate-z-0" style={{ left: zone.x, top: 4000, transform: `scale(${Math.max(viewport.zoom, 0.4)})`, opacity: Math.max(viewport.zoom, 0.2) }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}40` }} />
                  <span className="text-[9px] font-mono font-bold text-white/30 tabular-nums">{zh.total}</span>
                </div>
                <div className="w-[2px] h-[3000px] bg-white/[0.08]" />
                <div className="mt-12 flex flex-col items-center gap-2">
                  <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.5em]">{zone.id}</span>
                  <span className="text-4xl font-black text-white/60 tracking-tighter">{zone.name}</span>
                </div>
              </div>
            );
          })}
        </div>
        <svg className="absolute inset-0 pointer-events-none overflow-visible z-0">
          {renderData.edges.map((edge: EngineEdge) => {
            const srcNode = nodeMap.get(edge.source);
            const tgtNode = nodeMap.get(edge.target);
            const filterDimmed = isFiltering && srcNode && tgtNode && !matchesFilter(srcNode) && !matchesFilter(tgtNode);
            return (
              <MemoizedEdge key={edge.id} edge={edge} sourceNode={srcNode} targetNode={tgtNode} 
                isPathHovered={activeHoveredId === edge.source || activeHoveredId === edge.target} isBlueprint={isBlueprint || filterDimmed} isSummaryView={isSummaryView} zoom={viewport.zoom} isAnyNodeHovered={!!activeHoveredId} />
            );
          })}
        </svg>
        <div className="absolute inset-0 pointer-events-none z-10">
          {renderData.nodes.map((node: Node) => {
            const filterDimmed = isFiltering && !matchesFilter(node);
            return (
              <MemoizedNode key={node.id} node={node} isSelected={selectedId === node.id} zoom={viewport.zoom} onSelect={setSelectedId} onInspect={setInspectedId}
                isSummaryView={isSummaryView} isHovered={activeHoveredId === node.id} isAnyHovered={!!activeHoveredId || filterDimmed} />
            );
          })}
        </div>
      </div>
    );
  }, [renderData, selectedId, hoveredId, isBlueprint, isSummaryView, viewport.x, viewport.y, viewport.zoom, isPanning, engine, draggedNodeId, activeFilter, zoneHealth, telemetryTick]);

  const selectedNode = inspectedId ? engine.getNodeById(inspectedId) : null;
  const selectedEdges = inspectedId ? engine.getConnectedEdges(inspectedId) : [];

  const handleMouseLeave = () => {
    if (draggedNodeId) {
      const nodeEl = document.getElementById(`node-${draggedNodeId}`);
      if (nodeEl) nodeEl.classList.remove('dragging');
    }
    setIsPanning(false);
    setDraggedNodeId(null);
    nextPos.current = null;
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = 0; }
    engine.commitNodePositions();
    setViewport(viewportRef.current);
  };

  return (
    <div ref={containerRef} className={cn("w-screen h-screen relative overflow-hidden bg-[#01040f] select-none", isPanning ? "cursor-grabbing" : "cursor-grab")}
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onClick={() => { setSelectedId(null); setInspectedId(null); }}>
      {canvasContent}
      <div className="absolute inset-0 pointer-events-none z-[9999] overflow-hidden">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none w-full max-w-lg px-8">
          <div className={cn("w-full glass-panel rounded-2xl px-5 py-2.5 flex items-center gap-4 shadow-2xl pointer-events-auto transition-all duration-500 relative overflow-hidden", isSearchFocused ? "border-blue-500/40 ring-2 ring-blue-500/5 scale-[1.01]" : "border-white/5")}>
            <div className={cn("absolute inset-0 shimmer-active opacity-0 transition-opacity duration-700", isSearchFocused && "opacity-100")} />
            <Search size={14} className={cn("transition-colors duration-500 shrink-0", isSearchFocused ? "text-blue-400" : "text-white/20")} strokeWidth={2.5} />
            <input type="text" placeholder="Search Infrastructure DNA..." onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} className="bg-transparent border-none outline-none text-[11px] text-white/80 w-full font-mono placeholder:text-white/10 tracking-tight relative z-10" />
          </div>
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {['ALL', 'CRITICAL', 'DEGRADED', 'LATENCY'].map(f => (
              <button key={f} onClick={(e) => { e.stopPropagation(); setActiveFilter(f); localStorage.setItem('cntp-filter', f); }}
                className={cn("px-3 py-1 rounded-full border text-[7px] font-black tracking-[0.15em] transition-all duration-300 uppercase",
                  activeFilter === f ? "glass-panel text-white border-white/20 shadow-lg" : "bg-white/5 border-white/5 text-white/20 hover:bg-white/10 hover:text-white/40")}>{f}</button>
            ))}
          </div>
        </div>
        <div className="absolute top-6 right-6 pointer-events-none hidden xl:block">
          <div className="glass-panel rounded-2xl p-2 w-48 h-24 pointer-events-auto relative overflow-hidden group border-white/5">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: `10px 10px` }} />
            <div className="absolute inset-0 pointer-events-none opacity-40 transition-all duration-500 group-hover:opacity-100">
              {engine.getNodes().map(node => (<div key={node.id} className="absolute w-1 h-1 rounded-full" style={{ transform: `translate3d(${(node.position.x - 3500) / 3000 * 192}px, ${(node.position.y - 4000) / 2000 * 96}px, 0)`, backgroundColor: node.data?.color || '#3b82f6' }} />))}
            </div>
            <div ref={radarRef} className="absolute border border-blue-500/40 bg-blue-500/5 transition-all duration-100 z-10 rounded-sm" style={{ transform: `translate(${((-viewport.x / viewport.zoom - 3500) / 3000) * 192}px, ${((-viewport.y / viewport.zoom - 4000) / 2000) * 96}px)`, width: `${((window.innerWidth / viewport.zoom) / 3000) * 192}px`, height: `${((window.innerHeight / viewport.zoom) / 2000) * 96}px` }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-10"><div className="w-full h-px bg-blue-500" /><div className="h-full w-px bg-blue-500 absolute" /></div>
            </div>
            <span className="absolute bottom-0.5 right-1.5 text-[5px] font-black text-white/10 uppercase tracking-[0.2em] font-mono">Radar</span>
          </div>
        </div>
        <div className="absolute top-6 left-6 pointer-events-none">
          <div className="glass-panel px-4 py-3 rounded-2xl shadow-2xl pointer-events-auto border-white/5">
            <StatHUD stats={stats} engine={engine} isBlueprintMode={isBlueprint} setIsBlueprint={setIsBlueprint} setIsSummaryView={setIsSummaryView} isSummaryView={isSummaryView} 
              onReset={() => {
                localStorage.removeItem('cntp-topology-layout');
                engine.resetToGoldenLayout();
                const zoom = getInitialZoom();
                const newViewport = {
                  x: window.innerWidth / 2 - WORLD_CENTER.x * zoom,
                  y: window.innerHeight / 2 - WORLD_CENTER.y * zoom,
                  zoom
                };
                viewportRef.current = newViewport;
                updateWorldTransform();
                setViewport(newViewport);
              }} />
          </div>
        </div>
        {/* Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-7 glass-status-bar flex items-center px-5 gap-6 pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-mono font-bold text-emerald-400/60 tabular-nums">{stats?.healthy || 0}</span>
              <span className="text-[7px] font-black text-white/15 uppercase tracking-widest">Healthy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-[8px] font-mono font-bold text-amber-400/60 tabular-nums">{stats?.degraded || 0}</span>
              <span className="text-[7px] font-black text-white/15 uppercase tracking-widest">Degraded</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-[8px] font-mono font-bold text-rose-400/60 tabular-nums">{stats?.critical || 0}</span>
              <span className="text-[7px] font-black text-white/15 uppercase tracking-widest">Critical</span>
            </div>
          </div>
          <div className="w-px h-3 bg-white/5" />
          <span className="text-[8px] font-mono text-white/15 tabular-nums">{stats?.totalNodes || 0} nodes · {stats?.totalEdges || 0} edges</span>
          <span className="ml-auto text-[8px] font-mono text-white/10 tabular-nums">{(viewport.zoom * 100).toFixed(0)}%</span>
        </div>
      </div>
      {/* Node Detail Panel */}
      {selectedNode && (
        <div className="absolute top-0 right-0 bottom-7 w-80 glass-panel border-l border-white/10 z-[200] pointer-events-auto detail-panel-enter overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0f172a] z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedNode.data?.color || '#3b82f6' }} />
              <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.15em]">{selectedNode.data?.type || 'UNIT'}</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setInspectedId(null); }} className="p-1 rounded-md hover:bg-white/10 transition-colors text-white/30 hover:text-white/60"><X size={14} /></button>
          </div>
          <div className="flex items-center gap-6 px-5 border-b border-white/5 bg-white/[0.01]">
            {['OVERVIEW', 'METRICS', 'CONTROLS'].map(tab => (
              <button key={tab} onClick={() => setInspectorTab(tab as any)}
                className={cn("py-3 text-[8px] font-black tracking-widest uppercase transition-all relative", 
                  inspectorTab === tab ? "text-blue-400" : "text-white/20 hover:text-white/40")}>
                {tab}
                {inspectorTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {inspectorTab === 'OVERVIEW' && (
              <div className="p-5 flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-black text-white/90 tracking-tight">{selectedNode.data?.label}</h3>
                  <p className="text-[9px] font-mono text-white/20 mt-1">UUID: {selectedNode.id}</p>
                </div>
                
                <div className={cn("inline-flex self-start px-2.5 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border",
                  selectedNode.data?.status === 'CRITICAL' ? "text-rose-400 bg-rose-500/10 border-rose-500/20" :
                  selectedNode.data?.status === 'DEGRADED' ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                  selectedNode.data?.status === 'RESTARTING' ? "text-blue-400 bg-blue-500/10 border-blue-500/20" :
                  "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                )}>{selectedNode.data?.status || 'HEALTHY'}</div>

                <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                  <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Topological Context</span>
                  {selectedEdges.filter(e => e.target === selectedNode.id).length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[7px] text-white/15 uppercase tracking-widest">Inbound traffic</span>
                      {selectedEdges.filter(e => e.target === selectedNode.id).map(e => (
                        <div key={e.id} className="flex items-center gap-2 text-[9px] font-mono text-white/30 p-2 bg-white/[0.02] rounded border border-white/5">
                          <ChevronRight size={8} className="text-white/10 rotate-180" /><span>{e.source}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {inspectorTab === 'METRICS' && (
              <div className="p-5 flex flex-col gap-5">
                <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Live Telemetry</span>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-white/30 font-mono uppercase tracking-widest">Latency</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400">{selectedNode.data.telemetry.latency}ms</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500/40 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, parseFloat(selectedNode.data.telemetry.latency) * 2)}%` }} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-white/30 font-mono uppercase tracking-widest">CPU LOAD</span>
                      <span className="text-[10px] font-mono font-bold text-blue-400">{selectedNode.data.telemetry.cpu.toFixed(1)}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-1000", selectedNode.data.telemetry.cpu > 80 ? "bg-rose-500/60" : selectedNode.data.telemetry.cpu > 50 ? "bg-amber-500/40" : "bg-blue-500/40")} style={{ width: `${selectedNode.data.telemetry.cpu}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {inspectorTab === 'CONTROLS' && (
              <div className="p-5 flex flex-col gap-6">
                <h4 className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Operational Interventions</h4>
                <div className="flex flex-col gap-2">
                  <button onClick={(e) => { e.stopPropagation(); engine.restartNode(selectedNode.id); }}
                    className="w-full py-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest transition-all">
                    Restart Service Instance
                  </button>
                  <button onClick={() => { setIsBlueprint(!isBlueprint); localStorage.setItem('cntp-blueprint', String(!isBlueprint)); }}
                    className={cn("w-full py-3 rounded-lg transition-all duration-300 border text-[9px] font-black uppercase tracking-widest", isBlueprint ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10")}>
                    Toggle Blueprint Mode
                  </button>
                  <button onClick={() => { if(confirm('Reset all node positions to system defaults?')) { localStorage.removeItem('cntp-topology-layout'); window.location.reload(); } }}
                    className="w-full py-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-[9px] font-black text-rose-400 uppercase tracking-widest transition-all">
                    Reset Layout
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); engine.injectFault(selectedNode.id); }}
                    className="w-full py-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-[9px] font-black text-rose-400 uppercase tracking-widest transition-all">
                    Inject Fault (VPC Pressure)
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <p className="text-[8px] text-amber-200/40 leading-relaxed uppercase tracking-tighter">
                    Warning: Injecting faults will simulate cascading back-pressure to all downstream dependencies. Use only for resilience testing.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
