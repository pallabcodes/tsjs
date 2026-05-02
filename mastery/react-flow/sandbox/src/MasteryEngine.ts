import { DoubleBufferStore } from '@core/scaling-inv24-double-buffer/src/index';
import { SpatialVirtualizer } from '@core/scaling-inv15-virtualization/src/index';
import type { Viewport } from '@core/inv02-viewport/src/index';
import { Node } from '@core/inv01-model/src/index';

export interface EngineEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export class MasteryEngine {
  private dbStore: DoubleBufferStore;
  private virtualizer: SpatialVirtualizer;
  private viewport = { x: 0, y: 0, zoom: 1.0 };
  private canvasSize = { width: 800, height: 600 };
  private nodes: Node[] = [];
  private edges: EngineEdge[] = [];
  private goldenLayout: Map<string, { x: number; y: number }> = new Map();
  private isClusteredMode = false;

  getZoneXForType(type: string) {
    const zone = MasteryEngine.ZONES.find(z => z.nodeType === type);
    return zone ? zone.x : null;
  }

  // L7 Architectural Zones (INV-10 Gravity Targets)
  public static readonly ZONES = [
    { id: 'Z01', name: 'INGRESS', x: 3800, nodeType: 'GATEWAY' },
    { id: 'Z02', name: 'ROUTING', x: 4400, nodeType: 'LOAD_BALANCER' },
    { id: 'Z03', name: 'SERVICES', x: 5000, nodeType: 'SERVICE' },
    { id: 'Z04', name: 'PERSISTENCE', x: 5600, nodeType: 'DATABASE' }
  ];

  constructor(maxNodes: number, boundary: { width: number, height: number }) {
    this.dbStore = new DoubleBufferStore(maxNodes);
    this.virtualizer = new SpatialVirtualizer({ x: 0, y: 0, width: boundary.width, height: boundary.height });

    const initialNodes: Node[] = [];
    const initialEdges: EngineEdge[] = [];
    const back = this.dbStore.getBack();
    
    const LAYERS = 4;
    const SERVICES_PER_LAYER = [1, 3, 5, 8];
    const LAYER_GAP = 850; 
    const SERVICE_GAP = 380; 

    const meshWidth = (LAYERS - 1) * LAYER_GAP;
    const meshStartX = (boundary.width / 2) - (meshWidth / 2);

    let nodeCount = 0;

    for (let l = 0; l < LAYERS; l++) {
      const x = meshStartX + l * LAYER_GAP;
      const count = SERVICES_PER_LAYER[l];
      const layerHeight = (count - 1) * SERVICE_GAP;
      const startY = (boundary.height / 2) - (layerHeight / 2);

      for (let s = 0; s < count; s++) {
        const y = startY + s * SERVICE_GAP;
        const id = `n${nodeCount++}`;
        const type = l === 0 ? 'GATEWAY' : l === 1 ? 'LOAD_BALANCER' : l === 2 ? 'SERVICE' : 'DATABASE';
        let status = 'HEALTHY';
        let color = '#3b82f6';

        if (id === 'n16') { status = 'CRITICAL'; color = '#f43f5e'; } 
        if (id === 'n8') { status = 'DEGRADED'; color = '#fbbf24'; } 

        const width = 190;
        const height = 140;

        // Assign to logical clusters for INV-22
        const clusterId = x < 4000 ? 'ZONE_WEST' : (x > 6000 ? 'ZONE_EAST' : 'ZONE_CORE');

        const nodeData = { 
          id, 
          position: { x, y },
          data: { 
            width, height, color, clusterId,
            label: `${type} ${nodeCount - 1}`, 
            type, status,
            telemetry: {
              latency: (5 + Math.random() * 20).toFixed(1),
              cpu: Math.round(20 + Math.random() * 60),
              errorRate: (status === 'CRITICAL' ? 100 : status === 'DEGRADED' ? 5 : 0.01).toFixed(2)
            }
          }
        };

        initialNodes.push(nodeData);
        
        // EDGE GENERATION
        if (l > 0) {
          const prevLayerType = l === 1 ? 'GATEWAY' : l === 2 ? 'LOAD_BALANCER' : 'SERVICE';
          const prevLayerNodes = initialNodes.filter(n => n.data.type === prevLayerType);

          prevLayerNodes.forEach(prev => {
            const srcIdx = parseInt(prev.id.slice(1));
            const tgtIdx = parseInt(id.slice(1));
            if (l === 1 || Math.abs(srcIdx - tgtIdx) < 6) {
              initialEdges.push({
                id: `e-${prev.id}-${id}`,
                source: prev.id,
                target: id,
                type: 'NORMAL'
              });
            }
          });
        }
      }
    } 
    
    this.nodes = initialNodes;
    this.edges = initialEdges;

    // Capture Golden Layout (HLD Architectural Defaults)
    this.nodes.forEach(n => {
      this.goldenLayout.set(n.id, { ...n.position });
    });

    // L7 CRITICAL FIX: Correctly populate the virtualizer using the proper method
    this.virtualizer.updateNodes(this.nodes.map(n => ({
      id: n.id,
      x: n.position.x,
      y: n.position.y,
      width: n.data.width,
      height: n.data.height
    })));
  }

  // Scaling Invariant 22: Geometric Hysteresis
  getClusteredRenderData(zoom: number, draggedNodeId: string | null = null) {
    const THRESHOLD = 0.18;
    const HYSTERESIS = 0.03;
    
    // L7 Stateful Hysteresis: Directional state locking to prevent flickering
    if (this.isClusteredMode) {
      if (zoom > THRESHOLD + HYSTERESIS) this.isClusteredMode = false;
    } else {
      if (zoom < THRESHOLD - HYSTERESIS) this.isClusteredMode = true;
    }

    if (!this.isClusteredMode) {
      return this.getRenderData(draggedNodeId);
    }

    const clusters = new Map<string, any[]>();
    this.nodes.forEach(node => {
      const cid = node.data?.clusterId || 'DEFAULT';
      const clusterNodes = clusters.get(cid) || [];
      clusterNodes.push(node);
      clusters.set(cid, clusterNodes);
    });

    const clusteredNodes: any[] = [];
    const clusterMap = new Map<string, any>();

    clusters.forEach((cNodes, cid) => {
      const avgX = cNodes.reduce((sum, n) => sum + n.position.x, 0) / cNodes.length;
      const avgY = cNodes.reduce((sum, n) => sum + n.position.y, 0) / cNodes.length;
      
      const cluster = {
        id: `cluster-${cid}`,
        position: { x: avgX, y: avgY },
        isCluster: true,
        data: {
          label: cid.replace('_', ' '),
          count: cNodes.length,
          type: 'CLUSTER',
          status: cNodes.some(n => n.data.status === 'CRITICAL') ? 'CRITICAL' : 
                  (cNodes.some(n => n.data.status === 'DEGRADED') ? 'DEGRADED' : 'HEALTHY'),
          color: cNodes.some(n => n.data.status === 'CRITICAL') ? '#f43f5e' : 
                 (cNodes.some(n => n.data.status === 'DEGRADED') ? '#fbbf24' : '#3b82f6'),
          width: 600,
          height: 400
        }
      };
      clusteredNodes.push(cluster);
      clusterMap.set(cid, cluster);
    });

    // Aggregate Edges
    const clusteredEdges: any[] = [];
    const edgeKeySet = new Set<string>();

    this.edges.forEach(edge => {
      const sourceNode = this.nodes.find(n => n.id === edge.source);
      const targetNode = this.nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return;

      const sCid = sourceNode.data.clusterId;
      const tCid = targetNode.data.clusterId;

      if (sCid !== tCid) {
        const edgeKey = `cluster-${sCid}-to-cluster-${tCid}`;
        if (!edgeKeySet.has(edgeKey)) {
          clusteredEdges.push({
            id: edgeKey,
            source: `cluster-${sCid}`,
            target: `cluster-${tCid}`,
            type: 'CLUSTER_LINK'
          });
          edgeKeySet.add(edgeKey);
        }
      }
    });

    return { nodes: clusteredNodes, edges: clusteredEdges };
  }

  getRenderData(draggedNodeId: string | null = null) {
    const worldTopLeft = {
      x: -this.viewport.x / this.viewport.zoom,
      y: -this.viewport.y / this.viewport.zoom
    };
    const worldWidth = this.canvasSize.width / this.viewport.zoom;
    const worldHeight = this.canvasSize.height / this.viewport.zoom;

    const worldRect = {
      x: worldTopLeft.x - 8000, 
      y: worldTopLeft.y - 8000,
      width: worldWidth + 16000,
      height: worldHeight + 16000
    };

    const visibleNodeStubs = this.virtualizer.getVisibleNodes(worldRect);
    const nodeIds = new Set(visibleNodeStubs.map(n => n.id));
    
    // L7 Invariant: Dragged node MUST always be materialized
    if (draggedNodeId) nodeIds.add(draggedNodeId);

    // L7 Invariant: If an edge is visible, both its nodes must be materialized
    const visibleEdges = this.edges.filter(e => nodeIds.has(e.source) || nodeIds.has(e.target));
    visibleEdges.forEach(e => {
      nodeIds.add(e.source);
      nodeIds.add(e.target);
    });

    const visibleNodes = this.nodes.filter(n => nodeIds.has(n.id));
    
    return {
      nodes: visibleNodes,
      edges: visibleEdges
    };
  }

  getStats() {
    if (!this.nodes) return { totalNodes: 0, totalEdges: 0, critical: 0, degraded: 0, healthy: 0 };
    const critical = this.nodes.filter(n => n.data?.status === 'CRITICAL').length;
    const degraded = this.nodes.filter(n => n.data?.status === 'DEGRADED').length;
    return {
      totalNodes: this.nodes.length,
      totalEdges: this.edges.length,
      critical,
      degraded,
      healthy: this.nodes.length - critical - degraded
    };
  }

  getNodes() { return this.nodes; }
  getEdges() { return this.edges; }

  getNodeById(id: string): Node | undefined {
    return this.nodes.find(n => n.id === id);
  }

  injectFault(id: string) {
    const node = this.nodes.find(n => n.id === id);
    if (node) {
      node.data.status = 'CRITICAL';
      node.data.color = '#f43f5e';
      node.data.telemetry.cpu = 99.8;
      node.data.telemetry.errorRate = "12.50";
    }
  }

  restartNode(id: string) {
    const node = this.nodes.find(n => n.id === id);
    if (node) {
      node.data.status = 'RESTARTING';
      node.data.color = '#3b82f6';
      node.data.telemetry.cpu = 0;
      node.data.telemetry.latency = "0.0";
    }
  }

  getZoneHealth(): Record<string, { healthy: number; degraded: number; critical: number; total: number }> {
    const zones: Record<string, { healthy: number; degraded: number; critical: number; total: number }> = {
      'GATEWAY': { healthy: 0, degraded: 0, critical: 0, total: 0 },
      'LOAD_BALANCER': { healthy: 0, degraded: 0, critical: 0, total: 0 },
      'SERVICE': { healthy: 0, degraded: 0, critical: 0, total: 0 },
      'DATABASE': { healthy: 0, degraded: 0, critical: 0, total: 0 },
    };
    this.nodes.forEach(n => {
      const type = n.data?.type;
      if (type && zones[type]) {
        zones[type].total++;
        if (n.data.status === 'CRITICAL') zones[type].critical++;
        else if (n.data.status === 'DEGRADED') zones[type].degraded++;
        else zones[type].healthy++;
      }
    });
    return zones;
  }

  // L7 Optimized Node Relocation - Defer virtualizer sync to commit phase
  updateNodePosition(id: string, x: number, y: number) {
    const node = this.nodes.find(n => n.id === id);
    if (!node) return;
    node.position = { x, y };
  }

  // L7 Zero-Copy Sync (INV-19)
  updateFromBuffer(buffer: Float32Array) {
    const STATUS_REV_MAP = ['HEALTHY', 'DEGRADED', 'CRITICAL', 'RESTARTING'];
    const COLOR_MAP = ['#3b82f6', '#fbbf24', '#f43f5e', '#3b82f6'];

    this.nodes.forEach((node, i) => {
      const offset = i * 5;
      node.data.telemetry.latency = buffer[offset].toFixed(1);
      node.data.telemetry.cpu = buffer[offset + 1];
      const statusIdx = buffer[offset + 2];
      node.data.status = STATUS_REV_MAP[statusIdx] || 'HEALTHY';
      node.data.color = COLOR_MAP[statusIdx] || '#3b82f6';
      node.data.telemetry.requests = buffer[offset + 3];
      node.data.telemetry.errorRate = buffer[offset + 4].toFixed(2);
    });

    // Low-frequency spatial re-index
    this.virtualizer.updateNodes(this.nodes.map(n => ({
      id: n.id,
      x: n.position.x,
      y: n.position.y,
      width: n.data.width,
      height: n.data.height
    })));
  }

  applyTelemetryDelta(updates: any[]) {
    const nodeMap = new Map(this.nodes.map(n => [n.id, n]));
    updates.forEach(update => {
      const node = nodeMap.get(update.id);
      if (node) {
        node.data.status = update.status;
        node.data.color = update.color;
        node.data.telemetry = update.telemetry;
      }
    });
    
    // Low-frequency spatial re-index (only during telemetry ticks, not drag)
    this.virtualizer.updateNodes(this.nodes.map(n => ({
      id: n.id,
      x: n.position.x,
      y: n.position.y,
      width: n.data.width,
      height: n.data.height
    })));
  }

  hydratePositions(layout: Record<string, { x: number; y: number }>) {
    this.nodes.forEach(node => {
      if (layout[node.id]) {
        node.position = { ...layout[node.id] };
      }
    });
    
    // Re-index spatial grid
    this.virtualizer.updateNodes(this.nodes.map(n => ({
      id: n.id,
      x: n.position.x,
      y: n.position.y,
      width: n.data.width,
      height: n.data.height
    })));
  }

  getConnectedEdges(nodeId: string) {
    return this.edges.filter(e => e.source === nodeId || e.target === nodeId);
  }

  commitNodePositions() {
    this.virtualizer.updateNodes(this.nodes.map(n => ({
      id: n.id,
      x: n.position.x,
      y: n.position.y,
      width: n.data.width,
      height: n.data.height
    })));
  }

  resetToGoldenLayout() {
    this.nodes.forEach(node => {
      const golden = this.goldenLayout.get(node.id);
      if (golden) {
        node.position = { ...golden };
      }
    });
    this.commitNodePositions();
  }

  setViewport(v: Viewport) { this.viewport = v; }
  setCanvasSize(width: number, height: number) { this.canvasSize = { width, height }; }
}
