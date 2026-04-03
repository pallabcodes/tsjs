import { Zen, Theme, Box, Text, Modal } from '@zen-tui/core';
import { useStore } from '../state/ZenStore';

/**
 * 🏗️ CommitModal: Message Orchestrator
 */
export function CommitModal(props: { store?: any }) {
  const context = props.store || useStore();
  const { state, dispatch } = context;
  const [message, setMessage] = Zen.signal('');

  const onCommit = () => {
    if (message().trim()) {
      dispatch({ type: 'COMMIT', message: message() });
      setMessage('');
    }
  };

  return (
    <Modal
      title="Commit Message"
      visible={state.modalVisible()}
      onClose={() => dispatch({ type: 'TOGGLE_MODAL', visible: false })}
    >
      <Box
        flexDirection="column"
        width={60}
        height={10}
        bg={Theme.Colors.Background}
        border="solid"
        borderColor={Theme.Colors.Highlight}
        padding={{ top: 1, bottom: 1, left: 1, right: 1 }}
      >
        <Box padding={{ bottom: 1 }}>
          <Text fg={Theme.Colors.Highlight} bold={true} value="COMMIT REPOSITORY" />
        </Box>

        <Box flexGrow={1} bg={Theme.Colors.PanelActive} padding={{ top: 1, bottom: 1, left: 1, right: 1 }}>
          <Text fg={Theme.Colors.TextMain} value={message() || "Type commit message..."} />
        </Box>

        <Box height={1} padding={{ top: 1 }}>
          <Text fg={Theme.Colors.TextDim} value="Enter: Commit | Esc: Cancel" />
        </Box>
      </Box>
    </Modal>
  );
}
