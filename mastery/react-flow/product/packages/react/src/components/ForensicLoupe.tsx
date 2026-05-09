import { useRef, useEffect } from 'react';
import { useMeshStore } from '@ostream/core';

interface ForensicLoupeProps {
  id: string;
  pos: { x: number; y: number };
}

const CLS_COLORS: Record<string, string> = {
  person: '#3b82f6',
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
        const color = CLS_COLORS[det.cls] ?? '#3b82f6';

        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, bw, bh);
        
        // Label
        ctx.font = '8px monospace';
        ctx.fillStyle = color;
        ctx.fillText(det.cls.toUpperCase(), bx, by - 4);
      }

      ctx.restore();

      // 5. Sharpening Filter Overlay (Simulated)
      ctx.fillStyle = 'rgba(0, 243, 255, 0.05)';
      ctx.fillRect(0, 0, w, h);

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
