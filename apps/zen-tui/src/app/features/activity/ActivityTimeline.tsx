/** @jsx h */
import { Box, Text } from '@zen-tui/solid';
import { Theme } from '../../theme.js';

/**
 * ActivityTimeline: The Center Context Lane
 * Fully uncapped dynamic flex responsiveness!
 */
export function ActivityTimeline() {
  return (
    <Box flexGrow={3} flexDirection="column" padding={{ left: Theme.Spacing.Medium, right: Theme.Spacing.Medium }}>
       <Text fg={Theme.Colors.TextStrong} bold={true} value=" ╼ RECENT ACTIVITY" />
       <Box height={1} />
       <ActivityItem time="10:42 AM" lane="● │ " laneColor={Theme.Colors.Warning} user="picon" type="commit" msg="wip: layout bounds " hash="263215b" color={Theme.Colors.Primary} />
       <ActivityItem time="09:15 AM" lane="│ ┝━" laneColor="#60a5fa" user="ci-bot" type="build" msg="Deploy to staging " hash="success" color={Theme.Colors.Success} />
       <ActivityItem time="Yesterday " lane="│ │ " laneColor="#60a5fa" user="picon" type="merge" msg="Merge branch 'l5'" hash="f920abc" color={Theme.Colors.Highlight} />
       <ActivityItem time="Yesterday " lane="┝━┛ " laneColor={Theme.Colors.Highlight} user="dependa" type="pr" msg="Bump zen-tui-solid " hash="#142" color={Theme.Colors.Warning} />
       <ActivityItem time="Mar 26    " lane="●   " laneColor={Theme.Colors.Success} user="picon" type="commit" msg="Initial TUI engine " hash="c41d991" color={Theme.Colors.Primary} />
    </Box>
  );
}

const ActivityItem = (props: any) => (
  <Box height={1} flexDirection="row">
     <Box width={12}><Text fg={Theme.Colors.TextDim} value={props.time} /></Box>
     <Box width={6}><Text fg={props.laneColor} value={props.lane} /></Box>
     <Box width={8}><Text fg={props.color} value={props.type} /></Box>
     <Box width={11}><Text fg={Theme.Colors.TextMuted} value={`@${props.user}`} /></Box>
     <Box flexGrow={1}><Text fg={Theme.Colors.TextMain} value={props.msg} /></Box>
     <Box width={8} alignItems="flex-end"><Text fg={Theme.Colors.Border} value={props.hash} /></Box>
  </Box>
);
