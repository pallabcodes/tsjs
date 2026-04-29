/**
 * SCALING-INV-22: Level of Detail (LoD) Aggregation
 * 
 * Adaptive rendering based on zoom scale.
 */

export interface Cluster {
  id: string;
  x: number;
  y: number;
  count: number;
}

export class ZoomAggregator {
  private LOD_THRESHOLD = 0.2;

  /**
   * Adaptive Render DNA.
   * If zoomed out far, returns clusters grouped by clusterId.
   */
  aggregate(nodes: any[], zoom: number): { type: 'NODES' | 'CLUSTERS', data: any[] } {
    if (zoom >= this.LOD_THRESHOLD || nodes.length === 0) {
      return { type: 'NODES', data: nodes };
    }

    const clusters = new Map<string, any[]>();
    for (const node of nodes) {
      const cid = node.data?.clusterId || 'root';
      const clusterNodes = clusters.get(cid) || [];
      clusterNodes.push(node);
      clusters.set(cid, clusterNodes);
    }

    const result = [];
    for (const [id, cNodes] of clusters.entries()) {
      result.push({
        id: `cluster-${id}`,
        position: {
          x: cNodes.reduce((sum, n) => sum + n.position.x, 0) / cNodes.length,
          y: cNodes.reduce((sum, n) => sum + n.position.y, 0) / cNodes.length,
        },
        count: cNodes.length
      });
    }

    return { type: 'CLUSTERS', data: result };
  }
}
