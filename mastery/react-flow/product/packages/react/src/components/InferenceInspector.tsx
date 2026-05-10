import { useMeshStore } from '@ostream/core';
import { BrainCircuit, Fingerprint, AlertCircle } from 'lucide-react';

export const InferenceInspector = () => {
  const { selectedDetectionId, detections, focusedCamera } = useMeshStore();

  if (!selectedDetectionId || !focusedCamera) return null;

  // Find the detection across all cams (or just focused cam)
  const det = detections[focusedCamera]?.find(d => d.id === selectedDetectionId);
  if (!det) return null;

  const AttributeRow = ({ label, value, confidence }: { label: string; value: string; confidence: number }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono text-white/30 uppercase">{label}</span>
        <span className="text-[9px] font-mono text-white/70">{value}</span>
      </div>
      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(0,243,255,0.5)] transition-all duration-1000" 
          style={{ width: `${confidence * 100}%` }} 
        />
      </div>
      <div className="text-right">
        <span className="text-[8px] font-mono text-indigo-500/60">CONFIDENCE: {(confidence * 100).toFixed(1)}%</span>
      </div>
    </div>
  );

  return (
    <div className="p-3 bg-indigo-500/5 border-b border-indigo-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 mb-3">
        <BrainCircuit size={14} className="text-indigo-500" />
        <span className="text-[10px] font-mono font-bold text-white/90 uppercase tracking-widest">
          AI_Reasoning_Inspector
        </span>
      </div>

      <div className="space-y-4">
        {/* Core Identity */}
        <AttributeRow 
          label="Classification" 
          value={det.cls.toUpperCase()} 
          confidence={det.confidence} 
        />

        {/* Mock Attributes based on class */}
        {det.cls === 'person' && (
          <>
            <AttributeRow 
              label="Apparel_Primary" 
              value={det.attributes?.color?.toUpperCase() || 'UNKNOWN'} 
              confidence={0.92} 
            />
            <AttributeRow 
              label="Interaction_State" 
              value={det.attributes?.gear?.join(', ').toUpperCase() || 'NULL'} 
              confidence={0.84} 
            />
          </>
        )}

        {det.cls === 'vehicle' && (
          <AttributeRow 
            label="Vehicle_Color" 
            value={det.attributes?.color?.toUpperCase() || 'UNKNOWN'} 
            confidence={0.96} 
          />
        )}

        {/* Metadata Footer */}
        <div className="pt-2 mt-2 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Fingerprint size={10} className="text-white/20" />
            <span className="text-[8px] font-mono text-white/20 uppercase">Vector_ID: {det.id}</span>
          </div>
          <AlertCircle size={10} className="text-indigo-500/40" />
        </div>
      </div>
    </div>
  );
};
