import { useRef, useEffect } from 'react';
import { useMeshStore } from '@ostream/core';

interface ForensicLoupeProps {
  id: string;
  pos: { x: number; y: number };
}

const CLS_COLORS: Record<string, string> = {
  person: '#6366f1',
  vehicle: '#f59e0b',
  bag: '#ef4444',
};

export const ForensicLoupe = ({ id, pos }: ForensicLoupeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { detections } = useMeshStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;


      // 1. Clear & Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      // 2. High-Zoom Transform
      // We want to zoom into 'pos' by 4x
      // Center of canvas is (w/2, h/2)
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(4, 4);
      ctx.translate(-pos.x * w, -pos.y * h);

      // 3. Draw Grid (Simplified for Loupe)
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 0.5;
      for(let i=0; i<1000; i+=50) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1000); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1000, i); ctx.stroke();
      }

      // 4. Draw Detections
      const active = detections[id] ?? [];
      for (const det of active) {
        const bx = det.x * w;
        const by = det.y * h;
        const bw = det.w * w;
        const bh = det.h * h;
        const color = CLS_COLORS[det.cls] ?? '#6366f1';

        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, bw, bh);
        
        // Label
        ctx.font = '8px monospace';
        ctx.fillStyle = color;
        ctx.fillText(det.cls.toUpperCase(), bx, by - 4);
      }

      ctx.restore();

      // 5. Tactical Overlays (Crosshairs)
      ctx.strokeStyle = '#6366f1'; // Intelligence Indigo
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(w/2 - 10, h/2); ctx.lineTo(w/2 + 10, h/2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w/2, h/2 - 10); ctx.lineTo(w/2, h/2 + 10); ctx.stroke();

      // Corner Brackets
      const bLen = 15;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, bLen); ctx.lineTo(0, 0); ctx.lineTo(bLen, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - bLen, 0); ctx.lineTo(w, 0); ctx.lineTo(w, bLen); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, h - bLen); ctx.lineTo(0, h); ctx.lineTo(bLen, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - bLen, h); ctx.lineTo(w, h); ctx.lineTo(w, h - bLen); ctx.stroke();

      // 6. "ENHANCE" Status Ticker
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('ENHANCE_ENGINE: 4.0x', 8, h - 8);
      
      // Scanning Pulse
      const pulse = (Date.now() / 1000) % 2;
      ctx.globalAlpha = Math.max(0, 1 - pulse);
      ctx.strokeStyle = '#6366f1';
      ctx.strokeRect(0, 0, w, h);
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [id, pos, detections]);

  return (
    <canvas 
      ref={canvasRef} 
      width={192} 
      height={192} 
      className="w-full h-full block" 
    />
  );
};
