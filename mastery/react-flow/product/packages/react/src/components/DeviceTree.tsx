import { useMeshStore, cn, Device } from '@ostream/core';
import { 
  Circle, 
  AlertTriangle, 
  ChevronDown, 
  Search,
  MoreVertical,
  Maximize2
} from 'lucide-react';
import { useState } from 'react';

export const DeviceTree = () => {
  const { 
    devices, 
    activeCameras, 
    setActiveCameras,
    focusedCamera,
    setFocusedCamera,
    setIsLeftSidebarCollapsed
  } = useMeshStore();

  const [search, setSearch] = useState('');

  const filteredDevices = devices.filter(d => 
    d.label.toLowerCase().includes(search.toLowerCase())
  );

  const StatusIcon = ({ status }: { status: Device['status'] }) => {
    switch (status) {
      case 'online': return <Circle size={8} className="fill-indigo-500 text-indigo-500/20" />;
      case 'offline': return <Circle size={8} className="fill-white/20 text-white/5" />;
      case 'error': return <AlertTriangle size={10} className="text-red-500" />;
      default: return null;
    }
  };

  const handleDeviceClick = (id: string) => {
    // If already in activeCameras, just focus it
    if (activeCameras.includes(id)) {
      setFocusedCamera(id);
    } else {
      // Otherwise, add it to the grid if there's space, or replace focused
      const newCams = [...activeCameras];
      if (focusedCamera) {
        const idx = newCams.indexOf(focusedCamera);
        if (idx !== -1) newCams[idx] = id;
        else newCams.push(id);
      } else {
        newCams.push(id);
      }
      setActiveCameras(newCams.slice(0, 9)); // Cap at 9
      setFocusedCamera(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080808] border-r border-white/[0.05] w-64 select-none animate-in slide-in-from-left duration-300">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.05]">
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-white/40">
          Device Inventory
        </span>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsLeftSidebarCollapsed(true)}
            className="p-1.5 text-white/20 hover:text-white/60 hover:bg-white/5 rounded-sm transition-all"
          >
            <ChevronDown size={14} className="rotate-90" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-2">
        <div className="relative group">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.05] rounded-sm py-1.5 pl-8 pr-2 text-[11px] font-mono text-white/80 placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>

      {/* Device List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Hierarchy Root */}
        <div className="flex items-center gap-2 px-3 py-2 text-white/30 border-b border-white/[0.02]">
          <ChevronDown size={14} />
          <span className="text-[9px] font-mono font-bold uppercase tracking-tighter">Root Site / Primary</span>
        </div>

        <div className="py-1">
          {filteredDevices.map((device) => {
            const isActive = activeCameras.includes(device.id);
            const isFocused = focusedCamera === device.id;

            return (
              <div
                key={device.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('deviceId', device.id)}
                onClick={() => handleDeviceClick(device.id)}
                className={cn(
                  "group h-10 flex items-center px-4 cursor-pointer transition-all border-l-2",
                  isFocused 
                    ? "bg-indigo-500/10 border-indigo-500 text-white" 
                    : isActive 
                      ? "bg-white/[0.03] border-indigo-500/30 text-white/80" 
                      : "border-transparent text-white/40 hover:bg-white/[0.02] hover:text-white/70"
                )}
              >
                <div className="mr-3 flex-shrink-0">
                  <StatusIcon status={device.status} />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className="text-[11px] font-mono font-bold truncate tracking-tight">
                    {device.label}
                  </span>
                  <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest">
                    {device.type} • {device.ip || 'no-ip'}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:text-white transition-colors">
                    <Maximize2 size={12} />
                  </button>
                  <button className="p-1 hover:text-white transition-colors">
                    <MoreVertical size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-black/40 border-t border-white/[0.05]">
        <div className="flex items-center justify-between text-[9px] font-mono text-white/20">
          <span>Total: {devices.length}</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {devices.filter(d => d.status === 'online').length} Live
          </span>
        </div>
      </div>
    </div>
  );
};
