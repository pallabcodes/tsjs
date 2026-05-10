import { useMeshStore, formatTime } from '@ostream/core';
import { 
  Search, 
  Sparkles, 
  Clock, 
  Camera, 
  ArrowRight, 
  Filter, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  History
} from 'lucide-react';
import { useState } from 'react';

export const SearchView = () => {
  const { searchSemantic, setCurrentTime, setActiveView } = useMeshStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const SUGGESTED_QUERIES = [
    "Person in red backpack",
    "White vehicle in parking",
    "Person in blue clothing",
    "Suspicious bag left in lobby"
  ];

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query) return;

    setIsSearching(true);
    // Simulate AI processing delay
    setTimeout(() => {
      const matches = searchSemantic(query);
      setResults(matches);
      setIsSearching(false);
    }, 800);
  };

  const handleJumpToResult = (time: number) => {
    setCurrentTime(time);
    setActiveView('live');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020202] text-white/90 font-mono overflow-hidden">
      {/* Search Header (Google Style) */}
      <div className="pt-20 pb-12 flex flex-col items-center px-6 bg-gradient-to-b from-[#080808] to-transparent">
        <div className="flex items-center gap-4 mb-8">
           <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <Sparkles size={32} className="text-indigo-500" />
           </div>
           <div>
              <h1 className="text-2xl font-bold tracking-tighter uppercase">Sovereign Semantic <span className="text-indigo-500 italic">OS</span></h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Enterprise Video Meta-Indexing Engine v4.2</p>
           </div>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-3xl relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search size={20} className="text-white/20 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything... (e.g. 'Person in red jacket running')"
            className="w-full h-16 bg-[#0a0a0a] border border-white/10 rounded-2xl pl-14 pr-32 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-2xl"
          />
          <div className="absolute inset-y-2 right-2 flex items-center">
            <button 
              type="submit"
              className="h-full px-6 bg-indigo-500 text-black font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-white transition-all flex items-center gap-2"
            >
              Analyze <ArrowRight size={14} />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3 mt-6">
           <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Prompts:</span>
           {SUGGESTED_QUERIES.map(q => (
             <button 
               key={q}
               onClick={() => { setQuery(q); handleSearch(); }}
               className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-[9px] text-white/40 hover:text-indigo-500 hover:border-indigo-500/30 transition-all"
             >
               {q}
             </button>
           ))}
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">
        <div className="max-w-5xl mx-auto">
          {isSearching ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] uppercase tracking-widest text-indigo-500">Synthesizing Metadata...</span>
             </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-8">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                     <TrendingUp size={14} className="text-indigo-500" />
                     <span className="text-[10px] font-bold uppercase text-white/40">Analysis Complete: {results.length} Matches Found</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <button className="flex items-center gap-2 text-[9px] uppercase text-white/20 hover:text-white transition-colors"><Filter size={12} /> Filter Rank</button>
                     <button className="flex items-center gap-2 text-[9px] uppercase text-white/20 hover:text-white transition-colors"><History size={12} /> Search History</button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((res, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleJumpToResult(res.time)}
                      className="group bg-[#080808] border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-indigo-500/30 transition-all"
                    >
                       <div className="flex h-32">
                          {/* Thumbnail Simulation */}
                          <div className="w-48 bg-white/[0.02] relative overflow-hidden flex items-center justify-center">
                             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                             <Camera size={24} className="text-white/10 group-hover:text-indigo-500/40 transition-colors" />
                             <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 text-[8px] text-indigo-500 font-bold uppercase tracking-tighter">CLIP_META_{res.time}</div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 p-4 flex flex-col justify-between">
                             <div>
                                <div className="flex items-center justify-between mb-1">
                                   <span className="text-[10px] font-bold text-white/80 group-hover:text-indigo-500 transition-colors uppercase">{res.match}</span>
                                   <div className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded">
                                      <ShieldCheck size={10} className="text-indigo-500" />
                                      <span className="text-[8px] font-bold text-indigo-400">{(res.score * 100).toFixed(0)}% Match</span>
                                   </div>
                                </div>
                                <div className="flex items-center gap-3 text-[9px] text-white/20 uppercase tracking-tighter mt-2">
                                   <div className="flex items-center gap-1"><Camera size={10} /> {res.camLabel}</div>
                                   <div className="flex items-center gap-1"><Clock size={10} /> {formatTime(res.time)}</div>
                                </div>
                             </div>
                             
                             <div className="flex items-center justify-between pt-2">
                                <span className="text-[8px] text-white/10 font-mono">UID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                                <ChevronRight size={16} className="text-white/10 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ) : query ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50 text-white/20">
               <Filter size={48} strokeWidth={1} />
               <div className="flex flex-col items-center gap-1">
                  <span className="text-[12px] font-bold uppercase tracking-widest">No Matches Found</span>
                  <span className="text-[10px] uppercase tracking-tighter">Refine your query or check metadata indexing status</span>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
               <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex flex-col gap-4">
                  <Sparkles size={24} className="text-indigo-500" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest">Meta-Attribute Search</h3>
                  <p className="text-[10px] text-white/40 leading-relaxed uppercase">Search for objects based on color, gear, action, and physical descriptors indexed in real-time.</p>
               </div>
               <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex flex-col gap-4">
                  <Clock size={24} className="text-indigo-500" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest">Temporal Context</h3>
                  <p className="text-[10px] text-white/40 leading-relaxed uppercase">Analyze movement patterns across multiple cameras to find exactly when and where an event occurred.</p>
               </div>
               <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex flex-col gap-4">
                  <ShieldCheck size={24} className="text-indigo-500" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest">Forensic Validation</h3>
                  <p className="text-[10px] text-white/40 leading-relaxed uppercase">Every result is cross-validated against the Sovereign Data store for absolute chain-of-custody integrity.</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Status */}
      <div className="h-10 border-t border-white/5 bg-[#050505] flex items-center justify-between px-6">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
               <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Inference Engine Online</span>
            </div>
            <span className="text-[9px] text-white/10 uppercase tracking-tighter">LATENCY: 124ms // NODES: 5 // LOAD: 12%</span>
         </div>
         <span className="text-[9px] text-white/10 font-mono tracking-tighter uppercase">SECURE_INDEX: VALIDATED</span>
      </div>
    </div>
  );
};
