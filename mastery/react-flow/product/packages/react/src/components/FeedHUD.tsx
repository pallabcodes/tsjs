import { useMeshStore, cn } from '@ostream/core';

interface FeedHUDProps {
  camId: string;
  label: string;
  isFocused: boolean;
}

export const FeedHUD = ({ camId, label, isFocused }: FeedHUDProps) => {
  const { systemStats, detections } = useMeshStore();
  const camDetections = detections[camId] || [];
  const hasMotion = camDetections.length > 0;

  return (
    <div className={cn(
      "absolute inset-0 pointer-events-none transition-opacity duration-500",
      isFocused ? "opacity-100" : "opacity-40 group-hover:opacity-80"
    )}>
      {/* ─── Corner Brackets (HTML/SVG) ────────────────────────────────────── */}
      <div className={cn(
        "absolute inset-0 transition-colors duration-300 pointer-events-none z-10",
        isFocused ? "text-vms-accent" : "text-white/20"
      )} style={{ filter: 'url(#hud-glow)' }}>
        {/* Top Left */}
        <svg className="absolute top-3 left-3 w-8 h-8 overflow-visible">
          <path d="M 0 32 V 0 H 32" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {/* Top Right */}
        <svg className="absolute top-3 right-3 w-8 h-8 overflow-visible">
          <path d="M 0 0 H 32 V 32" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {/* Bottom Left */}
        <svg className="absolute bottom-3 left-3 w-8 h-8 overflow-visible">
          <path d="M 0 0 V 32 H 32" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {/* Bottom Right */}
        <svg className="absolute bottom-3 right-3 w-8 h-8 overflow-visible">
          <path d="M 0 32 H 32 V 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <filter id="hud-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ─── Scanning Line ──────────────────────────────────────────────── */}
        {isFocused && (
          <line 
            x1="0" y1="0" x2="100%" y2="0" 
            stroke="rgba(0, 243, 255, 0.15)" 
            strokeWidth="1"
            className="animate-scanline"
          />
        )}
      </svg>

      {/* ─── OSD Telemetry ────────────────────────────────────────────────── */}
      <div className="absolute top-4 left-14 flex flex-col gap-0.5">
        <span className="text-[10px] font-mono font-black text-white leading-none tracking-tighter">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[7px] font-mono text-white/40 uppercase tracking-widest">
            Stream_ID: {camId}
          </span>
          <div className="flex items-center gap-1">
             <div className={cn("w-1 h-1 rounded-full", hasMotion ? "bg-red-500 animate-pulse" : "bg-vms-emerald-500")} />
             <span className="text-[7px] font-mono text-white/40 uppercase">{hasMotion ? 'Activity' : 'Stable'}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-14 text-right flex flex-col gap-0.5">
        <div className="flex items-center justify-end gap-2">
           <span className="text-[8px] font-mono text-vms-accent/60 uppercase">Forensic_Link</span>
           <span className="text-[9px] font-mono text-white/80">30.00 FPS</span>
        </div>
        <span className="text-[7px] font-mono text-white/20 uppercase">
          Latency: {systemStats.inferenceLatency.toFixed(1)}ms // 1080P_RAW
        </span>
      </div>

      {/* ─── Crosshair (Centered if focused) ─────────────────────────────── */}
      {isFocused && (
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
           <div className="w-12 h-px bg-vms-accent" />
           <div className="h-12 w-px bg-vms-accent absolute" />
           <div className="w-4 h-4 border border-vms-accent rounded-full absolute" />
        </div>
      )}
    </div>
  );
};
