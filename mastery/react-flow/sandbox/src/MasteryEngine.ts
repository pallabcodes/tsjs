import { DoubleBufferStore } from '../../invariant-core/scaling-inv24-double-buffer/src/index.ts';
import { SpatialVirtualizer } from '../../invariant-core/scaling-inv15-virtualization/src/index.ts';
import type { Viewport } from '../../invariant-core/inv02-viewport/src/index.ts';
import { Node } from '../../invariant-core/inv01-model/src/index.ts';

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

  constructor(maxNodes: number, boundary: { width: number, height: number }) {
    this.dbStore = new DoubleBufferStore(maxNodes);
    this.virtualizer = new SpatialVirtualizer({ x: 0, y: 0, width: boundary.width, height: boundary.height });

    const initialNodes: Node[] = [];
    const initialEdges: EngineEdge[] = [];
    const back = this.dbStore.getBack();
    
    const LAYERS = 4;
    const SERVICES_PER_LAYER = [1, 3, 5, 8];
    const LAYER_GAP = 600; 
    const SERVICE_GAP = 400; 

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

        const nodeData = { 
          id, 
          position: { x, y },
          data: { 
            width, height, color, 
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

    // L7 CRITICAL FIX: Correctly populate the virtualizer using the proper method
    this.virtualizer.updateNodes(this.nodes.map(n => ({
      id: n.id,
      x: n.position.x,
      y: n.position.y,
      width: n.data.width,
      height: n.data.height
    })));
  }

  getRenderData() {
    const worldTopLeft = {
      x: -this.viewport.x / this.viewport.zoom,
      y: -this.viewport.y / this.viewport.zoom
    };
    const worldWidth = this.canvasSize.width / this.viewport.zoom;
    const worldHeight = this.canvasSize.height / this.viewport.zoom;

    const worldRect = {
      x: worldTopLeft.x - 5000, // L7 Over-Render Buffer
      y: worldTopLeft.y - 5000,
      width: worldWidth + 10000,
      height: worldHeight + 10000
    };

    const visibleNodeStubs = this.virtualizer.getVisibleNodes(worldRect);
    const nodeIds = new Set(visibleNodeStubs.map(n => n.id));
    
    const visibleNodes = this.nodes.filter(n => nodeIds.has(n.id));
    const visibleEdges = this.edges.filter(e => nodeIds.has(e.source) || nodeIds.has(e.target));
    
    return {
      nodes: visibleNodes,
      edges: visibleEdges
    };
  }

  getStats() {
    const critical = this.nodes.filter(n => n.data.status === 'CRITICAL').length;
    const degraded = this.nodes.filter(n => n.data.status === 'DEGRADED').length;
    return {
      totalNodes: this.nodes.length,
      totalEdges: this.edges.length,
      critical,
      degraded,
      healthy: this.nodes.length - critical - degraded
    };
  }

  getNodes() { return this.nodes; }

  // L7 MODULE 3: Precision Node Relocation
  updateNodePosition(id: string, x: number, y: number) {
    const node = this.nodes.find(n => n.id === id);
    if (!node) return;

    // Update the visual truth
    node.position = { x, y };

    // L7 CRITICAL: Update the Spatial Virtualizer so culling knows where the node moved
    this.virtualizer.updateNodes(this.nodes.map(n => ({
      id: n.id,
      x: n.position.x,
      y: n.position.y,
      width: n.data.width,
      height: n.data.height
    })));
  }

  setViewport(v: Viewport) { this.viewport = v; }
  setCanvasSize(width: number, height: number) { this.canvasSize = { width, height }; }
}
