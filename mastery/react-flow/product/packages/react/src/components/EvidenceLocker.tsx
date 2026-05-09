import { useMeshStore, formatTime } from '@ostream/core';
import { 
  FolderLock, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Download, 
  Trash2, 
  Plus,
  Share2,
  Lock,
  Box,
  Fingerprint
} from 'lucide-react';

export const EvidenceLocker = () => {
  const { evidence, removeEvidence } = useMeshStore();

  // Mock cases for visual structure
  const MOCK_CASES = [
    { id: 'case-2026-001', name: 'Lobby Incident 05/09', itemCount: 3, created: Date.now() - 3600000, status: 'Open' },
    { id: 'case-2026-002', name: 'Parking Lot Survey', itemCount: 12, created: Date.now() - 86400000, status: 'Closed' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#020202] text-white/90 font-mono">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-white/[0.05] bg-[#080808]">
        <div className="flex items-center gap-3">
          <FolderLock size={18} className="text-vms-accent" />
          <h1 className="text-[12px] font-bold uppercase tracking-widest">
            Evidence Custody Manager <span className="text-white/20 ml-2 font-normal">Vault: SECURE_01</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-4 bg-white/[0.05] border border-white/[0.1] text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
            <Plus size={14} /> New Case File
          </button>
          <button className="h-8 px-4 bg-vms-accent text-black font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2">
            <FileText size={14} /> Generate PDF Report
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Case List Sidebar */}
        <div className="w-80 border-r border-white/[0.05] bg-[#050505] flex flex-col">
          <div className="p-4 border-b border-white/[0.05]">
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Active Case Files</span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {MOCK_CASES.map(caseFile => (
              <div 
                key={caseFile.id}
                className="p-4 border-b border-white/[0.02] hover:bg-white/[0.02] cursor-pointer group transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-white/80 group-hover:text-vms-accent transition-colors">{caseFile.name}</span>
                  <span className="text-[8px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-sm text-white/40 uppercase">{caseFile.status}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-white/20">
                  <span>ID: {caseFile.id}</span>
                  <span>{caseFile.itemCount} Artifacts</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-white/[0.05] bg-black/20">
             <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-[10px] text-white/30 font-bold uppercase">
                   <span>Storage Integrity</span>
                   <span className="text-vms-emerald-500">OPTIMAL</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-vms-accent w-[42%]" />
                </div>
                <span className="text-[9px] text-white/20 uppercase tracking-tighter">4.2 GB / 10 GB SECURE VAULT</span>
             </div>
          </div>
        </div>

        {/* Evidence Grid */}
        <div className="flex-1 flex flex-col p-6 bg-grid-pattern overflow-y-auto no-scrollbar">
          {evidence.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/10 gap-4 opacity-50">
              <Box size={64} strokeWidth={0.5} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-[12px] font-bold uppercase tracking-widest">Vault Empty</span>
                <span className="text-[10px] uppercase tracking-tighter">No forensic artifacts captured for this case</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {evidence.map((item) => (
                <div key={item.id} className="bg-[#080808] border border-white/[0.05] flex flex-col group relative overflow-hidden">
                  {/* Thumbnail / Meta */}
                  <div className="h-44 bg-white/[0.02] flex items-center justify-center relative overflow-hidden">
                    <img src={item.thumbnail} alt="Evidence" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    {item.type === 'snapshot' ? <ImageIcon size={24} className="text-white/20" /> : <Video size={24} className="text-white/20" />}
                    
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 border border-white/10 text-[9px] flex items-center gap-2">
                       <Fingerprint size={10} className="text-vms-accent" />
                       <span className="text-white/60 uppercase">SHA-256 Validated</span>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-white/90">{item.camLabel}</span>
                       <span className="text-[8px] text-white/40">{formatTime(item.timestamp)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 py-1.5 bg-white/[0.03] border border-white/5 text-[9px] uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition-all">
                       <Download size={12} /> Save
                    </button>
                    <button className="flex items-center justify-center gap-2 py-1.5 bg-white/[0.03] border border-white/5 text-[9px] uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition-all">
                       <Share2 size={12} /> Share
                    </button>
                    <button 
                      onClick={() => removeEvidence(item.id)}
                      className="col-span-2 flex items-center justify-center gap-2 py-1.5 bg-red-500/5 border border-red-500/10 text-[9px] uppercase tracking-widest text-red-500/60 hover:bg-red-500/20 hover:text-red-500 transition-all"
                    >
                       <Trash2 size={12} /> Delete Permanently
                    </button>
                  </div>
                  
                  {/* Security Overlay */}
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Lock size={14} className="text-vms-accent" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
