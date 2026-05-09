import { useMeshStore } from '@ostream/core';
import { Timeline } from './components/Timeline';
import { Viewport } from './components/Viewport';
import { NavRail } from './components/NavRail';
import { DeviceTree } from './components/DeviceTree';
import { FloorPlan } from './components/FloorPlan';
import { CampusMap } from './components/CampusMap';
import { IncidentFeed } from './components/IncidentFeed';
import { AuditLogFooter } from './components/AuditLogFooter';
import { SearchView } from './components/SearchView';
import { EvidenceLocker } from './components/EvidenceLocker';
import { SystemHealthView } from './components/SystemHealthView';
import './index.css';

function App() {
  const { 
    activeView, 
    activeSite,
    isLeftSidebarCollapsed,
    isPlayerSidebarCollapsed 
  } = useMeshStore();

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

              {/* Real-time Incident Channel (Command & Control) */}
              {!isPlayerSidebarCollapsed && <IncidentFeed />}
            </div>

            {/* Forensic Timeline Instrument */}
            <Timeline />
          </div>
        );
      
      case 'map':
        return activeSite === 'campus' ? <CampusMap /> : <FloorPlan />;
      
      case 'search':
        return <SearchView />;
      
      case 'locker':
        return <EvidenceLocker />;
      
      case 'settings':
        return <SystemHealthView />;

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-vms-bg text-white overflow-hidden font-sans antialiased">
      {/* 01. Global Navigation Rail */}
      <NavRail />

      {/* 02. Dynamic Context Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {renderMainContent()}
        <AuditLogFooter />
      </div>
    </div>
  );
}

export default App;
