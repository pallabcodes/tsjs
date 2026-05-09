import { useMeshStore, cn, formatTime } from '@ostream/core';
import { 
  Search, 
  User, 
  Filter,
  Play,
  Database,
  Fingerprint
} from 'lucide-react';
import { useState } from 'react';

export const SearchView = () => {
  const { setCurrentTime, setActiveView } = useMeshStore();
  const [query, setQuery] = useState('');

  // Mock search results
  const MOCK_RESULTS = [
    { id: 1, cam: 'LOBBY_CAM_01', type: 'person', timestamp: 1200, confidence: 0.98, color: 'Red', desc: 'Subject in red jacket' },
    { id: 2, cam: 'PARKING_CAM_03', type: 'vehicle', timestamp: 1500, confidence: 0.94, color: 'Silver', desc: 'Entry event' },
    { id: 3, cam: 'LOBBY_CAM_01', type: 'person', timestamp: 2400, confidence: 0.89, color: 'Black', desc: 'After hours movement' },
    { id: 4, cam: 'BACK_EXIT_02', type: 'person', timestamp: 3100, confidence: 0.92, color: 'Blue', desc: 'Delivery personnel' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#020202] text-white/90 font-mono">
      {/* Search Header */}
      <div className="h-14 flex items-center px-6 border-b border-white/[0.05] bg-[#080808]">
        <div className="flex items-center gap-3">
          <Database size={18} className="text-vms-accent" />
          <h1 className="text-[12px] font-bold uppercase tracking-widest">
            Forensic Query Engine <span className="text-vms-accent opacity-50 ml-1">v4.2</span>
          </h1>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Search Sidebar */}
        <div className="w-80 border-r border-white/[0.05] bg-[#050505] p-6 flex flex-col gap-6">
          {/* Query Input */}
          <div className="flex flex-col gap-3">
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Natural Language Query</span>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-white/20" />
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 'Find person wearing red in Lobby between 2pm and 4pm'"
                className="w-full h-24 bg-white/[0.02] border border-white/[0.05] rounded-sm pt-3 pl-10 pr-3 pb-3 text-[11px] leading-relaxed text-white focus:outline-none focus:border-vms-accent/40 focus:bg-white/[0.04] transition-all resize-none"
              />
            </div>
            <button className="h-10 bg-vms-accent text-black font-bold text-[11px] uppercase tracking-widest hover:bg-white transition-colors">
              Execute Forensic Scan
            </button>
          </div>

          <div className="w-full h-px bg-white/[0.05]" />

          {/* Structured Filters */}
          <div className="flex flex-col gap-4">
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
              <Filter size={10} /> Structured Parameters
            </span>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/[0.02] border border-white/[0.05] p-2 rounded-sm flex flex-col gap-1">
                <span className="text-[8px] text-white/20 uppercase">Object Class</span>
                <div className="flex items-center gap-2 text-[10px] text-white/60">
                  <User size={12} /> Person
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] p-2 rounded-sm flex flex-col gap-1">
                <span className="text-[8px] text-white/20 uppercase">Color Match</span>
                <div className="flex items-center gap-2 text-[10px] text-red-500">
                  <div className="w-2 h-2 rounded-full bg-red-500" /> Red
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[8px] text-white/20 uppercase">Time Window</span>
              <div className="flex items-center gap-2 text-[10px] text-white/60 bg-white/[0.02] border border-white/[0.05] p-2 rounded-sm">
                2026-05-09
                <span className="mx-1 opacity-20">|</span>
                14:00 - 16:00
              </div>
            </div>
          </div>
        </div>

        {/* Results View */}
        <div className="flex-1 flex flex-col p-6 bg-grid-pattern overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-[14px] font-bold uppercase tracking-tight text-white/90">Search Results</span>
              <span className="px-2 py-0.5 bg-vms-accent/10 text-vms-accent text-[10px] border border-vms-accent/20 rounded-sm uppercase tracking-widest">
                {MOCK_RESULTS.length} Matches Found
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-white/10 text-[10px] text-white/40 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">Export Report</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_RESULTS.map((result) => (
              <div 
                key={result.id}
                className="bg-[#080808] border border-white/[0.05] hover:border-vms-accent/40 transition-all group flex flex-col relative overflow-hidden"
              >
                {/* Visual Placeholder */}
                <div className="h-40 bg-white/[0.02] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <Fingerprint size={48} className="text-white/[0.03]" />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 border border-white/10 text-[9px] text-white/60">
                    {result.cam}
                  </div>
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-vms-accent/20 border border-vms-accent/30 text-[9px] text-vms-accent font-bold">
                    {(result.confidence * 100).toFixed(1)}% CONF
                  </div>
                  
                  <button 
                    onClick={() => {
                      setCurrentTime(result.timestamp);
                      setActiveView('live');
                    }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 rounded-full border border-vms-accent flex items-center justify-center text-vms-accent hover:scale-110 transition-transform">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </button>
                </div>

                {/* Metadata */}
                <div className="p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white/80">{result.desc}</span>
                    <span className="text-[10px] text-white/30">{formatTime(result.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-white/[0.05] text-[8px] text-white/40 border border-white/10 rounded-sm uppercase tracking-widest">{result.type}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 text-[8px] border rounded-sm uppercase tracking-widest",
                      result.color === 'Red' ? "text-red-500 border-red-500/20 bg-red-500/5" : "text-white/40 border-white/10 bg-white/5"
                    )}>Color: {result.color}</span>
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-vms-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
