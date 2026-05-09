import { useRef, useEffect } from 'react';
import { useMeshStore } from '@ostream/core';
import { Terminal, ShieldCheck, Activity } from 'lucide-react';

export const AuditLogFooter = () => {
  const { auditLogs } = useMeshStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [auditLogs]);

  return (
    <div className="h-7 bg-[#050505] border-t border-white/[0.04] flex items-center px-3 gap-4 overflow-hidden select-none">
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Terminal size={10} className="text-vms-accent" />
        <span className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest">
          Audit_Trail
        </span>
      </div>

      <div className="w-px h-3 bg-white/[0.08]" />

      <div 
        ref={scrollRef}
        className="flex-1 flex flex-col overflow-y-auto no-scrollbar"
      >
        {auditLogs.map((log) => (
          <div key={log.id} className="flex items-center gap-2 py-0.5 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <span className="text-[8px] font-mono text-white/20">
              [{new Date(log.ts).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
            </span>
            <span className="text-[9px] font-mono text-white/60 tracking-tight">
              {log.msg}
            </span>
          </div>
        ))}
      </div>

      <div className="w-px h-3 bg-white/[0.08]" />

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1">
          <ShieldCheck size={10} className="text-vms-emerald-400" />
          <span className="text-[8px] font-mono text-vms-emerald-400/60 uppercase">Encrypted_Link</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity size={10} className="text-vms-accent" />
          <span className="text-[8px] font-mono text-vms-accent/60 uppercase">Sync_Active</span>
        </div>
      </div>
    </div>
  );
};
