/** @jsx h */
import { Box } from '@zen-tui/solid';
import { VerticalDivider } from './Header.js';
import { ExplorerTree } from '../features/explorer/ExplorerTree.js';
import { ActivityTimeline } from '../features/activity/ActivityTimeline.js';
import { CommitReviewPane } from '../features/commits/CommitReviewPane.js';

/**
 * Body: Modular Layout Coordinator V140
 */
export function Body() {
  return (
    <Box flexGrow={1} flexDirection="row" padding={{ top: 1, left: 1, right: 1 }}>
       <ExplorerTree />
       <VerticalDivider />
       <ActivityTimeline />
       <VerticalDivider />
       <CommitReviewPane />
    </Box>
  );
}
