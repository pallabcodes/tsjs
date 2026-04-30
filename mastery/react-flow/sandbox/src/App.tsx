import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MasteryEngine, type EngineEdge } from './MasteryEngine';
import { project, unproject } from '../../invariant-core/inv02-viewport/src/index.ts';
import type { Viewport, Point } from '../../invariant-core/inv02-viewport/src/index.ts';
import { Node } from '../../invariant-core/inv01-model/src/index.ts';
import { Shield, Search, Eye, Layout, Database, Activity, Terminal, Info, Cpu, ChevronRight } from 'lucide-react';
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

const calculatePath = (sourcePos: Point, targetPos: Point, sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number, targetIdx: number, isGateway: boolean) => {
  const srcYOffset = isGateway ? (targetIdx % 3 - 1) * 30 : 0;
  const sX = sourcePos.x + sourceWidth;
  const sY = sourcePos.y + (sourceHeight / 2) + srcYOffset;
  const tX = targetPos.x;
  const tY = targetPos.y + (targetHeight / 2);
  const dx = tX - sX;
  const cp1x = sX + dx * 0.4;
  const cp2x = sX + dx * 0.6;
  return `M ${sX} ${sY} C ${cp1x} ${sY}, ${cp2x} ${tY}, ${tX} ${tY}`;
};

const MemoizedEdge = React.memo(({ edge, sourceNode, targetNode, isPathHovered, isBlueprint, isSummaryView, zoom, isAnyNodeHovered }: any) => {
  if (!sourceNode || !targetNode) return null;
  const effectiveSummaryView = isSummaryView && zoom < 0.7;
  const sW = effectiveSummaryView ? 40 : sourceNode.data?.width || 280;
  const sH = effectiveSummaryView ? 40 : sourceNode.data?.height || 160;
  const tW = effectiveSummaryView ? 40 : targetNode.data?.width || 280;
  const tH = effectiveSummaryView ? 40 : targetNode.data?.height || 160;
  const tIdx = parseInt(targetNode.id.replace(/\D/g, '')) || 0;
  const path = calculatePath(sourceNode.position, targetNode.position, sW, sH, tW, tH, tIdx, sourceNode.data?.type === 'GATEWAY');

  const isDimmed = isAnyNodeHovered && !isPathHovered;

  return (
    <path
      id={`edge-path-${edge.id}`}
      d={path}
      fill="none"
      stroke={isPathHovered ? "rgba(255,255,255,1.0)" : isBlueprint ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.4)"}
      strokeWidth={isPathHovered ? 3.0 : 2.0}
      className={cn(
        "transition-all duration-500",
        isDimmed ? "opacity-10" : isPathHovered ? "opacity-100" : "opacity-80",
        isPathHovered && "animate-flow"
      )}
      style={{
        strokeDasharray: isPathHovered ? '8, 8' : 'none',
        willChange: 'opacity, stroke-width'
      }}
    />
  );
});

const MemoizedNode = React.memo(({ node, isSelected, zoom, onSelect, isSummaryView, isHovered, isAnyHovered }: any) => {
  const isDimmed = isAnyHovered && !isHovered && !isSelected;
  const effectiveSummaryView = isSummaryView && zoom < 0.7;
  const isError = node.data?.status === 'CRITICAL';
  const color = node.data?.color || '#3b82f6';

  return (
    <div
      id={`node-${node.id}`}
      className={cn(
        "absolute pointer-events-auto group transition-all duration-500",
        isDimmed ? "opacity-10 scale-95 blur-[2px]" : "opacity-100 scale-100 blur-0"
      )}
      style={{
        transform: `translate3d(${node.position.x}px, ${node.position.y}px, 0)`,
        width: effectiveSummaryView ? 40 : node.data?.width || 280,
        height: effectiveSummaryView ? 40 : node.data?.height || 160,
        zIndex: isSelected ? 100 : 10,
        willChange: 'transform'
      }}
      onMouseDown={() => onSelect(node.id)}
    >
      {effectiveSummaryView ? (
        <div className={cn(
          "w-full h-full rounded-xl border-2 transition-all duration-500 glass-card",
          isSelected ? "node-selected scale-125 border-white" : "border-white/10",
          isError && "border-rose-500 bg-rose-500/20"
        )} style={{ backgroundColor: isSelected ? color : `${color}33` }} />
      ) : (
        <div className={cn(
          "relative h-full w-full flex flex-col rounded-2xl overflow-hidden glass-card transition-all duration-500",
          isSelected ? "node-selected border-white/40 ring-1 ring-white/20" : "border-white/5",
          isError && "border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.1)]"
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
                    <div className="h-full bg-blue-500/40 rounded-full" style={{ width: `${node.data?.telemetry?.cpu || 0}%` }} />
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
  { id: 'Z01', name: 'INGRESS', x: 4400 },
  { id: 'Z02', name: 'ROUTING', x: 4700 },
  { id: 'Z03', name: 'SERVICES', x: 5000 },
  { id: 'Z04', name: 'PERSISTENCE', x: 5300 }
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

const StatHUD = React.memo(({ stats, isBlueprintMode, viewport, setIsBlueprint, setIsSummaryView, isSummaryView, isEventFeedVisible, setIsEventFeedVisible, isLegendVisible, setIsLegendVisible }: any) => {
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
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
        <h2 className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] text-gradient">Topology Master</h2>
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
            { icon: Activity, active: isEventFeedVisible, onClick: () => setIsEventFeedVisible(!isEventFeedVisible), label: 'FEED' },
            { icon: Info, active: isLegendVisible, onClick: () => setIsLegendVisible(!isLegendVisible), label: 'KEY' }
          ].map((btn, i) => (
            <button 
              key={i}
              onClick={btn.onClick}
              className={cn(
                "p-1.5 rounded-lg border transition-all duration-300 group relative",
                btn.active ? "bg-white/10 border-white/20 text-white shadow-lg" : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10"
              )}
            >
              <btn.icon size={11} strokeWidth={2.5} />
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#0f172a] rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <span className="text-[6px] font-black text-white/40 tracking-widest uppercase">{btn.label}</span>
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

  const [engine] = useState(() => new MasteryEngine(MAX_NODES, BOUNDARY));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isBlueprint, setIsBlueprint] = useState(() => localStorage.getItem('cntp-blueprint') === 'true');
  const [isSummaryView, setIsSummaryView] = useState(() => localStorage.getItem('cntp-summary') === 'true');
  const [isLegendVisible, setIsLegendVisible] = useState(false);
  const [isEventFeedVisible, setIsEventFeedVisible] = useState(true);
  const [stats, setStats] = useState(() => engine.getStats());
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
      setSelectedId(hit.id);
      dragOffset.current = { x: point.x - hit.position.x, y: point.y - hit.position.y };
      setIsPanning(false);
      const nodeEl = document.getElementById(`node-${hit.id}`);
      if (nodeEl) nodeEl.classList.add('dragging');
    } else {
      setIsPanning(true);
      setSelectedId(null);
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

  const handleMouseUp = () => {
    if (isPanning || draggedNodeId) {
      if (draggedNodeId) {
        const nodeEl = document.getElementById(`node-${draggedNodeId}`);
        if (nodeEl) nodeEl.classList.remove('dragging');
      }
      setIsPanning(false);
      setDraggedNodeId(null);
      nextPos.current = null;
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
      engine.commitNodePositions();
      setViewport(viewportRef.current);
    }
  };

  const renderData = useMemo(() => {
    engine.setViewport(viewport);
    return engine.getRenderData();
  }, [viewport, engine]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(engine.getStats());
    }, 100);
    return () => clearInterval(timer);
  }, [engine]);

  const canvasContent = useMemo(() => {
    const nodes = engine.getNodes();
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    // L7 Fix: Suppress hover updates during drag to prevent canvas flickering
    const activeHoveredId = draggedNodeId ? null : hoveredId;
    
    return (
      <div ref={worldRef} className={cn("absolute inset-0 will-change-transform", isPanning && "pointer-events-none")} style={{ transformOrigin: '0 0', transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.zoom})` }}>
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
          {renderData.edges.map((edge: EngineEdge) => (
            <MemoizedEdge key={edge.id} edge={edge} sourceNode={nodeMap.get(edge.source)} targetNode={nodeMap.get(edge.target)} 
              isPathHovered={activeHoveredId === edge.source || activeHoveredId === edge.target} isBlueprint={isBlueprint} isSummaryView={isSummaryView} zoom={viewport.zoom} isAnyNodeHovered={!!activeHoveredId} />
          ))}
        </svg>
        <div className="absolute inset-0 pointer-events-none z-10">
          {renderData.nodes.map((node: Node) => (
            <MemoizedNode key={node.id} node={node} isSelected={selectedId === node.id} zoom={viewport.zoom} onSelect={setSelectedId} 
              isSummaryView={isSummaryView} isHovered={activeHoveredId === node.id} isAnyHovered={!!activeHoveredId} />
          ))}
        </div>
      </div>
    );
  }, [renderData, selectedId, hoveredId, isBlueprint, isSummaryView, viewport.x, viewport.y, viewport.zoom, isPanning, engine, draggedNodeId]);

  return (
    <div ref={containerRef} className={cn("w-screen h-screen relative overflow-hidden bg-[#01040f] select-none", isPanning ? "cursor-grabbing" : "cursor-grab")}
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onClick={() => setSelectedId(null)}>
      {canvasContent}
      <div className="absolute inset-0 pointer-events-none z-[100]">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none w-full max-w-xl px-8">
          <div className={cn("w-full glass-panel rounded-2xl px-5 py-2.5 flex items-center gap-4 shadow-2xl pointer-events-auto transition-all duration-500 relative overflow-hidden", isSearchFocused ? "border-blue-500/40 ring-2 ring-blue-500/5 scale-[1.01]" : "border-white/5")}>
            <div className={cn("absolute inset-0 shimmer-active opacity-0 transition-opacity duration-700", isSearchFocused && "opacity-100")} />
            <Search size={15} className={cn("transition-colors duration-500", isSearchFocused ? "text-blue-400" : "text-white/20")} strokeWidth={2.5} />
            <input type="text" placeholder="Query topological DNA..." onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} className="bg-transparent border-none outline-none text-xs text-white/80 w-full font-mono placeholder:text-white/5 tracking-tight relative z-10" />
            <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/5 relative z-10"><span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Search</span></div>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            {['ALL', 'CRITICAL', 'DEGRADED', 'LATENCY'].map((f, i) => (
              <button key={f} className={cn("px-3.5 py-1 rounded-full border text-[7px] font-black tracking-[0.2em] transition-all duration-500 uppercase", i === 0 ? "glass-panel text-white border-white/20 shadow-lg" : "bg-white/5 border-white/5 text-white/20 hover:bg-white/10")}>{f}</button>
            ))}
          </div>
        </div>
        <div className="absolute top-6 right-6 pointer-events-none hidden xl:block">
          <div className="glass-panel rounded-2xl p-2 w-44 h-22 pointer-events-auto relative overflow-hidden group border-white/5">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: `10px 10px` }} />
            <div className="absolute inset-0 pointer-events-none flex justify-between px-2 opacity-[0.05]">
              {ZONES.map(z => (<div key={z.id} className="h-full w-px bg-white" style={{ left: `${(z.x / 10000) * 100}%` }} />))}
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-40 transition-all duration-500 group-hover:opacity-100">
              {engine.getNodes().map(node => (<div key={node.id} className="absolute w-1 h-1 rounded-full translate-z-0" style={{ transform: `translate3d(${(node.position.x / 10000) * 176}px, ${(node.position.y / 10000) * 88}px, 0)`, backgroundColor: node.data?.color || '#3b82f6' }} />))}
            </div>
            <div ref={radarRef} className="absolute border border-blue-500/40 bg-blue-500/5 transition-all duration-100 z-10 rounded-sm" style={{ transform: `translate(${((-viewport.x / viewport.zoom) / 10000) * 160}px, ${((-viewport.y / viewport.zoom) / 10000) * 80}px)`, width: `${((window.innerWidth / viewport.zoom) / 10000) * 160}px`, height: `${((window.innerHeight / viewport.zoom) / 10000) * 80}px` }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-10"><div className="w-full h-px bg-blue-500" /><div className="h-full w-px bg-blue-500 absolute" /></div>
            </div>
            <span className="absolute bottom-1 right-2 text-[6px] font-black text-white/10 uppercase tracking-[0.3em] font-mono">Radar-LX</span>
          </div>
        </div>
        <div className="absolute top-6 left-6 pointer-events-none">
          <div className="glass-panel px-4 py-3 rounded-2xl shadow-2xl pointer-events-auto border-white/5">
            <StatHUD stats={stats} isBlueprintMode={isBlueprint} viewport={viewport} setIsBlueprint={setIsBlueprint} setIsSummaryView={setIsSummaryView} isSummaryView={isSummaryView} isEventFeedVisible={isEventFeedVisible} setIsEventFeedVisible={setIsEventFeedVisible} isLegendVisible={isLegendVisible} setIsLegendVisible={setIsLegendVisible} />
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
      </div>
    </div>
  );
}
