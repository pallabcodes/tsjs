import { useMeshStore, AppView, cn } from '@ostream/core';
import { 
  Monitor, 
  Map as MapIcon,
  Search, 
  FolderLock, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Activity,
  History,
  Globe
} from 'lucide-react';

export const NavRail = () => {
  const { 
    activeView, 
    setActiveView, 
    isNavCollapsed, 
    setIsNavCollapsed 
  } = useMeshStore();

  const navItems: { view: AppView; icon: any; label: string }[] = [
    { view: 'live', icon: Monitor, label: 'Live / Forensic' },
    { view: 'map', icon: MapIcon, label: 'Tactical Map' },
    { view: 'search', icon: Search, label: 'Search & Query' },
    { view: 'locker', icon: FolderLock, label: 'Evidence Locker' },
    { view: 'gmaps', icon: Globe, label: 'Sovereign Sat-Link' },
    { view: 'settings', icon: Settings, label: 'System Settings' },
  ];

  return (
    <div 
      className={cn(
        "flex flex-col bg-[#050505] border-r border-white/[0.05] transition-all duration-300 ease-in-out z-50",
        isNavCollapsed ? "w-14" : "w-48"
      )}
    >
      {/* Brand / Logo Area */}
      <div className="h-14 flex items-center px-4 border-b border-white/[0.05]">
        <div className="w-6 h-6 bg-indigo-500 rounded-sm flex items-center justify-center flex-shrink-0">
          <ShieldAlert size={14} className="text-black" />
        </div>
        {!isNavCollapsed && (
          <span className="ml-3 font-mono text-xs font-bold tracking-tighter uppercase text-white/90">
            MESH_OS <span className="text-indigo-500">L7</span>
          </span>
        )}
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={cn(
              "h-10 flex items-center px-4 transition-colors relative group",
              activeView === item.view 
                ? "text-indigo-500 bg-indigo-500/5" 
                : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
            )}
            title={isNavCollapsed ? item.label : undefined}
          >
            <item.icon size={18} />
            {!isNavCollapsed && (
              <span className="ml-4 text-[11px] font-mono tracking-tight font-medium">
                {item.label}
              </span>
            )}
            {activeView === item.view && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500" />
            )}
          </button>
        ))}
      </div>

      {/* Footer / System Status */}
      <div className="p-3 border-t border-white/[0.05] flex flex-col gap-3">
        <div className={cn("flex flex-col gap-2", isNavCollapsed && "items-center")}>
          <button className="text-white/30 hover:text-indigo-500 transition-colors">
            <Activity size={16} />
          </button>
          <button className="text-white/30 hover:text-indigo-500 transition-colors">
            <History size={16} />
          </button>
        </div>
        
        <button 
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          className="h-8 flex items-center justify-center text-white/20 hover:text-white/50 border border-white/[0.05] rounded-sm hover:bg-white/[0.02] transition-all mt-2"
        >
          {isNavCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </div>
  );
};
