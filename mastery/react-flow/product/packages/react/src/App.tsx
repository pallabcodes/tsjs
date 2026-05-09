import { useMeshStore } from '@ostream/core';
import { Timeline } from './components/Timeline';
import { Viewport } from './components/Viewport';
import { NavRail } from './components/NavRail';
import { DeviceTree } from './components/DeviceTree';
import { FloorPlan } from './components/FloorPlan';
import { SearchView } from './components/SearchView';
import { EvidenceLocker } from './components/EvidenceLocker';
import './index.css';

function App() {
  const { activeView, isLeftSidebarCollapsed } = useMeshStore();

  const renderMainContent = () => {
    switch (activeView) {
      case 'live':
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex overflow-hidden">
              {/* Device Tree Sidebar (Contextual to Live View) */}
              {!isLeftSidebarCollapsed && <DeviceTree />}
              
              {/* Core Player Engine */}
              <div className="flex-1 overflow-hidden relative flex flex-col">
                <Viewport />
              </div>
            </div>

            {/* Forensic Timeline Instrument */}
            <Timeline />
          </div>
        );
      
      case 'map':
        return <FloorPlan />;
      
      case 'search':
        return <SearchView />;
      
      case 'locker':
        return <EvidenceLocker />;
      
      case 'settings':
        return (
          <div className="flex-1 flex items-center justify-center bg-[#020202] text-white/20 font-mono text-[11px] uppercase tracking-[0.2em]">
            System Configuration Engine - Access Denied (L7 Root Required)
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-vms-bg text-white overflow-hidden font-sans antialiased">
      {/* 01. Global Navigation Rail */}
      <NavRail />

      {/* 02. Dynamic Context Content */}
      {renderMainContent()}
    </div>
  );
}

export default App;
