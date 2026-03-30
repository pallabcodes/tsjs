/** @jsx h */
import { Box, Text } from '@zen-tui/solid';
import { Theme } from '../../theme.js';

/**
 * CommitReviewPane: The Right Side Inset Pane
 * Leverages `flexGrow={4}` so it holds the largest dynamic proportion of unused width.
 */
export function CommitReviewPane() {
  const diffLines = [
    { type: "header", content: "@@ -14,6 +14,7 @@" },
    { type: " ", content: "   useInput((e) => toggle(e));" },
    { type: "-", content: "     <Footer />" },
    { type: "+", content: "     <Footer mode={mode} />" },
    { type: " ", content: "   return (" },
  ];

  return (
    <Box flexGrow={4} flexDirection="column" padding={{ left: Theme.Spacing.Medium }}>
       <Text fg={Theme.Colors.TextStrong} bold={true} value=" ╼ COMMIT DETAILS" />
       <Box height={1} />
       
       <Box flexDirection="row" height={1}>
          <Box width={10}><Text fg={Theme.Colors.TextMuted} value="Commit:" /></Box>
          <Text fg={Theme.Colors.Primary} bold={true} value="263215b" />
          <Text fg={Theme.Colors.Border} value=" (HEAD -> main)" />
       </Box>
       <Box flexDirection="row" height={1}>
          <Box width={10}><Text fg={Theme.Colors.TextMuted} value="Author:" /></Box>
          <Text fg={Theme.Colors.TextMain} value="picon " />
          <Text fg={Theme.Colors.TextDim} value="<dev@google.com>" />
       </Box>
       <Box flexDirection="row" height={1}>
          <Box width={10}><Text fg={Theme.Colors.TextMuted} value="Date:" /></Box>
          <Text fg={Theme.Colors.TextMain} value="Sat Mar 28 10:42 AM" />
       </Box>
       <Box flexDirection="row" height={1} padding={{ top: Theme.Spacing.Small, bottom: Theme.Spacing.Small }}>
          <Box width={10}><Text fg={Theme.Colors.TextMuted} value="Message:" /></Box>
          <Text fg={Theme.Colors.Warning} bold={true} value="wip: layout bounds" />
       </Box>
       <Box flexDirection="row" height={1}>
          <Box width={10}><Text fg={Theme.Colors.TextMuted} value="Diff Stat:" /></Box>
          <Text fg={Theme.Colors.Success} value="1 file changed, " />
          <Text fg={Theme.Colors.Success} bold={true} value="1 insert, " />
          <Text fg={Theme.Colors.Danger} bold={true} value="1 delete " />
          <Text fg={Theme.Colors.TextMuted} value="[ +- ]" />
       </Box>

       <Box height={1} />
       <Box height={1} padding={{ bottom: Theme.Spacing.Small }}>
           <Text fg={Theme.Colors.TextMuted} value=" apps/zen-tui/App.tsx" />
       </Box>
       
       {/* Premium Diff Frame: stretches naturally inside flex context */}
       <Box flexDirection="column" bg={Theme.Colors.Panel} padding={{ left: Theme.Spacing.Small, right: Theme.Spacing.Small, top: Theme.Spacing.Small, bottom: Theme.Spacing.Small }}>
         {diffLines.map((line: any) => (
           <Box flexDirection="row" height={1}>
              <Text fg={line.type === '-' ? Theme.Colors.Danger : line.type === '+' ? Theme.Colors.Success : line.type === 'header' ? Theme.Colors.Highlight : Theme.Colors.TextMuted} 
                    value={line.content} />
           </Box>
         ))}
       </Box>
    </Box>
  );
}
