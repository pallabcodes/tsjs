import { useRef, useEffect, useState, useCallback } from 'react';
import { useMeshStore, cn } from '@ostream/core';
import { Camera, Maximize, ZoomIn, ZoomOut, Crosshair, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { FeedHUD } from './FeedHUD';

const CLS_COLORS: Record<string, string> = {
  person: '#6366f1',
  vehicle: '#f59e0b',
  bag: '#ef4444',
};

interface CameraFeedProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}

export const CameraFeed = ({ id, label, isActive, onClick, className }: CameraFeedProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    currentTime, 
    isPlaying, 
    showOSD, 
    showBoundingBoxes, 
    frameRate, 
    addEvidence,
    detections,
    tickDetections,
    isMagnifierActive,
    updateMagnifierPos
  } = useMeshStore();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showPTZ, setShowPTZ] = useState(false);

  // ─── Handlers ───────────────────────────────────────────────────────────

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isMagnifierActive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    updateMagnifierPos(x, y, id);
  }, [id, isMagnifierActive, updateMagnifierPos]);

  const handleMouseLeave = useCallback(() => {
    if (isMagnifierActive) {
      updateMagnifierPos(0, 0, null);
    }
  }, [isMagnifierActive, updateMagnifierPos]);

  const handleSnapshot = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    
    // Add to Evidence Store
    addEvidence({
      timestamp: currentTime,
      camId: id,
      camLabel: label,
      thumbnail: url,
      type: 'snapshot',
      tags: ['manual_capture', label],
    });

    // Also trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `evidence_${label}_FRM${String(Math.floor(currentTime * frameRate)).padStart(6, '0')}.png`;
    a.click();
  }, [label, id, currentTime, frameRate, addEvidence]);

  const handleFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  const resetPTZ = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // ─── Canvas Render Loop Engine ───────────────────────────────────────────
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    // Generate static noise buffer once for performance
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 128; noiseCanvas.height = 128;
    const nctx = noiseCanvas.getContext('2d')!;
    const imgData = nctx.createImageData(128, 128);
    for(let i=0; i<imgData.data.length; i+=4) {
      const v = Math.random() * 255;
      imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = v;
      imgData.data[i+3] = 8; // Very subtle noise
    }
    nctx.putImageData(imgData, 0, 0);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const displayW = rect.width;
      const displayH = rect.height;

      if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;
        ctx.scale(dpr, dpr);
      }

      const w = displayW;
      const h = displayH;
      const t = useMeshStore.getState().currentTime;

      // ── 1. Base Dark Environment ─────────────────────────────────────────
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, w, h);

      // Add dynamic noise offset based on time
      const nx = (t * 100) % 128;
      const ny = (t * 150) % 128;
      ctx.fillStyle = ctx.createPattern(noiseCanvas, 'repeat')!;
      ctx.save();
      ctx.translate(-nx, -ny);
      ctx.fillRect(0, 0, w + 128, h + 128);
      ctx.restore();

      // ── 2. Advanced 3D Horizon Grid ─────────────────────────────────────
      const horizonY = h * 0.35;
      const fov = 800; // Fake field of view
      
      ctx.lineWidth = 1;
      
      // Vertical converging lines
      for (let i = -10; i <= 10; i++) {
        const xAtBottom = (w / 2) + i * 80;
        const xAtHorizon = (w / 2) + (i * 80 * (horizonY / fov));
        
        const grad = ctx.createLinearGradient(0, h, 0, horizonY);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(xAtBottom, h);
        ctx.lineTo(xAtHorizon, horizonY);
        ctx.stroke();
      }

      // Horizontal depth lines
      for (let z = 1; z < 20; z++) {
        const depth = z * z * 0.5; // Non-linear spacing to simulate perspective
        if (depth > (h - horizonY)) break;
        const y = h - depth;
        
        const opacity = Math.max(0, 1 - (depth / (h - horizonY)));
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.08})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // ── 3. Simulated Feature Extraction Points (Moving Dots) ────────────
      ctx.fillStyle = 'rgba(99, 102, 241, 0.6)'; // Accent indigo
      for(let i=0; i<15; i++) {
        const px = ((i * 123 + t * 20) % 1000) / 1000 * w;
        const py = horizonY + (((i * 321 - t * 10) % 1000 + 1000) % 1000) / 1000 * (h - horizonY);
        
        // Only draw below horizon
        if (py > horizonY) {
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── 4. Sweeping Lidar / Depth Scan ──────────────────────────────────
      const scanCycle = (t * 0.3) % 1; // 0 to 1
      const scanY = horizonY + scanCycle * (h - horizonY);
      
      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY);
      scanGrad.addColorStop(0, 'rgba(99, 102, 241, 0)');
      scanGrad.addColorStop(1, 'rgba(99, 102, 241, 0.15)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, w, 20);
      
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();

      // ── 6. ML Bounding Boxes (Sovereign Data Provider) ─────────────────
      if (showBoundingBoxes) {
        // Sync simulation state for this frame
        tickDetections(t);
        
        const active = detections[id] ?? [];

        for (const det of active) {
          const bx = det.x * w;
          const by = det.y * h;
          const bw = det.w * w;
          const bh = det.h * h;
          const color = CLS_COLORS[det.cls] ?? '#6366f1';

          // Box Lines (very subtle)
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = 1;
          ctx.strokeRect(bx, by, bw, bh);
          ctx.globalAlpha = 1.0;

          // Corner brackets (High visibility)
          const bracketLen = Math.min(bw, bh) * 0.15;
          ctx.lineWidth = 1.5;
          // Top-left
          ctx.beginPath();
          ctx.moveTo(bx, by + bracketLen); ctx.lineTo(bx, by); ctx.lineTo(bx + bracketLen, by);
          ctx.stroke();
          // Top-right
          ctx.beginPath();
          ctx.moveTo(bx + bw - bracketLen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + bracketLen);
          ctx.stroke();
          // Bottom-left
          ctx.beginPath();
          ctx.moveTo(bx, by + bh - bracketLen); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bracketLen, by + bh);
          ctx.stroke();
          // Bottom-right
          ctx.beginPath();
          ctx.moveTo(bx + bw - bracketLen, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - bracketLen);
          ctx.stroke();

          // Label background
          const labelText = `[ ${det.cls.toUpperCase()} : ${(det.confidence * 100).toFixed(1)}% ]`;
          ctx.font = '9px monospace';
          const tm = ctx.measureText(labelText);
          const labelW = tm.width + 8;
          const labelH = 14;
          ctx.fillStyle = color;
          ctx.fillRect(bx, by - labelH, labelW, labelH);

          // Label text
          ctx.fillStyle = '#fff';
          ctx.fillText(labelText, bx + 4, by - 4);
        }
      }

      // Loop if playing
      if (useMeshStore.getState().isPlaying) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [currentTime, isPlaying, showOSD, showBoundingBoxes, label, frameRate]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full h-full overflow-hidden cursor-pointer group bg-[#030303]",
        isActive ? "ring-1 ring-inset ring-indigo-500" : "ring-1 ring-inset ring-white/[0.04]",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: 'center center',
          transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />

      {/* ─── Tactical SVG HUD ─────────────────────────────────────────── */}
      {showOSD && (
        <FeedHUD camId={id} label={label} isFocused={isActive} />
      )}

      {/* ─── Glassmorphic Floating Command Island (Bottom Center) ────────── */}
      <div className={cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl transition-all duration-300 z-20",
        // Show if active, or if hovering the container. Otherwise fade out.
        isActive || showPTZ ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0"
      )}>
        
        {/* Core Actions */}
        <div className="flex items-center gap-0.5 px-1">
          <button onClick={handleSnapshot} className="p-2 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-all" title="Secure Snapshot">
            <Camera size={14} />
          </button>
          <button onClick={handleFullscreen} className="p-2 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-all" title="Focus Mode">
            <Maximize size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setShowPTZ(!showPTZ); }} className={cn("p-2 rounded-md transition-all", showPTZ ? "bg-indigo-500/20 text-indigo-500" : "hover:bg-white/10 text-white/70 hover:text-white")} title="PTZ Overrides">
            <Crosshair size={14} />
          </button>
        </div>

        {/* Expandable PTZ Controls */}
        {showPTZ && (
          <>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <div className="flex items-center gap-0.5 px-1">
              <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(z - 0.5, 1)); setPan({x:0, y:0}); }} className="p-1.5 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-all">
                <ZoomOut size={13} />
              </button>
              
              {/* Mini D-Pad */}
              <div className="grid grid-cols-3 grid-rows-3 gap-0.5 mx-1">
                <div />
                <button onClick={(e) => { e.stopPropagation(); setPan(p => ({...p, y: p.y + 40})) }} className="p-0.5 hover:bg-white/20 rounded-sm text-white/70 hover:text-white"><ChevronUp size={10} /></button>
                <div />
                <button onClick={(e) => { e.stopPropagation(); setPan(p => ({...p, x: p.x + 40})) }} className="p-0.5 hover:bg-white/20 rounded-sm text-white/70 hover:text-white"><ChevronLeft size={10} /></button>
                <button onClick={resetPTZ} className="p-0.5 hover:bg-indigo-500/20 rounded-sm text-indigo-500"><div className="w-1.5 h-1.5 bg-current rounded-full mx-auto" /></button>
                <button onClick={(e) => { e.stopPropagation(); setPan(p => ({...p, x: p.x - 40})) }} className="p-0.5 hover:bg-white/20 rounded-sm text-white/70 hover:text-white"><ChevronRight size={10} /></button>
                <div />
                <button onClick={(e) => { e.stopPropagation(); setPan(p => ({...p, y: p.y - 40})) }} className="p-0.5 hover:bg-white/20 rounded-sm text-white/70 hover:text-white"><ChevronDown size={10} /></button>
                <div />
              </div>

              <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(z + 0.5, 5)); }} className="p-1.5 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-all">
                <ZoomIn size={13} />
              </button>

              <div className="w-8 text-center ml-1">
                <span className="text-[9px] font-mono font-bold text-indigo-500">{zoom.toFixed(1)}x</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── Active Indicator Bar ──────────────────────────────────────────── */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-80" />
      )}
    </div>
  );
};
