import { useMeshStore, cn } from '@ostream/core';
import { 
  ShieldAlert, 
  MessageSquare, 
  Zap, 
  Package, 
  Eye, 
  ArrowRight,
  MoreVertical
} from 'lucide-react';

export const IncidentFeed = () => {
  const { incidents, setCurrentTime, setFocusedCamera, setActiveCameras } = useMeshStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'intrusion': return <ShieldAlert size={14} />;
      case 'loitering': return <Zap size={14} />;
      case 'package': return <Package size={14} />;
      case 'comms': return <MessageSquare size={14} />;
      default: return <Eye size={14} />;
    }
  };

  const handleIncidentClick = (inc: any) => {
    // Jump forensic context to the incident moment
    setCurrentTime(inc.timestamp / 1000 % 3600); // Mock mapping to timeline space
    setFocusedCamera(inc.camId);
    setActiveCameras([inc.camId]);
  };

  return (
    <div className="w-80 border-l border-white/[0.05] bg-[#050505] flex flex-col overflow-hidden">
      <div className="h-12 flex items-center justify-between px-4 border-b border-white/[0.05] bg-[#080808]">
        <div className="flex items-center gap-2">
           <ActivityIcon size={14} className="text-indigo-500" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Incident Channel</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
           <span className="text-[9px] text-white/30 uppercase font-bold">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {incidents.map((inc) => (
          <div 
            key={inc.id}
            onClick={() => handleIncidentClick(inc)}
            className="group p-4 border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between mb-2">
               <div className={cn(
                 "p-1.5 rounded bg-black/40 border",
                 inc.severity === 'critical' ? "text-red-500 border-red-500/20" : 
                 inc.severity === 'warning' ? "text-amber-500 border-amber-500/20" : 
                 "text-indigo-500 border-indigo-500/20"
               )}>
                  {getIcon(inc.type)}
               </div>
               <span className="text-[8px] text-white/20 font-mono uppercase tracking-tighter">
                  {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
               </span>
            </div>

            <div className="space-y-1">
               <div className="text-[10px] font-bold uppercase text-white/80 group-hover:text-white transition-colors">{inc.label}</div>
               <div className="flex items-center justify-between">
                  <span className="text-[9px] text-white/20 uppercase tracking-tighter font-mono">{inc.camId}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-[8px] text-indigo-500 font-bold uppercase">Investigate</span>
                     <ArrowRight size={10} className="text-indigo-500" />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Meta */}
      <div className="p-4 bg-black/40 border-t border-white/5 space-y-3">
         <div className="flex items-center justify-between">
            <span className="text-[9px] text-white/20 uppercase font-bold">Operator Queue</span>
            <span className="text-[9px] text-white/60 font-mono">03 PENDING</span>
         </div>
         <div className="flex gap-1">
            <div className="flex-1 h-1 bg-indigo-500/20 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 w-[60%]" />
            </div>
            <div className="flex-1 h-1 bg-red-500/20 rounded-full overflow-hidden">
               <div className="h-full bg-red-500 w-[20%]" />
            </div>
         </div>
         <button className="w-full py-2 bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <MoreVertical size={12} /> Master Command Log
         </button>
      </div>
    </div>
  );
};

const ActivityIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
