import React from 'react';
import { useMeshStore, formatTime, cn } from '@ostream/core';
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
  Fingerprint,
  ShieldCheck
} from 'lucide-react';

import { ForensicReport } from './ForensicReport';

export const EvidenceLocker = () => {
  const { 
    evidence, 
    removeEvidence, 
    cases, 
    activeCaseId, 
    setActiveCase, 
    addCase, 
    addAuditLog
  } = useMeshStore();

  const [showReport, setShowReport] = React.useState(false);

  const activeCase = cases.find(c => c.id === activeCaseId);
  const activeEvidence = activeCaseId 
    ? evidence.filter(e => activeCase?.evidenceIds.includes(e.id))
    : evidence;

  const handleNewCase = () => {
    const title = prompt('Enter Case Title:');
    const desc = prompt('Enter Case Description:');
    if (title && desc) {
      addCase(title, desc);
      addAuditLog(`New case file initialized: ${title}`);
    }
  };

  const handleGenerateReport = () => {
    if (activeCaseId) {
      setShowReport(true);
      addAuditLog(`Forensic report generated for case: ${activeCase?.title}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020202] text-white/90 font-mono">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-white/[0.05] bg-[#080808]">
        <div className="flex items-center gap-3">
          <FolderLock size={18} className="text-indigo-500" />
          <h1 className="text-[12px] font-bold uppercase tracking-widest">
            Evidence Custody Manager <span className="text-white/20 ml-2 font-normal">Vault: SECURE_01</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleNewCase}
            className="h-8 px-4 bg-white/[0.05] border border-white/[0.1] text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Plus size={14} /> New Case File
          </button>
          <button 
            onClick={handleGenerateReport}
            disabled={!activeCaseId}
            className={cn(
              "h-8 px-4 font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2",
              activeCaseId ? "bg-indigo-500 text-black hover:bg-white" : "bg-white/5 text-white/20 cursor-not-allowed"
            )}
          >
            <FileText size={14} /> Generate PDF Report
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Case List Sidebar */}
        <div className="w-80 border-r border-white/[0.05] bg-[#050505] flex flex-col">
          <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Active Case Files</span>
            {activeCaseId && (
              <button onClick={() => setActiveCase(null)} className="text-[8px] text-indigo-500 uppercase hover:underline">Clear</button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {cases.map(caseFile => (
              <div 
                key={caseFile.id}
                onClick={() => setActiveCase(caseFile.id)}
                className={cn(
                  "p-4 border-b border-white/[0.02] hover:bg-white/[0.02] cursor-pointer group transition-all",
                  activeCaseId === caseFile.id && "bg-indigo-500/[0.03] border-l-2 border-l-indigo-500"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    "text-[11px] font-bold transition-colors",
                    activeCaseId === caseFile.id ? "text-indigo-500" : "text-white/80 group-hover:text-indigo-500"
                  )}>{caseFile.title}</span>
                  <span className="text-[8px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-sm text-white/40 uppercase">{caseFile.status}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-white/20">
                  <span className="truncate w-32">{caseFile.description}</span>
                  <span>{caseFile.evidenceIds.length} Artifacts</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-white/[0.05] bg-black/20">
             <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-[10px] text-white/30 font-bold uppercase">
                   <span>Storage Integrity</span>
                   <span className="text-indigo-500">OPTIMAL</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 w-[42%]" />
                </div>
                <span className="text-[9px] text-white/20 uppercase tracking-tighter">4.2 GB / 10 GB SECURE VAULT</span>
             </div>
          </div>
        </div>

        {/* Evidence Grid */}
        <div className="flex-1 flex flex-col p-6 bg-grid-pattern overflow-y-auto no-scrollbar">
          {!activeCaseId ? (
             <div className="mb-6 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <ShieldCheck size={18} className="text-indigo-500" />
                   <div>
                      <h3 className="text-[11px] font-bold uppercase text-indigo-500">Master Vault View</h3>
                      <p className="text-[9px] text-white/40 uppercase">Displaying all artifacts across active site perimeter</p>
                   </div>
                </div>
                <span className="text-[10px] font-mono text-indigo-500/60">{evidence.length} TOTAL ITEMS</span>
             </div>
          ) : (
             <div className="mb-6">
                <h2 className="text-[16px] font-bold text-white/90">{activeCase?.title}</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{activeCase?.description}</p>
             </div>
          )}

          {activeEvidence.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/10 gap-4 opacity-50">
              <Box size={64} strokeWidth={0.5} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-[12px] font-bold uppercase tracking-widest">Vault Empty</span>
                <span className="text-[10px] uppercase tracking-tighter">No forensic artifacts captured for this case</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {activeEvidence.map((item) => (
                <div key={item.id} className="bg-[#080808] border border-white/[0.05] flex flex-col group relative overflow-hidden">
                  {/* Thumbnail / Meta */}
                  <div className="h-44 bg-white/[0.02] flex items-center justify-center relative overflow-hidden">
                    <img src={item.thumbnail} alt="Evidence" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    {item.type === 'snapshot' ? <ImageIcon size={24} className="text-white/20" /> : <Video size={24} className="text-white/20" />}
                    
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[8px] flex flex-col gap-1">
                       <div className="flex items-center gap-2">
                          <Fingerprint size={10} className="text-indigo-500" />
                          <span className="text-indigo-500 font-bold uppercase">Integrity Verified</span>
                       </div>
                       <span className="text-[7px] text-white/30 font-mono truncate w-32">{item.hash}</span>
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
                     <Lock size={14} className="text-indigo-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showReport && <ForensicReport onClose={() => setShowReport(false)} />}
    </div>
  );
};
