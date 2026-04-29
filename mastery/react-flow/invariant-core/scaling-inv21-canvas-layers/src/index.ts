/**
 * SCALING-INV-21: Multi-Layer Canvas Pipeline
 * 
 * Separates Dynamic (Moving) vs Static (Background) rendering.
 */

export class LayeredRenderer {
  private staticLayer: Set<string> = new Set();
  private dynamicLayer: Set<string> = new Set();

  /**
   * Partitions nodes based on their activity state.
   */
  updateLayers(allNodeIds: string[], movingNodeIds: string[]) {
    this.dynamicLayer = new Set(movingNodeIds);
    this.staticLayer = new Set(
      allNodeIds.filter(id => !this.dynamicLayer.has(id))
    );
  }

  /**
   * In a real engine, this would return two Canvas Contexts.
   * Here we return the counts to verify the partitioning logic.
   */
  getRenderCounts(): { static: number, dynamic: number } {
    return {
      static: this.staticLayer.size,
      dynamic: this.dynamicLayer.size
    };
  }

  /**
   * The "Flattening" DNA.
   * Demonstrates how we only have to re-draw the dynamic layer 
   * while the static layer is cached as a bitmap.
   */
  shouldRedrawStatic(viewChanged: boolean): boolean {
    return viewChanged;
  }
}
