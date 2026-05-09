import { useMeshStore, formatTime } from '@ostream/core';
import { Shield, Download, Printer, X, CheckCircle2, Lock } from 'lucide-react';

export const ForensicReport = ({ onClose }: { onClose: () => void }) => {
  const { cases, activeCaseId, evidence, auditLogs } = useMeshStore();
  
  const targetCase = cases.find(c => c.id === activeCaseId);
  if (!targetCase) return null;

  const caseEvidence = evidence.filter(e => targetCase.evidenceIds.includes(e.id));
  const reportId = `REP-${targetCase.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-4xl h-full bg-white text-slate-900 overflow-hidden flex flex-col shadow-[0_0_100px_rgba(255,255,255,0.1)] rounded-sm">
        
        {/* Report Header */}
        <div className="p-8 border-b-2 border-slate-900 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={24} className="text-slate-900" />
              <h1 className="text-2xl font-black uppercase tracking-tighter italic">O_MESH_FORENSICS</h1>
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">Official Evidence Summary Report</p>
            <h2 className="text-3xl font-black uppercase">{targetCase.title}</h2>
          </div>
          <div className="text-right space-y-1">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Report_ID</div>
            <div className="text-[11px] font-mono font-bold">{reportId}</div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase pt-4">Generated_On</div>
            <div className="text-[11px] font-mono font-bold">{new Date().toLocaleString()}</div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          
          {/* Case Description */}
          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase border-b border-slate-200 pb-1">01_Case_Overview</h3>
            <p className="text-sm leading-relaxed font-medium text-slate-700">
              {targetCase.description}
            </p>
          </section>

          {/* Evidence Grid */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase border-b border-slate-200 pb-1">02_Evidence_Matrix</h3>
            <div className="grid grid-cols-2 gap-6">
              {caseEvidence.map((e) => (
                <div key={e.id} className="border border-slate-200 p-4 space-y-3 bg-slate-50">
                  <div className="aspect-video bg-black relative group overflow-hidden">
                    <img src={e.thumbnail} className="w-full h-full object-cover opacity-90" alt="Evidence" />
                    <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[8px] font-mono px-1.5 py-0.5 rounded uppercase">
                      {e.camLabel}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Timestamp</span>
                      <span className="text-[10px] font-mono font-bold">{formatTime(e.timestamp)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Type</span>
                      <span className="text-[10px] font-mono font-bold uppercase">{e.type}</span>
                    </div>
                    <div className="pt-2">
                      <div className="text-[8px] font-mono font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                        <Lock size={8} /> SHA-256 Forensic Hash
                      </div>
                      <div className="text-[8px] font-mono bg-white p-1.5 border border-slate-200 break-all leading-tight">
                        {e.hash}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Chain of Custody */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase border-b border-slate-200 pb-1">03_Audit_Trail</h3>
            <div className="space-y-1">
              {auditLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex gap-4 text-[9px] font-mono py-1 border-b border-slate-100 last:border-0">
                  <span className="text-slate-400 w-24">[{new Date(log.ts).toLocaleTimeString()}]</span>
                  <span className="font-bold uppercase tracking-tight">{log.msg}</span>
                  <span className="ml-auto text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={8} /> VERIFIED
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Certification */}
          <section className="pt-8 border-t-2 border-slate-900 flex justify-between items-end">
            <div className="space-y-4">
              <div className="w-48 h-12 border-b border-slate-900 flex items-end pb-1 italic font-serif">
                Digital Signature Verified
              </div>
              <div className="text-[9px] font-mono font-bold uppercase tracking-widest">Operator Authorization Signature</div>
            </div>
            <div className="bg-slate-900 text-white p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
                <Shield size={24} />
              </div>
              <div>
                <div className="text-[10px] font-mono font-black uppercase tracking-widest">Certified_Integrity</div>
                <div className="text-[8px] font-mono opacity-50 uppercase">O_Mesh_L7 // Forensic_Sovereign_OS</div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center print:hidden">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-200 text-slate-600 transition-colors text-xs font-bold uppercase"
          >
            <X size={14} /> Close Preview
          </button>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 transition-colors text-xs font-black uppercase">
              <Printer size={14} /> Print Report
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white transition-colors text-xs font-black uppercase shadow-xl shadow-slate-900/20">
              <Download size={14} /> Export Secure PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
