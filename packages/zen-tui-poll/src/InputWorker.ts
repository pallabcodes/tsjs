import { parentPort } from 'worker_threads';
import { ZenInput } from '@zen-tui/native'; 

const input = new ZenInput();

/**
 * InputWorker: The Sovereign Background Poller.
 * Lives in @zen-tui/poll.
 */
function poll() {
  while (true) {
    try {
      // 5ms block for snappy but power-efficient input
      const eventJson = input.poll_event(5);
      if (eventJson && parentPort) {
        parentPort.postMessage(eventJson);
      }
    } catch (e) {
      // Catch native fails
    }
  }
}

poll();
